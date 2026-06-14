# Web Lukers — Sitio institucional + Backend

Sitio institucional de **Lukers** ("Mejores marcas, mejores precios") con un backend propio:

- 📬 **Newsletter con base de datos** — formulario de suscripción que guarda los correos en una base de datos SQLite.
- 🎨 **Panel de administración** (`/admin`) — permite cambiar las imágenes del diseño (portada y categorías) y ver/exportar los suscriptores, protegido con contraseña.

El sitio público sigue aplicando el **manual de marca Lukers 2024** (azul `#008CFF`, crema `#EFEFE8`, tipografía Archivo, el brillo ✦, logos oficiales).

## 🚀 Cómo ejecutarlo en local

Requiere **Node.js 22.5 o superior** (usa el módulo `node:sqlite` integrado, sin bases de datos externas).

```bash
npm install
npm start
```

Luego abre:
- Sitio: **http://localhost:3000**
- Panel de administración: **http://localhost:3000/admin**

La contraseña por defecto del panel es `lukers-admin`. Cámbiala creando un archivo `.env` (ver `.env.example`):

```bash
PORT=3000
ADMIN_PASSWORD=tu-clave-segura
SESSION_SECRET=un-texto-largo-y-aleatorio
```

## ☁️ Desplegar en Railway

1. En [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** y elige este repositorio.
2. Railway detecta Node y ejecuta `npm start` automáticamente (ya configurado en `railway.json`). El puerto lo asigna Railway vía la variable `PORT`.
3. En **Variables**, define:
   - `ADMIN_PASSWORD` → tu contraseña del panel.
   - `SESSION_SECRET` → cualquier texto largo y aleatorio.
4. **IMPORTANTE — Persistencia.** El disco de Railway se borra en cada despliegue. Para que NO se pierdan los suscriptores ni las imágenes subidas:
   - Crea un **Volume** y móntalo en, por ejemplo, `/data`.
   - Añade estas variables para que la base de datos y las imágenes vivan en el volumen:
     - `DATA_DIR=/data`
     - `UPLOADS_DIR=/data/uploads`

Con eso, cada `git push` actualiza el sitio y los datos se conservan entre despliegues.

> Nota: GitHub Pages **no** sirve para esta versión, porque solo aloja archivos estáticos y no puede ejecutar el backend (base de datos / panel). Para el newsletter y el panel necesitas un host que corra Node, como Railway.

## 🗂 Estructura

```
├── index.html            # Sitio público
├── admin.html            # Panel de administración
├── css/
│   ├── styles.css        # Estilos del sitio (manual de marca)
│   └── admin.css         # Estilos del panel
├── js/
│   ├── main.js           # Sitio: newsletter, imágenes dinámicas, animaciones
│   └── admin.js          # Panel: login, imágenes, suscriptores
├── server/
│   ├── server.js         # Servidor Express + API
│   └── db.js             # Base de datos SQLite (node:sqlite)
├── assets/               # Logos y brillos oficiales del brandbook
├── uploads/              # Imágenes subidas desde el panel (no se versiona)
├── data/                 # Base de datos en tiempo de ejecución (no se versiona)
├── package.json
└── railway.json          # Configuración de despliegue en Railway
```

## 🔌 API

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/subscribe` | Suscribe un correo al newsletter |
| `GET` | `/api/images` | Imágenes del diseño actuales (público) |
| `POST` | `/api/admin/login` | Inicia sesión en el panel |
| `POST` | `/api/admin/images/:slot` | Sube/reemplaza una imagen del diseño |
| `DELETE` | `/api/admin/images/:slot` | Quita una imagen (vuelve al diseño por defecto) |
| `GET` | `/api/admin/subscribers` | Lista de suscriptores |
| `GET` | `/api/admin/subscribers.csv` | Exporta los suscriptores a CSV |
| `DELETE` | `/api/admin/subscribers/:id` | Elimina un suscriptor |

Las rutas `/api/admin/*` (salvo el login) requieren el token de sesión.

> El sitio degrada con elegancia: si se abre sin el backend activo, las imágenes muestran el diseño por defecto y el formulario avisa que necesita el servidor.
