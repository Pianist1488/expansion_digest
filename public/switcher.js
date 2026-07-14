// Меню выбора выпуска. Подключается к обоим дайджестам: и к собранному в один
// файл #09, и к #10, который раздаётся исходником. Шапка у них совпадает.
(function () {
  "use strict";

  var MONO = "'IBM Plex Mono', ui-monospace, monospace";
  var currentId = (location.pathname.match(/\/digest\/([^/]+)/) || [])[1] || "";

  // Переключатель — третий элемент в шапке, и на узком экране логотип с ним
  // не помещается: подпись «Expansio · Дайджест» переносится на две строки.
  // Прячем подпись, оставляя фирменный знак; меню при этом важнее.
  function injectStyles() {
    if (document.getElementById("expansio-switcher-css")) return;
    var style = document.createElement("style");
    style.id = "expansio-switcher-css";
    style.textContent =
      "@media (max-width:600px){" +
      "header.no-print a[href='#top'] span{display:none!important}" +
      "[data-expansio-switcher] [role='menu']{" +
      "position:fixed;top:56px;left:12px;right:12px;min-width:0}" +
      "}";
    document.head.appendChild(style);
  }

  // Шапка есть в двух местах: в исходном шаблоне внутри <x-dc> и в том, что
  // рантайм отрендерил в #dc-root. Нужна вторая — вставку в шаблон рендер затрёт.
  function findBar() {
    var root = document.getElementById("dc-root");
    if (root) {
      var rendered = root.querySelector("header.no-print > div");
      if (rendered) return rendered;
    }
    var bars = document.querySelectorAll("header.no-print > div");
    for (var i = 0; i < bars.length; i++) {
      if (!bars[i].closest("x-dc")) return bars[i];
    }
    return null;
  }

  // Рантайм собирает DOM асинхронно, поэтому шапки может ещё не быть.
  function waitFor(find, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var found = find();
      if (found) return resolve(found);

      var observer = new MutationObserver(function () {
        var el = find();
        if (el) {
          observer.disconnect();
          clearTimeout(timer);
          resolve(el);
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });

      var timer = setTimeout(function () {
        observer.disconnect();
        reject(new Error("switcher: не дождались шапки дайджеста"));
      }, timeoutMs);
    });
  }

  function button() {
    var el = document.createElement("button");
    el.type = "button";
    el.setAttribute("aria-haspopup", "true");
    el.setAttribute("aria-expanded", "false");
    el.style.cssText =
      "display:flex;align-items:center;gap:6px;cursor:pointer;" +
      "font-family:" + MONO + ";font-size:12px;font-weight:500;letter-spacing:.08em;" +
      "text-transform:uppercase;color:#46566c;background:rgba(255,255,255,.7);" +
      "border:1px solid rgba(16,28,44,.14);border-radius:999px;padding:6px 12px;" +
      "white-space:nowrap;transition:border-color .15s,color .15s;";
    el.innerHTML =
      '<span>Выпуски</span>' +
      '<svg width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true" style="flex:none;">' +
      '<path d="M1 1l3.5 3.5L8 1" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    el.addEventListener("mouseenter", function () {
      el.style.borderColor = "rgba(16,28,44,.3)";
      el.style.color = "#14243a";
    });
    el.addEventListener("mouseleave", function () {
      el.style.borderColor = "rgba(16,28,44,.14)";
      el.style.color = "#46566c";
    });
    return el;
  }

  function menu(digests) {
    var box = document.createElement("div");
    box.setAttribute("role", "menu");
    box.style.cssText =
      "position:absolute;top:calc(100% + 8px);right:0;min-width:264px;display:none;" +
      "background:#fff;border:1px solid rgba(16,28,44,.12);border-radius:14px;" +
      "box-shadow:0 18px 40px rgba(14,24,37,.16);padding:6px;z-index:60;";

    digests.forEach(function (digest) {
      var isCurrent = digest.id === currentId;
      var item = document.createElement("a");
      item.href = "/digest/" + digest.id;
      item.setAttribute("role", "menuitem");
      if (isCurrent) item.setAttribute("aria-current", "page");
      item.style.cssText =
        "display:block;padding:10px 12px;border-radius:10px;text-decoration:none;" +
        "background:" + (isCurrent ? "rgba(23,166,124,.08)" : "transparent") + ";";
      item.addEventListener("mouseenter", function () {
        if (!isCurrent) item.style.background = "rgba(16,28,44,.045)";
      });
      item.addEventListener("mouseleave", function () {
        if (!isCurrent) item.style.background = "transparent";
      });

      var meta = document.createElement("div");
      meta.style.cssText =
        "display:flex;align-items:center;gap:8px;font-family:" + MONO + ";" +
        "font-size:11px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;" +
        "color:" + (isCurrent ? "#17A67C" : "#8A9BB0") + ";margin-bottom:3px;";
      meta.textContent = "Выпуск #" + digest.id + " · " + digest.date;
      if (isCurrent) {
        var badge = document.createElement("span");
        badge.textContent = "сейчас";
        badge.style.cssText = "margin-left:auto;font-weight:600;";
        meta.appendChild(badge);
      }

      var title = document.createElement("div");
      title.style.cssText =
        "font-family:'Manrope',-apple-system,sans-serif;font-size:13px;line-height:1.35;" +
        "font-weight:600;color:#14243a;";
      title.textContent = digest.title;

      item.appendChild(meta);
      item.appendChild(title);
      box.appendChild(item);
    });

    return box;
  }

  function mount(bar, digests) {
    var wrap = document.createElement("div");
    wrap.className = "no-print";
    wrap.setAttribute("data-expansio-switcher", "");
    wrap.style.cssText = "position:relative;display:flex;align-items:center;flex:none;";

    // Просто дописываем третьим элементом: шапка — flex со space-between, так что
    // выйдет логотип слева, время чтения по центру, переключатель справа.
    // Переносить чужие узлы не хотим — рантайм пересоздаёт их при ре-рендере.
    bar.appendChild(wrap);

    var btn = button();
    var box = menu(digests);
    wrap.appendChild(btn);
    wrap.appendChild(box);

    function setOpen(open) {
      box.style.display = open ? "block" : "none";
      btn.setAttribute("aria-expanded", String(open));
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(box.style.display !== "block");
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  Promise.all([
    waitFor(findBar, 15000),
    fetch("/api/digests").then(function (r) {
      if (!r.ok) throw new Error("switcher: /api/digests вернул " + r.status);
      return r.json();
    })
  ])
    .then(function (results) {
      var digests = results[1];
      // Один выпуск — выбирать не из чего, меню только мешало бы.
      if (!Array.isArray(digests) || digests.length < 2) return;

      injectStyles();
      mount(results[0], digests);

      // Если рантайм перерисует шапку — возвращаем переключатель на место.
      var scheduled = false;
      new MutationObserver(function () {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
          scheduled = false;
          if (document.querySelector("[data-expansio-switcher]")) return;
          var bar = findBar();
          if (bar) mount(bar, digests);
        });
      }).observe(document.documentElement, { childList: true, subtree: true });
    })
    .catch(function (err) {
      // Дайджест важнее переключателя: молча живём без меню.
      console.warn(err);
    });
})();
