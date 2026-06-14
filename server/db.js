"use strict";

/**
 * Base de datos SQLite usando el módulo nativo de Node (node:sqlite).
 * No requiere dependencias externas ni compilación nativa.
 * El archivo de datos se crea automáticamente en data/lukers.db
 */

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

// Configurable para apuntar a un volumen persistente (p. ej. en Railway).
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

let db;

function getDb() {
  if (db) return db;

  db = new DatabaseSync(path.join(DATA_DIR, "lukers.db"));

  // Suscriptores del newsletter
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT UNIQUE NOT NULL,
      name       TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Imágenes del diseño gestionadas desde el panel de administración
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      slot       TEXT PRIMARY KEY,
      filename   TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  return db;
}

module.exports = { getDb };
