/* ============================================================
   LUKERS — Lógica del panel de administración
   ============================================================ */
"use strict";

const $ = (s) => document.querySelector(s);
const TOKEN_KEY = "lukers-admin-token";

let token = localStorage.getItem(TOKEN_KEY) || "";

/* ---------- Helpers ---------- */
async function api(path, options = {}) {
  const opts = { ...options, headers: { ...(options.headers || {}) } };
  if (token) opts.headers.Authorization = "Bearer " + token;
  const res = await fetch(path, opts);
  if (res.status === 401) {
    logout();
    throw new Error("Sesión expirada");
  }
  return res;
}

let toastTimer;
function showToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---------- Ojito: mostrar / ocultar contraseña ---------- */
$("#pwToggle").addEventListener("click", () => {
  const input = $("#password");
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  $("#eyeIcon").innerHTML = isHidden
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
});

/* ---------- Login ---------- */
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#loginMsg");
  msg.textContent = "";
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: $("#password").value }),
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.error || "No se pudo ingresar";
      return;
    }
    token = data.token;
    localStorage.setItem(TOKEN_KEY, token);
    enterDashboard();
  } catch {
    msg.textContent = "No se pudo conectar con el servidor";
  }
});

function logout() {
  token = "";
  localStorage.removeItem(TOKEN_KEY);
  $("#dashView").hidden = true;
  $("#loginView").hidden = false;
  $("#password").value = "";
}
$("#logoutBtn").addEventListener("click", logout);

/* ---------- Tabs ---------- */
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.tab;
    $("#tab-images").hidden = target !== "images";
    $("#tab-offers").hidden = target !== "offers";
    $("#tab-subs").hidden = target !== "subs";
    if (target === "subs") loadSubscribers();
    if (target === "offers") loadOffers();
  });
});

/* ---------- Dashboard ---------- */
function enterDashboard() {
  $("#loginView").hidden = true;
  $("#dashView").hidden = false;
  loadImages();
}

/* ---------- Imágenes ---------- */
async function loadImages() {
  const res = await fetch("/api/images");
  const { slots, images } = await res.json();
  const box = $("#imageSlots");
  box.innerHTML = "";

  slots.forEach((s) => {
    const url = images[s.slot];
    const card = document.createElement("div");
    card.className = "slot-card";
    card.innerHTML = `
      <div class="slot-preview ${url ? "" : "empty"}" ${url ? `style="background-image:url('${url}')"` : ""}></div>
      <div class="slot-body">
        <h3>${s.label}</h3>
        <input type="file" class="slot-file" accept="image/*" />
        <div class="slot-actions">
          <button class="btn btn-primary slot-upload">Subir imagen</button>
          ${url ? `<button class="slot-reset" title="Quitar imagen">Quitar</button>` : ""}
        </div>
      </div>`;

    const fileInput = card.querySelector(".slot-file");
    card.querySelector(".slot-upload").addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append("image", file);
      try {
        const r = await api(`/api/admin/images/${s.slot}`, { method: "POST", body: fd });
        const d = await r.json();
        if (!r.ok) return showToast(d.error || "Error al subir");
        showToast("✓ Imagen actualizada");
        loadImages();
      } catch (e) {
        showToast(e.message || "Error de conexión");
      }
    });

    const resetBtn = card.querySelector(".slot-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        if (!confirm("¿Quitar esta imagen y volver al diseño por defecto?")) return;
        const r = await api(`/api/admin/images/${s.slot}`, { method: "DELETE" });
        if (r.ok) {
          showToast("Imagen quitada");
          loadImages();
        }
      });
    }

    box.appendChild(card);
  });
}

/* ---------- Suscriptores ---------- */
async function loadSubscribers() {
  try {
    const res = await api("/api/admin/subscribers");
    const { count, subscribers } = await res.json();
    $("#subCount").textContent = count;
    const body = $("#subsBody");
    body.innerHTML = "";
    $("#subsEmpty").hidden = count > 0;

    subscribers.forEach((s) => {
      const tr = document.createElement("tr");
      const fecha = new Date(s.created_at).toLocaleDateString("es-PE", {
        year: "numeric", month: "short", day: "numeric",
      });
      tr.innerHTML = `
        <td>${s.id}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.name || "—")}</td>
        <td>${fecha}</td>
        <td><button class="del-sub" title="Eliminar">🗑</button></td>`;
      tr.querySelector(".del-sub").addEventListener("click", async () => {
        if (!confirm(`¿Eliminar a ${s.email}?`)) return;
        const r = await api(`/api/admin/subscribers/${s.id}`, { method: "DELETE" });
        if (r.ok) { showToast("Suscriptor eliminado"); loadSubscribers(); }
      });
      body.appendChild(tr);
    });
  } catch (e) {
    showToast(e.message || "Error al cargar");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* ---------- Ofertas / novedades ---------- */
$("#offerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = $("#offerMsg");
  msg.classList.remove("ok");
  const tag = $("#offerTag").value.trim();
  const title = $("#offerTitle").value.trim();
  const description = $("#offerDesc").value.trim();
  if (!title) { msg.textContent = "El título es obligatorio"; return; }
  try {
    const r = await api("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, title, description }),
    });
    if (!r.ok) { const d = await r.json(); msg.textContent = d.error || "Error"; return; }
    e.target.reset();
    showToast("✓ Oferta publicada");
    loadOffers();
  } catch (err) {
    msg.textContent = err.message || "Error de conexión";
  }
});

async function loadOffers() {
  const res = await fetch("/api/offers");
  const { offers } = await res.json();
  const box = $("#offersAdminList");
  if (!offers.length) {
    box.innerHTML = `<p class="subs-empty">Aún no hay ofertas publicadas.</p>`;
    return;
  }
  box.innerHTML = "";
  offers.forEach((o) => {
    const row = document.createElement("div");
    row.className = "offer-admin-row";
    row.innerHTML = `
      <div>
        ${o.tag ? `<span class="offer-admin-tag">${escapeHtml(o.tag)}</span>` : ""}
        <b>${escapeHtml(o.title)}</b>
        ${o.description ? `<span class="offer-admin-desc">${escapeHtml(o.description)}</span>` : ""}
      </div>
      <button class="del-sub" title="Eliminar">🗑</button>`;
    row.querySelector(".del-sub").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar la oferta "${o.title}"?`)) return;
      const r = await api(`/api/admin/offers/${o.id}`, { method: "DELETE" });
      if (r.ok) { showToast("Oferta eliminada"); loadOffers(); }
    });
    box.appendChild(row);
  });
}

/* Exportar CSV (incluye el token vía descarga autenticada con fetch -> blob) */
$("#exportBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await api("/api/admin/subscribers.csv");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "suscriptores-lukers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    showToast("No se pudo exportar");
  }
});

/* ---------- Init ---------- */
if (token) {
  // Validamos el token cargando algo protegido
  api("/api/admin/subscribers")
    .then((r) => { if (r.ok) enterDashboard(); else logout(); })
    .catch(() => logout());
}
