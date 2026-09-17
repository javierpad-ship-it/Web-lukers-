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

/* ------------------------------------------------------------------ */
/*  Lectura del archivo .env (sin dependencias externas)               */
/*  Las variables ya definidas en el entorno (Railway) tienen          */
/*  prioridad: el archivo .env solo rellena las que falten.            */
/* ------------------------------------------------------------------ */
function loadEnvFile(file) {
  let raw;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    return; // no hay .env: normal en producción
  }
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvFile(path.join(ROOT, ".env"));

// Carpeta de datos persistente (volumen de Railway). Una sola variable
// DATA_DIR cubre la base de datos y, por defecto, las imágenes subidas.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const PORT = process.env.PORT || 3000;

// Dirección pública definitiva del sitio (para robots.txt, sitemap y
// enlaces canónicos). Se cambia con la variable SITE_URL.
const SITE_URL = (process.env.SITE_URL || "https://lukers.pe").replace(/\/+$/, "");

/**
 * Contraseñas de acceso. NUNCA hay una contraseña por defecto conocida:
 * si la variable de entorno no está definida se genera una aleatoria y se
 * imprime en el arranque. El sitio público sigue funcionando; lo único que
 * queda inaccesible es el panel, que es exactamente lo que queremos.
 */
function requiredPassword(varName, label) {
  const fromEnv = process.env[varName];
  if (fromEnv && fromEnv.length >= 8) return fromEnv;
  const generated = crypto.randomBytes(12).toString("base64url");
  if (fromEnv) {
    console.warn(
      `\n⚠  ${varName} es demasiado corta (mínimo 8 caracteres). Se ignora.`
    );
  }
  console.warn(
    `\n⚠  ${varName} no está definida. ${label} usará esta contraseña temporal,\n` +
      `   que cambia en cada reinicio:\n\n      ${generated}\n\n` +
      `   Define ${varName} en las variables de entorno para fijarla.\n`
  );
  return generated;
}

const ADMIN_PASSWORD = requiredPassword("ADMIN_PASSWORD", "El panel de administración");
// Acceso independiente al módulo de postulaciones (RR.HH.)
const JOBS_PASSWORD = requiredPassword("JOBS_PASSWORD", "El módulo de RR.HH.");

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
if (!process.env.SESSION_SECRET) {
  console.warn(
    "⚠  SESSION_SECRET no está definida: las sesiones abiertas se cerrarán\n" +
      "   en cada reinicio del servidor.\n"
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
/*  Límite de intentos de acceso (anti fuerza bruta)                   */
/*  5 intentos fallidos por IP; después, bloqueo de 15 minutos.        */
/* ------------------------------------------------------------------ */
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map(); // ip -> { count, resetAt }

// Limpieza periódica para que el mapa no crezca sin control.
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts) {
    if (entry.resetAt <= now) loginAttempts.delete(ip);
  }
}, LOGIN_WINDOW_MS).unref();

function loginRateLimit(req, res, next) {
  const ip = req.ip || "desconocida";
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= LOGIN_MAX_ATTEMPTS) {
    const minutes = Math.ceil((entry.resetAt - now) / 60000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Vuelve a intentarlo en ${minutes} minuto(s).`,
    });
  }
  next();
}

function registerFailedLogin(req) {
  const ip = req.ip || "desconocida";
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedLogins(req) {
  loginAttempts.delete(req.ip || "desconocida");
}

/** Comparación de contraseñas en tiempo constante, sin filtrar la longitud. */
function passwordMatches(candidate, expected) {
  const a = crypto.createHash("sha256").update(String(candidate)).digest();
  const b = crypto.createHash("sha256").update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Convierte el :id de la URL en un entero positivo, o null si no lo es. */
function parseId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * Prepara un valor para el CSV. Además de las comillas, neutraliza las
 * celdas que empiezan por = + - @ (y tabulador o retorno de carro), que
 * Excel interpretaría como fórmulas: así nadie puede ejecutar nada
 * escribiendo una fórmula en el formulario público.
 */
function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/* ------------------------------------------------------------------ */
/*  Subida de imágenes (multer)                                        */
/* ------------------------------------------------------------------ */
/**
 * La extensión del archivo SIEMPRE se deriva del tipo de imagen declarado,
 * nunca del nombre que envía quien sube el archivo. Así es imposible dejar
 * un .html o un .svg dentro de /uploads haciéndolo pasar por imagen.
 */
const EXT_BY_MIME = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

function imageOnly(req, file, cb) {
  if (EXT_BY_MIME[file.mimetype]) cb(null, true);
  else cb(new Error("Solo se permiten imágenes (PNG, JPG, WEBP, GIF, AVIF)"));
}

// Nombre aleatorio: ni el slot ni el id llegan nunca al sistema de archivos.
function safeName(prefix, file) {
  const ext = EXT_BY_MIME[file.mimetype] || ".png";
  return `${prefix}_${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, safeName("img", file)),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB
  fileFilter: imageOnly,
});

// Subida de fotos de tienda
const uploadStore = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, safeName("store", file)),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: imageOnly,
});

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
const app = express();

// Railway sirve detrás de un proxy: sin esto, req.ip sería siempre la del
// proxy y el límite de intentos de login no distinguiría a los visitantes.
app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

// Cabeceras de seguridad para todas las respuestas.
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Recursos estáticos del sitio (no exponemos server/, data/, package.json…)
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    // Nada de /uploads se interpreta como página: siempre se descarga o
    // se muestra como imagen, nunca se ejecuta.
    setHeaders: (res) => res.setHeader("Content-Security-Policy", "default-src 'none'"),
  })
);
app.use("/css", express.static(path.join(ROOT, "css")));
app.use("/js", express.static(path.join(ROOT, "js")));
app.use("/assets", express.static(path.join(ROOT, "assets")));

// Las páginas internas nunca deben aparecer en Google.
function noIndex(req, res, next) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  next();
}

app.get("/", (req, res) => res.sendFile(path.join(ROOT, "index.html")));
app.get("/admin", noIndex, (req, res) => res.sendFile(path.join(ROOT, "admin.html")));
app.get(["/trabaja", "/trabaja.html"], (req, res) =>
  res.sendFile(path.join(ROOT, "trabaja.html"))
);
app.get(["/postulaciones", "/postulaciones.html"], noIndex, (req, res) =>
  res.sendFile(path.join(ROOT, "postulaciones.html"))
);
app.get(["/privacidad", "/privacidad.html"], (req, res) =>
  res.sendFile(path.join(ROOT, "privacidad.html"))
);

// robots.txt — le dice a Google qué NO debe indexar.
app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(
    [
      "User-agent: *",
      "Disallow: /admin",
      "Disallow: /postulaciones",
      "Disallow: /uploads/",
      "Allow: /",
      "",
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      "",
    ].join("\n")
  );
});

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
app.post("/api/admin/login", loginRateLimit, (req, res) => {
  if (!passwordMatches(req.body.password || "", ADMIN_PASSWORD)) {
    registerFailedLogin(req);
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }
  clearFailedLogins(req);
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
  const csv = [
    "id,email,nombre,fecha",
    ...rows.map((r) => [r.id, r.email, r.name, r.created_at].map(csvCell).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=suscriptores-lukers.csv");
  res.send("﻿" + csv); // BOM para que Excel respete los acentos
});

app.delete("/api/admin/subscribers/:id", requireAuth, (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  db.prepare("DELETE FROM subscribers WHERE id = ?").run(id);
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
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
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
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  const prev = db.prepare("SELECT photo FROM stores WHERE id = ?").get(id);
  db.prepare("DELETE FROM stores WHERE id = ?").run(id);
  if (prev && prev.photo) fs.unlink(path.join(UPLOADS_DIR, prev.photo), () => {});
  res.json({ ok: true });
});

app.post("/api/admin/stores/:id/photo", requireAuth, uploadStore.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No se recibió ninguna imagen" });
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  const prev = db.prepare("SELECT photo FROM stores WHERE id = ?").get(id);
  db.prepare("UPDATE stores SET photo = ? WHERE id = ?").run(req.file.filename, id);
  if (prev && prev.photo && prev.photo !== req.file.filename) {
    fs.unlink(path.join(UPLOADS_DIR, prev.photo), () => {});
  }
  res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

app.delete("/api/admin/stores/:id/photo", requireAuth, (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
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
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  db.prepare("DELETE FROM brands WHERE id = ?").run(id);
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
app.post("/api/rrhh/login", loginRateLimit, (req, res) => {
  if (!passwordMatches(req.body.password || "", JOBS_PASSWORD)) {
    registerFailedLogin(req);
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }
  clearFailedLogins(req);
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
  const csv = [
    "id,nombre,correo,celular,dni,tienda,jornada,estudia,mensaje,fecha",
    ...rows.map((r) => [r.id, r.name, r.email, r.phone, r.dni, r.store, r.schedule, r.studying, r.message, r.created_at].map(csvCell).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=postulaciones-lukers.csv");
  res.send("﻿" + csv);
});

app.delete("/api/rrhh/applications/:id", requireScope("jobs", "admin"), (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  db.prepare("DELETE FROM job_applications WHERE id = ?").run(id);
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
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Identificador no válido" });
  db.prepare("DELETE FROM offers WHERE id = ?").run(id);
  res.json({ ok: true });
});

/* ----------------------------- Manejo de errores ------------------ */
app.use((err, req, res, next) => {
  if (!err) return next();

  // Errores de multer y de validación: culpa de la petición, mensaje útil.
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "La imagen supera el máximo de 5 MB"
        : "No se pudo procesar el archivo";
    return res.status(400).json({ error: message });
  }
  if (err.message && err.message.startsWith("Solo se permiten imágenes")) {
    return res.status(400).json({ error: err.message });
  }

  // Cualquier otro error es nuestro: se registra completo en el servidor,
  // pero al visitante solo le llega un mensaje genérico (antes se filtraban
  // rutas internas del sistema de archivos).
  console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  res.status(500).json({ error: "Error interno del servidor" });
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
