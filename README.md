# Web Lukers — Outlet de Marcas Originales

Sitio web avanzado para **Lukers**, outlet peruano de moda masculina con más de 60 marcas originales de USA y Europa (John Holden, Donatelli, entre otras), inspirado en [lukers.pe](https://www.lukers.pe/) y mejorado con una experiencia moderna e interactiva.

## ✨ Funcionalidades

- **Catálogo interactivo** con filtros por categoría (formal, casual, calzado, accesorios), ordenamiento por precio/descuento y búsqueda en vivo.
- **Carrito de compras** funcional (drawer lateral) con cantidades, totales y persistencia en `localStorage`.
- **Modo claro / oscuro** con preferencia guardada y detección del tema del sistema.
- **Buscador de tiendas** por ciudad: Lima, Trujillo, Chiclayo, Tarapoto e Iquitos.
- **Cuenta regresiva** de promoción en la barra de anuncios.
- **Animaciones**: reveal on scroll, contadores animados, marquee de marcas y micro-interacciones.
- **Diseño responsive** (desktop, tablet y móvil) con menú hamburguesa.
- **Accesibilidad**: navegación semántica, etiquetas ARIA y soporte para `prefers-reduced-motion`.

## 🗂 Estructura

```
├── index.html        # Página principal (one-page)
├── css/styles.css    # Estilos (variables CSS, dark mode, responsive)
└── js/main.js        # Catálogo, carrito, tiendas, tema y animaciones
```

## 🚀 Cómo verlo

No requiere build ni dependencias. Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

> Sitio demostrativo: el checkout y el catálogo usan datos de ejemplo.
