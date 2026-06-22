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
// Carpeta de datos persistente (volumen de Railway). Una sola variable
// DATA_DIR cubre la base de datos y, por defecto, las imágenes subidas.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lukers-admin";
// Acceso independiente al módulo de postulaciones (RR.HH.)
const JOBS_PASSWORD = process.env.JOBS_PASSWORD || "lukers-rrhh";
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

if (!process.env.ADMIN_PASSWORD) {
  console.warn(
    "\n⚠  Usando la contraseña de administrador por defecto: \"lukers-admin\".\n" +
      "   Define ADMIN_PASSWORD en producción para protegerlo.\n"
  );
}
if (!process.env.JOBS_PASSWORD) {
  console.warn(
    "⚠  Usando la contraseña de RR.HH. por defecto: \"lukers-rrhh\".\n" +
      "   Define JOBS_PASSWORD en producción para protegerlo.\n"
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
/*  Autenticación con tokens HMAC firmados y con ámbito (scope)        */
/*  scope "admin": panel completo · scope "jobs": solo postulaciones   */
/* ------------------------------------------------------------------ */
function makeToken(scope = "admin") {
  const exp = Date.now() + 1000 * 60 * 60 * 8; // expira en 8h
  const payload = `${exp}:${scope}`;
  const sig = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

function parseToken(token) {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const idx = decoded.lastIndexOf(".");
    if (idx < 0) return null;
    const payload = decoded.slice(0, idx);
    const sig = decoded.slice(idx + 1);
    const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const [expStr, scope] = payload.split(":");
    if (Date.now() >= Number(expStr)) return null;
    return { scope: scope || "admin" };
  } catch {
    return null;
  }
}

function requireScope(...allowed) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    const data = parseToken(token);
    if (!data || !allowed.includes(data.scope)) {
      return res.status(401).json({ error: "Sesión no válida o expirada" });
    }
    next();
  };
}

// El administrador general
const requireAuth = requireScope("admin");

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

// Subida de fotos de tienda (nombre basado en el id de la tienda)
const uploadStore = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
      cb(null, `store_${req.params.id}_${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Solo se permiten imágenes"));
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
app.get(["/postulaciones", "/postulaciones.html"], (req, res) =>
  res.sendFile(path.join(ROOT, "postulaciones.html"))
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
  const rows = db
    .prepare("SELECT id, name, city, address, hours, photo FROM stores WHERE active = 1 ORDER BY sort_order, id")
    .all();
  const stores = rows.map((s) => ({
    id: s.id, name: s.name, city: s.city, address: s.address, hours: s.hours,
    photo: s.photo ? `/uploads/${s.photo}` : null,
  }));
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
  const prev = db.prepare("SELECT photo FROM stores WHERE id = ?").get(Number(req.params.id));
  db.prepare("DELETE FROM stores WHERE id = ?").run(Number(req.params.id));
  if (prev && prev.photo) fs.unlink(path.join(UPLOADS_DIR, prev.photo), () => {});
  res.json({ ok: true });
});

app.post("/api/admin/stores/:id/photo", requireAuth, uploadStore.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
  const id = Number(req.params.id);
  const prev = db.prepare("SELECT photo FROM stores WHERE id = ?").get(id);
  db.prepare("UPDATE stores SET photo = ? WHERE id = ?").run(req.file.filename, id);
  if (prev && prev.photo && prev.photo !== req.file.filename) {
    fs.unlink(path.join(UPLOADS_DIR, prev.photo), () => {});
  }
  res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

app.delete("/api/admin/stores/:id/photo", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const prev = db.prepare("SELECT photo FROM stores WHERE id = ?").get(id);
  if (prev && prev.photo) {
    db.prepare("UPDATE stores SET photo = NULL WHERE id = ?").run(id);
    fs.unlink(path.join(UPLOADS_DIR, prev.photo), () => {});
  }
  res.json({ ok: true });
});

/* ----------------------------- Marcas del carrusel ---------------- */
app.get("/api/brands", (req, res) => {
  const rows = db.prepare("SELECT id, name, lane FROM brands ORDER BY lane, sort_order, id").all();
  const lanes = { 1: [], 2: [], 3: [] };
  for (const r of rows) (lanes[r.lane] || (lanes[r.lane] = [])).push({ id: r.id, name: r.name });
  res.json({ lanes });
});

app.post("/api/admin/brands", requireAuth, (req, res) => {
  const name = String(req.body.name || "").trim().slice(0, 60);
  let lane = Number(req.body.lane);
  if (![1, 2, 3].includes(lane)) lane = 1;
  if (!name) return res.status(400).json({ error: "El nombre de la marca es obligatorio" });
  const maxOrder = db.prepare("SELECT COALESCE(MAX(sort_order),0) as m FROM brands WHERE lane = ?").get(lane).m;
  const info = db
    .prepare("INSERT INTO brands (name, lane, sort_order, created_at) VALUES (?, ?, ?, ?)")
    .run(name, lane, maxOrder + 1, new Date().toISOString());
  res.json({ ok: true, id: Number(info.lastInsertRowid) });
});

app.delete("/api/admin/brands/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM brands WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

/* ----------------------------- Postulaciones (trabaja con nosotros) */
app.post("/api/jobs", (req, res) => {
  const name     = String(req.body.name     || "").trim().slice(0, 80);
  const email    = String(req.body.email    || "").trim().toLowerCase();
  const phone    = String(req.body.phone    || "").trim().slice(0, 30);
  const dni      = String(req.body.dni      || "").trim().slice(0, 15);
  const store    = String(req.body.store    || "").trim().slice(0, 100);
  const schedule = String(req.body.schedule || "").trim().slice(0, 40);
  const studying = String(req.body.studying || "").trim().slice(0, 40);
  const message  = String(req.body.message  || "").trim().slice(0, 600);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Nombre y correo válido son obligatorios" });
  }
  db.prepare(
    "INSERT INTO job_applications (name, email, phone, dni, city, store, schedule, studying, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(name, email, phone || null, dni || null, null, store || null, schedule || null, studying || null, message || null, new Date().toISOString());
  res.json({ ok: true, message: "¡Gracias! Revisaremos tu postulación y te contactaremos pronto." });
});

/* --- Módulo independiente de RR.HH. (acceso propio: JOBS_PASSWORD) --- */
app.post("/api/rrhh/login", (req, res) => {
  const password = String(req.body.password || "");
  const a = Buffer.from(password);
  const b = Buffer.from(JOBS_PASSWORD);
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });
  res.json({ ok: true, token: makeToken("jobs") });
});

app.get("/api/rrhh/applications", requireScope("jobs", "admin"), (req, res) => {
  const rows = db
    .prepare("SELECT id, name, email, phone, dni, store, schedule, studying, message, created_at FROM job_applications ORDER BY id DESC")
    .all();
  res.json({ count: rows.length, applications: rows });
});

app.get("/api/rrhh/applications.csv", requireScope("jobs", "admin"), (req, res) => {
  const rows = db
    .prepare("SELECT id, name, email, phone, dni, store, schedule, studying, message, created_at FROM job_applications ORDER BY id DESC")
    .all();
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    "id,nombre,correo,celular,dni,tienda,jornada,estudia,mensaje,fecha",
    ...rows.map((r) => [r.id, r.name, r.email, r.phone, r.dni, r.store, r.schedule, r.studying, r.message, r.created_at].map(esc).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=postulaciones-lukers.csv");
  res.send("﻿" + csv);
});

app.delete("/api/rrhh/applications/:id", requireScope("jobs", "admin"), (req, res) => {
  db.prepare("DELETE FROM job_applications WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
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
  console.log(`  Panel de administración: http://localhost:${PORT}/admin`);
  console.log(`  Datos:     ${DATA_DIR}`);
  console.log(`  Imágenes:  ${UPLOADS_DIR}`);
  if (!process.env.DATA_DIR) {
    console.warn("  ⚠  DATA_DIR no está definido: los datos NO son persistentes.\n");
  } else {
    console.log("  ✓ Volumen persistente activo.\n");
  }
});
