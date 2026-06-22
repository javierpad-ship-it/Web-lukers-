/* ============================================================
   LUKERS — Página "Trabaja con nosotros"
   ============================================================ */
"use strict";

const $ = (sel) => document.querySelector(sel);

/* Mismo número que el resto del sitio (ver js/main.js) */
const WHATSAPP_NUMBER = "51000000000";
const WHATSAPP_CONFIGURED = !/^510{8,}$/.test(WHATSAPP_NUMBER);
function whatsappLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* ---------- Tema positivo / negativo ---------- */
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

/* ---------- Menú móvil ---------- */
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(text) {
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ---------- WhatsApp flotante ---------- */
const fab = $("#whatsappFab");
if (fab) {
  fab.href = whatsappLink("Hola Lukers 👋 quisiera postular para trabajar con ustedes.");
  if (!WHATSAPP_CONFIGURED) {
    fab.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("Configura el número de WhatsApp en js/main.js");
    });
  }
}

/* ---------- Cargar tiendas en el selector ---------- */
async function loadStoresIntoSelect() {
  const select = $("#jobStore");
  try {
    const res = await fetch("/api/stores");
    if (!res.ok) return;
    const { stores } = await res.json();
    stores.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = `${s.name} — ${s.city}`;
      opt.textContent = `${s.name} (${s.city})`;
      select.appendChild(opt);
    });
  } catch {
    /* Sin backend: el selector queda solo con la opción por defecto */
  }
}

/* ---------- Envío del formulario ---------- */
const jobForm = $("#jobForm");
jobForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#jobMsg");
  msg.classList.remove("ok");

  const name  = $("#jobName").value.trim();
  const email = $("#jobEmail").value.trim();
  const phone = $("#jobPhone").value.trim();
  const dni   = $("#jobDni").value.trim();
  const store = $("#jobStore").value;
  const scheduleEl = document.querySelector('input[name="schedule"]:checked');
  const studyingEl = document.querySelector('input[name="studying"]:checked');

  if (name.length < 3) { msg.textContent = "✗ Ingresa tu nombre completo"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = "✗ Ingresa un correo válido"; return; }
  if (phone.length < 6) { msg.textContent = "✗ Ingresa tu número de celular"; return; }
  if (dni.length < 6) { msg.textContent = "✗ Ingresa tu DNI"; return; }
  if (!store) { msg.textContent = "✗ Elige la tienda donde quieres trabajar"; return; }
  if (!scheduleEl) { msg.textContent = "✗ Elige una jornada (full time / part time)"; return; }
  if (!studyingEl) { msg.textContent = "✗ Indícanos si estás estudiando"; return; }

  msg.textContent = "Enviando…";
  try {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone,
        dni,
        store,
        schedule: scheduleEl.value,
        studying: studyingEl.value,
        message:  $("#jobMessage").value.trim(),
      }),
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = "✗ " + (data.error || "No se pudo enviar"); return; }
    msg.classList.add("ok");
    msg.textContent = "✓ " + data.message;
    jobForm.reset();
    showToast("🎉 ¡Recibimos tu postulación! Te contactaremos pronto.");
  } catch {
    msg.textContent = "✗ El formulario necesita el servidor activo.";
  }
});

/* ---------- Init ---------- */
$("#year").textContent = new Date().getFullYear();
loadStoresIntoSelect();
