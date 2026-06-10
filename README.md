# Web Lukers — Sitio Institucional

Sitio web institucional avanzado para **Lukers**, tienda de ropa de marca a buen precio. Concepto: **"Mejores marcas, mejores precios"**. Presenta la empresa: su historia, valores, marcas, tiendas y canales de contacto.

## 🎨 Identidad de marca (Manual 2024)

El sitio aplica el manual de marca oficial, disponible como skill del proyecto en `.claude/skills/marca-lukers/`:

- **Azul Lukers `#008CFF`** como color dominante; **crema `#EFEFE8`** como fondo claro (nunca blanco puro).
- Tipografía **Archivo / Archivo Black** (sustituto web de MD Nichrome).
- El **brillo ✦** como hilo conductor gráfico (assets oficiales en `assets/`).
- Pasteles (verde, turquesa, lila, rosa) solo como acentos puntuales.
- Logos oficiales: positivo (azul sobre claro) y negativo (crema sobre azul); símbolo "LL" como favicon.
- El toggle de tema alterna entre **modo positivo** (azul sobre crema) y **modo negativo** (crema sobre azul), las dos únicas versiones de color que admite el manual.
- Sin rojo/amarillo: esa paleta está reservada exclusivamente a material de remate.

## ✨ Secciones y funcionalidades

- **Hero institucional** con estadísticas animadas (trayectoria, tiendas, marcas, colaboradores).
- **Quiénes somos**: misión, visión y valores.
- **Historia**: línea de tiempo interactiva con los hitos de la empresa (2001–2026).
- **Compromiso**: garantía de originalidad, orgullo peruano, empleo formal y comercio responsable.
- **Marcas**: marquee animado del portafolio y líneas de producto (formal, casual, calzado, accesorios) — sin precios ni venta.
- **Tiendas**: directorio filtrable por ciudad (Lima, Trujillo, Chiclayo, Tarapoto, Iquitos) con direcciones y horarios.
- **Testimonios** de clientes, colaboradores y socios comerciales.
- **Contacto**: formulario con validación (consultas, alianzas, trabajo, libro de reclamaciones) e información de atención.
- **Modo positivo / negativo** con preferencia guardada y detección del tema del sistema.
- **Animaciones**: reveal on scroll, contadores, brillos flotantes y micro-interacciones.
- **Diseño responsive** (desktop, tablet, móvil) y accesible (`prefers-reduced-motion`, ARIA).

## 🗂 Estructura

```
├── index.html                      # Página principal (one-page institucional)
├── css/styles.css                  # Estilos según manual de marca
├── js/main.js                      # Tema, animaciones, tiendas y formulario
├── assets/                         # Logos oficiales y brillos (PNG del brandbook)
└── .claude/skills/marca-lukers/    # Skill del manual de marca (se carga en cualquier sesión de Claude Code)
```

## 🚀 Cómo verlo

No requiere build ni dependencias. Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

> Sitio demostrativo: los formularios no envían datos reales y las direcciones/hitos son referenciales.
