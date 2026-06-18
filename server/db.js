"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

let db;

const INITIAL_STORES = [
  { name: "Lukers San Miguel",      city: "Lima",     address: "Av. La Marina 1666, San Miguel",              hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Jr. de la Unión", city: "Lima",     address: "Jr. de la Unión 455, Centro Histórico",       hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Chorrillos",      city: "Lima",     address: "Av. El Sol 1175, Chorrillos",                  hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Breña",           city: "Lima",     address: "Av. Brasil 1099, Breña",                       hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Lince",           city: "Lima",     address: "Av. Arequipa 1890, Lince",                     hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Pueblo Libre",    city: "Lima",     address: "Av. Sucre 545, Pueblo Libre",                  hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Independencia",   city: "Lima",     address: "Av. Carlos Izaguirre 210, Independencia",      hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Surco Outlet",    city: "Lima",     address: "Av. Tomás Marsano 3025, Surco",                hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Trujillo",        city: "Trujillo", address: "Jr. Pizarro 540, Centro de Trujillo",          hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Chiclayo",        city: "Chiclayo", address: "Av. Balta 1050, Chiclayo",                     hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Tarapoto",        city: "Tarapoto", address: "Jr. San Martín 320, Tarapoto",                 hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
  { name: "Lukers Iquitos",         city: "Iquitos",  address: "Jr. Próspero 615, Iquitos",                    hours: "Lun a Dom · 10:00 a.m. – 10:00 p.m." },
];

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

  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      city       TEXT NOT NULL,
      address    TEXT NOT NULL,
      hours      TEXT NOT NULL DEFAULT 'Lun a Dom · 10:00 a.m. – 10:00 p.m.',
      active     INTEGER NOT NULL DEFAULT 1,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  // Sembrar tiendas iniciales si la tabla está vacía
  const count = db.prepare("SELECT COUNT(*) as c FROM stores").get();
  if (count.c === 0) {
    const ins = db.prepare(
      "INSERT INTO stores (name, city, address, hours, active, sort_order, created_at) VALUES (?, ?, ?, ?, 1, ?, ?)"
    );
    const now = new Date().toISOString();
    INITIAL_STORES.forEach((s, i) => ins.run(s.name, s.city, s.address, s.hours, i, now));
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      phone      TEXT,
      city       TEXT,
      store      TEXT,
      schedule   TEXT,
      message    TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Migración suave: agrega columnas store/schedule si la tabla ya existía
  const jobCols = db.prepare("PRAGMA table_info(job_applications)").all().map((c) => c.name);
  if (!jobCols.includes("store"))    db.exec("ALTER TABLE job_applications ADD COLUMN store TEXT");
  if (!jobCols.includes("schedule")) db.exec("ALTER TABLE job_applications ADD COLUMN schedule TEXT");

  return db;
}

module.exports = { getDb };
