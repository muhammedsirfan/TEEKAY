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
