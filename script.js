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
  bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  if (!reduce && heroImg && y < window.innerHeight * 1.2) {
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
  el.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); setWa(true); })
);

// ===== Gallery: show 3 photos, "View more" reveals the rest =====
(function () {
  const grid = document.getElementById("gallery-grid");
  const btn = document.getElementById("galleryMore");
  if (!grid || !btn) return;
  const imgs = [...grid.querySelectorAll("img")];
  const FIRST = 3;   // photos shown at the start
  const STEP = 6;    // photos revealed on each "View more" tap
  let shown = FIRST;

  function render() {
    imgs.forEach((im, i) => im.classList.toggle("is-hidden", i >= shown));
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

  // Lightbox
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML = '<button class="lb-x" aria-label="Close">✕</button><button class="lb-p" aria-label="Previous">‹</button><img alt="" /><button class="lb-n" aria-label="Next">›</button><div class="lb-cap"></div><div class="lb-count"></div>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector(".lb-cap"), lbCount = lb.querySelector(".lb-count");
  let cur = 0;
  const visible = () => imgs.filter((_, i) => i < shown);
  function show(i) {
    const list = visible();
    cur = (i + list.length) % list.length;
    lbImg.src = list[cur].currentSrc || list[cur].src;
    lbCap.textContent = list[cur].alt || "";
    lbCount.textContent = `${cur + 1} / ${list.length}`;
  }
  function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
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