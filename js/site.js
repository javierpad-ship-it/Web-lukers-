/* ============================================================
   LUKERS — Portada
   Requiere js/config.js, js/ui.js y js/reveal.js.
   ============================================================ */
"use strict";

initWhatsApp("Hola Lukers 👋 quisiera más información.");

/* ---------- Contadores de las cifras de portada ---------- */
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
      const paso = (ahora) => {
        const t = Math.min((ahora - inicio) / 1100, 1);
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
      if (!url) return;            // sin foto: se queda la pieza de marca
      const img = new Image();
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("load", () => {
        const ph = $(".media__placeholder", hueco);
        if (ph) ph.remove();
        hueco.appendChild(img);
      });
      img.src = url;
    });
  } catch {
    /* Sin servidor: quedan las piezas de marca, que ya se ven bien */
  }
}

/* ---------- Tiendas ---------- */
const ICONO_PIN   = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
const ICONO_RELOJ = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

function mapsUrl(direccion, nombre) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${nombre} ${direccion} Perú`);
}

function avisoTiendas(texto) {
  return `<div class="empty-state">
      <span class="brillo" aria-hidden="true"></span>
      <p>${texto}</p>
    </div>`;
}

async function cargarTiendas() {
  const grid = $("#storeGrid");
  if (!grid) return;
  // Si el servidor ya escribió las tiendas en el HTML, no las repintamos:
  // evita el parpadeo y una petición innecesaria.
  if (grid.dataset.servidor === "1") return;
  try {
    const res = await fetch("/api/stores");
    if (!res.ok) throw new Error("respuesta no válida");
    const { stores } = await res.json();

    if (!stores || !stores.length) {
      grid.innerHTML = avisoTiendas(
        'Estamos actualizando la lista de tiendas. Escríbenos a <a href="mailto:hola@lukers.pe">hola@lukers.pe</a> y te decimos cuál te queda más cerca.'
      );
      return;
    }

    grid.innerHTML = stores.map((s) => {
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
  } catch {
    // Antes esta sección se quedaba vacía y muda. Ahora siempre dice algo.
    grid.innerHTML = avisoTiendas(
      'No pudimos cargar las tiendas en este momento. Recarga la página o escríbenos a <a href="mailto:hola@lukers.pe">hola@lukers.pe</a>.'
    );
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
    const carriles = Object.keys(lanes).map((k) => lanes[k]).filter((a) => a && a.length);
    if (!carriles.length) { cont.remove(); return; }

    cont.innerHTML = carriles.map((marcas, i) => {
      // La lista se duplica para que el desplazamiento no tenga cortes.
      const chips = marcas.concat(marcas)
        .map((m) => `<span class="brand-chip">${escapeHtml(m.name)}</span>`)
        .join("");
      return `<div class="marquee${i % 2 ? " marquee--rev" : ""}"><div class="marquee__track">${chips}</div></div>`;
    }).join("");
  } catch {
    cont.remove(); // sin marcas la sección no aporta nada: se retira entera
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

    if (!EMAIL_RE.test(email)) return setMsg(msg, "Ingresa un correo válido.", false);
    if (!$("#nlConsent").checked) {
      return setMsg(msg, "Necesitamos tu autorización para poder escribirte.", false);
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
        if (!res.ok) return setMsg(msg, data.error || "No pudimos suscribirte.", false);
        setMsg(msg, data.message, true);
        form.reset();
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
    const name    = $("#ctName").value.trim();
    const email   = $("#ctEmail").value.trim();
    const message = $("#ctMessage").value.trim();

    if (name.length < 3)       return setMsg(msg, "Ingresa tu nombre.", false);
    if (!EMAIL_RE.test(email)) return setMsg(msg, "Ingresa un correo válido.", false);
    if (message.length < 10)   return setMsg(msg, "Cuéntanos un poco más en tu mensaje.", false);
    if (!$("#ctConsent").checked) {
      return setMsg(msg, "Necesitamos tu autorización para responderte.", false);
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
        if (!res.ok) return setMsg(msg, data.error || "No pudimos enviar tu mensaje.", false);
        setMsg(msg, data.message, true);
        form.reset();
        showToast("Mensaje recibido. Te responderemos pronto.");
      } catch {
        setMsg(msg, "No pudimos enviar tu mensaje. Escríbenos a hola@lukers.pe.", false);
      }
    });
  });
})();

cargarImagenes();
cargarTiendas();
cargarMarcas();
