/* ============================================================
   LUKERS — Sitio público
   Requiere js/config.js (número de WhatsApp) y js/reveal.js.
   ============================================================ */
"use strict";

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Utilidades ---------- */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

let toastTimer;
function showToast(text) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

/** Muestra un mensaje de resultado bajo un formulario. */
function setMsg(el, text, ok) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("form-msg--ok", !!ok);
}

/**
 * Gestiona el envío de un formulario: bloquea el doble clic, cambia el
 * texto del botón y devuelve siempre el control, pase lo que pase.
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- WhatsApp ---------- */
const WHATSAPP_NUMBER = ((window.LUKERS_CONFIG || {}).WHATSAPP_NUMBER || "").replace(/\D/g, "");
const WHATSAPP_OK = WHATSAPP_NUMBER.length >= 9 && !/^510{8,}$/.test(WHATSAPP_NUMBER);

function whatsappLink(mensaje) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

(function initWhatsApp() {
  const fab = $("#waFab");
  if (!fab) return;
  // Sin número configurado el botón desaparece. Nunca mostramos al
  // visitante un botón que no lleva a ninguna parte.
  if (!WHATSAPP_OK) { fab.remove(); return; }
  fab.href = whatsappLink("Hola Lukers 👋 quisiera más información.");
})();

/* ---------- Modo claro / azul ---------- */
(function initTheme() {
  const guardado = localStorage.getItem("lukers-theme");
  if (guardado) {
    document.documentElement.dataset.theme = guardado;
  }
  const btn = $("#themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const siguiente = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = siguiente;
    try { localStorage.setItem("lukers-theme", siguiente); } catch { /* modo privado */ }
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

/* ---------- Contador de las cifras de portada ---------- */
(function initContadores() {
  const cifras = $$("[data-count]");
  if (!cifras.length || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);
      const destino = Number(el.dataset.count) || 0;
      const sufijo = el.dataset.suffix || "";
      const inicio = performance.now();
      const dur = 1100;
      const paso = (ahora) => {
        const t = Math.min((ahora - inicio) / dur, 1);
        const suave = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(destino * suave) + sufijo;
        if (t < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  }, { threshold: 0.4 });

  cifras.forEach((el) => obs.observe(el));
})();

/* ---------- Imágenes gestionadas desde el panel ---------- */
async function cargarImagenes() {
  const huecos = $$("[data-slot]");
  if (!huecos.length) return;
  try {
    const res = await fetch("/api/images");
    if (!res.ok) return;
    const { images } = await res.json();
    huecos.forEach((hueco) => {
      const url = images[hueco.dataset.slot];
      if (!url) return;                      // sin foto: se queda la pieza de marca
      const img = new Image();
      img.src = url;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", () => {
        const ph = $(".media__placeholder", hueco);
        if (ph) ph.remove();
        hueco.appendChild(img);
      });
    });
  } catch {
    /* Sin servidor: quedan las piezas de marca, que ya se ven bien */
  }
}

/* ---------- Tiendas ---------- */
const ICONO_PIN  = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
const ICONO_RELOJ= '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

function mapsUrl(direccion, nombre) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${nombre} ${direccion} Perú`);
}

function pintarTiendas(tiendas) {
  const grid = $("#storeGrid");
  if (!grid) return;

  if (!tiendas.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <span class="brillo" aria-hidden="true"></span>
        <p>Estamos actualizando la lista de tiendas. Escríbenos a
           <a href="mailto:hola@lukers.pe">hola@lukers.pe</a> y te decimos cuál te queda más cerca.</p>
      </div>`;
    return;
  }

  grid.innerHTML = tiendas.map((s) => {
    const foto = s.photo
      ? `<img src="${escapeHtml(s.photo)}" alt="Tienda Lukers ${escapeHtml(s.name)}" loading="lazy" decoding="async" />`
      : `<div class="media__placeholder"><span class="brillo" aria-hidden="true"></span><span>Foto de la tienda</span></div>`;

    const wa = WHATSAPP_OK
      ? `<a class="btn btn--outline btn--sm" href="${whatsappLink(`Hola Lukers 👋 quiero consultar por la tienda ${s.name}.`)}" target="_blank" rel="noopener">WhatsApp</a>`
      : "";

    return `
      <article class="card store-card card--hover">
        <div class="media media--3x2">${foto}</div>
        <div class="card__body">
          <span class="store-card__city">${escapeHtml(s.city)}</span>
          <h3>${escapeHtml(s.name)}</h3>
          <p class="store-card__meta">${ICONO_PIN}<span>${escapeHtml(s.address)}</span></p>
          <p class="store-card__meta">${ICONO_RELOJ}<span>${escapeHtml(s.hours || "Lun a Dom · 10:00 a. m. – 10:00 p. m.")}</span></p>
          <div class="store-card__actions">
            <a class="btn btn--primary btn--sm" href="${mapsUrl(s.address, s.name)}" target="_blank" rel="noopener">Cómo llegar</a>
            ${wa}
          </div>
        </div>
      </article>`;
  }).join("");
}

async function cargarTiendas() {
  const grid = $("#storeGrid");
  if (!grid) return;
  try {
    const res = await fetch("/api/stores");
    if (!res.ok) throw new Error("respuesta no válida");
    const { stores } = await res.json();
    pintarTiendas(stores || []);
  } catch {
    // Antes esta sección se quedaba vacía y muda. Ahora siempre dice algo.
    grid.innerHTML = `
      <div class="empty-state">
        <span class="brillo" aria-hidden="true"></span>
        <p>No pudimos cargar las tiendas en este momento. Recarga la página o
           escríbenos a <a href="mailto:hola@lukers.pe">hola@lukers.pe</a>.</p>
      </div>`;
  }
}

/* ---------- Marcas ---------- */
async function cargarMarcas() {
  const cont = $("#brandLanes");
  if (!cont) return;
  try {
    const res = await fetch("/api/brands");
    if (!res.ok) throw new Error("respuesta no válida");
    const { lanes } = await res.json();
    const carriles = Object.keys(lanes)
      .map((k) => lanes[k])
      .filter((arr) => arr && arr.length);

    if (!carriles.length) { cont.remove(); return; }

    cont.innerHTML = carriles.map((marcas, i) => {
      // Se duplica la lista para que el desplazamiento sea continuo.
      const chips = marcas.concat(marcas)
        .map((m) => `<span class="brand-chip">${escapeHtml(m.name)}</span>`)
        .join("");
      return `<div class="marquee${i % 2 ? " marquee--rev" : ""}"><div class="marquee__track">${chips}</div></div>`;
    }).join("");
  } catch {
    cont.remove(); // sin marcas, la sección no aporta nada: se retira entera
  }
}

/* ---------- Newsletter ---------- */
(function initNewsletter() {
  const form = $("#newsletterForm");
  if (!form) return;
  const msg = $("#nlMsg");
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#nlEmail").value.trim();

    if (!EMAIL_RE.test(email)) { setMsg(msg, "Ingresa un correo válido.", false); return; }
    if (!$("#nlConsent").checked) {
      setMsg(msg, "Necesitamos tu autorización para poder escribirte.", false);
      return;
    }

    submitOnce(form, btn, "Enviando…", async () => {
      setMsg(msg, "Enviando…", false);
      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) { setMsg(msg, data.error || "No pudimos suscribirte.", false); return; }
        setMsg(msg, data.message, true);
        form.reset();
        $("#nlConsent").checked = false;
        showToast("Listo, te avisaremos de las novedades.");
      } catch {
        setMsg(msg, "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.", false);
      }
    });
  });
})();

/* ---------- Contacto ---------- */
(function initContacto() {
  const form = $("#contactForm");
  if (!form) return;
  const msg = $("#ctMsg");
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#ctName").value.trim();
    const email = $("#ctEmail").value.trim();
    const message = $("#ctMessage").value.trim();

    if (name.length < 3)        { setMsg(msg, "Ingresa tu nombre.", false); return; }
    if (!EMAIL_RE.test(email))  { setMsg(msg, "Ingresa un correo válido.", false); return; }
    if (message.length < 10)    { setMsg(msg, "Cuéntanos un poco más en tu mensaje.", false); return; }
    if (!$("#ctConsent").checked) {
      setMsg(msg, "Necesitamos tu autorización para responderte.", false);
      return;
    }

    submitOnce(form, btn, "Enviando…", async () => {
      setMsg(msg, "Enviando…", false);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });
        const data = await res.json();
        if (!res.ok) { setMsg(msg, data.error || "No pudimos enviar tu mensaje.", false); return; }
        setMsg(msg, data.message, true);
        form.reset();
        showToast("Mensaje recibido. Te responderemos pronto.");
      } catch {
        setMsg(msg, "No pudimos enviar tu mensaje. Escríbenos a hola@lukers.pe.", false);
      }
    });
  });
})();

/* ---------- Arranque ---------- */
const anio = $("#year");
if (anio) anio.textContent = new Date().getFullYear();

cargarImagenes();
cargarTiendas();
cargarMarcas();
