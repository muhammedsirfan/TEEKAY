// Mobile detection (phones / small screens)
const mq = window.matchMedia("(max-width: 760px)");
const isMobile = () => mq.matches;

// Mobile menu
const burger = document.getElementById("burger");
const links = document.getElementById("links");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("open");
});
links.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  })
);

// Scroll: nav state, progress bar, hero parallax
const nav = document.getElementById("nav");
const bar = document.getElementById("progress");
const heroImg = document.getElementById("heroImg");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle("scrolled", y > 40);
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (!reduce && !isMobile() && heroImg && y < window.innerHeight * 1.2) {
    heroImg.style.transform = `translateY(${y * 0.25}px) scale(1.08)`;
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

// Reveal on scroll (with small stagger inside grids)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".bento, .steps, .hero-copy, .people").forEach(group => {
  group.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i * 90) + "ms";
  });
});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Spotlight follows the cursor on product tiles
document.querySelectorAll(".spot").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
});

// Quote form -> WhatsApp
document.getElementById("quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const msg = document.getElementById("fMsg").value.trim();
  const to = document.getElementById("fTo").value;
  const text = `Hello TEEKAY HARDWARE & PLYWOOD,\nName: ${name}\nPhone: ${phone}\nRequirement: ${msg}`;
  window.open(`https://wa.me/${to}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Product "Enquire now" -> WhatsApp with a ready-to-edit message =====
// Who receives product enquiries (country code + number, no + or spaces).
const ENQUIRY_NUMBER = "919847606446"; // Abdul Salam TK

// The message customers see before sending. They can edit anything in WhatsApp.
// To change a message, edit the lines below. Key = product name exactly as in the card heading (lowercase).
const ENQUIRY_MESSAGES = {
  "plywood": [
    "Hey! I'm interested in buying plywood.",
    "Size: 8 × 4 ft",
    "Thickness: 18 mm",
    "Quantity: 10 sheets",
    "Brand:",
    "Could you please share the price and availability?"
  ],
  "multiwood": [
    "Hey! I'm interested in buying multiwood.",
    "Size: 8 × 4 ft",
    "Thickness: 18 mm",
    "Quantity: 10 sheets",
    "Brand:",
    "Could you please share the price and availability?"
  ],
  "laminated sheets": [
    "Hey! I'm interested in buying laminated sheets.",
    "Size: 8 × 4 ft",
    "Thickness: 1 mm",
    "Quantity: 10 sheets",
    "Brand / design no.:",
    "Could you please share the price and availability?"
  ],
  "hardware": [
    "Hey! I'm interested in buying hardware.",
    "Item (e.g. hinges, handles, locks):",
    "Size:",
    "Quantity:",
    "Brand:",
    "Could you please share the price and availability?"
  ],
  "kitchen accessories": [
    "Hey! I'm interested in buying kitchen accessories.",
    "Item (e.g. basket, drawer fittings):",
    "Size:",
    "Quantity:",
    "Brand:",
    "Could you please share the price and availability?"
  ],
  "glass": [
    "Hey! I'm interested in buying glass.",
    "Type (clear / frosted / mirror):",
    "Size:",
    "Thickness: 5 mm",
    "Quantity:",
    "Could you please share the price and availability?"
  ]
};

// Every "Enquire now" link inside the product cards is connected automatically.
document.querySelectorAll(".bento .more").forEach(a => {
  const tile = a.closest(".tile");
  const name = (a.dataset.product || (tile && tile.querySelector("h3") ? tile.querySelector("h3").textContent : "")).trim();
  const lines = ENQUIRY_MESSAGES[name.toLowerCase()] || [
    `Hey! I'm interested in buying ${name.toLowerCase()}.`,
    "Item:", "Size:", "Quantity:", "Brand:",
    "Could you please share the price and availability?"
  ];
  a.href = `https://wa.me/${ENQUIRY_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  a.target = "_blank";
  a.rel = "noopener";
});

// ===== Floating WhatsApp: choose whom to message =====
const waWidget = document.getElementById("waWidget");
const waBtn = document.getElementById("waBtn");
const waMenu = document.getElementById("waMenu");
function setWa(open) {
  waWidget.classList.toggle("open", open);
  waBtn.setAttribute("aria-expanded", open);
  waMenu.setAttribute("aria-hidden", !open);
}
waBtn.addEventListener("click", e => { e.stopPropagation(); setWa(!waWidget.classList.contains("open")); });
document.addEventListener("click", e => { if (!waWidget.contains(e.target)) setWa(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setWa(false); });
document.querySelectorAll("[data-wa-open]").forEach(el =>
  el.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); openContact("wa"); })
);

// ===== Gallery: desktop shows 3 + "View more"; mobile is a swipe grid (see mobile section) =====
(function () {
  const grid = document.getElementById("gallery-grid");
  const btn = document.getElementById("galleryMore");
  if (!grid || !btn) return;
  const imgs = [...grid.querySelectorAll("img")];
  imgs.forEach(im => { im.decoding = "async"; });
  const FIRST = 3;   // photos shown at the start (desktop)
  const STEP = 6;    // photos revealed on each "View more" tap
  let shown = FIRST;

  function render() {
    imgs.forEach((im, i) => {
      const hide = i >= shown;
      im.classList.toggle("is-hidden", hide);
      if (!hide && im.loading === "lazy") im.loading = "eager"; // start loading as soon as it is revealed
    });
    if (imgs.length <= FIRST) { btn.hidden = true; return; }
    btn.hidden = false;
    btn.textContent = shown >= imgs.length ? "Show less" : `View more (${imgs.length - shown} more)`;
  }
  btn.addEventListener("click", () => {
    if (shown >= imgs.length) {
      shown = FIRST;
      render();
      document.getElementById("gallery").scrollIntoView({ behavior: "smooth" });
    } else {
      shown = Math.min(shown + STEP, imgs.length);
      render();
    }
  });
  render();

  // Lightbox (works for both desktop and the mobile swipe grid)
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML = '<button class="lb-x" aria-label="Close">✕</button><button class="lb-p" aria-label="Previous">‹</button><img alt="" /><button class="lb-n" aria-label="Next">›</button><div class="lb-cap"></div><div class="lb-count"></div>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap"), lbCount = lb.querySelector(".lb-count");
  let cur = 0;
  const visible = () => imgs.filter(im => getComputedStyle(im).display !== "none");
  function show(i) {
    const list = visible();
    cur = (i + list.length) % list.length;
    lbImg.src = list[cur].currentSrc || list[cur].src;
    lbCap.textContent = list[cur].alt || "";
    lbCount.textContent = `${cur + 1} / ${list.length}`;
  }
  function open(i) { show(i); lb.classList.add("open"); document.documentElement.classList.add("no-scroll"); }
  function close() { lb.classList.remove("open"); document.documentElement.classList.remove("no-scroll"); }
  imgs.forEach(im => im.addEventListener("click", () => open(visible().indexOf(im))));
  lb.querySelector(".lb-x").addEventListener("click", close);
  lb.querySelector(".lb-p").addEventListener("click", e => { e.stopPropagation(); show(cur - 1); });
  lb.querySelector(".lb-n").addEventListener("click", e => { e.stopPropagation(); show(cur + 1); });
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
  let x0 = null;
  lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

// =====================================================================
// MOBILE EXPERIENCE  (swipe carousels, category tabs, bottom bar, contact sheet)
// All of this is built here, so index.html does not need any changes.
// =====================================================================
const $el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; return n; };

// Keep in sync with the contact cards in index.html
const CONTACTS = [
  { name: "Abdul Salam TK",    num: "919847606446", show: "+91 98476 06446", ini: "AS" },
  { name: "Mohammad Safwan C", num: "918129034945", show: "+91 81290 34945", ini: "MS" },
  { name: "Office",            num: "918590665337", show: "+91 85906 65337", ini: "OF" }
];
const GREETING = "Hello TEEKAY HARDWARE & PLYWOOD, I would like to enquire about your products.";
const DIRECTIONS = "https://www.google.com/maps/search/?api=1&query=TEEKAY+HARDWARE+%26+PLYWOOD+South+Bazar+Kannur";

// ---- generic swipe carousel: tracks the active card, syncs tabs + dots ----
function initCarousel(track, items, { tabsEl, dotsEl, hintEl } = {}) {
  let cur = -1, raf = 0, moved = false;
  const pad = () => parseFloat(getComputedStyle(track).paddingLeft) || 0;
  const goTo = i => track.scrollTo({ left: items[i].offsetLeft - pad(), behavior: "smooth" });

  function set(i) {
    if (i === cur) return;
    cur = i;
    items.forEach((it, k) => it.classList.toggle("is-active", k === i));
    if (dotsEl) [...dotsEl.children].forEach((d, k) => d.classList.toggle("on", k === i));
    if (tabsEl) {
      const bs = [...tabsEl.children];
      bs.forEach((b, k) => b.classList.toggle("on", k === i));
      const b = bs[i];
      tabsEl.scrollTo({ left: b.offsetLeft - (tabsEl.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
    }
  }
  function calc() {
    raf = 0;
    const sl = track.scrollLeft, max = track.scrollWidth - track.clientWidth;
    let best = 0, bd = Infinity;
    if (sl >= max - 4) best = items.length - 1;
    else items.forEach((it, k) => { const d = Math.abs(it.offsetLeft - pad() - sl); if (d < bd) { bd = d; best = k; } });
    set(best);
    if (!moved && sl > 8) { moved = true; if (hintEl) hintEl.classList.add("gone"); }
  }
  track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(calc); }, { passive: true });
  if (tabsEl) [...tabsEl.children].forEach((b, i) => b.addEventListener("click", () => goTo(i)));
  if (dotsEl) [...dotsEl.children].forEach((b, i) => b.addEventListener("click", () => goTo(i)));
  set(0);
}

// ---- products: category tabs + dots + hint ----
(function () {
  const bento = document.querySelector(".bento");
  if (!bento) return;
  const tiles = [...bento.querySelectorAll(".tile")];
  const short = { "Laminated Sheets": "Laminates", "Kitchen Accessories": "Kitchen" };
  const names = tiles.map(t => { const h = t.querySelector("h3"); return h ? h.textContent.trim() : "Item"; });
  const tabs = $el("div", "cat-tabs", names.map(n => `<button type="button">${short[n] || n}</button>`).join(""));
  const dots = $el("div", "dots", tiles.map((_, i) => `<button type="button" aria-label="Show card ${i + 1}"></button>`).join(""));
  const hint = $el("div", "swipe-hint", 'Swipe to explore <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
  bento.before(tabs); bento.after(dots); dots.after(hint);
  initCarousel(bento, tiles, { tabsEl: tabs, dotsEl: dots, hintEl: hint });
})();

// ---- interiors: dots ----
(function () {
  const steps = document.querySelector(".steps");
  if (!steps) return;
  const items = [...steps.querySelectorAll(".step")];
  const dots = $el("div", "dots", items.map((_, i) => `<button type="button" aria-label="Show card ${i + 1}"></button>`).join(""));
  steps.after(dots);
  initCarousel(steps, items, { dotsEl: dots });
})();

// ---- gallery: progress bar + early loading of upcoming photos ----
(function () {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const imgs = [...grid.querySelectorAll("img")];
  const meta = $el("div", "g-meta", `<div class="g-prog"><i></i></div><span class="g-count">${imgs.length} photos · swipe →</span>`);
  grid.after(meta);
  const prog = meta.querySelector(".g-prog"), thumb = prog.firstElementChild;
  let raf = 0;
  function upd() {
    raf = 0;
    const w = prog.clientWidth, sw = grid.scrollWidth, cw = grid.clientWidth, max = sw - cw;
    if (!w || !sw) return;
    const tw = Math.max((cw / sw) * w, 32);
    thumb.style.width = tw + "px";
    thumb.style.transform = `translateX(${max > 0 ? (grid.scrollLeft / max) * (w - tw) : 0}px)`;
  }
  grid.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  window.addEventListener("resize", upd);
  upd();

  // start loading photos shortly before they scroll into view (fixes photos that stay blank on phones)
  if ("IntersectionObserver" in window) {
    const pre = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.loading = "eager"; pre.unobserve(e.target); }
    }), { root: grid, rootMargin: "0px 120% 0px 120%" });
    imgs.forEach(im => pre.observe(im));
  }
})();

// ---- bottom action bar + slide-up contact sheet ----
const waSvg = (document.querySelector(".wa-float .i-wa") || { outerHTML: "" }).outerHTML.replace('class="i-wa"', "");
const phoneSvg = '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';
const pinSvg = '<svg viewBox="0 0 24 24"><path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></svg>';
const goSvg = '<svg class="go" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';

const mbar = $el("nav", "mbar", `<button type="button" data-act="call">${phoneSvg}Call</button><button type="button" class="m-wa" data-act="wa">${waSvg}WhatsApp</button><a href="${DIRECTIONS}" target="_blank" rel="noopener">${pinSvg}Map</a>`);
mbar.setAttribute("aria-label", "Quick actions");
const sheet = $el("div", "sheet", '<div class="sheet-bg"></div><div class="sheet-panel" role="dialog" aria-modal="true"><i class="grab"></i><h3 id="sheetTitle"></h3><p class="sheet-sub"></p><div class="sheet-list"></div><button type="button" class="sheet-close">Close</button></div>');
document.body.append(mbar, sheet);

function openSheet(mode) {
  const wa = mode === "wa";
  sheet.querySelector("h3").textContent = wa ? "Chat on WhatsApp" : "Call us";
  sheet.querySelector(".sheet-sub").textContent = wa ? "Who would you like to message?" : "Who would you like to call?";
  sheet.querySelector(".sheet-list").innerHTML = CONTACTS.map(c => {
    const href = wa ? `https://wa.me/${c.num}?text=${encodeURIComponent(GREETING)}` : `tel:+${c.num}`;
    const attrs = wa ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${href}"${attrs}><span class="wa-av${wa ? "" : " call"}">${c.ini}</span><span><b>${c.name}</b><small>${c.show}</small></span>${goSvg}</a>`;
  }).join("");
  sheet.classList.add("open");
  document.documentElement.classList.add("no-scroll");
}
function closeSheet() { sheet.classList.remove("open"); document.documentElement.classList.remove("no-scroll"); }
function openContact(mode) {
  if (mode === "wa" && !isMobile()) setWa(true);   // desktop: small popup next to the green button
  else openSheet(mode);                              // phone: slide-up sheet
}
mbar.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => openContact(b.dataset.act)));
sheet.querySelector(".sheet-bg").addEventListener("click", closeSheet);
sheet.querySelector(".sheet-close").addEventListener("click", closeSheet);
sheet.querySelector(".sheet-list").addEventListener("click", e => { if (e.target.closest("a")) setTimeout(closeSheet, 150); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });