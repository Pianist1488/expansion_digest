import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const port = Number(process.env.PORT || 3000);
const publicDir = join(process.cwd(), "public");
const databaseUrl = process.env.DATABASE_URL || "";
const analyticsPassword = process.env.ANALYTICS_PASSWORD || "";

let poolPromise;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  return join(publicDir, normalized);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64_000) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function isAuthed(req) {
  if (!analyticsPassword) {
    return false;
  }

  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    return false;
  }

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const password = decoded.split(":").slice(1).join(":");
  return password === analyticsPassword;
}

function requireAuth(req, res) {
  if (isAuthed(req)) {
    return true;
  }

  res.writeHead(401, {
    "www-authenticate": 'Basic realm="Expansio Analytics", charset="UTF-8"',
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end("Authentication required");
  return false;
}

async function getPool() {
  if (!databaseUrl) {
    return null;
  }

  if (!poolPromise) {
    poolPromise = import("pg").then(async ({ Pool }) => {
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes("railway.internal") ? false : { rejectUnauthorized: false }
      });

      await pool.query(`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id BIGSERIAL PRIMARY KEY,
          event_id UUID UNIQUE NOT NULL,
          event_name TEXT NOT NULL,
          session_id TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          page_path TEXT,
          referrer TEXT,
          user_agent TEXT,
          payload JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await pool.query("CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events (created_at DESC);");
      await pool.query("CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON analytics_events (event_name);");
      return pool;
    });
  }

  return poolPromise;
}

async function handleTrack(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const pool = await getPool();
  if (!pool) {
    sendJson(res, 503, { error: "Analytics database is not configured" });
    return;
  }

  try {
    const body = JSON.parse(await readBody(req) || "{}");
    const eventName = String(body.event || "").slice(0, 80);
    const sessionId = String(body.sessionId || "").slice(0, 100);
    const visitorId = String(body.visitorId || "").slice(0, 100);

    if (!eventName || !sessionId || !visitorId) {
      sendJson(res, 400, { error: "Missing event, sessionId or visitorId" });
      return;
    }

    await pool.query(
      `INSERT INTO analytics_events
        (event_id, event_name, session_id, visitor_id, page_path, referrer, user_agent, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (event_id) DO NOTHING`,
      [
        randomUUID(),
        eventName,
        sessionId,
        visitorId,
        String(body.path || "").slice(0, 500),
        String(body.referrer || "").slice(0, 1000),
        String(req.headers["user-agent"] || "").slice(0, 1000),
        JSON.stringify(body.payload || {})
      ]
    );

    sendJson(res, 204, {});
  } catch (error) {
    console.error("Track error:", error);
    sendJson(res, 500, { error: "Could not save analytics event" });
  }
}

async function handleAnalytics(req, res) {
  if (!requireAuth(req, res)) {
    return;
  }

  const pool = await getPool();
  if (!pool) {
    sendJson(res, 503, { error: "Analytics database is not configured" });
    return;
  }

  try {
    const since = new URL(req.url || "/", "http://localhost").searchParams.get("since") || "30 days";
    const allowedSince = new Set(["24 hours", "7 days", "30 days", "90 days"]);
    const interval = allowedSince.has(since) ? since : "30 days";

    const [summary, events, clicks, sources, sections, daily] = await Promise.all([
      pool.query(
        `SELECT
          COUNT(*)::int AS events,
          COUNT(DISTINCT visitor_id)::int AS visitors,
          COUNT(DISTINCT session_id)::int AS sessions,
          COUNT(*) FILTER (WHERE event_name = 'club_click')::int AS club_clicks,
          COUNT(*) FILTER (WHERE event_name = 'source_click')::int AS source_clicks,
          COUNT(*) FILTER (WHERE event_name = 'case_open')::int AS case_opens
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval`,
        [interval]
      ),
      pool.query(
        `SELECT event_name, COUNT(*)::int AS count
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
         GROUP BY event_name
         ORDER BY count DESC`,
        [interval]
      ),
      pool.query(
        `SELECT COALESCE(payload->>'label', payload->>'href', 'unknown') AS label,
                COALESCE(payload->>'href', '') AS href,
                event_name,
                COUNT(*)::int AS count
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
           AND event_name IN ('club_click', 'source_click', 'nav_click', 'cta_click')
         GROUP BY label, href, event_name
         ORDER BY count DESC
         LIMIT 30`,
        [interval]
      ),
      pool.query(
        `SELECT COALESCE(NULLIF(referrer, ''), 'direct') AS referrer,
                COUNT(DISTINCT session_id)::int AS sessions
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
           AND event_name = 'page_view'
         GROUP BY referrer
         ORDER BY sessions DESC
         LIMIT 20`,
        [interval]
      ),
      pool.query(
        `SELECT COALESCE(payload->>'section', 'unknown') AS section,
                COUNT(DISTINCT session_id)::int AS sessions
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
           AND event_name = 'section_view'
         GROUP BY section
         ORDER BY sessions DESC`,
        [interval]
      ),
      pool.query(
        `SELECT TO_CHAR(created_at::date, 'YYYY-MM-DD') AS date,
                COUNT(DISTINCT session_id)::int AS sessions,
                COUNT(DISTINCT visitor_id)::int AS visitors
         FROM analytics_events
         WHERE created_at >= NOW() - $1::interval
           AND event_name = 'page_view'
         GROUP BY created_at::date
         ORDER BY date ASC`,
        [interval]
      )
    ]);

    sendJson(res, 200, {
      since: interval,
      summary: summary.rows[0],
      events: events.rows,
      clicks: clicks.rows,
      referrers: sources.rows,
      sections: sections.rows,
      daily: daily.rows
    });
  } catch (error) {
    console.error("Analytics error:", error);
    sendJson(res, 500, { error: "Could not read analytics" });
  }
}

function serveFile(res, filePath) {
  res.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=3600"
  });
  createReadStream(filePath).pipe(res);
}

createServer(async (req, res) => {
  const pathname = new URL(req.url || "/", "http://localhost").pathname;

  if (pathname === "/api/track") {
    await handleTrack(req, res);
    return;
  }

  if (pathname === "/api/analytics") {
    await handleAnalytics(req, res);
    return;
  }

  if (pathname === "/analytics" || pathname === "/analytics.html") {
    if (!requireAuth(req, res)) {
      return;
    }
    serveFile(res, join(publicDir, "analytics.html"));
    return;
  }

  const filePath = resolvePath(req.url || "/");

  if (!filePath.startsWith(publicDir) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  serveFile(res, filePath);
}).listen(port, () => {
  console.log(`Expansio Digest is running on http://localhost:${port}`);
});
