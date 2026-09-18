/* ============================================================
   LUKERS — Página "Trabaja con nosotros"
   Requiere js/config.js, js/ui.js y js/reveal.js.
   ============================================================ */
"use strict";

initWhatsApp("Hola Lukers 👋 quisiera postular para trabajar con ustedes.");

/* ---------- Tiendas en el selector ---------- */
async function cargarTiendas() {
  const select = $("#jobStore");
  if (!select) return;

  // Si la lista no carga, el candidato se queda sin poder elegir tienda y
  // el formulario se bloquearía en silencio. Por eso siempre avisamos.
  function sinTiendas() {
    const opt = document.createElement("option");
    opt.value = "";
    opt.disabled = true;
    opt.textContent = "No pudimos cargar las tiendas";
    select.appendChild(opt);
    setMsg($("#jobMsg"),
      "No pudimos cargar la lista de tiendas. Recarga la página o escríbenos a hola@lukers.pe",
      false);
  }

  try {
    const res = await fetch("/api/stores");
    if (!res.ok) return sinTiendas();
    const { stores } = await res.json();
    if (!stores || !stores.length) return sinTiendas();
    stores.forEach((s) => {
      const opt = document.createElement("option");
      opt.value = `${s.name} — ${s.city}`;
      opt.textContent = `${s.name} (${s.city})`;
      select.appendChild(opt);
    });
  } catch {
    sinTiendas();
  }
}

/* ---------- Envío de la postulación ---------- */
(function initPostulacion() {
  const form = $("#jobForm");
  if (!form) return;
  const msg = $("#jobMsg");
  const btn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name  = $("#jobName").value.trim();
    const email = $("#jobEmail").value.trim();
    const phone = $("#jobPhone").value.trim();
    const dni   = $("#jobDni").value.trim();
    const store = $("#jobStore").value;
    const schedule = document.querySelector('input[name="schedule"]:checked');
    const studying = document.querySelector('input[name="studying"]:checked');

    if (name.length < 3)       return setMsg(msg, "Ingresa tu nombre completo.", false);
    if (!EMAIL_RE.test(email)) return setMsg(msg, "Ingresa un correo válido.", false);
    if (phone.replace(/\D/g, "").length < 6) return setMsg(msg, "Ingresa tu número de celular.", false);
    if (dni.replace(/\D/g, "").length < 6)   return setMsg(msg, "Ingresa tu DNI.", false);
    if (!store)    return setMsg(msg, "Elige la tienda donde quieres trabajar.", false);
    if (!schedule) return setMsg(msg, "Elige una jornada.", false);
    if (!studying) return setMsg(msg, "Indícanos si estás estudiando.", false);
    if (!$("#jobConsent").checked) {
      return setMsg(msg, "Debes autorizar el tratamiento de tus datos para postular.", false);
    }

    submitOnce(form, btn, "Enviando…", async () => {
      setMsg(msg, "Enviando…", false);
      try {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name, email, phone, dni, store,
            schedule: schedule.value,
            studying: studying.value,
            message: $("#jobMessage").value.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) return setMsg(msg, data.error || "No pudimos enviar tu postulación.", false);
        setMsg(msg, data.message, true);
        form.reset();
        showToast("Recibimos tu postulación. Te contactaremos pronto.");
      } catch {
        setMsg(msg, "No pudimos enviar tu postulación. Revisa tu conexión e inténtalo de nuevo.", false);
      }
    });
  });
})();

cargarTiendas();
