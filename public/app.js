const clubUrl =
  "https://sbsite.pro/Expansio_best_1?utm_source=telegram&utm_medium=pinned&utm_campaign=digest_site&utm_content=barkov_site&utm_term=2026_05_14";

const cases = [
  {
    brand: "On That Ass",
    meta: "DTC · ЕС · Подписка",
    stat: "250K+ подписчиков",
    model: "Мужское белье превращено из редкой покупки в ежемесячную привычку через дизайн-дропы.",
    details: "MVP для РФ: комплект на 12 месяцев со скидкой или автоплатеж на своем сайте. Подходит категориям с низкой частотой переоценки: носки, белье, базовые футболки, лезвия.",
    sources: [
      ["Сайт", "https://onthatass.com"],
      ["Instagram", "https://www.instagram.com/onthatass/"],
      ["TikTok", "https://www.tiktok.com/@onthatass"]
    ],
    tags: ["subscription", "russia"],
    label: "Можно в РФ"
  },
  {
    brand: "Olipop",
    meta: "США · DTC · Напитки",
    stat: "$1.85B оценка",
    model: "Функциональная газировка продается не как ЗОЖ, а как ностальгия по массовой соде.",
    details: "Сильная модель для понимания рефрейминга, но прямой перенос в РФ ограничен упаковочным языком, ритейлом и регуляторикой заявлений о пользе.",
    sources: [
      ["Сайт", "https://drinkolipop.com"],
      ["Instagram", "https://www.instagram.com/drinkolipop/"],
      ["TikTok", "https://www.tiktok.com/@drinkolipop"]
    ],
    tags: ["price"],
    label: "Honest no-fit"
  },
  {
    brand: "Function Health",
    meta: "США · Health · Подписка",
    stat: "$2.5B оценка",
    model: "Разовая лабораторная услуга упакована в годовую подписку с траекторией показателей.",
    details: "Подходит как концепт для чек-апов и wellness, но врачебная интерпретация и medical-regulatory стек требуют локальной юридической проверки.",
    sources: [
      ["Сайт", "https://www.functionhealth.com"],
      ["Instagram", "https://www.instagram.com/functionhealth/"],
      ["Mark Hyman", "https://www.instagram.com/drmarkhyman/"]
    ],
    tags: ["subscription"],
    label: "Концептуально"
  },
  {
    brand: "Mid-Day Squares",
    meta: "Канада · DTC · Контент",
    stat: "$30M+ выручки",
    model: "Ежедневный влог основателей стал главным каналом доверия и запуска новых артикулов.",
    details: "MVP для РФ: Telegram, YouTube и короткие видео с производства, закупок, упаковки и конфликтов. Нужен основатель, готовый стать медиа-каналом.",
    sources: [
      ["Сайт", "https://middaysquares.com"],
      ["Instagram", "https://www.instagram.com/middaysquares/"],
      ["TikTok", "https://www.tiktok.com/@middaysquares"]
    ],
    tags: ["content", "russia"],
    label: "Можно в РФ"
  },
  {
    brand: "Who Gives A Crap",
    meta: "Австралия · DTC · Миссия",
    stat: "$100M+ выручки",
    model: "Коммодити-продукт стал премиальным через подписку и реальное обязательство отдавать 50% прибыли.",
    details: "Модель полезна как ориентир, но в РФ mission-driven позиционирование такого масштаба сложнее переносится без доверенной инфраструктуры и отчетности.",
    sources: [
      ["AU сайт", "https://au.whogivesacrap.org"],
      ["US сайт", "https://us.whogivesacrap.org"],
      ["Instagram", "https://www.instagram.com/whogivesacraptp/"]
    ],
    tags: ["subscription", "price"],
    label: "Honest no-fit"
  },
  {
    brand: "12storeez",
    meta: "РФ · Мода · Омниканал",
    stat: "12.4 млрд ₽",
    model: "Контент основателя, 12 коллекций в год, сайт и офлайн работают как единый путь клиента.",
    details: "MVP: коллекции по месяцам, контент-блог, малый отшив и свой канал продаж. Маркетплейсы не должны быть единственной точкой контакта.",
    sources: [
      ["Сайт", "https://12storeez.com"],
      ["Instagram", "https://www.instagram.com/12storeez_official/"],
      ["Telegram", "https://t.me/twelvestoreez"]
    ],
    tags: ["content", "channel", "russia"],
    label: "Можно в РФ"
  },
  {
    brand: "HexClad",
    meta: "США · DTC · Канальный арбитраж",
    stat: "$400M выручки",
    model: "Гордон Рамзи и живые демонстрации в Costco создали канал, который конкуренты не могли быстро скопировать.",
    details: "MVP для РФ: уикенд-демо в Metro или Ленте, локальный эксперт с долей в продукте, продукт, который можно убедительно показать руками.",
    sources: [
      ["Сайт", "https://hexclad.com"],
      ["Instagram", "https://www.instagram.com/hexclad/"],
      ["TikTok", "https://www.tiktok.com/@hexclad"],
      ["YouTube", "https://www.youtube.com/@HexClad"]
    ],
    tags: ["channel", "russia"],
    label: "Можно в РФ"
  },
  {
    brand: "Pasta Evangelists",
    meta: "Великобритания · Еда · DTC",
    stat: "£40M сделка",
    model: "Свежая паста стала ресторанным опытом дома: коробка, шеф, доставка и повторяемость.",
    details: "MVP для РФ: премиум-коробка на 2 порции, 4 рецепта в месяц, видеоинструкция от шефа, старт в Москве или Петербурге.",
    sources: [
      ["Сайт", "https://pastaevangelists.com"],
      ["Instagram", "https://www.instagram.com/pastaevangelists/"],
      ["TikTok", "https://www.tiktok.com/@pastaevangelists"]
    ],
    tags: ["subscription", "content", "russia"],
    label: "Можно в РФ"
  }
];

const guideContent = {
  frequency: {
    title: "Тест подписки",
    text: "Если фактическая покупка заметно реже оптимальной частоты использования, проблема не в продукте, а в инерции перепокупки.",
    steps: [
      "Соберите лендинг с предзаказом на 12 месяцев товара со скидкой 20%.",
      "Дайте трафик из канала основателя, Telegram Ads или VK Ads в течение 30 дней.",
      "KPI: стоимость предзаказа должна быть ниже прогнозного LTV первого года."
    ]
  },
  channel: {
    title: "Тест пустого канала",
    text: "Если топ-10 брендов продают одинаково, ищите канал, который технически возможен, но культурно еще не принят в категории.",
    steps: [
      "Выберите один канал: демо в рознице, контент-движок, сайт с подпиской или экспертный эндорсмент.",
      "Запустите один уикенд, одну серию контента или один партнерский оффер.",
      "KPI: канал должен дать конверсию или CAC лучше текущего платного трафика."
    ]
  },
  price: {
    title: "Тест ценового рефрейминга",
    text: "Если все полезные альтернативы продают себя через отказ, попробуйте продавать через ту же эмоцию, что и массовый лидер.",
    steps: [
      "Соберите две версии оффера: рациональную и эмоциональную.",
      "Проверьте объявления на одинаковой аудитории и одинаковом бюджете.",
      "KPI: эмоциональный оффер должен выигрывать по CTR, конверсии или готовности платить."
    ]
  }
};

const caseGrid = document.querySelector("#caseGrid");
const filters = document.querySelectorAll(".filter");
const guideOptions = document.querySelectorAll(".guide-option");
const guideResult = document.querySelector("#guideResult");
const progressBar = document.querySelector(".read-progress span");
const navLinks = document.querySelectorAll("[data-nav]");
const sessionId = getId("expansio_session_id", true);
const visitorId = getId("expansio_visitor_id");
const seenSections = new Set();
let maxScrollDepth = 0;

function getId(key, sessionOnly = false) {
  const storage = sessionOnly ? window.sessionStorage : window.localStorage;
  const existing = storage.getItem(key);
  if (existing) {
    return existing;
  }

  const next = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  storage.setItem(key, next);
  return next;
}

function track(event, payload = {}) {
  const body = {
    event,
    sessionId,
    visitorId,
    path: window.location.pathname + window.location.hash,
    referrer: document.referrer,
    payload
  };

  const json = JSON.stringify(body);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", new Blob([json], { type: "application/json" }));
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: json,
    keepalive: true
  }).catch(() => {});
}

function renderCases(filter = "all") {
  caseGrid.innerHTML = cases
    .map((item) => {
      const isHidden = filter !== "all" && !item.tags.includes(filter);
      return `
        <article class="case-card ${isHidden ? "is-hidden" : ""}" data-tags="${item.tags.join(" ")}">
          <div class="case-topline">
            <div class="case-meta">${item.meta}</div>
            <span>${item.label}</span>
          </div>
          <h3>${item.brand}</h3>
          <p>${item.model}</p>
          <div class="case-stat">${item.stat}</div>
          <details class="case-details">
            <summary>Разобрать модель</summary>
            <p>${item.details}</p>
            <div class="source-links" aria-label="Источники">
              ${item.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}</a>`).join("")}
            </div>
          </details>
          <div class="case-tags">
            ${item.tags.map((tag) => `<span>${tagName(tag)}</span>`).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function tagName(tag) {
  const names = {
    russia: "РФ",
    subscription: "Подписка",
    content: "Контент",
    channel: "Канал",
    price: "Цена"
  };
  return names[tag] || tag;
}

function renderGuide(key) {
  const item = guideContent[key];
  guideResult.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.text}</p>
    <ul>
      ${item.steps.map((step) => `<li>${step}</li>`).join("")}
    </ul>
    <div class="hero-actions">
      <a class="button primary" href="${clubUrl}" target="_blank" rel="noreferrer">Обсудить в клубе</a>
    </div>
  `;
  guideResult.classList.remove("is-swapping");
  window.requestAnimationFrame(() => guideResult.classList.add("is-swapping"));
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderCases(button.dataset.filter);
    track("filter_click", { filter: button.dataset.filter, label: button.textContent.trim() });
  });
});

guideOptions.forEach((button) => {
  button.addEventListener("click", () => {
    guideOptions.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderGuide(button.dataset.guide);
    track("guide_select", { guide: button.dataset.guide, label: button.querySelector("span")?.textContent || "" });
  });
});

function updateProgress() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(scrollTop / max, 1) : 0;
  progressBar.style.transform = `scaleX(${progress})`;
}

function setActiveNav() {
  const sections = ["events", "cases", "guide", "join"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const active = sections
    .filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.42)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", active?.id === link.dataset.nav);
  });
}

function setupReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.id && !seenSections.has(entry.target.id)) {
            seenSections.add(entry.target.id);
            track("section_view", { section: entry.target.id });
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  targets.forEach((target) => observer.observe(target));
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  const summary = event.target.closest("summary");

  if (summary && summary.closest(".case-details")) {
    const card = summary.closest(".case-card");
    track("case_open", { case: card?.querySelector("h3")?.textContent || "" });
  }

  if (!link) {
    return;
  }

  const href = link.href;
  const label = link.textContent.trim();

  if (href === clubUrl || href.includes("sbsite.pro/Expansio_best_1")) {
    track("club_click", { label, href });
    return;
  }

  if (link.closest(".source-links") || link.closest(".tool-steps")) {
    track("source_click", { label, href });
    return;
  }

  if (link.dataset.nav) {
    track("nav_click", { label, target: link.getAttribute("href") });
    return;
  }

  if (link.classList.contains("button")) {
    track("cta_click", { label, href: link.getAttribute("href") || "" });
  }
});

window.addEventListener("scroll", () => {
  updateProgress();
  setActiveNav();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const depth = max > 0 ? Math.floor((window.scrollY / max) * 100) : 0;
  const bucket = Math.min(100, Math.floor(depth / 25) * 25);
  if (bucket > maxScrollDepth) {
    maxScrollDepth = bucket;
    track("scroll_depth", { depth: maxScrollDepth });
  }
}, { passive: true });

renderCases();
renderGuide("frequency");
setupReveal();
updateProgress();
setActiveNav();
track("page_view", {
  title: document.title,
  width: window.innerWidth,
  height: window.innerHeight
});
