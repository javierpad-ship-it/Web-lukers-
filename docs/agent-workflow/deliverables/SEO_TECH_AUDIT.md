# SEO_TECH_AUDIT — Auditoría técnica SEO de lukers.pe

**Agente:** `search` (fase de auditoría)
**Fecha:** 2026-09-18
**Alcance:** rastreabilidad, indexación, metadatos, encabezados, Open Graph,
datos estructurados, imágenes, rendimiento móvil, enlazado, 404 y accesibilidad
con impacto SEO.
**Entorno de prueba:** `http://localhost:3999` (servidor real del repositorio,
`server/server.js`), navegador Chromium vía Playwright emulando **Pixel 5**.

---

## 0. Cómo leer este informe

Cada hallazgo indica:

- **Severidad** — `CRÍTICO` (bloquea el objetivo de negocio) · `ALTO` ·
  `MEDIO` · `BAJO`.
- **Verificado** — lo he comprobado ejecutando el sitio o leyendo el archivo.
- **Hipótesis** — razonamiento fundado que **no** he podido medir aquí.

**No hay ninguna puntuación de PageSpeed / Lighthouse en este documento.** No he
ejecutado PageSpeed Insights (requiere el dominio público). Las cifras de
rendimiento que aparecen son mediciones propias en localhost y están marcadas
como tales, con sus limitaciones explicadas en la sección 6.

**Aviso de entorno:** las tipografías de Google no cargan en este sandbox por un
bloqueo de certificado (`ERR_CERT_AUTHORITY_INVALID`). **Eso es del entorno, no
del sitio**, y no se reporta como hallazgo.

**Nota de negocio que atraviesa todo el informe:** Lukers no vende online. Los
12 puntos de venta son el producto. Por tanto el único SEO que mueve la aguja es
el **SEO local**: que alguien que busca «ropa de marca» + su ciudad o distrito
encuentre la tienda Lukers que le queda cerca. Los hallazgos están ordenados con
ese criterio, no con el de un e-commerce.

---

## 1. Resumen ejecutivo

El sitio está **técnicamente limpio en lo básico**: hay canonical en las tres
páginas públicas, `robots.txt` y `sitemap.xml` generados por el servidor, las
páginas internas llevan `X-Robots-Tag: noindex`, los títulos y descripciones son
únicos y bien escritos, hay un solo `h1` por página, el HTML es semántico y la
animación de entrada tiene red de seguridad para no ocultar contenido. El equipo
`dev` hizo un trabajo cuidadoso.

El problema no está en lo que está mal hecho, sino en **lo que no existe**:

> **Lukers tiene 12 tiendas físicas y, para Google, tiene cero.**
> No hay ni un solo marcado `LocalBusiness`/`ClothingStore`, ni una sola URL por
> tienda o por ciudad, y las 12 direcciones **no aparecen en el HTML que el
> servidor entrega** — se inyectan con JavaScript después de cargar la página.

Ese es el mayor hueco de SEO del sitio y explica por qué las tres correcciones
de la cabecera de la tabla pesan más que todas las demás juntas.

### Tabla de prioridades

| # | Severidad | Hallazgo | Archivo |
|---|---|---|---|
| C1 | CRÍTICO | Sin `LocalBusiness`/`ClothingStore` para ninguna de las 12 tiendas | `index.html:37-51` |
| C2 | CRÍTICO | Las 12 direcciones solo existen en el DOM renderizado por JS | `index.html:203`, `js/site.js:78-118` |
| C3 | CRÍTICO | `og:image` apunta a un archivo que no existe (404) | `index.html:18`, `trabaja.html:17` |
| A1 | ALTO | Sin páginas por tienda ni por ciudad: 12 tiendas en 1 sola URL | arquitectura |
| A2 | ALTO | `/trabaja/` devuelve 200 con **todos** los recursos rotos | `server/server.js:321-323` |
| A3 | ALTO | `robots.txt` bloquea `/uploads/`, donde vivirán **todas** las fotos reales | `server/server.js:360` |
| A4 | ALTO | Página 404 por defecto de Express: `lang="en"`, sin marca, sin salida | `server/server.js` (no hay handler) |
| A5 | ALTO | Sin compresión gzip/brotli: 76 KB de texto que serían 22 KB | `server/server.js:290-311` |
| M1 | MEDIO | La futura imagen LCP se inyecta por JS con `loading="lazy"` | `js/site.js:40-57` |
| M2 | MEDIO | Todas las imágenes gestionadas reciben `alt=""` vacío | `js/site.js:45` |
| M3 | MEDIO | `Cache-Control: public, max-age=0` en todos los estáticos | `server/server.js:309-311` |
| M4 | MEDIO | `/trabaja.html`, `/Trabaja`, `/privacidad.html` sirven 200 sin 301 | `server/server.js:321-329` |
| M5 | MEDIO | `robots.txt` bloquea el rastreo de `/admin`, así Google nunca lee su `noindex` | `server/server.js:354-366` |
| M6 | MEDIO | Logos PNG de 57 KB para 72×34 px, con `width`/`height` que no cuadran | `index.html:70-71` |
| M7 | MEDIO | `Organization` incompleta; faltan `WebSite`, `BreadcrumbList`, `JobPosting` | `index.html:37-51` |
| M8 | MEDIO | `sitemap.xml` con `lastmod` falso (siempre la fecha de hoy) | `server/server.js:332-351` |
| M9 | MEDIO | `privacidad.html` sin ninguna etiqueta Open Graph | `privacidad.html:1-14` |
| M10 | MEDIO | Los huecos del HTML piden un recorte distinto al que pide el panel | `index.html:130,154-174` |
| B1 | BAJO | Salto de jerarquía `h2 → h4` en los pies de página | `index.html:436,446,456` |
| B2 | BAJO | `lang="es"` en vez de `lang="es-PE"` | todas las páginas |
| B3 | BAJO | Sin `og:image:alt`, sin `twitter:image`, sin `twitter:site` | `index.html:12-22` |
| B4 | BAJO | `assets/brillo_*.png` (5 archivos, 167 KB) no se usan en ningún sitio | `assets/` |
| B5 | BAJO | Sin teléfono en el sitio: el NAP local queda incompleto | `index.html:372-377` |
| B6 | BAJO | Favicon de 77 KB; no hay `/favicon.ico` ni manifest | `index.html:24` |
| B7 | BAJO | Testimonios con nombres no verificables: no marcarlos con `Review` | `index.html:283-302` |

---

## 2. CRÍTICO

### C1 · No existe marcado `LocalBusiness`/`ClothingStore` para ninguna tienda

**Severidad: CRÍTICO. Verificado.**

**Evidencia.** El único bloque de datos estructurados de todo el sitio está en
`index.html:37-51` y es un `Organization`:

```json
{ "@type": "Organization", "name": "Lukers", "url": "https://lukers.pe/",
  "logo": "…", "slogan": "…", "foundingDate": "2001", "areaServed": "PE",
  "sameAs": ["facebook…", "instagram…"] }
```

`grep -n "application/ld" *.html` devuelve **una sola coincidencia** en todo el
repositorio (`index.html:37`). No hay nada en `trabaja.html` ni en
`privacidad.html`.

Mientras tanto, `GET /api/stores` devuelve las 12 tiendas con nombre, ciudad,
dirección y horario ya estructurados en la base de datos:

```
Lukers San Miguel      · Lima     · Av. La Marina 1666, San Miguel
Lukers Jr. de la Unión · Lima     · Jr. de la Unión 455, Centro Histórico
Lukers Chorrillos      · Lima     · Av. El Sol 1175, Chorrillos
Lukers Breña           · Lima     · Av. Brasil 1099, Breña
Lukers Lince           · Lima     · Av. Arequipa 1890, Lince
Lukers Pueblo Libre    · Lima     · Av. Sucre 545, Pueblo Libre
Lukers Independencia   · Lima     · Av. Carlos Izaguirre 210, Independencia
Lukers Surco Outlet    · Lima     · Av. Tomás Marsano 3025, Surco
Lukers Trujillo        · Trujillo · Jr. Pizarro 540, Centro de Trujillo
Lukers Chiclayo        · Chiclayo · Av. Balta 1050, Chiclayo
Lukers Tarapoto        · Tarapoto · Jr. San Martín 320, Tarapoto
Lukers Iquitos         · Iquitos  · Jr. Próspero 615, Iquitos
```

**Por qué esto es el mayor hueco de SEO del sitio.**

Cuando alguien en Perú busca «ropa de marca San Miguel», «tiendas de ropa
Chiclayo» o «outlet de marcas Trujillo», Google no responde con diez enlaces
azules: responde con el **paquete local** — el mapa con tres fichas de negocio,
que se lleva la mayoría de los clics de esas búsquedas. Para entrar en ese
paquete, Google necesita entender que Lukers no es «una empresa», sino **doce
establecimientos físicos, cada uno con su dirección, su horario y su zona de
influencia**.

Hoy el sitio le dice a Google exactamente una cosa: «existe una organización
llamada Lukers que opera en PE». Nada más. `areaServed: "PE"` es, para efectos
de SEO local, el equivalente a no decir nada: sitúa a la marca en un país de 33
millones de personas en vez de en doce esquinas concretas.

El coste de la omisión es asimétrico. Un e-commerce sin `LocalBusiness` pierde
un extra; **una cadena de tiendas físicas sin `LocalBusiness` pierde el canal
principal**, porque el 100 % de sus ventas ocurren en un local al que alguien
tiene que llegar caminando. El sitio está haciendo el trabajo de marca y no está
haciendo el trabajo de captación.

Además, el `Organization` que sí existe está incompleto para lo que necesita:
no tiene `address`, ni `telephone`, ni `contactPoint`, ni `@id` estable al que
puedan apuntar las fichas de tienda como `parentOrganization`.

**Corrección propuesta (para `dev`).** Emitir, además del `Organization`
enriquecido, un `ItemList` de 12 `ClothingStore` generado **en el servidor** a
partir de la misma tabla que ya alimenta `/api/stores`, para que no haya dos
fuentes de verdad. Esquema por tienda:

```json
{
  "@type": "ClothingStore",
  "@id": "https://lukers.pe/tiendas/san-miguel#store",
  "name": "Lukers San Miguel",
  "parentOrganization": { "@id": "https://lukers.pe/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. La Marina 1666",
    "addressLocality": "San Miguel",
    "addressRegion": "Lima",
    "addressCountry": "PE"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "10:00", "closes": "22:00"
  }],
  "url": "https://lukers.pe/tiendas/san-miguel",
  "image": "…", "telephone": "[VALIDAR]",
  "geo": { "@type": "GeoCoordinates", "latitude": "[VALIDAR]", "longitude": "[VALIDAR]" }
}
```

**`[VALIDAR]`** — hacen falta, y debe confirmarlos Lukers (no el equipo de
agentes): el teléfono de cada tienda o de la central, las coordenadas
geográficas de cada local, y si algún local tiene horario distinto al
«Lun a Dom 10:00–22:00» que hoy comparten los 12 registros. **No inventes
ninguno de esos datos**; un `LocalBusiness` con una dirección o un horario
equivocado es peor que no tenerlo, porque Google penaliza la inconsistencia NAP
(Name–Address–Phone) entre el sitio y la ficha de Google Business Profile.

**Hipótesis (no verificada aquí):** el retorno de esta corrección depende de que
existan y estén reclamadas las 12 fichas de Google Business Profile. El marcado
del sitio refuerza y desambigua esas fichas, no las sustituye. Quien deba
confirmar si las fichas existen es Lukers.

---

### C2 · Las 12 direcciones no están en el HTML: las pone JavaScript

**Severidad: CRÍTICO. Verificado.**

**Evidencia.** El contenedor de tiendas se sirve vacío:

```html
<!-- index.html:203 -->
<div class="grid grid-3" id="storeGrid"></div>
```

Lo mismo con las marcas (`index.html:192`): `<div class="reveal" id="brandLanes"></div>`.

Ambos se rellenan en `js/site.js` (tiendas: líneas 78-118; marcas: más abajo en
el mismo archivo) tras un `fetch` a `/api/stores` y `/api/brands`.

Contraste medido:

- **HTML servido** (`curl http://localhost:3999/`): no contiene «Av. La Marina»,
  ni «Jr. Pizarro», ni ninguna otra dirección. El único texto local del
  documento es el banner de anuncio (`index.html:62`), que menciona
  «Jr. de la Unión» de pasada.
- **DOM renderizado** (Playwright, Pixel 5, tras `load` + 2,5 s): 12
  `<article>` dentro de `#storeGrid`, con los 12 nombres como `h3`, las 12
  direcciones y los 12 enlaces a Google Maps. El renderizado **sí funciona** y
  funciona bien.

**Por qué importa.** Google renderiza JavaScript, así que este contenido *puede*
indexarse — pero el renderizado ocurre en una segunda pasada, en una cola
separada, con presupuesto propio y sin garantías de plazo. Para contenido de
marca eso es un riesgo tolerable. Para **el dato exacto que hace que te
encuentren** —una dirección en San Miguel, un horario en Iquitos— convertirlo en
opcional es una apuesta innecesaria. A esto se suma que:

1. Otros rastreadores que importan aquí **no ejecutan JavaScript**: el bot de
   WhatsApp que genera la vista previa cuando alguien comparte el enlace por
   chat (canal dominante en Perú), el de Facebook, el de X, y buena parte de los
   agregadores locales. Todos ellos ven una página sin tiendas.
2. El `Organization` de C1 tampoco menciona direcciones, así que **no hay
   ninguna ruta** —ni HTML ni JSON-LD— por la que un rastreador sin JS conozca
   las 12 ubicaciones.
3. Si `/api/stores` falla, el bloque muestra un aviso de cortesía
   (`js/site.js:85-90`) — bien resuelto para el usuario, pero significa que la
   indexabilidad del contenido local depende de la disponibilidad de un endpoint
   en el momento exacto del rastreo.

**Corrección propuesta (para `dev`).** Renderizar las 12 tarjetas **en el
servidor** dentro de `index.html` (o de las páginas por tienda de A1), leyendo
la misma tabla, y dejar el `fetch` como hidratación/actualización opcional. El
resultado visual no cambia; lo que cambia es que el dato existe sin depender de
JS. Es la misma corrección que habilita C1, así que conviene hacerlas juntas.

---

### C3 · `og:image` apunta a una imagen que no existe

**Severidad: CRÍTICO (para compartir en redes). Verificado.**

**Evidencia.**

```html
<!-- index.html:18 y trabaja.html:17 -->
<meta property="og:image" content="https://lukers.pe/assets/og-lukers.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

```
$ curl -o /dev/null -w "%{http_code}" http://localhost:3999/assets/og-lukers.png
404
```

```
$ ls assets/
brillo_azul.png  brillo_lila.png  brillo_rosa.png  brillo_turquesa.png
brillo_verde.png  logo_azul_transparente.png  logo_crema_transparente.png
simbolo_LL_fondo_azul.png
```

**No existe `og-lukers.png`.** El archivo nunca se creó.

**Consecuencia.** Cada vez que alguien comparta lukers.pe por WhatsApp,
Instagram, Facebook o Messenger, la vista previa saldrá **sin imagen**: solo
título y descripción sobre fondo gris, o directamente un enlace pelado. En el
mercado peruano, donde WhatsApp es el canal por el que una promoción de tienda
circula de verdad, una tarjeta sin imagen reduce drásticamente el clic. Y el
daño es silencioso: nadie reporta «la vista previa salió fea», simplemente no
comparten.

Además, las dimensiones `1200×630` están declaradas y son mentira, porque no hay
archivo que medir. Algunos rastreadores dejan de reintentar tras un 404 y
cachean la ausencia durante días.

**Corrección propuesta (para `dev` + `aria`).** Crear
`assets/og-lukers.png` a 1200×630 px con el sistema visual de marca (azul
`#008CFF`, crema `#EFEFE8`, logo oficial, el brillo ✦). **No reconstruyas ni
recolorees el logo**: usa `assets/logo_crema_transparente.png` tal cual sobre
fondo azul de marca. Mientras no haya fotografía real disponible, una pieza
tipográfica de marca es perfectamente válida y cumple mejor que un placeholder.
Añadir también `og:image:alt` y `twitter:image` (ver B3), y una pieza propia
para `/trabaja`, que hoy reutiliza la misma.

---

## 3. ALTO

### A1 · 12 tiendas compitiendo por una sola URL

**Severidad: ALTO. Verificado (arquitectura) + hipótesis (impacto).**

**Evidencia.** El `sitemap.xml` generado en `server/server.js:332-351` declara
exactamente tres URLs:

```xml
<loc>https://lukers.pe/</loc>
<loc>https://lukers.pe/trabaja</loc>
<loc>https://lukers.pe/privacidad</loc>
```

Las 12 tiendas viven todas dentro del ancla `/#tiendas` de la portada. Un ancla
`#` **no es una URL indexable**: Google no posiciona `/#tiendas` como resultado
independiente.

**Por qué importa.** Una página solo puede posicionar bien para un puñado de
intenciones. La portada ya carga con «Lukers», «ropa de marca Perú» y la promesa
de marca. Pedirle además que compita por «ropa de marca San Miguel», «tiendas de
ropa Breña», «outlet Trujillo», «ropa de marca Iquitos» y ocho intenciones
locales más es pedirle algo que estructuralmente no puede hacer: no hay
suficiente texto, ni suficientes señales locales, ni suficientes enlaces
entrantes para 12 mercados distintos en un solo documento.

**Corrección propuesta (para `dev` + `aria` + `copy`).** Crear un directorio de
tiendas indexable:

- `/tiendas` — índice con las 12, agrupadas por ciudad.
- `/tiendas/<slug>` — una por tienda (`/tiendas/san-miguel`,
  `/tiendas/trujillo`, …), generada desde la misma tabla.

Cada página de tienda debería llevar: `h1` con nombre y distrito/ciudad, el NAP
completo, el horario, cómo llegar, qué categorías hay en ese local, el
`ClothingStore` de C1, `BreadcrumbList`, canonical propia, y entrada en el
sitemap. El enlazado interno desde `/#tiendas` hacia cada ficha reparte la
autoridad de la portada hacia las 12.

**Hipótesis explícita:** no aporto volúmenes de búsqueda para ninguna de esas
consultas — no he ejecutado ninguna herramienta de keywords y **no voy a
inventar cifras**. La recomendación se sostiene en la estructura del problema
(12 mercados locales, una URL), no en un volumen estimado. Si Lukers quiere
priorizar qué ciudades atacar primero, hace falta datos reales de Search Console
o de una herramienta de keywords; quien debería aportarlos es Lukers junto con
`launch`.

---

### A2 · `/trabaja/` devuelve 200 con la página completamente rota

**Severidad: ALTO. Verificado.**

**Evidencia.** Express, con el enrutado no estricto por defecto, hace que la
barra final también resuelva:

```
$ curl -o /dev/null -w "%{http_code}" http://localhost:3999/trabaja/
200
$ curl -o /dev/null -w "%{http_code}" http://localhost:3999/trabaja/css/base.css
404
$ curl -o /dev/null -w "%{http_code}" http://localhost:3999/trabaja/assets/logo_azul_transparente.png
404
```

La causa es que `trabaja.html` referencia todo con rutas **relativas**
(`trabaja.html:21,25,26,39,40,193,253-256`):

```html
<link rel="stylesheet" href="css/base.css" />
<script src="js/trabaja.js"></script>
```

Servidas desde `/trabaja/`, esas rutas resuelven a `/trabaja/css/base.css`, que
no existe. Resultado: una página que devuelve **200 OK** —es decir, que Google
puede rastrear e indexar— sin ningún estilo, sin logo, sin JavaScript y con el
formulario de postulación inoperativo.

Es el peor de los casos posibles: no es un 404 que Google descarte, es una
página «válida» y rota. Si alguien la enlaza así, o si un rastreador la
descubre, es candidata a indexarse y a mostrarse a un usuario real.

**Corrección propuesta (para `dev`).** Dos cambios complementarios:

1. Redirección 301 de `/trabaja/` a `/trabaja` (y equivalentes) — o activar
   `strict routing` y añadir el redirect explícito.
2. Convertir las rutas relativas en **absolutas** (`/css/base.css`,
   `/js/trabaja.js`, `/assets/…`) en las cuatro páginas HTML. Esto blinda el
   sitio ante cualquier variante de URL futura, incluidas las páginas de tienda
   de A1, que vivirán bajo `/tiendas/…` y sufrirían exactamente el mismo
   problema.

---

### A3 · `robots.txt` bloquea la carpeta donde vivirán todas las fotos reales

**Severidad: ALTO. Verificado.**

**Evidencia.** `server/server.js:354-366` genera:

```
User-agent: *
Disallow: /admin
Disallow: /postulaciones
Disallow: /uploads/
Allow: /

Sitemap: https://lukers.pe/sitemap.xml
```

Y `/uploads/` es exactamente donde el panel deposita **toda** la fotografía del
sitio (`server/server.js:437,475,524,574`):

```js
for (const r of rows) images[r.slot] = `/uploads/${r.filename}`;   // :437
photo: s.photo ? `/uploads/${s.photo}` : null,                     // :524
```

Los ocho huecos que el panel gestiona (`GET /api/images`) son la imagen
principal de portada, los tres «looks» de oferta y las cuatro categorías —más la
foto de cada tienda. Es decir: **cuando lleguen las fotografías reales, el 100 %
de ellas nacerá bloqueado para Google.**

**Consecuencia.** Nada de esa imaginería podrá aparecer en Google Imágenes ni
usarse como miniatura en resultados enriquecidos. Para una tienda de ropa —una
categoría donde la búsqueda por imagen y el descubrimiento visual pesan— es una
pérdida evitable. Y es especialmente irónico porque hoy el hallazgo no duele:
no hay fotos. Dolerá el día que se suban, y para entonces nadie recordará que
`robots.txt` las estaba bloqueando desde el principio.

**Por qué está así (y por qué el motivo es bueno pero la solución no).** La
intención evidente es no exponer subidas del panel. Pero el bloqueo por
`robots.txt` no aporta seguridad —`robots.txt` es público y solo lo respetan los
bots educados— y sí cuesta visibilidad.

**Corrección propuesta (para `dev`).** Permitir el rastreo de las imágenes
públicas y mantener fuera solo lo que de verdad no debe verse. Por ejemplo,
separar rutas: `/uploads/publico/…` (rastreable, imágenes del sitio) y
`/uploads/privado/…` (bloqueado, CVs de postulantes y cualquier adjunto de
RR.HH.). **Los CVs de `/postulaciones` no deben ser rastreables ni accesibles
sin autenticación bajo ningún concepto** — ahí el bloqueo es correcto y hay que
reforzarlo con control de acceso real, no con `robots.txt`.

---

### A4 · La página 404 es la de Express: en inglés, sin marca y sin salida

**Severidad: ALTO. Verificado.**

**Evidencia.**

```
$ curl -i http://localhost:3999/no-existe-esta-url
HTTP/1.1 404 Not Found
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Error</title></head>
<body><pre>Cannot GET /no-existe-esta-url</pre></body>
```

No hay handler de 404 en `server/server.js`; el manejador de errores de las
líneas 698-720 solo cubre errores de multer y 500.

**Lo que está bien:** el código de estado **es 404**, que es lo importante para
que Google no indexe la URL. No es un «soft 404». Eso está correcto.

**Lo que está mal:**

1. `lang="en"` en un sitio íntegramente en español. Contradice la señal de
   idioma que el resto del sitio da correctamente.
2. `<title>Error</title>` y el texto `Cannot GET /…` — jerga técnica que a un
   cliente no le dice nada.
3. **Sin un solo enlace de vuelta.** Quien llegue ahí desde un enlace roto, un
   QR mal impreso o una URL tecleada a medias se queda en un callejón sin
   salida y se va. Es tráfico ya ganado que se pierde en la puerta.
4. Rompe por completo la experiencia de marca recién rediseñada.

**Corrección propuesta (para `dev` + `copy`).** Una página 404 con la identidad
Lukers que devuelva **código 404** (no 200) y que ofrezca salida útil: enlace a
la portada, al buscador de tiendas (`/#tiendas` o `/tiendas` tras A1) y a
«Trabaja con nosotros». En un negocio de tiendas físicas, el enlace más valioso
de un 404 es «encuentra tu tienda más cercana».

---

### A5 · Sin compresión: se envía tres veces y media más texto del necesario

**Severidad: ALTO. Verificado (medición propia en localhost).**

**Evidencia.** No hay middleware de compresión en `server/server.js` y la
respuesta lo confirma: pidiendo explícitamente `Accept-Encoding: gzip, br`, la
cabecera `Content-Encoding` **no aparece**.

```
$ curl -I -H "Accept-Encoding: gzip, br" http://localhost:3999/css/base.css
HTTP/1.1 200 OK
Cache-Control: public, max-age=0
Content-Type: text/css; charset=UTF-8
Content-Length: 18666          ← sin comprimir
```

Peso real de los recursos de texto de la portada, medido archivo a archivo:

| Recurso | Actual | Con gzip -9 | Ahorro |
|---|---:|---:|---:|
| `index.html` | 25 040 B | 6 748 B | 73 % |
| `css/base.css` | 18 666 B | 5 699 B | 69 % |
| `css/site.css` | 17 702 B | 4 302 B | 76 % |
| `js/site.js` | 8 715 B | 3 055 B | 65 % |
| `js/ui.js` | 4 146 B | 1 744 B | 58 % |
| `js/reveal.js` | 1 200 B | 640 B | 47 % |
| `js/config.js` | 747 B | 450 B | 40 % |
| **Total texto** | **76 216 B** | **22 638 B** | **70 %** |

**53,6 KB desperdiciados en cada primera visita**, en un país donde buena parte
del tráfico llega por datos móviles. Es la corrección de rendimiento con mejor
relación esfuerzo/resultado del informe: una línea de middleware.

**Corrección propuesta (para `dev`).** Añadir `compression` (o la compresión del
proxy de Railway) para `text/html`, `text/css`, `application/javascript` y
`application/json`. Activarla también para `/api/stores` y `/api/brands`.

---

## 4. MEDIO

### M1 · La futura imagen LCP se inyecta por JS y nace con `loading="lazy"`

**Severidad: MEDIO hoy, ALTO cuando lleguen las fotos. Verificado (código) +
hipótesis (impacto futuro).**

**Evidencia.** Todas las imágenes gestionadas, incluida la de portada, se crean
así (`js/site.js:40-57`):

```js
const img = new Image();
img.alt = "";
img.loading = "lazy";
img.decoding = "async";
img.addEventListener("load", () => { …; hueco.appendChild(img); });
img.src = url;
```

`img.loading = "lazy"` se aplica **sin excepción**, incluido el hueco
`data-slot="hero_main"` (`index.html:130`), que es el elemento visual dominante
de la mitad superior de la portada.

**Estado hoy (medido, Pixel 5, localhost):**

| Métrica | Valor |
|---|---|
| LCP | **412 ms** |
| First Contentful Paint | 412 ms |
| CLS | **0** |
| DOMContentLoaded | 393 ms |
| Peticiones | 12 (1 HTML, 2 CSS, 4 JS, 2 PNG, 3 fetch) |

Buenos números — pero **no son representativos del sitio publicado**: es
localhost (TTFB de 3 ms), sin latencia de red, sin la fuente de Google y, sobre
todo, **sin ninguna fotografía**. Hoy el LCP es el `h1` de texto, y por eso sale
tan bien.

**Lo que pasará cuando se suba la foto de portada** (hipótesis fundada, no
medida): el elemento LCP dejará de ser texto y pasará a ser esa imagen, que se
descubre al final de una cadena larga — HTML → CSS → JS → `fetch /api/images` →
`img.src` — y que además está marcada como `lazy`, lo que indica al navegador
que **no** tiene prisa. Es la receta exacta de un LCP malo en móvil.

**Corrección propuesta (para `dev`).**

1. Excluir el hueco de portada del `lazy`: `loading="eager"` y
   `fetchpriority="high"` para `hero_main`.
2. Mejor aún, renderizar la imagen de portada **en el HTML servido** (igual que
   C2) con un `<link rel="preload" as="image">`, para que el navegador la
   descubra en el primer byte y no tras cuatro saltos.
3. Mantener `lazy` para categorías, looks y fotos de tienda, que sí están por
   debajo del pliegue.

---

### M2 · Todas las imágenes gestionadas reciben `alt` vacío

**Severidad: MEDIO. Verificado.**

**Evidencia.** `js/site.js:45` asigna `img.alt = "";` a **todas** las imágenes
de los ocho huecos: portada, los tres looks y las cuatro categorías. Un `alt`
vacío declara formalmente que la imagen es **decorativa** y que un lector de
pantalla debe ignorarla.

Pero esas imágenes no son decorativas: son la foto principal de la marca y las
cuatro imágenes que representan Formal, Casual, Calzado y Accesorios. Son
contenido.

**Contraste con lo que sí está bien hecho:** las fotos de tienda del mismo
archivo (`js/site.js:100`) sí llevan texto alternativo y además descriptivo:

```js
`<img src="…" alt="Tienda Lukers ${escapeHtml(s.name)}" loading="lazy" decoding="async" />`
```

Y los logos del HTML estático también (`index.html:70`):
`alt="Lukers — Mejores marcas, mejores precios"`, con el segundo logo del par
claro/oscuro correctamente en `alt=""` (`index.html:71`) porque ahí **sí** es
decorativo y duplicado. Eso está bien resuelto.

Así que no es desconocimiento del equipo: es una línea que se quedó atrás.

**Corrección propuesta (para `dev`).** Que el panel permita capturar un texto
alternativo por imagen y que `js/site.js` lo use; como mínimo, derivar un `alt`
del `label` que ya devuelve `/api/images` («Categoría — Línea Formal», etc.).
Impacto doble: accesibilidad real para quien usa lector de pantalla, y
contexto para Google Imágenes.

---

### M3 · Los estáticos se revalidan en cada visita

**Severidad: MEDIO. Verificado.**

`express.static` se monta sin opciones (`server/server.js:309-311`) y el
resultado es:

```
Cache-Control: public, max-age=0
ETag: W/"48ea-1a0b247b8b4"
```

`max-age=0` obliga al navegador a preguntar por cada CSS, JS e imagen en cada
visita. El `ETag` evita retransmitir el cuerpo (responde 304), pero **no evita
el viaje de ida y vuelta**: son 9 peticiones de red de latencia pura antes de
poder pintar, en cada visita repetida, sobre datos móviles.

**Corrección propuesta (para `dev`).** `max-age` largo con nombres versionados
(`base.abc123.css`) o, sin versionado, `max-age=604800` para `/assets` y
`max-age=3600` con `must-revalidate` para CSS/JS. El HTML debe seguir sin
cachear.

---

### M4 · Cuatro URLs distintas sirven la misma página, todas con 200

**Severidad: MEDIO. Verificado.**

```
/trabaja          200
/trabaja.html     200
/trabaja/         200   ← además rota, ver A2
/Trabaja          200   ← Express no distingue mayúsculas
/privacidad.html  200
/index.html       404   ← correcto, nada lo enlaza
```

Las rutas se declaran como arrays que aceptan ambas formas
(`server/server.js:321-329`).

**Mitigación existente:** hay `canonical` correcto en las tres páginas públicas
(`index.html:9`, `trabaja.html:9`, `privacidad.html:8`), lo que consolida las
señales en la URL buena. Por eso esto es MEDIO y no ALTO: el problema está
contenido.

**Por qué corregirlo igual:** el canonical es una *sugerencia*. Un 301 es una
*instrucción*. Además, cada variante consume presupuesto de rastreo y, en el
caso de `/trabaja/`, sirve una página rota (A2).

**Corrección propuesta (para `dev`).** 301 de `.html`, de la barra final y de
las variantes de mayúsculas hacia la URL canónica en minúsculas y sin extensión.

---

### M5 · `robots.txt` impide que Google llegue a leer el `noindex` de `/admin`

**Severidad: MEDIO. Verificado.**

**Lo que está bien.** El encabezado se emite correctamente en las tres rutas
internas:

```
$ curl -I http://localhost:3999/admin          → X-Robots-Tag: noindex, nofollow, noarchive
$ curl -I http://localhost:3999/postulaciones  → X-Robots-Tag: noindex, nofollow, noarchive
$ curl -I http://localhost:3999/postulaciones.html → X-Robots-Tag: noindex, nofollow, noarchive
```

El middleware `noIndex` de `server/server.js:314-318` está bien aplicado, y
`/admin` y `/postulaciones` están correctamente excluidos, tal como debe ser.

**La sutileza.** `robots.txt` también las bloquea (`Disallow: /admin`,
`Disallow: /postulaciones`), y ahí está la contradicción: **si Google no puede
rastrear la URL, nunca descarga la respuesta y por tanto nunca lee el
`X-Robots-Tag: noindex`.** Es el caso clásico en que una URL bloqueada por
`robots.txt` acaba igualmente en el índice —sin título ni descripción, como
«resultado sin información»— porque alguien la enlazó desde fuera.

También conviene notar que `Disallow: /admin` es un prefijo: bloquea
`/admin`, `/administracion`, `/admin-cualquier-cosa`. Hoy no hay conflicto, pero
es una trampa a futuro.

**Corrección propuesta (para `dev`).** Elegir **un** mecanismo por objetivo:

- Para que **no se indexe**: permitir el rastreo y dejar que el `noindex` haga
  su trabajo (quitar el `Disallow` de `/admin` y `/postulaciones`, mantener el
  `X-Robots-Tag`, y añadir además `<meta name="robots" content="noindex">` en
  `admin.html` y `postulaciones.html` como cinturón y tirantes).
- Para que **no se acceda**: autenticación, que ya existe. Eso es lo que
  protege de verdad; `robots.txt` nunca protegió nada.

`Allow: /` después de los `Disallow` es inofensivo (Google aplica la regla más
específica y `/admin` gana sobre `/`), pero es redundante y confunde a quien lea
el archivo.

---

### M6 · Logos: 57 KB para pintar 72×34 px, con dimensiones mal declaradas

**Severidad: MEDIO. Verificado (medición propia).**

**Evidencia** (Playwright, Pixel 5):

| Archivo | Peso | Tamaño intrínseco | Tamaño pintado | `width`/`height` declarados |
|---|---:|---|---|---|
| `logo_azul_transparente.png` | 28 437 B | 1406 × 668 | **72 × 34** | `150 × 34` |
| `logo_crema_transparente.png` | 28 815 B | 1498 × 669 | 72 × 34 (y 0×0) | `150 × 34` |
| `simbolo_LL_fondo_azul.png` (favicon) | 77 204 B | — | 16×16 / 32×32 | — |

Tres problemas encadenados:

1. **Sobredimensionado brutal.** Se descargan 1406 px de ancho para pintar 72.
   Son ~57 KB de PNG en el camino crítico que, en SVG o WebP, serían ~3 KB.
   Como el logo es una forma vectorial, el SVG es la respuesta natural.
2. **`width`/`height` incorrectos.** Se declara `150 × 34`, pero la relación
   intrínseca real es 1406/668 ≈ 2,105, que a 34 px de alto da **≈72 px de
   ancho**, no 150. El navegador reserva el doble de ancho del que hará falta.
3. **Doble descarga.** `index.html:70-71` carga los dos logos (claro y oscuro)
   para el conmutador de tema; el segundo se pinta a `0 × 0` pero **se descarga
   igual**. 28 KB para un elemento invisible en la carga inicial.

**El CLS medido es 0**, porque el CSS impone el tamaño final y compensa el
`width` erróneo. Así que esto no está rompiendo nada hoy: es peso desperdiciado
y una declaración que miente.

**Corrección propuesta (para `dev`).** Servir los logos en SVG (o WebP),
corregir `width`/`height` a la relación real, y resolver el par claro/oscuro con
CSS (`currentColor` sobre un SVG, o `<picture>`/`prefers-color-scheme`) en vez
de descargar dos PNG. Y reemplazar el favicon de 77 KB (B6).

---

### M7 · El `Organization` está incompleto y faltan los demás esquemas

**Severidad: MEDIO. Verificado.**

Más allá de C1, el `Organization` de `index.html:37-51` funciona pero se queda
corto: **sin `address`, sin `telephone`, sin `contactPoint`, sin `@id`**. El
`@id` es el que permite que las 12 fichas `ClothingStore` cuelguen de la matriz
vía `parentOrganization`; sin él, Google ve trece entidades sueltas en vez de
una cadena con doce locales.

Esquemas ausentes y lo que aportarían:

| Esquema | Dónde | Para qué |
|---|---|---|
| `ClothingStore` ×12 | portada + `/tiendas/<slug>` | **C1 — la pieza clave** |
| `WebSite` | portada | nombre del sitio en resultados |
| `BreadcrumbList` | `/trabaja`, `/privacidad`, `/tiendas/*` | miga de pan en el resultado |
| `JobPosting` | `/trabaja` | entrar en **Google Jobs** |
| `FAQPage` | portada o `/tiendas` | resultados enriquecidos |

**Sobre `JobPosting`:** `/trabaja` ya tiene infraestructura de ofertas
(`GET /api/offers`, hoy `{"offers":[]}`). Cuando se publiquen ofertas reales,
marcarlas con `JobPosting` las haría elegibles para Google Jobs — un canal de
reclutamiento gratuito que encaja con la promesa de «empleo formal, línea de
carrera» de `trabaja.html:81-113`. **Requiere ofertas reales con fecha,
ubicación y descripción**; no se debe marcar nada mientras el array esté vacío.

**Sobre `FAQPage`:** solo si las preguntas existen de verdad en la página y son
visibles al usuario. Marcar un FAQ que no se ve es una violación de las
directrices de Google.

---

### M8 · El `sitemap.xml` declara un `lastmod` que no es cierto

**Severidad: MEDIO. Verificado.**

`server/server.js:332-351`:

```js
const hoy = new Date().toISOString().slice(0, 10);
…
`<lastmod>${hoy}</lastmod>`
```

Las tres URLs declaran **siempre la fecha de hoy**, se haya tocado el contenido
o no. Verificado en la respuesta: las tres dicen `2026-09-18`, incluida
`/privacidad`, cuya última actualización real es el 17 de septiembre según su
propio `<time datetime="2026-09-17">` (`privacidad.html:35`).

Un `lastmod` que cambia a diario sin que cambie nada deja de ser una señal:
Google aprende a ignorarlo. Peor aún, `/privacidad` con `changefreq: yearly` y
`lastmod` de hoy es internamente contradictorio.

**Corrección propuesta (para `dev`).** Derivar `lastmod` del `mtime` real de
cada archivo (o de la fecha de modificación del registro, para las páginas de
tienda de A1). Si no se puede, es preferible omitir `lastmod` que mentirlo.
`priority` y `changefreq` son ignorados por Google desde hace años; se pueden
dejar o quitar, da igual.

---

### M9 · `privacidad.html` no tiene ninguna etiqueta Open Graph

**Severidad: MEDIO-BAJO. Verificado.**

`privacidad.html:1-14` tiene `title`, `description`, `canonical` y favicon —
todo correcto— pero **cero** etiquetas `og:` o `twitter:`. Si alguien comparte el
enlace de la política de privacidad o, más probable, el del **Libro de
Reclamaciones** (`/privacidad#reclamaciones`, enlazado desde el pie de las dos
páginas principales y desde `index.html:383`), la vista previa saldrá sin
formato de marca.

En Perú el Libro de Reclamaciones es una obligación legal visible y un enlace
que se comparte con más frecuencia de lo que parece. Merece una tarjeta decente.

**Corrección propuesta (para `dev`).** Añadir el bloque `og:`/`twitter:` mínimo
(`og:type`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:url`,
`og:image`) reutilizando la pieza de C3.

---

### M10 · Los huecos del HTML piden un recorte distinto al que pide el panel

**Severidad: MEDIO. Verificado.**

`GET /api/images` devuelve, para cada hueco, la medida que el panel le pide al
usuario. Comparada con la clase CSS que el HTML aplica:

| Hueco | El panel pide | El HTML usa | ¿Coincide? |
|---|---|---|---|
| `hero_main` | Cuadrada · 800×800 (`1 / 1`) | `media--4x5` (`index.html:130`) | **No** |
| `cat_formal` | Horizontal · 800×500 (`16 / 10`) | `media--4x5` (`index.html:154`) | **No** |
| `cat_casual` | Horizontal · 800×500 (`16 / 10`) | `media--4x5` (`index.html:160`) | **No** |
| `cat_calzado` | Horizontal · 800×500 (`16 / 10`) | `media--4x5` (`index.html:166`) | **No** |
| `cat_accesorios` | Horizontal · 800×500 (`16 / 10`) | `media--4x5` (`index.html:172`) | **No** |

Quien suba las fotos seguirá la instrucción del panel y verá su foto cuadrada
recortada a vertical 4:5, y sus fotos horizontales de categoría recortadas
salvajemente. Dado que `.media > img` usa `object-fit` sobre un contenedor con
`aspect-ratio` (`css/base.css:351-368`), el recorte es silencioso: nadie verá un
error, solo fotos mal encuadradas.

**Impacto SEO indirecto pero real:** las fotos de categoría mal recortadas son
peores candidatas para Google Imágenes y para miniaturas de resultados
enriquecidos, y el recorte del hero afecta al elemento LCP (M1).

**Corrección propuesta (para `dev` + `aria`).** Decidir el ratio correcto por
hueco y que **panel y HTML lean la misma fuente**: que la clase `media--*` se
derive del campo `ratio` que `/api/images` ya devuelve, en vez de estar escrita
a mano en el HTML. Así deja de poder desincronizarse.

---

## 5. BAJO

**B1 · Salto de jerarquía `h2 → h4` en los pies.** Los bloques «Institucional»,
«Atención» y «Legal» usan `h4` sin que exista ningún `h3` por encima
(`index.html:436,446,456`; `trabaja.html:207,217,227`). Verificado en el DOM
renderizado: la secuencia termina en `…H3: Escríbenos, H4: Institucional, H4:
Atención, H4: Legal`. Es un fallo de WCAG 1.3.1 (saltar niveles) y ensucia el
esquema del documento. **Corrección:** `h2` (son secciones hermanas de las demás
del pie) o `h3`. Cambio trivial, sin efecto visual si el CSS se ajusta.

Por lo demás la jerarquía es **correcta**: verificado un único `h1` por página en
las tres públicas (`Mejores marcas, mejores precios.` / `Trabaja con nosotros` /
`Política de privacidad`), y los 12 `h3` de las tarjetas de tienda cuelgan
correctamente del `h2` «Encuentra tu tienda Lukers».

**B2 · `lang="es"` en vez de `lang="es-PE"`.** Las cuatro páginas declaran
`lang="es"`. Con `og:locale: es_PE` ya presente, afinar a `es-PE` refuerza la
señal de mercado peruano. Impacto pequeño pero el cambio cuesta cuatro
caracteres. (La página 404 declara `lang="en"` — ver A4.)

**B3 · Metadatos sociales incompletos.** Falta `og:image:alt` (accesibilidad de
la tarjeta compartida), falta `twitter:image` explícito —hoy hereda de
`og:image`, que es un 404 (C3)—, falta `twitter:site`, y `trabaja.html` no
declara `og:image:width`/`height` aunque `index.html` sí. Corregir junto con C3.

**B4 · 167 KB de imágenes muertas en `assets/`.** Los cinco `brillo_*.png`
(azul, lila, rosa, turquesa, verde; ~33 KB cada uno) **no se referencian en
ningún HTML, CSS ni JS**. Verificado:
`grep -rn "brillo_" --include="*.html" --include="*.css" --include="*.js"`
devuelve **0 coincidencias**; el efecto ✦ se resuelve por completo con
gradientes CSS. No afectan al rendimiento (no se descargan) pero engordan el
repositorio y el despliegue, y confunden a quien venga después. **Corrección:**
confirmar con `aria` que no forman parte del sistema visual previsto y, si no,
eliminarlos.

**B5 · NAP incompleto: no hay teléfono.** El bloque está escrito y comentado a
la espera del dato real (`index.html:372-377`):
`<!-- PENDIENTE: teléfono real de la central. -->`. Fue la decisión correcta: es
preferible no publicar teléfono a publicar uno falso. Pero el NAP (Name–Address–
Phone) es la tripleta que Google usa para casar el sitio con las fichas de Google
Business Profile, y hoy le faltan dos de las tres patas (dirección visible en
HTML y teléfono). **`[VALIDAR]` — Lukers debe aportar el teléfono de central y,
si existen, los de tienda.** Sin ese dato, `telephone` debe quedar fuera del
`ClothingStore` de C1; **no lo rellenes con un marcador**.

**B6 · Favicon de 77 KB y sin `/favicon.ico`.** `assets/simbolo_LL_fondo_azul.png`
pesa 77 204 B y se usa como icono de pestaña en las cuatro páginas
(`index.html:24`). Se descarga en todas las visitas para pintar 16 o 32 px.
Además `/favicon.ico` devuelve **404** (verificado), que es la ruta que algunos
clientes piden por defecto, y no hay `site.webmanifest` (404) ni
`apple-touch-icon`. **Corrección:** generar un set de iconos pequeños (ICO 32×32,
PNG 180×180 para Apple, manifest) desde el símbolo oficial —sin reconstruirlo ni
recolorearlo—.

**B7 · No marcar los testimonios con `Review`/`AggregateRating`.** Esto no es un
fallo: es una **advertencia preventiva**. `index.html:283-302` muestra tres
testimonios con nombres parciales («Carlos R.», «María S.», «Luis A.»). Son
piezas de copy, no reseñas verificadas de clientes identificables. Marcarlos con
`Review` o `AggregateRating` para obtener estrellas en los resultados sería una
violación directa de las directrices de reseñas de Google y expone al sitio a
una acción manual. **`[VALIDAR]` — si Lukers tiene reseñas reales y
verificables** (por ejemplo, las de sus fichas de Google Business Profile), esas
sí sirven, pero se muestran a través de la ficha, no marcándolas en el sitio
propio. Quien debe confirmar el origen de estos testimonios es Lukers.

---

## 6. Rendimiento y Core Web Vitals en móvil — qué he medido y qué no

### Lo que he medido de verdad

Chromium headless vía Playwright, emulando **Pixel 5**, contra
`http://localhost:3999/`, sin throttling de red ni de CPU:

| Métrica | Valor medido |
|---|---:|
| LCP | 412 ms |
| First Contentful Paint | 412 ms |
| **CLS** | **0** |
| DOMContentLoaded | 393 ms |
| `load` | 399 ms |
| TTFB | 3 ms |
| Peticiones totales | 12 |
| Errores de consola | 1 (fuente de Google bloqueada **por el sandbox**, no por el sitio) |

Peso transferido: 25,0 KB HTML + 36,4 KB CSS + 14,8 KB JS + 57,3 KB PNG
(logos) + 3,6 KB JSON ≈ **137 KB sin comprimir**.

### Lo que NO he medido, y por qué

**No he ejecutado PageSpeed Insights ni Lighthouse contra el dominio público**,
porque lukers.pe no está desplegado en este entorno. **Cualquier puntuación
de 0 a 100 que apareciera en este informe sería inventada, así que no aparece
ninguna.**

Y, sobre todo: **estos números no predicen los del sitio publicado.** Las
diferencias son estructurales, no de matiz:

1. **TTFB de 3 ms es irreal.** En producción habrá latencia de red, TLS y el
   arranque del contenedor de Railway.
2. **CLS = 0 y LCP = 412 ms son artefactos de que no hay fotos.** El LCP actual
   es el `h1` de texto. Cuando entre la foto de portada, el LCP pasará a ser esa
   imagen, con el problema de M1 encima.
3. **Falta la fuente de Google**, que en producción sí se descargará (dos
   familias Archivo) y añadirá su propio coste de red en el camino crítico.

### Lo que sí se puede afirmar con la evidencia disponible

**Bien resuelto:**

- **CLS estructuralmente protegido.** `.media` reserva el espacio con
  `aspect-ratio` vía `--media-ratio` (`css/base.css:351-368`), así que las
  imágenes que se inyecten después no empujarán el contenido. Es una decisión
  correcta y deliberada del equipo `dev`.
- **Los scripts van al final del `<body>`** (`index.html:482-485`) y no bloquean
  el parseo.
- **`display=swap` en la fuente** (`index.html:27`): el texto se pinta con la
  fuente del sistema y no queda invisible esperando.
- **`preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`**
  (`index.html:25-26`), correctamente con `crossorigin` en el segundo.
- **La animación de entrada no puede ocultar contenido.** `js/reveal.js`
  documenta y aplica dos redes de seguridad: la clase `js-reveal` se añade desde
  el `<head>` (así, si el archivo no carga, nada queda invisible) y hay un
  `setTimeout` de 3 s que muestra todo pase lo que pase. Además
  `css/base.css:590` desactiva el efecto con `prefers-reduced-motion`. Esto es
  exactamente lo que evita el fallo clásico de «contenido invisible para el
  rastreador»; está bien pensado.
- **Sin dependencias de terceros**: no hay jQuery, ni frameworks, ni tags de
  analítica. 14,8 KB de JS propio, sin comprimir, es muy poco.

**Pendiente (ordenado por impacto móvil):**

1. Compresión gzip/brotli — **53,6 KB de ahorro inmediato** (A5).
2. Logos en SVG/WebP — ~54 KB (M6) + favicon ~76 KB (B6).
3. Caché de estáticos — elimina 9 idas y vueltas por visita repetida (M3).
4. `eager` + `fetchpriority=high` + preload para la imagen de portada, antes de
   que se suban las fotos (M1).
5. Renderizar tiendas en servidor: elimina `fetch` del camino crítico (C2).

Con 1 + 2 + 3, la carga inicial bajaría de ~137 KB a **~30 KB**. Eso sí es una
mejora real y medible, a diferencia de una puntuación estimada.

---

## 7. Enlazado interno, redirecciones y 404

**Verificado con el DOM renderizado (los 12 enlaces de tienda solo existen tras
ejecutar JS).**

**Anclas internas: todas resuelven.** Comprobado uno a uno contra los `id`
existentes en `index.html`:

| Ancla enlazada | `id` destino | ¿Existe? |
|---|---|---|
| `#contenido` | `index.html:95` | Sí |
| `#categorias` | `index.html:145` | Sí |
| `#marcas` | `index.html:183` | Sí |
| `#tiendas` | `index.html:195` | Sí |
| `#nosotros` | `index.html:207` | Sí |
| `#historia` | `index.html:242` | Sí |
| `#proveedores` | `index.html:306` | Sí |
| `#contacto` | `index.html:359` | Sí |

**No hay ni un solo enlace interno roto.** Además, `trabaja.html:44-47,209-222`
enlaza correctamente con rutas absolutas de vuelta a la portada
(`/#categorias`, `/#tiendas`, `/#historia`…) en lugar de anclas sueltas que en
`/trabaja` no resolverían. Eso está bien hecho y es un detalle que se escapa a
menudo.

**Enlaces externos:** 12 a Google Maps (uno por tienda, generados en
`js/site.js:68-71`), Facebook e Instagram, todos con `target="_blank"
rel="noopener"`. Correcto.

**El botón flotante de WhatsApp se oculta solo si no hay número.**
`js/config.js` tiene `WHATSAPP_NUMBER: ""` y, verificado en el DOM renderizado,
el enlace `href="#"` del FAB **no aparece** en la lista final de enlaces: se
elimina en vez de quedarse como enlace muerto. Decisión correcta y bien
ejecutada.

**Redirecciones:** ver M4 y A2. Hoy **no hay ninguna redirección 301** en el
servidor; la desduplicación depende por completo del `canonical`.

**404:** ver A4. El código de estado es correcto (404, no soft-404); la página
no lo es.

---

## 8. Accesibilidad con impacto SEO

Solo lo que cruza con SEO; la auditoría de accesibilidad completa corresponde a
`motion` y `cro`.

**Bien resuelto (verificado):**

- `lang="es"` presente en las cuatro páginas (afinable a `es-PE`, B2).
- **Un solo `h1` por página**, verificado en el DOM renderizado de las tres
  públicas.
- HTML semántico real: `<header>`, `<nav>`, `<main id="contenido">`, `<section>`,
  `<article>` para cada tienda, `<figure>`/`<blockquote>`/`<figcaption>` para los
  testimonios, `<footer>`. No es `<div>` disfrazado.
- **Skip link** `<a class="skip-link" href="#contenido">` en portada
  (`index.html:57`) y en `/trabaja` (`trabaja.html:34`).
- `aria-label="Navegación principal"` en los `<nav>`; `aria-current="page"` en el
  enlace activo (`trabaja.html:48`).
- Los SVG decorativos llevan `aria-hidden="true"` de forma consistente; los
  interactivos llevan `aria-label` («Lukers en Facebook», «Escríbenos por
  WhatsApp»).
- Los campos de formulario tienen `<label>` asociado por `for`/`id`, con
  `visually-hidden` donde el diseño no muestra etiqueta (`index.html:344`).
- `role="status"` en los mensajes de respuesta de formulario y en el toast, con
  `aria-live="polite"`.
- Las cifras de portada usan `<dl>/<dt>/<dd>` con `<dt>` en `visually-hidden`
  (`index.html:122-125`): la estructura semántica existe aunque no se vea.
- `prefers-reduced-motion` respetado en `css/base.css:590` y también en el
  contador animado (`js/site.js:12`).

**Pendiente:**

- `alt=""` en las imágenes de contenido gestionadas (**M2**) — es el hallazgo de
  accesibilidad con impacto SEO más claro.
- Salto `h2 → h4` en los pies (**B1**).
- `lang="en"` en la página 404 (**A4**).

---

## 9. Plan de corrección sugerido

**Antes de publicar (bloqueantes):**

1. **C3** — crear `assets/og-lukers.png`. Es un archivo; una hora de trabajo.
2. **A2** — arreglar `/trabaja/` (rutas absolutas + 301).
3. **A5** — activar compresión. Una línea.
4. **A4** — página 404 de marca.

**Primera semana tras publicar (el trabajo que de verdad mueve el SEO local):**

5. **C2 + C1** — renderizar tiendas en servidor **y** emitir los 12
   `ClothingStore`. Van juntas: la misma refactorización habilita ambas.
6. **A3** — desbloquear las imágenes públicas antes de subir fotos.
7. **M1 + M10** — dejar el hueco de portada listo **antes** de que entren las
   fotografías. Después será más caro.

**Primer mes:**

8. **A1** — `/tiendas` y las 12 páginas por tienda. Es el proyecto grande y el
   de mayor retorno a medio plazo.
9. **M3, M4, M5, M6, M7, M8, M9** — higiene técnica.
10. **B1–B7** — pulido.

---

## 10. Lo que este informe NO puede responder

Para que no se lea como una omisión:

- **No hay volúmenes de búsqueda** para ninguna consulta. No he ejecutado
  ninguna herramienta de keywords y no invento cifras. Las prioridades de este
  informe se justifican por estructura, no por volumen.
- **No hay puntuaciones de PageSpeed ni de Lighthouse.** No he ejecutado
  ninguna de las dos contra el dominio público.
- **No sé si existen las 12 fichas de Google Business Profile**, que son la otra
  mitad del SEO local. El marcado del sitio las refuerza; no las reemplaza.
- **No he podido verificar el rendimiento real en producción**, solo en
  localhost, con las limitaciones explicadas en la sección 6.
- **No he verificado los datos de negocio**: direcciones, horarios, el «más de
  60 marcas», los «más de 300 compañeros» (`trabaja.html:108`), la fecha de
  fundación 2001 o el «hasta 70% de descuento». Los he tomado del repositorio
  tal como están. Si alguno es incorrecto, el error se propagaría al marcado
  estructurado, que es precisamente donde más caro sale equivocarse.

---

# Contrato de entrega

## Decisiones tomadas

1. **Ordenar el informe por impacto en SEO local, no por categoría técnica.**
   Lukers no vende online: las 12 tiendas son el negocio. Un hallazgo que impide
   que Google entienda dónde están las tiendas pesa más que uno que afecta a
   métricas genéricas.
2. **Clasificar la ausencia de `LocalBusiness`/`ClothingStore` como el hallazgo
   principal (C1).** Es una omisión, no un error, y por eso pasa desapercibida
   en una revisión superficial; es también la que más separa al sitio de su
   objetivo comercial.
3. **Separar C1 (falta el marcado) de C2 (el contenido local no está en el
   HTML).** Son dos causas distintas del mismo síntoma y se pueden corregir por
   separado, aunque convenga hacerlo a la vez.
4. **No incluir ninguna puntuación de PageSpeed ni Lighthouse.** No los he
   ejecutado. Publicar una cifra estimada sería inventar una métrica.
5. **Medir el rendimiento con Playwright emulando Pixel 5 y declarar
   explícitamente las limitaciones de medir en localhost**, en vez de presentar
   esas cifras como representativas de producción.
6. **No reportar el fallo de las tipografías de Google como hallazgo**, por ser
   un bloqueo de certificado del sandbox según la instrucción recibida.
7. **Documentar de forma destacada lo que está bien resuelto** (CLS protegido
   por `aspect-ratio`, red de seguridad de `reveal.js`, `alt` correcto en fotos
   de tienda, enlazado interno sin roturas, ocultar el FAB de WhatsApp si no hay
   número). Una auditoría que solo enumera fallos induce a «arreglar» cosas que
   ya estaban bien.
8. **Advertir preventivamente contra marcar los testimonios con `Review`
   (B7)**, aunque hoy no exista ese marcado: es el siguiente paso natural de
   quien implemente datos estructurados y sería una violación de directrices.
9. **No proponer ningún dato inventado** para teléfonos, coordenadas u horarios
   específicos; marcarlos como `[VALIDAR]` con responsable.

## Evidencia utilizada

- `index.html` — cabecera y metadatos (1-53), estructura semántica y encabezados
  (95-480), contenedores vacíos `#storeGrid` (203) y `#brandLanes` (192),
  teléfono comentado (372-377), testimonios (283-302), pie (436-456).
- `trabaja.html` — cabecera (1-31), rutas relativas (21,25,26,39,40,193,253-256),
  encabezados y pie (69,81,117,207-227).
- `privacidad.html` — cabecera sin Open Graph (1-14), `h1` y `<time>` (34-35),
  jerarquía `h2` (61-184).
- `postulaciones.html`, `admin.html` — cabeceras, confirmación de que dependen
  del `X-Robots-Tag` del servidor.
- `server/server.js` — estáticos y cabeceras (290-311), middleware `noIndex`
  (314-318), rutas (319-329), `sitemap.xml` (332-351), `robots.txt` (354-366),
  rutas `/uploads/` (437,475,524,574), manejo de errores sin handler 404
  (698-720).
- `js/site.js` — inyección de imágenes con `alt=""` y `lazy` (40-57), renderizado
  de tiendas (78-118), enlaces a Maps (68-71).
- `js/reveal.js` — red de seguridad completa del efecto de aparición.
- `js/config.js` — `WHATSAPP_NUMBER` vacío.
- `css/base.css` — `.media` con `aspect-ratio` (351-368), `.js-reveal` y
  `prefers-reduced-motion` (576-590).
- **Comportamiento observado en el servidor** (`http://localhost:3999`):
  `robots.txt` y `sitemap.xml` completos; 404 de
  `/assets/og-lukers.png`; 404 de `/favicon.ico` y `/site.webmanifest`;
  códigos de estado de `/trabaja` (200), `/trabaja/` (200),
  `/trabaja/css/base.css` (404), `/trabaja.html` (200), `/Trabaja` (200),
  `/privacidad.html` (200), `/index.html` (404); `X-Robots-Tag` en `/admin` y
  `/postulaciones`; ausencia de `Content-Encoding` con `Accept-Encoding: gzip,
  br`; `Cache-Control: public, max-age=0`; cuerpo del 404 por defecto de
  Express; contenido de `/api/stores`, `/api/images`, `/api/brands` y
  `/api/offers`.
- **Renderizado con Playwright** (Chromium, emulación Pixel 5): LCP 412 ms,
  FCP 412 ms, CLS 0, DCL 393 ms, `load` 399 ms, TTFB 3 ms, 12 peticiones;
  12 `<article>` en `#storeGrid`; lista completa de encabezados del DOM;
  dimensiones intrínsecas vs. pintadas de los tres `<img>`; inventario de
  enlaces resultantes.
- **Medición de compresión**: `gzip -9` archivo a archivo (76 216 B → 22 638 B).
- `grep -rn "brillo_"` sobre HTML/CSS/JS: 0 coincidencias.
- `AGENTS.md`, `.claude/agents/search.md`, `docs/agent-workflow/HANDOFF_TEMPLATE.md`.

## Supuestos

1. **`https://lukers.pe` será el dominio de producción**, servido por HTTPS y con
   una única versión canónica (con o sin `www`, y sin duplicar `http`). No he
   podido verificar redirecciones de dominio ni de protocolo porque el entorno es
   `http://localhost`. Las URLs canónicas del código ya asumen `lukers.pe`.
2. **Las 12 tiendas de la base de datos son las reales y están vigentes**, con
   sus direcciones y su horario unificado «Lun a Dom 10:00–22:00». Las he tomado
   tal cual del repositorio.
3. **Se subirán fotografías reales al panel.** Varios hallazgos (A3, M1, M2,
   M10) son inocuos hoy y se activan en ese momento.
4. **Google renderiza el JavaScript del sitio sin problema**, por lo que el
   contenido de C2 *probablemente* acaba indexándose. El hallazgo trata del
   riesgo y de los rastreadores sin JS, no de una imposibilidad.
5. **El despliegue en Railway no añade compresión ni caché por delante del
   servidor.** No he podido verificarlo; si su proxy ya comprime, A5 pierde
   severidad. Debería confirmarlo `dev` contra el entorno real.
6. **No hay migraciones de un sitio anterior** que exijan redirecciones 301
   desde URLs antiguas. Si lukers.pe ya existía con otra estructura, hace falta
   un mapa de redirecciones que este informe no cubre.

## Información faltante

1. **Teléfono de la central y, si existen, de cada tienda.** Lo valida **Lukers**.
   Afecta a: el bloque de contacto comentado (`index.html:372-377`), el campo
   `telephone` del `Organization` y de los 12 `ClothingStore` (C1), y la
   consistencia NAP con Google Business Profile (B5).
2. **Coordenadas geográficas (lat/long) de las 12 tiendas.** Lo valida
   **Lukers**. Afecta a `geo` dentro de cada `ClothingStore` (C1) y a la
   precisión en el paquete local.
3. **Si existen y están reclamadas las 12 fichas de Google Business Profile**, y
   si el NAP de cada una coincide exactamente con el del sitio. Lo valida
   **Lukers** con `launch`. Afecta a todo el retorno de C1 y A1: el marcado del
   sitio refuerza las fichas, no las sustituye.
4. **Horarios reales por tienda.** Los 12 registros comparten
   «Lun a Dom 10:00–22:00». Lo valida **Lukers**. Si alguna difiere (centro
   comercial, feriados), el `openingHoursSpecification` sería incorrecto.
5. **Origen de los tres testimonios** de `index.html:283-302`. Lo valida
   **Lukers**. Determina si pueden marcarse con `Review` (hoy la recomendación
   es **no hacerlo**, B7).
6. **Si Railway comprime y cachea por delante del servidor.** Lo valida `dev`.
   Afecta a la severidad real de A5 y M3.
7. **Si `assets/brillo_*.png` forman parte del sistema visual previsto.** Lo
   valida `aria`. Determina si se eliminan (B4).
8. **Ratio correcto de cada hueco de imagen** (M10). Lo valida `aria` con `dev`.
9. **Acceso a Google Search Console del dominio.** Lo valida **Lukers** con
   `launch`. Sin él no hay forma de medir el efecto de ninguna corrección ni de
   priorizar ciudades con datos reales en vez de por estructura.

## Riesgos identificados

1. **Que se publique con C1 y C2 sin resolver.** Probabilidad alta (el sitio
   «funciona» y nada avisa), impacto alto: el sitio quedaría invisible para las
   búsquedas locales que son su única fuente de tráfico comercial. *Mitigación:*
   tratarlas como bloqueantes de la primera semana post-lanzamiento, no como
   mejoras.
2. **Que se suban las fotografías antes de corregir A3, M1, M2 y M10.**
   Probabilidad **alta** —subir fotos es lo primero que hará el cliente con el
   panel nuevo—, impacto medio-alto: toda la imaginería nacería bloqueada para
   Google, con `alt` vacío, mal recortada y degradando el LCP. *Mitigación:*
   hacer esas cuatro correcciones **antes** de entregar el panel, y avisar
   explícitamente a quien vaya a subirlas.
3. **Que se implementen los `ClothingStore` con datos inventados** para rellenar
   `telephone` o `geo`. Probabilidad media, impacto **alto**: un NAP inconsistente
   entre sitio y ficha daña activamente el posicionamiento local, y es más difícil
   de revertir que de evitar. *Mitigación:* omitir el campo antes que rellenarlo;
   los `[VALIDAR]` de este informe son bloqueantes de ese campo concreto, no del
   marcado entero.
4. **Que alguien marque los testimonios con `Review` para conseguir estrellas.**
   Probabilidad media (es tentador y hay tutoriales que lo recomiendan), impacto
   alto: violación de directrices y riesgo de acción manual. *Mitigación:* B7
   deja constancia explícita.
5. **Que `/trabaja/` se indexe rota.** Probabilidad baja-media (depende de que
   alguien la enlace con barra final), impacto medio: una página 200 sin estilos
   ni formulario, con la marca recién rediseñada. *Mitigación:* A2, que es barata.
6. **Que se publique sin analítica ni Search Console.** Probabilidad media,
   impacto alto a medio plazo: sin medición, ninguna de estas correcciones se
   puede evaluar y las prioridades seguirán siendo estructurales en vez de
   basadas en datos. *Mitigación:* corresponde a `launch` en
   `30_DAY_LAUNCH_PLAN.md`.
7. **Que las páginas por tienda (A1) se creen con contenido duplicado** —las 12
   iguales cambiando el nombre—. Probabilidad media, impacto medio: Google las
   trataría como duplicados y no posicionaría ninguna. *Mitigación:* que `copy`
   escriba contenido diferenciado por local (referencias de la zona, qué
   encuentras en esa tienda, cómo llegar); son 12 textos cortos pero tienen que
   ser distintos de verdad.

## Cambios solicitados a otros agentes

- **`REQUEST_FOR_CHANGE → dev` (C3, CRÍTICO):** crear `assets/og-lukers.png`
  (1200×630). *Evidencia:* `index.html:18` y `trabaja.html:17` referencian
  `https://lukers.pe/assets/og-lukers.png`; `curl` devuelve **404** y el archivo
  no está en `assets/`. *Efecto esperado:* las vistas previas al compartir por
  WhatsApp, Facebook e Instagram dejan de salir sin imagen. Coordinar la pieza
  con `aria`; **no reconstruir ni recolorear el logo**, usar
  `assets/logo_crema_transparente.png` tal cual.

- **`REQUEST_FOR_CHANGE → dev` (C2, CRÍTICO):** renderizar las 12 tarjetas de
  tienda en el HTML servido, dejando el `fetch` como hidratación. *Evidencia:*
  `index.html:203` sirve `<div id="storeGrid"></div>` vacío; `js/site.js:78-118`
  lo rellena tras `fetch`; el HTML de `curl` no contiene ninguna dirección,
  mientras el DOM renderizado sí muestra las 12. *Efecto esperado:* las
  direcciones dejan de depender de la ejecución de JS y pasan a ser visibles
  para todos los rastreadores, incluidos los de WhatsApp y redes sociales.

- **`REQUEST_FOR_CHANGE → dev` (C1, CRÍTICO):** emitir un `ItemList` con 12
  `ClothingStore` desde la misma tabla de `/api/stores`, y completar el
  `Organization` con `@id`, `address` y `contactPoint`. *Evidencia:*
  `index.html:37-51` es el único JSON-LD del repositorio y solo declara
  `areaServed: "PE"`; `/api/stores` ya devuelve nombre, ciudad, dirección y
  horario de las 12. *Efecto esperado:* Google puede entender Lukers como una
  cadena de doce establecimientos físicos y considerarla para el paquete local.
  **Dejar fuera `telephone` y `geo` hasta que Lukers aporte los datos**
  (`[VALIDAR]`); no rellenarlos con marcadores.

- **`REQUEST_FOR_CHANGE → dev` (A2, ALTO):** 301 de `/trabaja/` a `/trabaja` y
  conversión de todas las rutas relativas a absolutas en las cuatro páginas.
  *Evidencia:* `/trabaja/` devuelve **200** mientras
  `/trabaja/css/base.css` devuelve **404**; las rutas relativas están en
  `trabaja.html:21,25,26,39,40,193,253-256`. *Efecto esperado:* deja de existir
  una URL indexable que sirve la página sin estilos, sin logo y con el
  formulario inoperativo.

- **`REQUEST_FOR_CHANGE → dev` (A3, ALTO):** dejar de bloquear en `robots.txt` la
  ruta de las imágenes públicas, separando subidas públicas de privadas.
  *Evidencia:* `server/server.js:360` emite `Disallow: /uploads/`, y las líneas
  437, 475, 524 y 574 confirman que **toda** la fotografía del sitio se sirve
  desde ahí. *Efecto esperado:* las fotos de portada, categorías y tiendas
  podrán aparecer en Google Imágenes. **Los adjuntos de RR.HH. deben seguir
  fuera del alcance público, protegidos por autenticación y no por `robots.txt`.**

- **`REQUEST_FOR_CHANGE → dev` (A5, ALTO):** activar compresión gzip/brotli para
  HTML, CSS, JS y JSON. *Evidencia:* con `Accept-Encoding: gzip, br` la respuesta
  no incluye `Content-Encoding`; medición propia: 76 216 B → 22 638 B (**-70 %**).
  *Efecto esperado:* 53,6 KB menos en cada primera visita móvil.

- **`REQUEST_FOR_CHANGE → dev` (A4, ALTO):** página 404 propia que devuelva
  **código 404**, en español, con identidad Lukers y enlaces de salida (portada,
  buscador de tiendas, trabaja con nosotros). *Evidencia:* `curl` a una URL
  inexistente devuelve el HTML por defecto de Express, con `lang="en"`,
  `<title>Error</title>` y `Cannot GET /…`, sin ningún enlace. Coordinar el texto
  con `copy`. *Efecto esperado:* deja de perderse tráfico ya ganado y se corrige
  la señal de idioma.

- **`REQUEST_FOR_CHANGE → dev` (M1 + M2 + M10, MEDIO):** en `js/site.js`, excluir
  `hero_main` del `lazy` (`eager` + `fetchpriority="high"`), dar `alt`
  significativo a las imágenes gestionadas en vez de `alt=""`, y derivar la clase
  `media--*` del campo `ratio` que ya devuelve `/api/images`. *Evidencia:*
  `js/site.js:40-57` (`img.alt = ""`, `img.loading = "lazy"` sin excepciones);
  discrepancia verificada entre el `ratio` de `/api/images` y las clases de
  `index.html:130,154-174`. *Efecto esperado:* proteger el LCP y el recorte
  **antes** de que se suban las fotografías reales.

- **`REQUEST_FOR_CHANGE → dev` (M3–M9, B1–B3, B6, MEDIO/BAJO):** higiene técnica
  — caché de estáticos, 301 de variantes de URL, resolver la contradicción
  `robots.txt`/`noindex`, logos en SVG, `lastmod` real en el sitemap, Open Graph
  en `/privacidad`, `h4 → h2` en los pies, `lang="es-PE"`, `og:image:alt`, y un
  set de favicons ligero con `/favicon.ico`.

- **`REQUEST_FOR_CHANGE → aria` (A1, ALTO):** definir la arquitectura del
  directorio de tiendas (`/tiendas` + `/tiendas/<slug>` ×12). *Evidencia:* el
  sitemap declara 3 URLs para 12 tiendas; las tiendas viven en el ancla
  `#tiendas`, que no es indexable. *Efecto esperado:* 12 URLs capaces de
  competir cada una por su búsqueda local. **Decisión que corresponde a `aria`,
  no a SEO**: aquí solo documento la necesidad y la estructura mínima.

- **`REQUEST_FOR_CHANGE → aria` (M10 + B4, MEDIO/BAJO):** confirmar el ratio
  correcto de cada hueco de imagen y si los cinco `assets/brillo_*.png`
  (167 KB, **0 referencias** verificadas en HTML/CSS/JS) siguen formando parte
  del sistema visual o pueden eliminarse.

- **`REQUEST_FOR_CHANGE → copy` (A1, ALTO, dependiente):** cuando exista la
  arquitectura de `/tiendas/<slug>`, escribir contenido **diferenciado** por
  tienda —referencias de la zona, qué se encuentra en ese local, cómo llegar—.
  *Evidencia:* riesgo 7. *Efecto esperado:* evitar que 12 páginas casi idénticas
  se traten como duplicados y no posicione ninguna. Aplicar el mismo criterio a
  los textos de la 404 (A4).

- **`REQUEST_FOR_CHANGE → launch` (informativo):** incluir en
  `30_DAY_LAUNCH_PLAN.md` la verificación de las 12 fichas de Google Business
  Profile, el alta en Search Console, el envío del sitemap y la comprobación con
  la herramienta de resultados enriquecidos una vez desplegado C1. *Evidencia:*
  sección 10; ninguna de esas verificaciones es posible desde este entorno.

## Output para el siguiente agente

**Archivos que debe leer:**

- Este documento, `docs/agent-workflow/deliverables/SEO_TECH_AUDIT.md`, empezando
  por la tabla de prioridades de la sección 1 y el plan de la sección 9.
- `docs/agent-workflow/deliverables/SEO_STRATEGY.md`, si existe, para no
  contradecir la fase de estrategia.
- `docs/agent-workflow/deliverables/CRO_AUDIT.md`, cuando `cro` lo entregue: la
  404 de A4 y las páginas de tienda de A1 son territorio compartido entre
  conversión y SEO, y conviene resolverlas una sola vez.
- El código citado: `index.html`, `trabaja.html`, `privacidad.html`,
  `server/server.js`, `js/site.js`.

**Decisiones que debe respetar:**

1. **No inventar teléfonos, coordenadas, horarios por tienda ni reseñas.** Los
   `[VALIDAR]` de este informe bloquean el campo concreto, no el marcado entero:
   es preferible un `ClothingStore` sin `telephone` que uno con un teléfono
   inventado.
2. **No marcar los testimonios con `Review`/`AggregateRating`** (B7).
3. **Conservar lo que ya está bien resuelto:** el `aspect-ratio` de `.media`, las
   dos redes de seguridad de `js/reveal.js`, el `alt` descriptivo de las fotos de
   tienda, el `alt=""` correcto del logo duplicado del par claro/oscuro, el
   `X-Robots-Tag` en rutas internas, el skip link, el ocultado del FAB de
   WhatsApp cuando no hay número, y el canonical de las tres páginas públicas.
   **Ninguna de esas cosas es un hallazgo; no hay que «arreglarlas».**
4. **`/admin` y `/postulaciones` no se indexan jamás.** M5 propone cambiar el
   *mecanismo* (rastreable + `noindex` en vez de `Disallow`), no el objetivo.
5. **Las correcciones sobre imágenes (A3, M1, M2, M10) van antes de que se suban
   las fotografías reales**, no después.
6. **`dev` es el único que toca el producto.** Este informe no modifica ni una
   línea de HTML, CSS, JS ni servidor.

**Preguntas que siguen abiertas:**

1. ¿Existen y están reclamadas las 12 fichas de Google Business Profile, y su
   NAP coincide con el del sitio? → **Lukers** + `launch`.
2. ¿Cuál es el teléfono de central, y hay teléfonos por tienda? → **Lukers**.
3. ¿Coordenadas de los 12 locales? → **Lukers**.
4. ¿Algún local tiene horario distinto al «Lun a Dom 10:00–22:00»? → **Lukers**.
5. ¿De dónde salen los tres testimonios de `index.html:283-302`? → **Lukers**.
6. ¿Railway comprime y cachea por delante del servidor? → `dev`.
7. ¿Se aprueba la arquitectura `/tiendas/<slug>` de A1, y con qué prioridad? →
   `aria` con el agente principal.
8. ¿Habrá ofertas de empleo reales publicadas, para justificar `JobPosting`? →
   **Lukers** con RR.HH.
9. ¿Existía lukers.pe antes con otra estructura de URLs que exija redirecciones
   301? → **Lukers**.
