"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

let db;

/* Cambia esta cadena solo si hay que forzar otra sustitucion de tiendas.
   OJO: cambiarla PISA lo que se haya editado desde el panel.

   Historial:
     (sin sufijo) las diez tiendas reales, en lugar de las doce inventadas
     _b            horarios propios de Chiclayo, Tarapoto e Iquitos
     _c            la tienda de Av. La Marina pasa a llamarse "La Marina"

   Las tres se hicieron el 22/09/2026, antes de que nadie tocara el panel.
   A partir de aqui, lo que se edite desde el panel manda: no volver a
   cambiar esta cadena sin avisar a Lukers. */
const SEMILLA_TIENDAS = "stores_seed_reales_2026_09_c";

/* ══════════════════════════════════════════════════════════════════════
   TIENDAS — origen de los datos

   Las doce tiendas que habia aqui antes eran INVENTADAS por una sesion de
   IA anterior. Se han sustituido por las diez que Lukers publica en sus
   propias cuentas (TikTok @lukers.pe, Threads @lukers.pe, Facebook
   Lukers.pe), donde la misma lista se repite en varias publicaciones.

   NO se han podido leer desde www.lukers.pe: el dominio esta bloqueado
   por la politica de red de este entorno. Por eso siguen PENDIENTES DE
   QUE LUKERS LAS CONFIRME antes de publicarlas como datos estructurados
   (ver la variable TIENDAS_VERIFICADAS en server/server.js).

   Dudas concretas anotadas en docs/HALLAZGOS-WEB-PUBLICA.md.
   ══════════════════════════════════════════════════════════════════════ */

/* Dos horarios distintos: Lima abre de 10 a 10; las tres tiendas del norte
   y la selva, de 9:30 a 9:30. Confirmado por Lukers el 22/09/2026. */
const HORARIO_LIMA  = "Lun a Dom · 10:00 a. m. – 10:00 p. m.";
const HORARIO_9Y30  = "Lun a Dom · 9:30 a. m. – 9:30 p. m.";

const INITIAL_STORES = [
  // Lima
  { name: "Lukers Jr. de la Unión", city: "Lima",     address: "Jr. de la Unión 455, Cercado de Lima",     hours: HORARIO_LIMA },
  { name: "Lukers Chorrillos",      city: "Lima",     address: "Av. El Sol 1175, Chorrillos",              hours: HORARIO_LIMA },
  { name: "Lukers Independencia",   city: "Lima",     address: "Av. Alfredo Mendiola 3688, Independencia", hours: HORARIO_LIMA },
  { name: "Lukers Lince",           city: "Lima",     address: "Av. Prolongación Iquitos 2635, Lince",     hours: HORARIO_LIMA },
  /* Se llama por la avenida, no por el distrito: las publicaciones de Lukers
     la anuncian como San Miguel y dentro de la empresa se la conoce como
     Pueblo Libre. Av. La Marina separa ambos distritos en ese tramo.
     "La Marina" es ademas como la nombran los clientes. */
  { name: "Lukers La Marina",       city: "Lima",     address: "Av. La Marina 1666, San Miguel",           hours: HORARIO_LIMA },
  { name: "Lukers Breña",           city: "Lima",     address: "Av. Alfonso Ugarte 1234-1236, Breña",      hours: HORARIO_LIMA },
  // Provincias
  { name: "Lukers Trujillo",        city: "Trujillo", address: "Jr. Pizarro 519, Trujillo",                hours: HORARIO_LIMA },
  { name: "Lukers Chiclayo",        city: "Chiclayo", address: "Av. Luis Gonzales 1285, Chiclayo",         hours: HORARIO_9Y30 },
  { name: "Lukers Tarapoto",        city: "Tarapoto", address: "Jr. Martínez de Compagñón 246, Tarapoto",  hours: HORARIO_9Y30 },
  { name: "Lukers Iquitos",         city: "Iquitos",  address: "Jr. Sargento Lores 162, Iquitos",          hours: HORARIO_9Y30 },
];

const INITIAL_BRANDS = {
  1: ["JOHN HOLDEN", "LEVI'S", "BEVERLY HILLS POLO CLUB", "DONATELLI", "REGATA", "DOCKERS", "ADIDAS", "US POLO ASSN"],
  2: ["PIERRE CARDIN", "IZOD", "PUMA", "JACK & JONES", "VERO MODA", "TERRANOVA", "OLD NAVY", "NIKE"],
  3: ["WRANGLER", "LEE", "PIONIER", "ONLY", "GIACOMO BRIZZI", "VAN HEUSEN", "CK", "TALLY WEiJL"],
};

function columns(table) {
  return db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
}

function getDb() {
  if (db) return db;

  db = new DatabaseSync(path.join(DATA_DIR, "lukers.db"));

  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT UNIQUE NOT NULL,
      name       TEXT,
      created_at TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      slot       TEXT PRIMARY KEY,
      filename   TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS offers (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      tag         TEXT,
      title       TEXT NOT NULL,
      description TEXT,
      created_at  TEXT NOT NULL
    );
  `);

  /* ---------------- Tiendas ---------------- */
  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      city       TEXT NOT NULL,
      address    TEXT NOT NULL,
      hours      TEXT NOT NULL DEFAULT 'Lun a Dom · 10:00 a.m. – 10:00 p.m.',
      photo      TEXT,
      active     INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  if (!columns("stores").includes("photo")) db.exec("ALTER TABLE stores ADD COLUMN photo TEXT");

  /* Marcas internas: sirven para saber que migraciones ya se aplicaron a
     ESTA base de datos concreta. */
  db.exec(`
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  const leerMarca = (k) => db.prepare("SELECT value FROM meta WHERE key = ?").get(k);
  const ponerMarca = (k, v) =>
    db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)").run(k, v);

  const sembrarTiendas = () => {
    const ins = db.prepare(
      "INSERT INTO stores (name, city, address, hours, active, sort_order, created_at) VALUES (?, ?, ?, ?, 1, ?, ?)"
    );
    const now = new Date().toISOString();
    INITIAL_STORES.forEach((s, i) => ins.run(s.name, s.city, s.address, s.hours, i, now));
  };

  const storeCount = db.prepare("SELECT COUNT(*) as c FROM stores").get();
  if (storeCount.c === 0) {
    sembrarTiendas();
    ponerMarca(SEMILLA_TIENDAS, new Date().toISOString());
  } else if (!leerMarca(SEMILLA_TIENDAS)) {
    /* Esta base de datos ya existia con las doce tiendas INVENTADAS por una
       sesion de IA anterior. Como el sitio nunca se publico, esos registros
       no son informacion de nadie: se sustituyen una sola vez por las
       reales. La marca en `meta` impide que esto vuelva a ejecutarse y pise
       lo que Lukers edite despues desde el panel. */
    db.prepare("DELETE FROM stores").run();
    sembrarTiendas();
    ponerMarca(SEMILLA_TIENDAS, new Date().toISOString());
    console.log("[db] Tiendas ficticias sustituidas por las reales (una sola vez).");
  }

  /* ---------------- Marcas del carrusel ---------------- */
  db.exec(`
    CREATE TABLE IF NOT EXISTS brands (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      lane       INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);
  const brandCount = db.prepare("SELECT COUNT(*) as c FROM brands").get();
  if (brandCount.c === 0) {
    const ins = db.prepare("INSERT INTO brands (name, lane, sort_order, created_at) VALUES (?, ?, ?, ?)");
    const now = new Date().toISOString();
    Object.entries(INITIAL_BRANDS).forEach(([lane, names]) => {
      names.forEach((n, i) => ins.run(n, Number(lane), i, now));
    });
  }

  /* ---------------- Postulaciones ---------------- */
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      dni        TEXT,
      city       TEXT,
      store      TEXT,
      schedule   TEXT,
      studying   TEXT,
      message    TEXT,
      created_at TEXT NOT NULL
    );
  `);
  // Mensajes del formulario de contacto del sitio público.
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      message    TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const jobCols = columns("job_applications");
  if (!jobCols.includes("store"))    db.exec("ALTER TABLE job_applications ADD COLUMN store TEXT");
  if (!jobCols.includes("schedule")) db.exec("ALTER TABLE job_applications ADD COLUMN schedule TEXT");
  if (!jobCols.includes("dni"))      db.exec("ALTER TABLE job_applications ADD COLUMN dni TEXT");
  if (!jobCols.includes("studying")) db.exec("ALTER TABLE job_applications ADD COLUMN studying TEXT");

  return db;
}

module.exports = { getDb };
