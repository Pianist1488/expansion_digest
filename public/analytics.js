const periodSelect = document.querySelector("#periodSelect");
const summaryGrid = document.querySelector("#summaryGrid");
const dailyChart = document.querySelector("#dailyChart");
const clicksTable = document.querySelector("#clicksTable");
const sectionsTable = document.querySelector("#sectionsTable");
const referrersTable = document.querySelector("#referrersTable");
const eventsTable = document.querySelector("#eventsTable");

async function loadAnalytics() {
  const response = await fetch(`/api/analytics?since=${encodeURIComponent(periodSelect.value)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    summaryGrid.innerHTML = `<div class="metric"><strong>${response.status}</strong><span>Нет доступа или БД не настроена</span></div>`;
    return;
  }

  const data = await response.json();
  renderSummary(data.summary);
  renderDaily(data.daily);
  renderRows(clicksTable, data.clicks, (row) => ({
    title: `${eventName(row.event_name)} · ${row.label}`,
    subtitle: row.href,
    value: row.count
  }));
  renderRows(sectionsTable, data.sections, (row) => ({
    title: sectionName(row.section),
    subtitle: row.section,
    value: row.sessions
  }));
  renderRows(referrersTable, data.referrers, (row) => ({
    title: row.referrer === "direct" ? "Прямой заход" : row.referrer,
    subtitle: "sessions",
    value: row.sessions
  }));
  renderRows(eventsTable, data.events, (row) => ({
    title: eventName(row.event_name),
    subtitle: row.event_name,
    value: row.count
  }));
}

function renderSummary(summary) {
  const cards = [
    ["Визиты", summary.sessions],
    ["Люди", summary.visitors],
    ["События", summary.events],
    ["Клики в клуб", summary.club_clicks],
    ["Клики источников", summary.source_clicks],
    ["Открытия кейсов", summary.case_opens]
  ];

  summaryGrid.innerHTML = cards
    .map(([label, value]) => `<article class="metric"><strong>${value || 0}</strong><span>${label}</span></article>`)
    .join("");
}

function renderDaily(rows) {
  if (!rows.length) {
    dailyChart.innerHTML = `<p class="empty">Данных пока нет.</p>`;
    return;
  }

  const max = Math.max(...rows.map((row) => Number(row.sessions)));
  dailyChart.innerHTML = rows
    .map((row) => {
      const height = Math.max(8, Math.round((Number(row.sessions) / max) * 150));
      return `
        <div class="bar" title="${row.date}: ${row.sessions} sessions">
          <div class="bar-fill" style="height:${height}px"></div>
          <span>${row.date.slice(5)}</span>
        </div>
      `;
    })
    .join("");
}

function renderRows(container, rows, normalize) {
  if (!rows.length) {
    container.innerHTML = `<p class="empty">Данных пока нет.</p>`;
    return;
  }

  container.innerHTML = rows
    .map((row) => {
      const item = normalize(row);
      return `
        <div class="row">
          <div>
            <strong title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</strong>
            <small title="${escapeHtml(item.subtitle)}">${escapeHtml(item.subtitle)}</small>
          </div>
          <em>${item.value}</em>
        </div>
      `;
    })
    .join("");
}

function eventName(name) {
  const names = {
    page_view: "Просмотр страницы",
    club_click: "Клик в клуб",
    source_click: "Клик по источнику",
    nav_click: "Клик навигации",
    cta_click: "Клик CTA",
    filter_click: "Фильтр кейсов",
    guide_select: "Выбор гайда",
    case_open: "Открытие кейса",
    section_view: "Просмотр секции",
    scroll_depth: "Глубина скролла"
  };
  return names[name] || name;
}

function sectionName(section) {
  const names = {
    events: "События недели",
    cases: "Кейсы",
    guide: "Гайд",
    join: "Вступление в клуб"
  };
  return names[section] || section;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

periodSelect.addEventListener("change", loadAnalytics);
loadAnalytics();
