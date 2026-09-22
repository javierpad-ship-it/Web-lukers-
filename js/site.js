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

/* Lima o provincia: es el único corte que le sirve a alguien que busca
   dónde comprar. Las nueve ciudades sueltas no ayudan a decidir. */
function zona(ciudad) {
  return String(ciudad).trim().toLowerCase() === "lima" ? "lima" : "provincia";
}

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
      // En la miniatura no cabe el texto "Foto de la tienda": solo la pieza
      // de marca. El aviso de que faltan fotos va una vez, en el titular.
      const foto = s.photo
        ? `<img src="${escapeHtml(s.photo)}" alt="Tienda Lukers ${escapeHtml(s.name)}" loading="lazy" decoding="async" />`
        : `<div class="media__placeholder"><span class="brillo" aria-hidden="true"></span></div>`;

      const wa = WHATSAPP_OK
        ? `<a class="btn btn--ghost btn--sm" href="${whatsappLink(`Hola Lukers 👋 quiero consultar por la tienda ${s.name}.`)}" target="_blank" rel="noopener">WhatsApp</a>`
        : "";

      return `
        <article class="tienda" data-zona="${zona(s.city)}" data-nombre="${escapeHtml(s.name)}" data-direccion="${escapeHtml(s.address)}">
          <div class="tienda__foto media">${foto}</div>
          <div class="tienda__cuerpo">
            <span class="tienda__ciudad">${escapeHtml(s.city)}</span>
            <h3>${escapeHtml(s.name)}</h3>
            <p class="tienda__dato">${ICONO_PIN}<span>${escapeHtml(s.address)}</span></p>
            <p class="tienda__dato">${ICONO_RELOJ}<span>${escapeHtml(s.hours || "Lun a Dom · 10:00 a. m. – 10:00 p. m.")}</span></p>
            <div class="tienda__acciones">
              <a class="btn btn--primary btn--sm" href="${mapsUrl(s.address, s.name)}" target="_blank" rel="noopener">Cómo llegar</a>
              <button class="btn btn--outline btn--sm js-ver-plano" type="button">Ver en el plano</button>
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

/* ============================================================
   Plano de tiendas
   ------------------------------------------------------------
   Patrón de fachada, igual que con los vídeos: Google Maps no se
   carga hasta que alguien pulsa «Abrir el plano», así que hasta
   ese momento la página no instala cookies de terceros.

   Los datos los lee de las propias tarjetas (data-nombre y
   data-direccion) y no de una lista aparte, porque las tarjetas
   las puede haber pintado el servidor antes de llegar aquí.
   ============================================================ */
(function initPlano() {
  const plano = $("#plano");
  const grid  = $("#storeGrid");
  if (!plano || !grid) return;

  /**
   * Clave de la Embed API de Google. Mientras esté vacía se usa una
   * dirección sin clave que funciona hoy, pero que Google no documenta.
   * Si algún día dejara de responder, se contrata la clave y se pega
   * aquí: no hay que tocar nada más. El botón «Cómo llegar» no depende
   * de esto y seguiría funcionando igual.
   */
  const CLAVE_MAPS = "";

  let tapa  = $("#planoTapa");
  let marco = null;
  let elegida = null;

  /* Se considera visible si hay al menos 200 px del plano dentro de la
     ventana: con menos, el salto sí ayuda. */
  const seVe = (el) => {
    const r = el.getBoundingClientRect();
    return Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0) > 200;
  };

  const tarjetas  = () => $$(".tienda", grid);
  const visibles  = () => tarjetas().filter((c) => !c.hidden);

  function urlDelPlano(tarjeta) {
    const nombre = tarjeta.dataset.nombre || "Lukers";
    const dir    = tarjeta.dataset.direccion || "";
    // Si alguna tienda cayera en el sitio equivocado, se le pone
    // data-coords="-12.123,-77.123" y se usa eso en vez de la dirección.
    const consulta = tarjeta.dataset.coords || `${nombre}, ${dir}, Perú`;
    return CLAVE_MAPS
      ? `https://www.google.com/maps/embed/v1/place?key=${CLAVE_MAPS}&zoom=17&q=${encodeURIComponent(consulta)}`
      : `https://maps.google.com/maps?output=embed&z=17&q=${encodeURIComponent(consulta)}`;
  }

  function mostrar(tarjeta, irAlPlano = false) {
    if (!tarjeta) return;
    if (!marco) {
      const cargando = document.createElement("div");
      cargando.className = "plano__cargando";
      cargando.textContent = "Cargando el plano…";
      plano.appendChild(cargando);

      marco = document.createElement("iframe");
      marco.loading = "lazy";
      marco.referrerPolicy = "no-referrer-when-downgrade";
      marco.addEventListener("load", () => cargando.remove());
      plano.appendChild(marco);
      if (tapa) { tapa.remove(); tapa = null; }
    }
    marco.title = `Plano de ${tarjeta.dataset.nombre}, ${tarjeta.dataset.direccion}`;
    marco.src   = urlDelPlano(tarjeta);

    tarjetas().forEach((c) => c.setAttribute("aria-current", c === tarjeta ? "true" : "false"));
    elegida = tarjeta;
    // El salto de vista solo cuando lo pide una persona, y solo si el plano
    // no se ve ya: en pantalla ancha se queda fijo al desplazarse, así que
    // muchas veces está delante y mover la página sería un salto gratuito.
    if (irAlPlano && !seVe(plano)) plano.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (tapa) tapa.addEventListener("click", () => mostrar(visibles()[0], true));

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-ver-plano");
    if (!btn) return;
    mostrar(btn.closest(".tienda"), true);
  });

  /* ---------- Filtro Lima / provincias ----------
     Se usa el atributo `hidden` y no una clase: así la tienda escondida
     desaparece también para un lector de pantalla y para la búsqueda del
     navegador, no solo a la vista. */
  const zonas = $("#zonas");
  if (zonas) {
    zonas.hidden = false;   // solo sirve con JS; por eso nace oculto

    zonas.addEventListener("click", (e) => {
      const btn = e.target.closest(".zona");
      if (!btn) return;
      const z = btn.dataset.zona;

      $$(".zona", zonas).forEach((b) => {
        const activo = b === btn;
        b.classList.toggle("is-on", activo);
        b.setAttribute("aria-pressed", String(activo));
      });

      tarjetas().forEach((c) => {
        c.hidden = z !== "todas" && c.dataset.zona !== z;
      });

      /* Si la tienda que se está viendo en el plano queda fuera del filtro,
         el plano salta a la primera que sí entra. Dejarlo apuntando a una
         tienda que ya no se ve sería confuso. */
      if (marco && elegida && elegida.hidden) {
        const otra = visibles()[0];
        if (otra) mostrar(otra);
      }
    });
  }

  // Sin tiendas no hay nada que enseñar: el plano sobra.
  const observador = new MutationObserver(() => {
    if (!tarjetas().length && !marco) plano.remove();
  });
  observador.observe(grid, { childList: true });
})();

/* ============================================================
   Vídeos de la comunidad (TikTok)
   ------------------------------------------------------------
   Fachada otra vez: se ve la portada, y el reproductor de TikTok
   solo entra cuando alguien pulsa un vídeo.

   Cada vídeo necesita su portada: vertical 9:16, mínimo
   720 × 1280 px. Se sube desde el panel, como las fotos de tienda.
   ============================================================ */
(function initUgc() {
  const grid = $("#ugcGrid");
  if (!grid) return;

  const VIDEOS = [
    { user: "annys_cas",       id: "7666985672225377556", fecha: "jul 2026" },
    { user: "lenaahurtado",    id: "7577916134561762580", fecha: "nov 2025" },
    { user: "kennethtristanm", id: "7421334424396123398", fecha: "oct 2024" },
  ];

  const ICONO_TIKTOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8a4.3 4.3 0 0 1-1.1-2.8h-3v12a2.5 2.5 0 1 1-1.8-2.4V9.5a5.6 5.6 0 1 0 4.8 5.5V9.3a7.3 7.3 0 0 0 4.2 1.3V7.7a4.3 4.3 0 0 1-3.1-1.9Z"/></svg>';
  const ICONO_PLAY   = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  grid.innerHTML = VIDEOS.map((v) => `
    <figure class="vid" data-id="${escapeHtml(v.id)}" data-user="${escapeHtml(v.user)}">
      <div class="vid__tapa">
        <div>
          <span class="brillo" aria-hidden="true"></span>
          <b>Portada del vídeo</b><i>9:16 · 720 × 1280 px</i>
        </div>
      </div>
      <span class="vid__red">${ICONO_TIKTOK}</span>
      <span class="vid__play">${ICONO_PLAY}</span>
      <figcaption class="vid__meta">
        <b>@${escapeHtml(v.user)}</b><span>TikTok · ${escapeHtml(v.fecha)}</span>
      </figcaption>
      <button class="vid__btn" type="button" aria-label="Reproducir el vídeo de @${escapeHtml(v.user)} en TikTok"></button>
    </figure>`).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".vid__btn");
    if (!btn) return;
    const fig = btn.closest(".vid");
    if (fig.dataset.abierto === "1") return;
    fig.dataset.abierto = "1";

    const url = `https://www.tiktok.com/@${fig.dataset.user}/video/${fig.dataset.id}`;

    const marco = document.createElement("iframe");
    marco.src = `https://www.tiktok.com/embed/v2/${fig.dataset.id}`;
    marco.title = `Vídeo de @${fig.dataset.user} en TikTok`;
    marco.loading = "lazy";
    marco.allow = "autoplay; encrypted-media; picture-in-picture";
    marco.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit;z-index:4;background:#000";

    // Si el vídeo se borra o TikTok no carga, queda el enlace al original.
    const salida = document.createElement("a");
    salida.href = url;
    salida.target = "_blank";
    salida.rel = "noopener";
    salida.textContent = "Ver en TikTok";
    salida.style.cssText = "position:absolute;left:.9rem;bottom:.7rem;z-index:5;font-size:.74rem;color:#fff";

    fig.innerHTML = "";
    fig.append(marco, salida);
  });
})();
