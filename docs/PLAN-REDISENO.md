# Plan de rediseño total — Web Lukers

**Fecha:** 18 de septiembre de 2026

---

## Punto de partida real

Conviene decirlo sin rodeos, porque condiciona todo el plan:

- **`www.lukers.pe` es la web real de Lukers.** Nunca la he visto: el entorno de
  desarrollo solo permite salir a una lista de dominios y ese no está en ella.
- **Lo que hay en este repositorio nunca ha estado publicado.** Es una maqueta
  construida por sesiones de IA anteriores.
- **Su contenido es ficticio.** Doce tiendas con direcciones inventadas, una
  lista de marcas inventada, tres testimonios firmados por personas que no
  consta que existan, una historia que empieza en 2001 cuando la sociedad se
  registró en 2019, y cifras («más de 60 marcas», «300 compañeros», «hasta 70%
  de descuento») que nadie ha verificado.

Lo que **sí sirve** de lo construido, y no hay que tirar:

| Pieza | Estado |
|---|---|
| Sistema de diseño (`css/base.css`, `css/site.css`) | Aprovechable entero |
| Servidor, base de datos, panel de administración | Funcional y con la seguridad ya corregida |
| Formularios: newsletter, postulación, contacto | Funcionan y guardan de verdad |
| Cumplimiento: consentimiento, política de privacidad | Estructura correcta, faltan datos |
| SEO técnico: canonical, sitemap, 404, compresión | Hecho |

**Conclusión: el problema no es la maquinaria, es el contenido.** El rediseño
no consiste en volver a programar, sino en vaciar la ficción y llenarlo con lo
real.

---

## Fase 0 — Inventario de la web actual · **BLOQUEA TODO LO DEMÁS**

No se puede rediseñar lo que no se ha visto. Antes de decidir nada hace falta
saber qué hay hoy en `www.lukers.pe`.

**Qué necesito, y basta con copiar y pegar:**

1. **El texto de cada página** del sitio actual (portada, institucional,
   tiendas, contacto, libro de reclamaciones, lo que haya).
2. **El mapa del sitio**: qué páginas existen y cómo se llega a cada una.
3. **La lista real de tiendas**: nombre, dirección exacta, ciudad, horario,
   teléfono si lo hay. Y cuántas son: una publicación habla de 7 y la maqueta
   tiene 12.
4. **Los datos de contacto reales**: teléfono, WhatsApp, correo.
5. **Razón social, RUC y domicilio fiscal**, verificados en SUNAT.
6. **Qué se queda y qué se va** de la web actual.

**Alternativa si copiar y pegar es incómodo:** exportar cada página a PDF desde
el navegador (Imprimir → Guardar como PDF) y adjuntarlos. Puedo leer PDFs.

**Segundo bloque, igual de importante:** las fotografías. Tiendas y equipo
tienen que ser reales; la IA solo vale para ambiente y piezas editoriales.

---

## Fase 1 — Decidir qué debe hacer la web

Con el inventario delante, y no antes, se decide:

- **Qué objetivo tiene cada página** y qué acción esperamos del visitante.
- **Qué contenido de la web actual se conserva**, cuál se reescribe y cuál
  sobra.
- **La arquitectura**: hoy la maqueta es una sola página con anclas. Para SEO
  local hacen falta páginas reales, una por tienda o al menos una por ciudad.
- **Qué pasa con el catálogo** de `lukers.kyte.site`: se integra, se enlaza o
  se ignora.

Entregable: `docs/agent-workflow/deliverables/SITE_BLUEPRINT.md` (agente `aria`).

---

## Fase 2 — Contenido antes que diseño

Es el orden que evita rehacer el trabajo dos veces: primero se sabe qué se dice,
después cómo se ve.

- Textos completos de cada página, **sin inventar nada**, marcando con
  `[VALIDAR]` todo lo que no esté confirmado.
- Decidir cómo se cuenta la historia: 2001 como Remate de Fábrica, 2019 como
  Lukers, o ambas cosas bien hiladas.
- Preguntas frecuentes reales: ¿es original?, ¿venden online?, ¿hacen cambios?,
  ¿qué tallas?, ¿aceptan Yape?
- Sustituir los testimonios inventados por prueba social verificable. Los
  **143 000 seguidores de Instagram** y las reseñas reales de Google valen
  infinitamente más que tres citas sin dueño.

Entregable: `WEBSITE_COPY.md` (agente `copy`). Ya existe un primer borrador.

---

## Fase 3 — Diseño sobre contenido real

El sistema visual ya está construido y respeta el manual de marca. Aquí se
aplica al contenido real y se ajusta lo que haga falta:

- Portada rehecha sobre el mensaje que se haya decidido, no sobre el inventado.
- Plantilla de página de tienda, con foto, mapa, horario y cómo llegar.
- Tratamiento fotográfico: proporciones, recortes y qué foto va en cada hueco.
- Revisión de movimiento y accesibilidad.

---

## Fase 4 — Datos reales dentro del sistema

- Vaciar las tiendas y marcas ficticias y cargar las reales desde el panel.
- Activar los datos estructurados de tienda **solo entonces**, con la variable
  `TIENDAS_VERIFICADAS=1`. Hoy están desactivados a propósito.
- Completar la política de privacidad con RUC y razón social verificados.
- Enlazar el Libro de Reclamaciones real en lugar del texto genérico actual.
- Poner el número de WhatsApp en `js/config.js`.

---

## Fase 5 — Medición antes de publicar

Hoy el sitio no mide nada. Publicar sin medición es quedarse ciego justo cuando
más falta hace ver.

- Instalar **Plausible** o **Umami** (sin cookies, así no hace falta banner y la
  política de privacidad sigue siendo cierta).
- Eventos mínimos: pulsaciones en «Cómo llegar» por tienda, suscripciones,
  postulaciones enviadas, clics a WhatsApp.
- Dar de alta **Google Search Console**.

---

## Fase 6 — Lo que de verdad trae clientes: SEO local

Recordatorio de lo que ya hablamos: con tiendas físicas y sin venta online, el
grueso del resultado **no está en la web**.

1. Ficha de **Google Business Profile** de cada tienda, reclamada y verificada.
2. Campaña sostenida de **reseñas** en caja.
3. Página propia por tienda en la web, enlazada desde su ficha.
4. Datos idénticos (nombre, dirección, teléfono) en web, Google, Instagram,
   Facebook y TikTok.

---

## Orden y dependencias

```
Fase 0  Inventario  ← BLOQUEA TODO. Depende de Lukers, no de mí.
   │
Fase 1  Arquitectura y objetivos
   │
Fase 2  Contenido ────────────┐
   │                          │
Fase 3  Diseño                │  (en paralelo: fichas de Google,
   │                          │   fase 6, que no dependen de la web)
Fase 4  Datos reales          │
   │                          │
Fase 5  Medición ─────────────┘
   │
        Publicar
```

**Nada de lo que hay en este repositorio debe publicarse hasta completar la
fase 4.** Mientras tanto contiene datos inventados sobre una empresa real.
