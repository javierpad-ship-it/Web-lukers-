"use strict";

/**
 * Servidor de Lukers
 * - Sirve el sitio institucional (estático)
 * - API del newsletter con base de datos SQLite
 * - Panel de administración para cambiar las imágenes del diseño
 *
 * Variables de entorno (opcionales):
 *   PORT             Puerto del servidor (por defecto 3000)
 *   ADMIN_PASSWORD   Contraseña del panel de administración
 *   SESSION_SECRET   Secreto para firmar los tokens de sesión
 */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { getDb } = require("./db");

const ROOT = path.join(__dirname, "..");
// Configurable para apuntar a un volumen persistente (p. ej. en Railway).
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(ROOT, "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lukers-admin";
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    "\n⚠  Usando la contraseña de administrador por defecto: \"lukers-admin\".\n" +
      "   Define ADMIN_PASSWORD en producción para protegerlo.\n"
  );
}

const db = getDb();

/* ------------------------------------------------------------------ */
/*  Slots de imágenes del diseño que se pueden cambiar desde el panel  */
/* ------------------------------------------------------------------ */
const SLOTS = [
  { slot: "hero_main", label: "Imagen principal (portada / hero)", hint: "Cuadrada · 800 × 800 px", ratio: "1 / 1" },
  { slot: "look_ella", label: "Oferta — Look para ella (foto aspiracional)", hint: "Vertical (retrato) · 800 × 1100 px", ratio: "4 / 5" },
  { slot: "look_el", label: "Oferta — Look para él (foto aspiracional)", hint: "Vertical (retrato) · 800 × 1100 px", ratio: "4 / 5" },
  { slot: "look_urbano", label: "Oferta — Look urbano / familia (foto aspiracional)", hint: "Vertical (retrato) · 800 × 1100 px", ratio: "4 / 5" },
  { slot: "cat_formal", label: "Categoría — Línea Formal", hint: "Horizontal · 800 × 500 px", ratio: "16 / 10" },
  { slot: "cat_casual", label: "Categoría — Línea Casual", hint: "Horizontal · 800 × 500 px", ratio: "16 / 10" },
  { slot: "cat_calzado", label: "Categoría — Calzado", hint: "Horizontal · 800 × 500 px", ratio: "16 / 10" },
  { slot: "cat_accesorios", label: "Categoría — Accesorios", hint: "Horizontal · 800 × 500 px", ratio: "16 / 10" },
];
const SLOT_IDS = new Set(SLOTS.map((s) => s.slot));

/* ------------------------------------------------------------------ */
/*  Autenticación del administrador (token HMAC firmado, sin libs)     */
/* ------------------------------------------------------------------ */
function makeToken() {
  const payload = String(Date.now() + 1000 * 60 * 60 * 8); // expira en 8h
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(payload + "." + sig).toString("base64url");
}

function verifyToken(token) {
  try {
    const [payload, sig] = Buffer.from(token, "base64url")
      .toString()
      .split(".");
    const expected = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("hex");
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    return Date.now() < Number(payload);
  } catch {
    return false;
  }
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Sesión no válida o expirada" });
  }
  next();
}

/* ------------------------------------------------------------------ */
/*  Subida de imágenes (multer)                                        */
/* ------------------------------------------------------------------ */
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || ".png").toLowerCase();
      cb(null, `${req.params.slot}_${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Solo se permiten imágenes (PNG, JPG, WEBP, GIF, AVIF)"));
  },
});

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
const app = express();
app.use(express.json());

// Recursos estáticos del sitio (no exponemos server/, data/, package.json…)
app.use("/uploads", express.static(UPLOADS_DIR));
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/js", express.static(path.join(ROOT, "js")));
app.use("/assets", express.static(path.join(ROOT, "assets")));

app.get("/", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/admin", (req, res) => res.sendFile(path.join(ROOT, "admin.html")));
app.get(["/trabaja", "/trabaja.html"], (req, res) =>
  res.sendFile(path.join(ROOT, "trabaja.html"))
);

/* ----------------------------- Newsletter ------------------------- */
app.post("/api/subscribe", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const name = String(req.body.name || "").trim().slice(0, 80);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Ingresa un correo válido" });
  }

  try {
    db.prepare(
      "INSERT INTO subscribers (email, name, created_at) VALUES (?, ?, ?)"
    ).run(email, name || null, new Date().toISOString());
    res.json({ ok: true, message: "¡Listo! Te has suscrito al newsletter ✦" });
  } catch (e) {
    if (String(e.message).includes("UNIQUE")) {
      return res.json({
        ok: true,
        duplicate: true,
        message: "Este correo ya estaba suscrito 🙂",
      });
    }
    console.error(e);
    res.status(500).json({ error: "No se pudo guardar la suscripción" });
  }
});

/* ----------------------------- Imágenes (público) ----------------- */
app.get("/api/images", (req, res) => {
  const rows = db.prepare("SELECT slot, filename FROM images").all();
  const images = {};
  for (const r of rows) images[r.slot] = `/uploads/${r.filename}`;
  res.json({ slots: SLOTS, images });
});

/* ----------------------------- Admin: login ----------------------- */
app.post("/api/admin/login", (req, res) => {
  const password = String(req.body.password || "");
  const a = Buffer.from(password);
  const b = Buffer.from(ADMIN_PASSWORD);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });
  res.json({ ok: true, token: makeToken() });
});

/* ----------------------------- Admin: imágenes -------------------- */
app.post(
  "/api/admin/images/:slot",
  requireAuth,
  (req, res, next) => {
    if (!SLOT_IDS.has(req.params.slot)) {
      return res.status(400).json({ error: "Sección de imagen no válida" });
    }
    next();
  },
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
    const slot = req.params.slot;
    const prev = db.prepare("SELECT filename FROM images WHERE slot = ?").get(slot);

    db.prepare(
      `INSERT INTO images (slot, filename, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(slot) DO UPDATE SET filename = excluded.filename, updated_at = excluded.updated_at`
    ).run(slot, req.file.filename, new Date().toISOString());

    if (prev && prev.filename !== req.file.filename) {
      fs.unlink(path.join(UPLOADS_DIR, prev.filename), () => {});
    }
    res.json({ ok: true, url: `/uploads/${req.file.filename}` });
  }
);

app.delete("/api/admin/images/:slot", requireAuth, (req, res) => {
  const slot = req.params.slot;
  const prev = db.prepare("SELECT filename FROM images WHERE slot = ?").get(slot);
  if (prev) {
    db.prepare("DELETE FROM images WHERE slot = ?").run(slot);
    fs.unlink(path.join(UPLOADS_DIR, prev.filename), () => {});
  }
  res.json({ ok: true });
});

/* ----------------------------- Admin: suscriptores ---------------- */
app.get("/api/admin/subscribers", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT id, email, name, created_at FROM subscribers ORDER BY id DESC")
    .all();
  res.json({ count: rows.length, subscribers: rows });
});

app.get("/api/admin/subscribers.csv", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT id, email, name, created_at FROM subscribers ORDER BY id DESC")
    .all();
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    "id,email,nombre,fecha",
    ...rows.map((r) => [r.id, r.email, r.name, r.created_at].map(escape).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=suscriptores-lukers.csv");
  res.send("﻿" + csv); // BOM para que Excel respete los acentos
});

app.delete("/api/admin/subscribers/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM subscribers WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

/* ----------------------------- Tiendas (público) ------------------ */
app.get("/api/stores", (req, res) => {
  const stores = db
    .prepare("SELECT id, name, city, address, hours FROM stores WHERE active = 1 ORDER BY sort_order, id")
    .all();
  res.json({ stores });
});

/* ----------------------------- Admin: tiendas --------------------- */
app.post("/api/admin/stores", requireAuth, (req, res) => {
  const name    = String(req.body.name    || "").trim().slice(0, 100);
  const city    = String(req.body.city    || "").trim().slice(0, 60);
  const address = String(req.body.address || "").trim().slice(0, 200);
  const hours   = String(req.body.hours   || "Lun a Dom · 10:00 a.m. – 10:00 p.m.").trim().slice(0, 100);
  if (!name || !city || !address) return res.status(400).json({ error: "Nombre, ciudad y dirección son obligatorios" });
  const maxOrder = db.prepare("SELECT COALESCE(MAX(sort_order),0) as m FROM stores").get().m;
  const info = db
    .prepare("INSERT INTO stores (name, city, address, hours, active, sort_order, created_at) VALUES (?, ?, ?, ?, 1, ?, ?)")
    .run(name, city, address, hours, maxOrder + 1, new Date().toISOString());
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

app.put("/api/admin/stores/:id", requireAuth, (req, res) => {
  const id      = Number(req.params.id);
  const name    = String(req.body.name    || "").trim().slice(0, 100);
  const city    = String(req.body.city    || "").trim().slice(0, 60);
  const address = String(req.body.address || "").trim().slice(0, 200);
  const hours   = String(req.body.hours   || "").trim().slice(0, 100);
  if (!name || !city || !address) return res.status(400).json({ error: "Datos incompletos" });
  db.prepare("UPDATE stores SET name=?, city=?, address=?, hours=? WHERE id=?")
    .run(name, city, address, hours, id);
  res.json({ ok: true });
});

app.delete("/api/admin/stores/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM stores WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

/* ----------------------------- Postulaciones (trabaja con nosotros) */
app.post("/api/jobs", (req, res) => {
  const name     = String(req.body.name     || "").trim().slice(0, 80);
  const email    = String(req.body.email    || "").trim().toLowerCase();
  const phone    = String(req.body.phone    || "").trim().slice(0, 30);
  const store    = String(req.body.store    || "").trim().slice(0, 100);
  const schedule = String(req.body.schedule || "").trim().slice(0, 40);
  const message  = String(req.body.message  || "").trim().slice(0, 600);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Nombre y correo válido son obligatorios" });
  }
  db.prepare(
    "INSERT INTO job_applications (name, email, phone, city, store, schedule, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(name, email, phone || null, null, store || null, schedule || null, message || null, new Date().toISOString());
  res.json({ ok: true, message: "¡Gracias! Revisaremos tu postulación y te contactaremos pronto." });
});

app.get("/api/admin/jobs", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT id, name, email, phone, store, schedule, message, created_at FROM job_applications ORDER BY id DESC")
    .all();
  res.json({ count: rows.length, applications: rows });
});

/* ----------------------------- Ofertas / novedades ---------------- */
app.get("/api/offers", (req, res) => {
  const offers = db
    .prepare("SELECT id, tag, title, description, created_at FROM offers ORDER BY id DESC")
    .all();
  res.json({ offers });
});

app.post("/api/admin/offers", requireAuth, (req, res) => {
  const tag = String(req.body.tag || "").trim().slice(0, 24);
  const title = String(req.body.title || "").trim().slice(0, 120);
  const description = String(req.body.description || "").trim().slice(0, 300);
  if (!title) return res.status(400).json({ error: "El título es obligatorio" });
  const info = db
    .prepare("INSERT INTO offers (tag, title, description, created_at) VALUES (?, ?, ?, ?)")
    .run(tag || null, title, description || null, new Date().toISOString());
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

app.delete("/api/admin/offers/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM offers WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

/* ----------------------------- Manejo de errores ------------------ */
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || "Error en la solicitud" });
  next();
});

app.listen(PORT, () => {
  console.log(`\n✦ Lukers corriendo en  http://localhost:${PORT}`);
  console.log(`  Panel de administración: http://localhost:${PORT}/admin\n`);
});
