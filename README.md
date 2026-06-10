# Web Lukers — Sitio Institucional

Sitio web institucional avanzado para **Lukers**, empresa peruana de outlets de moda masculina con más de 60 marcas originales de USA y Europa (John Holden, Donatelli, entre otras). Inspirado en [lukers.pe](https://www.lukers.pe/) y enfocado en presentar la empresa: su historia, valores, marcas, tiendas y canales de contacto.

## ✨ Secciones y funcionalidades

- **Hero institucional** con estadísticas animadas (trayectoria, tiendas, marcas, colaboradores).
- **Quiénes somos**: misión, visión y valores.
- **Historia**: línea de tiempo interactiva con los hitos de la empresa (2001–2026).
- **Compromiso**: garantía de originalidad, orgullo peruano, empleo formal y comercio responsable.
- **Marcas**: marquee animado del portafolio y líneas de producto (formal, casual, calzado, accesorios) — sin precios ni venta.
- **Tiendas**: directorio filtrable por ciudad (Lima, Trujillo, Chiclayo, Tarapoto, Iquitos) con direcciones y horarios.
- **Testimonios** de clientes, colaboradores y socios comerciales.
- **Contacto**: formulario con validación (consultas, alianzas, trabajo, libro de reclamaciones) e información de atención.
- **Modo claro / oscuro** con preferencia guardada y detección del tema del sistema.
- **Animaciones**: reveal on scroll, contadores y micro-interacciones.
- **Diseño responsive** (desktop, tablet, móvil) y accesible (`prefers-reduced-motion`, ARIA).

## 🗂 Estructura

```
├── index.html        # Página principal (one-page institucional)
├── css/styles.css    # Estilos (variables CSS, dark mode, responsive)
└── js/main.js        # Tema, animaciones, tiendas y formulario
```

## 🚀 Cómo verlo

No requiere build ni dependencias. Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

> Sitio demostrativo: los formularios no envían datos reales y las direcciones/hitos son referenciales.
