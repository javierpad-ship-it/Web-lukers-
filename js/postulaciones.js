/* ============================================================
   LUKERS — Módulo independiente de Postulaciones (RR.HH.)
   ============================================================ */
"use strict";

const $ = (s) => document.querySelector(s);
const TOKEN_KEY = "lukers-rrhh-token";
let token = localStorage.getItem(TOKEN_KEY) || "";

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

let toastTimer;
function showToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

async function api(path, options = {}) {
  const opts = { ...options, headers: { ...(options.headers || {}) } };
  if (token) opts.headers.Authorization = "Bearer " + token;
  const res = await fetch(path, opts);
  if (res.status === 401) { logout(); throw new Error("Sesión expirada"); }
  return res;
}

/* ---------- Ojito ---------- */
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
    const res = await fetch("/api/rrhh/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: $("#password").value }),
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = data.error || "No se pudo ingresar"; return; }
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

function enterDashboard() {
  $("#loginView").hidden = true;
  $("#dashView").hidden = false;
  window.scrollTo({ top: 0, behavior: "instant" });
  loadApplications();
}

/* ---------- Datos ---------- */
async function loadApplications() {
  try {
    const res = await api("/api/rrhh/applications");
    const { count, applications } = await res.json();
    $("#appCount").textContent = count;
    const body = $("#appsBody");
    body.innerHTML = "";
    $("#appsEmpty").hidden = count > 0;
    applications.forEach((j) => {
      const tr = document.createElement("tr");
      const fecha = new Date(j.created_at).toLocaleDateString("es-PE", { year: "numeric", month: "short", day: "numeric" });
      tr.innerHTML = `
        <td>${j.id}</td>
        <td><b>${escapeHtml(j.name)}</b></td>
        <td>${escapeHtml(j.phone || "—")}</td>
        <td>${escapeHtml(j.dni || "—")}</td>
        <td style="font-size:0.82rem">${escapeHtml(j.email)}</td>
        <td style="font-size:0.82rem">${escapeHtml(j.store || "—")}</td>
        <td>${j.schedule ? `<span class="offer-admin-tag">${escapeHtml(j.schedule)}</span>` : "—"}</td>
        <td style="font-size:0.8rem">${escapeHtml(j.studying || "—")}</td>
        <td>${fecha}</td>
        <td><button class="del-sub" title="Eliminar">🗑</button></td>`;
      if (j.message) tr.title = j.message;
      tr.querySelector(".del-sub").addEventListener("click", async () => {
        if (!confirm(`¿Eliminar la postulación de ${j.name}?`)) return;
        const r = await api(`/api/rrhh/applications/${j.id}`, { method: "DELETE" });
        if (r.ok) { showToast("Postulación eliminada"); loadApplications(); }
      });
      body.appendChild(tr);
    });
  } catch (e) {
    showToast(e.message || "Error al cargar");
  }
}

/* ---------- Exportar CSV ---------- */
$("#exportBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await api("/api/rrhh/applications.csv");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "postulaciones-lukers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    showToast("No se pudo exportar");
  }
});

/* ---------- Init ---------- */
if (token) {
  api("/api/rrhh/applications")
    .then((r) => { if (r.ok) enterDashboard(); else logout(); })
    .catch(() => logout());
}
