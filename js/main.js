/* ============================================================
   LUKERS — Sitio institucional
   Tema, animaciones, tiendas y formulario de contacto
   ============================================================ */

"use strict";

/* ---------- Datos de tiendas ---------- */
const STORES = [
  { name: "Lukers San Miguel",       city: "Lima",     address: "Av. La Marina 1666, San Miguel" },
  { name: "Lukers Jr. de la Unión",  city: "Lima",     address: "Jr. de la Unión 455, Centro Histórico" },
  { name: "Lukers Chorrillos",       city: "Lima",     address: "Av. El Sol 1175, Chorrillos" },
  { name: "Lukers Breña",            city: "Lima",     address: "Av. Brasil 1099, Breña" },
  { name: "Lukers Lince",            city: "Lima",     address: "Av. Arequipa 1890, Lince" },
  { name: "Lukers Pueblo Libre",     city: "Lima",     address: "Av. Sucre 545, Pueblo Libre" },
  { name: "Lukers Independencia",    city: "Lima",     address: "Av. Carlos Izaguirre 210, Independencia" },
  { name: "Lukers Surco Outlet",     city: "Lima",     address: "Av. Tomás Marsano 3025, Surco" },
  { name: "Lukers Trujillo",         city: "Trujillo", address: "Jr. Pizarro 540, Centro de Trujillo" },
  { name: "Lukers Chiclayo",         city: "Chiclayo", address: "Av. Balta 1050, Chiclayo" },
  { name: "Lukers Tarapoto",         city: "Tarapoto", address: "Jr. San Martín 320, Tarapoto" },
  { name: "Lukers Iquitos",          city: "Iquitos",  address: "Jr. Próspero 615, Iquitos" },
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

/* ---------- Tema claro / oscuro ---------- */
const themeToggle = $("#themeToggle");
const savedTheme = localStorage.getItem("lukers-theme");
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.dataset.theme = "dark";
}
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("lukers-theme", next);
});

/* ---------- Header, menú móvil y back-to-top ---------- */
const header = $("#header");
const backTop = $("#backTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
  backTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }
});

/* Resaltar enlace activo según sección visible */
const sections = $$("main section[id]");
const linkMap = new Map($$(".nav-links a").map((a) => [a.getAttribute("href").slice(1), a]));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && linkMap.has(entry.target.id)) {
      linkMap.forEach((a) => a.classList.remove("active"));
      linkMap.get(entry.target.id).classList.add("active");
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Animaciones de scroll (reveal) ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Contadores animados del hero ---------- */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => statObserver.observe(el));

/* ---------- Tiendas ---------- */
function renderStores(city = "todas") {
  const list = STORES.filter((s) => city === "todas" || s.city === city);
  $("#storeGrid").innerHTML = list.map((s, i) => `
    <div class="store-card" style="animation-delay:${i * 0.05}s">
      <span class="store-city">${s.city}</span>
      <h3>${s.name}</h3>
      <p>📍 ${s.address}</p>
      <p class="hours">🕙 Lun a Dom · 10:00 a.m. – 10:00 p.m.</p>
    </div>`).join("");
}

$("#storeTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".store-tab");
  if (!tab) return;
  $$("#storeTabs .store-tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  renderStores(tab.dataset.city);
});

/* ---------- Formulario de contacto ---------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#contactName").value.trim();
  const email = $("#contactEmail").value.trim();
  const message = $("#contactMessage").value.trim();
  const msg = $("#formMsg");

  msg.classList.remove("ok");
  if (name.length < 3) {
    msg.textContent = "✗ Ingresa tu nombre completo";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    msg.textContent = "✗ Ingresa un correo válido";
    return;
  }
  if (message.length < 10) {
    msg.textContent = "✗ Cuéntanos un poco más en tu mensaje";
    return;
  }

  msg.classList.add("ok");
  msg.textContent = "✓ ¡Mensaje enviado! Te responderemos muy pronto.";
  e.target.reset();
  showToast("📨 ¡Gracias por escribirnos! (demo)");
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Newsletter (conecta con el backend) ---------- */
const newsletterForm = $("#newsletterForm");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#nlEmail").value.trim();
    const name = $("#nlName").value.trim();
    const msg = $("#nlMsg");
    msg.classList.remove("ok");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      msg.textContent = "✗ Ingresa un correo válido";
      return;
    }

    msg.textContent = "Enviando…";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        msg.textContent = "✗ " + (data.error || "No se pudo suscribir");
        return;
      }
      msg.classList.add("ok");
      msg.textContent = "✓ " + data.message;
      newsletterForm.reset();
      showToast(data.duplicate ? "Ese correo ya estaba suscrito 🙂" : "🎉 ¡Bienvenido al newsletter de Lukers!");
    } catch {
      // Sin backend (p. ej. abierto como archivo estático): degradación elegante
      msg.textContent = "✗ El newsletter necesita el servidor activo (npm start).";
    }
  });
}

/* ---------- Imágenes del diseño (cargadas desde el backend) ---------- */
async function loadDesignImages() {
  try {
    const res = await fetch("/api/images");
    if (!res.ok) return;
    const { images } = await res.json();
    Object.entries(images).forEach(([slot, url]) => {
      const el = document.querySelector(`[data-slot="${slot}"]`);
      if (el) {
        el.style.backgroundImage = `url('${url}')`;
        el.classList.add("has-img");
      }
    });
  } catch {
    /* Sin backend: se conservan las imágenes/placeholders por defecto del diseño */
  }
}

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
renderStores();
loadDesignImages();
