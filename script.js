// WhatsApp numbers are chosen in the quote form (see the "Send to" dropdown in index.html)

// Mobile menu
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

// Navbar background on scroll
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Quote form -> WhatsApp
document.getElementById("quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const msg = document.getElementById("fMsg").value.trim();
  const to = document.getElementById("fTo").value;
  const text = `Hello TEEKAY GLASS & HARDWARE,\nName: ${name}\nPhone: ${phone}\nRequirement: ${msg}`;
  window.open(`https://wa.me/${to}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
