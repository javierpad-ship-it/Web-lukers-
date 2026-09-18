/* ============================================================
   LUKERS — Comportamiento común a todas las páginas
   (cabecera, menú, modo de color, avisos, WhatsApp, formularios)

   Debe cargarse DESPUÉS de js/config.js y ANTES del script
   propio de cada página.
   ============================================================ */
"use strict";

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* ---------- Aviso flotante ---------- */
let toastTimer;
function showToast(text) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

/* ---------- Mensajes bajo los formularios ---------- */
function setMsg(el, text, ok) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("form-msg--ok", !!ok);
}

/**
 * Envía un formulario una sola vez: bloquea el doble clic, cambia el
 * texto del botón mientras tanto y siempre lo devuelve a su estado.
 */
async function submitOnce(form, button, textoEnviando, tarea) {
  if (form.dataset.sending === "1") return;
  form.dataset.sending = "1";
  const original = button ? button.textContent : "";
  if (button) { button.disabled = true; button.textContent = textoEnviando; }
  try {
    await tarea();
  } finally {
    form.dataset.sending = "0";
    if (button) { button.disabled = false; button.textContent = original; }
  }
}

/* ---------- WhatsApp ---------- */
const WHATSAPP_NUMBER = ((window.LUKERS_CONFIG || {}).WHATSAPP_NUMBER || "").replace(/\D/g, "");
const WHATSAPP_OK = WHATSAPP_NUMBER.length >= 9 && !/^510{8,}$/.test(WHATSAPP_NUMBER);

function whatsappLink(mensaje) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

function initWhatsApp(mensaje) {
  const fab = $("#waFab");
  if (!fab) return;
  // Sin número configurado el botón desaparece: es preferible a mostrar
  // al visitante un botón que no lleva a ninguna parte.
  if (!WHATSAPP_OK) { fab.remove(); return; }
  fab.href = whatsappLink(mensaje);
}

/* ---------- Modo claro / azul ---------- */
(function initTheme() {
  try {
    const guardado = localStorage.getItem("lukers-theme");
    if (guardado) document.documentElement.dataset.theme = guardado;
  } catch { /* navegación privada */ }

  const btn = $("#themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const siguiente = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = siguiente;
    try { localStorage.setItem("lukers-theme", siguiente); } catch { /* ídem */ }
  });
})();

/* ---------- Cabecera y menú móvil ---------- */
(function initHeader() {
  const header = $("#header");
  if (header) {
    const marcar = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    marcar();
    window.addEventListener("scroll", marcar, { passive: true });
  }

  const burger = $("#burger");
  const links = $("#navLinks");
  if (!burger || !links) return;

  const cerrar = () => {
    burger.classList.remove("is-open");
    links.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const abierto = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", abierto);
    burger.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  links.addEventListener("click", (e) => { if (e.target.closest("a")) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
})();

/* ---------- Año del pie ---------- */
(function initYear() {
  const anio = $("#year");
  if (anio) anio.textContent = new Date().getFullYear();
})();
