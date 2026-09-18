# CRO_AUDIT — Auditoría independiente de conversión

**Agente:** `cro` · **Fecha:** 18 de septiembre de 2026
**Alcance:** `/`, `/trabaja`, `/privacidad` · escritorio 1440 px y móvil 390 px
**Método:** recorrido real con Chromium/Playwright sobre `http://localhost:3999`, inspección
del DOM computado (`elementFromPoint`, `getBoundingClientRect`, `getComputedStyle`), cálculo
de ratios de contraste WCAG, envío real de los tres formularios y lectura del código servido.
**Modo:** solo lectura sobre el producto. No se modificó HTML, CSS, JS ni servidor.

> **Aviso:** `index.html`, `js/site.js` y `server/server.js` fueron modificados por otro
> agente **durante** esta auditoría (renderizado de tiendas en servidor, `404.html`, retirada
> de la promesa de devolución). Todos los hallazgos críticos y quick wins se **reverificaron
> contra el build vigente** tras esos cambios y siguen siendo reproducibles; las citas de
> línea están actualizadas al estado actual. Los dos puntos que el cambio sí alteró están
> marcados: §1.1 (las tiendas ya se pintan en servidor) y Q14 (contradicción nueva sobre la
> garantía).

> Nota de método: no uso tasas base ni benchmarks porque el sitio **no tiene medición
> instalada** (ver C4). Todo lo que sigue se sostiene en una ruta, un elemento o un
> comportamiento reproducible, nunca en una cifra inventada.

---

## 0. Veredicto en una página

El sitio está bien construido a nivel de código y de estructura semántica, pero **hoy no
está en condiciones de convertir**, y no por matices de diseño:

1. En móvil, los primeros ~110 px de la pantalla están ocupados por un **menú cerrado que
   sigue siendo clicable**. Tocar la barra de anuncio de la portada lleva a `/trabaja`.
   Verificado navegando de verdad.
2. En modo claro (el de entrada), **el campo de correo del newsletter escribe en color crema
   sobre blanco**: ratio 1.15:1. El visitante no ve lo que teclea en el único campo del
   objetivo 2.
3. La página de privacidad, que es exactamente donde va el usuario **antes** de dar su
   correo o su DNI, muestra literalmente `[PENDIENTE: razón social]` y `[PENDIENTE: RUC]`.
4. **No hay ni un solo evento de medición** en todo el sitio. Cero. Ninguno de los cuatro
   objetivos de negocio es observable.
5. **No hay una sola fotografía real**: 17 huecos de marcador de posición, incluidas las 12
   fichas de tienda y las 4 categorías.

Los cuatro objetivos (visita a tienda, suscripción, postulación, proveedores) comparten una
sola portada de **19,8 pantallas en móvil**, y los tres últimos viven a partir del 79 % de
profundidad de scroll.

---

## 1. Recorrido observado, etapa por etapa

### 1.1 Llegada

| Observación | Evidencia |
|---|---|
| Portada móvil: 16 692 px de alto = **19,8 pantallas** de 844 px | medición `document.body.scrollHeight` en 390×844 |
| Escritorio: 9 405 px | ídem en 1440×900 |
| Barra de anuncio no descartable y sin fecha | `index.html:59-65` |
| En móvil la barra de anuncio queda **tapada y secuestrada** | ver C1 |
| Sin `noscript`. Las tiendas **sí** se pintan ya en el servidor (`#storeGrid data-servidor="1"`), pero el carrusel de marcas sigue dependiendo de `fetch`: sin JS, `grep -c brand-chip` sobre el HTML servido → **0** | `js/site.js` `cargarMarcas()`; `grep -c noscript index.html` → 0 |

### 1.2 Comprensión en los primeros segundos

La promesa se entiende: «Mejores marcas, mejores precios», «+60 marcas», «hasta 70 % de
descuento». Es un buen titular. Los problemas son de **prueba** y de **coherencia**:

- **Contradicción abierta sobre la garantía, dentro del mismo pliegue.** El párrafo del hero
  sigue prometiendo «con **garantía de autenticidad**» (`index.html:113`), mientras que el
  recuadro que tiene justo al lado ahora dice «Marcas originales — **Revisa la prenda en
  tienda antes de llevártela**» (`index.html:145-148`). Uno afirma una garantía; el otro
  traslada la comprobación al cliente. Conviven a 300 px de distancia. La misma promesa
  reaparece sin matices en la `meta description` y en `og:description`
  (`index.html:8`, `:16`).
  *Origen:* durante esta auditoría, `dev` retiró la promesa «Si no es original, te devolvemos
  tu dinero» del recuadro por no estar respaldada (comentario en `index.html:136-144`), lo
  cual es correcto — pero el texto del hero y los metadatos no se ajustaron. Hay que decidir
  **una** posición y aplicarla en los cuatro sitios. → `copy`

- El visual principal del hero es un rectángulo que dice literalmente `FOTO DE PORTADA`
  (`index.html:130-135`). El primer pantallazo de una cadena de ropa no muestra ropa.
- El hero afirma **60 marcas** (`index.html:122`) pero el carrusel que hay 3 500 px más
  abajo renderiza **24 marcas únicas** (`/api/brands`, 48 chips = 24 duplicadas). Un
  visitante que baje puede contarlas. Es una contradicción verificable dentro de la misma
  página.
- «hasta 70 % de descuento» no tiene ni un precio, ni un antes/después, ni una foto de
  etiqueta en todo el sitio.

### 1.3 Exploración

- Las 4 tarjetas de categoría (Formal, Casual, Calzado, Accesorios) **apuntan las cuatro al
  mismo ancla `#tiendas`** (`index.html:163, 169, 175, 181`). Prometen cuatro destinos y
  entregan uno. Y el CTA secundario del hero, «Ver categorías», lleva a `#categorias`, que
  a su vez rebota a `#tiendas`: un bucle.
- El carrusel de marcas es decorativo: chips de texto, 46 s de animación, sin enlace, sin
  logo, sin posibilidad de filtrar «quiero ver dónde hay Levi's».

### 1.4 Evaluación — la sección de tiendas

Es la sección más importante del sitio (objetivo 1) y la que peor resuelve la decisión:

| Observación | Evidencia |
|---|---|
| 12 fichas, 458 px cada una en móvil | medición de `.store-card` |
| Ocupan de 4 199 px a 10 187 px = **7,1 pantallas, el 36 % de la portada** | posiciones medidas de `#tiendas` y `#nosotros` |
| Sin filtro por ciudad, sin buscador, sin orden por cercanía, sin mapa | `index.html:204-206`, `js/site.js` `cargarTiendas()` |
| Las 12 tienen **exactamente el mismo horario** y la misma imagen de marcador | `/api/stores`: los 12 registros con `Lun a Dom · 10:00 a.m. – 10:00 p.m.` y `photo: null` |
| Ningún teléfono por tienda | esquema `stores` en `server/db.js:71-82`: no existe columna de teléfono |
| El botón WhatsApp de cada ficha **no se muestra** | `js/config.js` `WHATSAPP_NUMBER: ""` → `WHATSAPP_OK === false` (`js/ui.js`) |
| «Cómo llegar» abre una **búsqueda** de Maps, no una ruta | `js/site.js` `mapsUrl()` → `maps/search/?api=1&query=…`. El usuario aún necesita elegir el resultado y pulsar «Cómo llegar» dentro de Maps: 2 pasos extra |

Respuesta directa a la pregunta del encargo: **el camino a «cómo llegar» existe y es visible
dentro de la ficha, pero no es evidente cuál ficha es la mía.** El usuario de Iquitos tiene
que desplazarse por las 11 tiendas que no le sirven para llegar a la suya, que es la última.

### 1.5 Confianza

- **Cero fotografía real.** 17 huecos: 1 hero + 4 categorías + 12 tiendas. Para una cadena
  sin venta online, cuya única conversión real es que alguien se desplace físicamente, la
  ausencia de la tienda es la objeción principal sin responder: *¿a qué voy?, ¿cómo es por
  dentro?, ¿tiene mi talla?*
- Tres testimonios firmados «Carlos R.», «María S.», «Luis A.» sin foto, sin fuente, sin
  enlace (`index.html:298, 303, 308`). Un testimonio sin verificar resta más de lo que suma.
- `/privacidad` muestra `[PENDIENTE: razón social]`, `[PENDIENTE: RUC]`,
  `[PENDIENTE: domicilio fiscal]` (`privacidad.html:64`) y `[PENDIENTE: plazo…]`
  (`privacidad.html:117`) **al visitante**. Verificado en el DOM renderizado: 2 líneas
  visibles con `PENDIENTE`.
- El teléfono de central está comentado en el HTML (`index.html:377-382`): no hay ningún
  canal telefónico. Y sin WhatsApp configurado, los únicos canales son un correo y un
  formulario.
- No hay razón social, RUC, ni dirección fiscal en el pie. Para una cadena peruana formal es
  una señal de confianza estándar que está ausente.

### 1.6 Acción — los tres formularios

**Newsletter** (`index.html:351-361`):
- 1 campo + 1 casilla. Bien dimensionado.
- **La casilla de consentimiento está debajo del botón de envío.** El orden visual invita a
  pulsar «Suscribirme» antes de verla. Comprobado: escribir el correo y pulsar devuelve
  «Necesitamos tu autorización para poder escribirte». Es un fallo garantizado en el primer
  intento de todo el que no lea hacia abajo.
- **La casilla está fuera del `<form>`** (`</form>` en `index.html:355`, `<label>` en
  `:357`). Consecuencia comprobada: tras un envío correcto `form.reset()` no la desmarca —
  sigue en `true`. En un móvil compartido, el siguiente usuario encuentra el consentimiento
  ya marcado.
- **La propuesta de valor no justifica el correo.** Dice «campañas de descuento **en tu
  ciudad**» pero el formulario nunca pregunta la ciudad, y `/api/subscribe` sólo guarda
  `email` y `name` (`server/db.js:43-48`). Se promete algo que el dato capturado no permite
  cumplir. No hay frecuencia («¿cuántos correos al mes?»), ni ejemplo de lo que se recibe,
  ni incentivo.
- **La base de datos no guarda el consentimiento** (ni texto, ni fecha, ni origen) ni un
  token de baja, pese a que la política promete que «cada comunicación incluirá la forma de
  darte de baja» (`privacidad.html:110-113`). El esquema `subscribers` no lo contempla.

**Postulación** (`trabaja.html:117-180`):
- **12 controles**: 4 texto (nombre, correo, celular, DNI), 1 select de tienda, 3 radios de
  jornada, 2 radios de estudios, 1 textarea opcional, 1 casilla de consentimiento.
  Son **7 decisiones obligatorias** antes de poder enviar.
- **Pide de más y de menos a la vez.** Pide el **DNI** —el dato más sensible— en el primer
  contacto, antes de que exista relación alguna, y no explica por qué lo necesita ni qué
  pasa con él. Y **no pide CV ni adjunto**: lo único que permite describir la experiencia es
  un textarea marcado como *opcional*. Es decir, se exige el identificador nacional y se
  deja opcional el único dato que sirve para decidir a quién llamar.
- El `select` de tiendas lista **las 12** sin distinguir cuáles tienen vacante.
- **Sin vacantes publicadas, sin puesto, sin rango salarial, sin plazos, sin «qué pasa
  después».** Objeciones sin responder: *¿hay vacante en mi tienda?, ¿para qué puesto?,
  ¿cuánto pagan?, ¿cuándo me responden?*
- El CTA del encabezado en `/trabaja` es **«Volver al inicio»** (`trabaja.html:55`): en la
  página de conversión de un objetivo, el botón destacado apunta hacia fuera.

**Proveedores** (`index.html:329-336`): un único `mailto:` con asunto prellenado. En móvil,
si no hay cliente de correo configurado, el enlace no hace nada visible. No hay formulario
alternativo ni indicación de qué enviar en qué formato ni en cuánto responden.

**Errores, en los tres formularios** (comprobado enviando de verdad):
- Los mensajes salen **de uno en uno** y **sólo al final del formulario**. Enviar el
  formulario de postulación vacío devuelve «Ingresa tu nombre completo.» y nada más: el
  candidato descubre sus 7 campos faltantes en 7 envíos.
- **El foco se queda en el botón** (`document.activeElement` = `BUTTON`), no salta al campo
  con problema.
- **Ningún campo se marca**: `aria-invalid` es `null` en los cinco campos comprobados. No
  hay borde rojo ni pista visual. Un lector de pantalla no sabe qué campo corregir.

### 1.7 Confirmación

- Tras postular con éxito: una línea de texto en el formulario, un *toast* que desaparece a
  los 3,2 s (`js/ui.js`), y la página se queda en `scrollY 1403`. **No hay página de gracias,
  ni número de referencia, ni «qué sigue», ni plazo de respuesta.**
- **No se envía ningún correo.** No hay `nodemailer` ni ningún cliente SMTP en el proyecto
  (`grep` sobre `server/` y `package.json`): ni acuse al candidato ni aviso a RR. HH. Las
  postulaciones se acumulan en SQLite hasta que alguien entra a `/postulaciones`. Es una
  fuga operativa del objetivo 3: nada avisa a nadie.

---

## 2. Medición — el fallo que invalida todo lo demás

**No existe ninguna instrumentación.** `grep -rn "gtag|dataLayer|analytics|fbq|plausible|umami"`
sobre `*.html` y `*.js` devuelve **cero resultados**.

Consecuencia concreta: hoy es imposible responder a ninguna de estas preguntas, que son
exactamente los cuatro objetivos del sitio:

| Objetivo | Pregunta que hoy no tiene respuesta |
|---|---|
| 1 · Ir a la tienda | ¿Cuántos pulsan «Cómo llegar»? ¿De qué tienda? ¿Desde qué ciudad? |
| 2 · Suscriptores | ¿Cuántos ven el newsletter? ¿Cuántos fallan por la casilla? |
| 3 · Postulaciones | ¿Cuántos empiezan el formulario y cuántos lo terminan? ¿En qué campo abandonan? |
| 4 · Proveedores | ¿Cuántos pulsan el `mailto:`? (un `mailto:` **nunca** se registra solo) |

La única señal disponible es el conteo de filas en SQLite: resultado sin denominador. No se
puede calcular ninguna tasa, ni comparar, ni priorizar con datos. **Ningún experimento de la
sección 5 puede ejecutarse hasta que esto exista.**

---

## 3. Hallazgos priorizados

Puntuación **Impacto × Confianza × Facilidad**, cada eje de 1 a 5 (Facilidad 5 = trivial).

### 3.1 Issues críticos

| # | Hallazgo | Evidencia | I | C | F | Score |
|---|---|---|:-:|:-:|:-:|:-:|
| **C1** | **El campo de correo del newsletter es ilegible en modo claro.** `.newsletter` fija `color: var(--crema)` y `button, input… { color: inherit }` lo hereda; el `.input` tiene fondo blanco. **Ratio 1.15:1.** El usuario no ve lo que teclea en el único campo del objetivo 2. | `css/site.css:244` + `css/base.css:128`; contraste medido crema `rgb(239,239,232)` sobre `rgb(255,255,255)` | 5 | 5 | 5 | **125** |
| **C2** | **Menú fantasma secuestra los primeros ~110 px en móvil.** `.nav__links` es `position:fixed` con `translateY(-120%)`, pero `.header` tiene `backdrop-filter`, que lo convierte en bloque contenedor: el panel no se esconde del todo. Queda de y=−92 a y=+110, **visible y con `pointer-events:auto`**. `elementFromPoint` sobre el enlace «Conoce nuestras sedes» devuelve `LI "Proveedores"`. **Tocar (195,40) en la portada navega a `/trabaja`.** | `css/site.css:377-391` + `css/site.css:26`; navegación verificada: `antes=/` → `después=/trabaja` | 5 | 5 | 4 | **100** |
| **C3** | **Cero medición.** Ningún evento, ninguna etiqueta, en ninguna página. Ningún objetivo del negocio es observable. | `grep` sin resultados sobre `*.html`/`*.js` | 5 | 5 | 4 | **100** |
| **C4** | **En móvil no hay ningún CTA persistente.** `.btn--nav` («Ver tiendas») tiene `display:none` por debajo del breakpoint y el FAB de WhatsApp se **elimina del DOM** porque `WHATSAPP_NUMBER` está vacío. Comprobado: `document.querySelector('#waFab')` → `null`. En 19,8 pantallas de scroll no hay una sola acción fija. | `css/site.css:395`; `js/config.js`; `js/ui.js` `initWhatsApp()` | 4 | 5 | 4 | **80** |
| **C5** | **`[PENDIENTE: …]` visibles en `/privacidad`**, justo donde va el usuario antes de entregar correo o DNI. 2 líneas renderizadas. | `privacidad.html:64` y `:117`, verificado en el DOM | 4 | 5 | 3 | **60** |
| **C6** | **Cero fotografía real.** 17 marcadores: hero, 4 categorías, 12 tiendas. Sin producto y sin local, la promesa «70 % de descuento en marcas originales» no tiene ninguna prueba. | `index.html:130-135`, `:163-185`; `/api/stores`: los 12 con `photo: null` | 5 | 5 | 2 | **50** |

### 3.2 Quick wins

| # | Hallazgo | Evidencia | I | C | F | Score |
|---|---|---|:-:|:-:|:-:|:-:|
| Q1 | **La casilla de consentimiento está debajo del botón** del newsletter: el primer intento falla siempre. Reordenar (casilla antes del botón). | `index.html:351-359`; comprobado: «Necesitamos tu autorización…» | 4 | 5 | 5 | **100** |
| Q14 | **El hero se contradice sobre la garantía.** El párrafo promete «con garantía de autenticidad» y el recuadro contiguo dice «Revisa la prenda en tienda antes de llevártela». La promesa sigue además en `meta description` y `og:description`. Hay que fijar una sola posición en los cuatro sitios. | `index.html:113` vs `:145-148`; `:8`, `:16` | 4 | 5 | 5 | **100** |
| Q2 | **Errores de uno en uno, sin foco y sin `aria-invalid`.** Validar todo de golpe, marcar los campos y llevar el foco al primero con problema. | `js/trabaja.js:49-60`, `js/site.js`; verificado: `activeElement=BUTTON`, `aria-invalid=null` en los 5 campos | 4 | 5 | 4 | **80** |
| Q3 | **Las 4 tarjetas de categoría van todas a `#tiendas`.** Prometen cuatro destinos, entregan uno. | `index.html:163, 169, 175, 181` | 3 | 5 | 5 | **75** |
| Q4 | **«Cómo llegar» abre una búsqueda de Maps, no una ruta.** Cambiar a `maps/dir/?api=1&destination=…` quita dos pasos justo en el objetivo 1. | `js/site.js` `mapsUrl()` | 4 | 4 | 4 | **64** |
| Q5 | **La casilla del newsletter está fuera del `<form>` y no se limpia tras enviar** (sigue marcada). | `index.html:355` vs `:357`; comprobado tras envío correcto | 3 | 5 | 4 | **60** |
| Q6 | **«60 marcas» en el hero vs 24 en el carrusel.** Ajustar el número o cargar las 60. | `index.html:122` vs `/api/brands` (24 únicas) | 3 | 5 | 4 | **60** |
| Q7 | **Contrastes por debajo de AA en texto pequeño:** barra de aviso **2.93:1**, consentimiento del newsletter **2.64:1**, mensaje de error del newsletter **2.73:1**, *eyebrow* **2.93:1**. El mensaje de error es, además, el texto que **más** necesita leerse. | medición de contraste sobre el DOM computado; `css/site.css:249-252` | 3 | 5 | 4 | **60** |
| Q8 | **Casillas de consentimiento de 19×19 px**, por debajo del mínimo de 24×24 de WCAG 2.2 y muy lejos de los 44 px de zona táctil cómoda — y son la **puerta obligatoria** de los tres formularios. | medición de `#nlConsent`, `#ctConsent`, `#jobConsent` | 3 | 5 | 4 | **60** |
| Q9 | **El menú abierto no bloquea el scroll y queda fuera del orden de tabulación.** Con el menú abierto la página se desplaza detrás (scrollY 596). Al tabular desde la hamburguesa el foco salta a «Encuentra tu tienda»: el `<ul>` está **antes** del botón en el DOM, así que los enlaces del menú son inalcanzables hacia delante. | verificado con teclado; `index.html:74-91` | 3 | 5 | 4 | **60** |
| Q10 | **Sin confirmación real tras postular ni aviso a RR. HH.** Una línea de texto, *toast* de 3,2 s y nada más. Sin correo de acuse, sin plazo, sin referencia. | `js/trabaja.js`; sin cliente SMTP en el proyecto | 4 | 5 | 3 | **60** |
| Q11 | **El CTA del encabezado en `/trabaja` es «Volver al inicio»**: en la página del objetivo 3, el botón destacado saca al usuario. | `trabaja.html:55` | 3 | 4 | 5 | **60** |
| Q12 | **Ningún teléfono**: ni central (comentado en el HTML) ni por tienda (no existe la columna). El único canal síncrono posible, WhatsApp, está desactivado. | `index.html:377-382`; `server/db.js:71-82`; `js/config.js` | 4 | 5 | 3 | **60** |
| Q13 | **Proveedores sólo por `mailto:`**, sin formulario alternativo, sin decir qué enviar ni en cuánto se responde. Un `mailto:` además es inmedible por definición. | `index.html:329-336` | 2 | 5 | 4 | **40** |

### 3.3 Cambios estructurales

| # | Hallazgo | Evidencia | I | C | F | Score |
|---|---|---|:-:|:-:|:-:|:-:|
| E1 | **La lista de 12 tiendas no ayuda a decidir.** 7,1 pantallas de scroll, 36 % de la portada, sin filtro por ciudad, sin buscador, sin orden por cercanía y con 12 fichas indistinguibles (mismo horario, misma imagen ausente). Necesita filtro por ciudad, teléfono por tienda y ficha propia por sede. | medición de posiciones; `/api/stores`; `index.html:204-206` | 5 | 5 | 2 | **50** |
| E2 | **`/trabaja` no publica vacantes.** Sin puesto, sin sede con vacante abierta, sin rango, sin plazos, sin «qué pasa después». Y el formulario pide **DNI** sin explicar por qué mientras deja el CV/experiencia como opcional. | `trabaja.html:117-180`; `/api/stores` completo en el `select` | 4 | 4 | 3 | **48** |
| E3 | **La portada intenta cuatro objetivos en 19,8 pantallas** y deja los tres últimos a partir del 79 % de profundidad: proveedores 79,5 %, newsletter 83,1 %, contacto 86,7 %. Newsletter y contacto compiten pegados el uno al otro. | posiciones medidas en 390×844 | 4 | 4 | 2 | **32** |
| E4 | **El newsletter no captura lo que promete.** Promete «campañas en tu ciudad» y no pregunta la ciudad; la BD no guarda consentimiento, origen ni token de baja, pese a que la política promete que se podrá dar de baja. | `index.html:345-361`; `server/db.js:43-48`; `privacidad.html:110-113` | 3 | 5 | 3 | **45** |
| E5 | **Testimonios sin respaldo** («Carlos R.», «María S.», «Luis A.», sin foto ni fuente). O se verifican y se atribuyen, o restan confianza. | `index.html:298, 303, 308` | 3 | 4 | 3 | **36** |
| E6 | **Sin datos estructurados por tienda.** Sólo hay `Organization`; no hay `LocalBusiness`/`Store` para las 12 sedes, que es lo que alimenta el paquete local de Google. Afecta directamente al objetivo 1. → `search` | `index.html:37-53` | 4 | 4 | 3 | **48** |
| E7 | **Sin JS, la portada pierde marcas y formularios.** Las tiendas ya se resuelven en servidor (mejora reciente, correcta), pero el carrusel de marcas se elimina entero (`cont.remove()`) y los tres formularios dejan de enviar, sin ningún `noscript` que lo explique. | `grep -c brand-chip` sobre el HTML servido → 0; `js/site.js` `cargarMarcas()`; `grep -c noscript` → 0 | 2 | 5 | 3 | **30** |

### 3.4 Defecto de operación (fuera del recorrido público, pero afecta al objetivo 1)

- **Los huecos de imagen del panel no coinciden con el sitio.** `SLOTS` en
  `server/server.js:104-113` ofrece `look_ella`, `look_el` y `look_urbano`, que **no existen
  en ninguna página** (`grep 'data-slot'` sólo devuelve `hero_main` y los 4 `cat_*`): quien
  suba esas tres fotos las subirá al vacío. Además las proporciones no cuadran: el panel
  pide el hero «cuadrada 800×800 / ratio 1/1» y las categorías «horizontal 800×500 /
  16:10», pero **los cinco contenedores del HTML son `media--4x5`** (vertical). Toda foto
  que se suba se recortará mal. Con el sitio dependiendo por completo de que alguien suba
  fotos (C6), esto bloquea la solución del hallazgo más caro.

---

## 4. Lo que sí está bien (para no romperlo)

Lo digo sólo porque afecta a qué se puede tocar sin coste:

- Foco visible correcto y consistente: `outline: 3px solid rgb(0,140,255)` con `offset: 3px`.
- `prefers-reduced-motion` respetado de verdad (`css/base.css:583-591`), incluidos los
  contadores del hero (`js/site.js`).
- Todos los campos de los tres formularios tienen etiqueta asociada; `autocomplete` correcto
  salvo `jobDni` y `jobStore`.
- Los estados de error y vacío de tiendas y marcas están cubiertos (`js/site.js`
  `avisoTiendas()`, `js/trabaja.js` `sinTiendas()`): no hay secciones mudas.
- `reveal.js` tiene red de seguridad a 3 s: nada queda invisible.
- Jerarquía de encabezados correcta y un solo `h1` por página.
- Doble envío bloqueado (`submitOnce` en `js/ui.js`).
- Cero errores de consola propios (los tres que aparecen son el bloqueo de certificado de
  Google Fonts del entorno, no del sitio).

---

## 5. Tres experimentos propuestos

**Requisito previo innegociable:** ninguno es ejecutable hasta cerrar C3. Antes de medir
nada hace falta, como mínimo, este conjunto de eventos: `view_stores_section`,
`click_como_llegar` (con `tienda` y `ciudad`), `newsletter_view`, `newsletter_submit_attempt`,
`newsletter_error` (con `motivo`), `newsletter_success`, `job_form_start`, `job_field_error`
(con `campo`), `job_submit_success`, `click_proveedores_mailto`, `click_whatsapp`.

---

### Experimento 1 — Buscador de tienda por ciudad frente a lista de 12

- **Hipótesis.** Los 12 bloques idénticos de 458 px obligan a un trabajo de descarte que hoy
  nadie hace: quien busca su tienda en provincia tiene que pasar por las 8 de Lima. Si la
  primera pantalla de la sección permite elegir la ciudad y muestra sólo las tiendas de esa
  ciudad, subirá la proporción de visitantes que llegan a pulsar «Cómo llegar».
- **Cambio.** Variante B: sobre `#tiendas`, un selector de ciudad (Lima, Trujillo, Chiclayo,
  Tarapoto, Iquitos) que filtra la cuadrícula; por defecto, todas. Sin cambiar las fichas.
  Variante A: la lista actual.
- **Segmento.** Todo el tráfico que llega a ver `#tiendas`, con corte por móvil/escritorio y
  por ciudad declarada en el filtro.
- **Evento / KPI.** KPI primario: `click_como_llegar` / `view_stores_section`.
  Secundarios: profundidad de scroll dentro de la sección; tiempo hasta el primer
  `click_como_llegar`. Guardarraíl: `newsletter_success` no debe caer.
- **Criterio de éxito.** B gana si el KPI primario supera a A con significación al 95 % y el
  guardarraíl no empeora. Duración mínima: dos ciclos semanales completos, porque el tráfico
  de una tienda física es estacional por día de semana. *(La duración exacta se fija con el
  volumen real una vez haya medición; no la estimo aquí porque no tengo la base.)*

### Experimento 2 — Consentimiento antes del botón y promesa concreta en el newsletter

- **Hipótesis.** Dos causas distintas se suman: la casilla está **debajo** del botón (fallo
  garantizado en el primer intento) y la promesa no dice qué llega ni cada cuánto. Corrigiendo
  el orden y concretando la promesa, subirá la suscripción efectiva.
- **Cambio.** Variante B: (1) la casilla de consentimiento pasa **encima** del botón y dentro
  del `<form>`; (2) el texto pasa a decir qué se recibe y con qué frecuencia —redacción a
  cargo de `copy`, sujeta a que la empresa confirme la frecuencia real **[VALIDAR]**;
  (3) se añade un selector de ciudad opcional para que la promesa «en tu ciudad» sea cierta.
- **Segmento.** Todo el tráfico que ve el bloque de newsletter. Corte por móvil/escritorio,
  donde espero la mayor diferencia porque el botón y la casilla están apilados.
- **Evento / KPI.** KPI primario: `newsletter_success` / `newsletter_view`.
  Diagnóstico: `newsletter_error` con `motivo="sin_consentimiento"` — debería caer a casi cero
  y es la prueba de que el mecanismo es el que creo.
- **Criterio de éxito.** B gana si el KPI primario supera a A con significación al 95 %.
  Si sube la suscripción pero **no** cae `motivo="sin_consentimiento"`, la hipótesis del
  orden era falsa y el mérito es de la promesa: hay que separar los dos cambios.

### Experimento 3 — Postulación en dos pasos, sin DNI en el primero

- **Hipótesis.** Pedir el DNI en el primer contacto, sin explicar para qué y sin que exista
  aún una relación, es lo que más abandono provoca en las 7 decisiones obligatorias del
  formulario. Moviéndolo a un segundo paso (o al momento de la entrevista) subirán las
  postulaciones completadas sin perder calidad de candidato.
- **Cambio.** Variante B, dos pasos: **paso 1** nombre, correo, celular, tienda (4 campos) +
  consentimiento → se guarda y se confirma; **paso 2**, opcional y en la misma pantalla de
  confirmación, jornada, estudios y experiencia. El DNI desaparece del sitio público. Si
  RR. HH. lo necesita de verdad, se pide por correo tras la preselección **[VALIDAR con
  RR. HH.]**. Variante A: el formulario actual.
- **Segmento.** Todo el tráfico de `/trabaja`, con corte por móvil (donde el formulario mide
  más de una pantalla) y por tienda elegida.
- **Evento / KPI.** KPI primario: `job_submit_success` / `job_form_start`.
  Diagnóstico: `job_field_error` por `campo`, para confirmar si el DNI es realmente donde se
  atascan. Guardarraíl de calidad: proporción de postulaciones que RR. HH. marca como
  contactables, medida sobre el módulo de postulaciones.
- **Criterio de éxito.** B gana si el KPI primario supera a A con significación al 95 % **y**
  el guardarraíl de calidad no cae más de un margen que RR. HH. debe fijar por adelantado
  **[VALIDAR]**. Más postulaciones inservibles no es una victoria.

---

## 6. Orden de trabajo recomendado

1. **Hoy** — C1 (color del campo), Q1 (orden de la casilla), Q3 (enlaces de categoría),
   Q6 (60 vs 24), Q11 (CTA de `/trabaja`), Q14 (contradicción de la garantía).
   Todo es CSS/HTML de bajo riesgo.
2. **Esta semana** — C2 (menú fantasma), C4 (CTA persistente en móvil + configurar
   WhatsApp), C5 (quitar los `[PENDIENTE]`), Q2 (validación), Q4 (ruta de Maps),
   Q5, Q7, Q8, Q9.
3. **Antes de publicar** — C3 (medición completa) y C6 (fotografía real), más el defecto de
   huecos de imagen de §3.4, que bloquea C6.
4. **Siguiente iteración** — E1, E2, E4 y luego los experimentos.

---

# Contrato de entrega

## Decisiones tomadas

1. **Priorizo con Impacto × Confianza × Facilidad y sitúo la medición (C3) entre los
   críticos**, aunque no sea un defecto visible para el usuario: sin ella ninguna otra
   corrección se puede validar y los tres experimentos son inejecutables.
2. **No propongo ninguna tasa base, benchmark ni duración de test en días.** El sitio no
   tiene instrumentación; cualquier cifra sería inventada. Los criterios de éxito se
   expresan como comparación entre variantes con significación, no como umbrales absolutos.
3. **Trato el menú fantasma (C2) y el contraste del campo de correo (C1) como defectos
   funcionales, no estéticos**, porque ambos se verificaron con comportamiento reproducible:
   una navegación real a `/trabaja` desde la barra de anuncio, y un ratio de contraste medido
   de 1.15:1.
4. **No toco el producto.** Todo lo accionable sale como `REQUEST_FOR_CHANGE`.
5. **No reporto las tipografías de Google**, bloqueadas por certificado en este entorno,
   según la instrucción recibida.
6. **Separo lo que funciona bien (§4)** para que las correcciones no lo rompan, sin usarlo
   como cortesía ni como compensación de los hallazgos.

## Evidencia utilizada

- Recorrido real con Chromium/Playwright sobre `http://localhost:3999` en 1440×900 y 390×844,
  con capturas revisadas visualmente de `/`, `/trabaja` y `/privacidad`, portada completa y
  secciones ampliadas.
- **Navegación verificada:** tocar (195,40) en la portada móvil lleva de `/` a `/trabaja`.
- **DOM computado:** `elementFromPoint` sobre la barra de anuncio → `LI "Proveedores"`;
  `#navLinks` con `position:fixed`, `transform: translateY(-243px)`, `opacity:1`,
  `pointer-events:auto`, rect y=−92 h=202,6.
- **Contraste calculado** sobre color y fondo efectivos: campo del newsletter 1.15:1;
  consentimiento 2.64:1; error del newsletter 2.73:1; barra de aviso 2.93:1; *eyebrow* 2.93:1.
- **Envíos reales** de los tres formularios: mensajes de error, foco resultante (`BUTTON`),
  `aria-invalid` (`null`), estado de la casilla tras un envío correcto (sigue marcada).
- **Mediciones:** portada móvil 16 692 px (19,8 pantallas); `#tiendas` a 4 199 px y
  `#nosotros` a 10 187 px; newsletter al 83,1 % y contacto al 86,7 % de profundidad;
  ficha de tienda 458 px; `#waFab` → `null`; `.btn--nav` → `display:none`.
- **API en vivo:** `/api/stores` (12 tiendas, `photo:null` en todas, horario idéntico),
  `/api/brands` (24 marcas únicas), `/api/images`.
- **Código:** `index.html`, `trabaja.html`, `privacidad.html`, `css/base.css`,
  `css/site.css`, `js/config.js`, `js/ui.js`, `js/site.js`, `js/trabaja.js`, `js/reveal.js`,
  `server/server.js`, `server/db.js`.
- **Búsquedas:** `grep` de analítica (0 resultados), de envío de correo (0 resultados),
  de `noscript` (0 resultados), de `data-slot` (5 huecos frente a 8 en el panel),
  de `brand-chip` en el HTML servido (0 resultados).
- **Reverificación tras los cambios de otro agente:** navegación (195,40) → `/trabaja`,
  contraste 1.15:1, `WHATSAPP_NUMBER` vacío, `translateY(-120%)`, los dos `[PENDIENTE]` y
  `jobDni` siguen todos presentes en el build vigente.

## Supuestos

1. Supongo que la portada del entorno de pruebas (12 tiendas y 24 marcas sembradas por
   `server/db.js`) refleja el contenido previsto en producción. Si en producción hubiera 60
   marcas cargadas, el hallazgo Q6 desaparece; el resto no cambia.
2. Supongo que `WHATSAPP_NUMBER` está vacío porque el número aún no se ha decidido, no porque
   se haya descartado WhatsApp como canal.
3. Supongo que el público principal llega por móvil, por el perfil del negocio (retail de
   calle en Perú, difusión por Instagram y WhatsApp). **No tengo datos que lo confirmen** —
   precisamente por C3 — y por eso todos los hallazgos están verificados también en 1440 px.
4. Supongo que la ausencia de correo de acuse es una decisión de alcance pendiente y no un
   fallo, pero la reporto porque afecta al objetivo 3.

## Información faltante

1. **Fotografía real de las 12 tiendas, del hero y de las 4 categorías.** Debe aportarla la
   empresa (marketing/operaciones de tienda). Bloquea C6, que es el mayor problema de
   confianza del sitio, y condiciona E1.
2. **Número de WhatsApp de atención.** Debe confirmarlo la empresa. Afecta a C4, Q12 y a la
   utilidad de cada ficha de tienda.
3. **Razón social, RUC, domicilio fiscal y plazo de conservación de postulaciones.** Debe
   confirmarlo la empresa y revisarlo un abogado. Bloquea C5 y la validez legal de la página.
4. **Teléfono de central y teléfono por tienda.** Debe confirmarlo la empresa. Afecta a Q12.
5. **¿Hay vacantes reales y en qué sedes? ¿Qué puestos? ¿Se puede publicar un rango
   salarial? ¿Cuál es el plazo de respuesta?** Debe confirmarlo RR. HH. Bloquea E2 y el
   experimento 3.
6. **¿RR. HH. necesita realmente el DNI en el primer contacto?** Debe confirmarlo RR. HH.
   Determina si el experimento 3 es viable tal como está planteado.
7. **Frecuencia real de envío del newsletter y quién lo opera.** Debe confirmarlo marketing.
   Bloquea el experimento 2: no se puede prometer una cadencia que nadie va a sostener.
8. **¿Los tres testimonios son de personas reales y autorizadas?** Debe confirmarlo
   marketing. Determina si E5 es «verificar y atribuir» o «retirar».
9. **¿Qué herramienta de analítica se va a usar?** Debe decidirlo la empresa con `launch`.
   Bloquea C3 y los tres experimentos.

## Riesgos identificados

1. **Publicar con `[PENDIENTE: RUC]` visible** — probabilidad alta si no se corrige antes del
   lanzamiento, impacto alto: incumple la Ley 29733 y destruye la confianza en el punto exacto
   donde se pide el consentimiento. *Mitigación:* bloquear el lanzamiento hasta tener los
   datos, o sustituir la sección por un aviso honesto de política en preparación.
2. **Publicar sin medición** — probabilidad alta, impacto alto: se invierte en un rediseño
   cuyo efecto nadie podrá demostrar, y las siguientes decisiones se tomarán por opinión.
   *Mitigación:* C3 como requisito de lanzamiento, no como tarea posterior.
3. **Recoger DNI sin base probatoria de consentimiento** — probabilidad media, impacto alto:
   ni `subscribers` ni `job_applications` guardan el consentimiento, su texto ni su fecha, y
   no hay mecanismo de baja pese a que la política lo promete. *Mitigación:* añadir columnas
   de consentimiento, versión de texto, fecha y token de baja antes de recibir tráfico real.
4. **Lanzar sin fotografía** — probabilidad media, impacto alto: la promesa de descuento no
   tiene prueba y las 12 tiendas son indistinguibles. *Mitigación:* mínimo viable de una foto
   real de fachada por tienda antes de publicar; el hero puede esperar.
5. **Corregir C2 tocando sólo el `translateY`** — probabilidad media, impacto medio: la causa
   es el `backdrop-filter` del encabezado, que crea bloque contenedor. Un ajuste del
   porcentaje se romperá en cuanto cambie el número de elementos del menú. *Mitigación:*
   arreglar el mecanismo (`visibility:hidden` + `pointer-events:none` en estado cerrado, o
   sacar el panel del encabezado), no el número.
6. **Edición concurrente del producto** — probabilidad alta, impacto medio: `index.html`,
   `js/site.js` y `server/server.js` cambiaron durante esta auditoría y ya generaron una
   incoherencia nueva (Q14: se retiró la garantía del recuadro pero no del párrafo ni de los
   metadatos). *Mitigación:* que el agente principal secuencie las correcciones y que cada
   cambio de promesa se aplique en **todas** sus apariciones, incluidos `meta description`,
   `og:description` y el JSON-LD.
7. **Que las correcciones de accesibilidad rompan lo que ya funciona** — probabilidad baja,
   impacto medio: el foco visible, `prefers-reduced-motion` y las etiquetas están bien
   resueltos hoy. *Mitigación:* §4 lista lo que no se debe tocar.

## Cambios solicitados a otros agentes

- **`REQUEST_FOR_CHANGE → dev` (crítico, C1):** el campo de correo del newsletter hereda
  `color: var(--crema)` de `css/site.css:244` vía `css/base.css:128` y queda a **1.15:1**
  sobre fondo blanco. *Evidencia:* contraste medido sobre el DOM computado.
  *Efecto esperado:* el usuario ve lo que escribe en el único campo del objetivo 2.
- **`REQUEST_FOR_CHANGE → dev` (crítico, C2):** `.nav__links` cerrado sigue visible y clicable
  en los primeros ~110 px en móvil, porque `.header` tiene `backdrop-filter` y actúa como
  bloque contenedor del `position:fixed` (`css/site.css:26` y `:377-391`). *Evidencia:*
  `elementFromPoint` devuelve enlaces del menú sobre la barra de anuncio; tocar (195,40)
  navega de `/` a `/trabaja`. *Efecto esperado:* se recupera la barra de anuncio y se elimina
  la navegación accidental en la primera pantalla móvil. **Corregir el mecanismo, no el
  porcentaje** (ver riesgo 5).
- **`REQUEST_FOR_CHANGE → dev` (crítico, C3):** instrumentar los eventos listados en §5.
  *Evidencia:* `grep` de analítica sin resultados. *Efecto esperado:* los cuatro objetivos
  pasan a ser observables y los experimentos, ejecutables.
- **`REQUEST_FOR_CHANGE → dev` (crítico, C4):** en móvil no queda ningún CTA persistente
  (`.btn--nav` oculto y `#waFab` eliminado por `WHATSAPP_NUMBER` vacío). *Efecto esperado:*
  una acción alcanzable en cualquier punto de 19,8 pantallas de scroll.
- **`REQUEST_FOR_CHANGE → dev` (Q1, Q5):** mover la casilla de consentimiento del newsletter
  **dentro** del `<form>` y **encima** del botón (`index.html:351-359`). *Evidencia:* primer
  intento fallido reproducible; la casilla sigue marcada tras un envío correcto.
- **`REQUEST_FOR_CHANGE → dev` (Q2):** validar todos los campos de golpe, marcar los erróneos
  con `aria-invalid` y llevar el foco al primero con problema, en los tres formularios.
  *Evidencia:* `activeElement=BUTTON`, `aria-invalid=null` en los 5 campos comprobados.
- **`REQUEST_FOR_CHANGE → dev` (Q4):** `mapsUrl()` debe generar
  `maps/dir/?api=1&destination=…` en lugar de `maps/search/`. *Efecto esperado:* dos pasos
  menos en el objetivo 1.
- **`REQUEST_FOR_CHANGE → dev` (Q7, Q8):** subir a AA los cuatro textos citados y llevar las
  casillas de consentimiento a 24×24 px como mínimo.
- **`REQUEST_FOR_CHANGE → dev` (Q9):** bloquear el scroll del cuerpo con el menú abierto y
  corregir el orden de tabulación (el `<ul>` precede al botón, así que los enlaces del menú
  abierto son inalcanzables tabulando hacia delante).
- **`REQUEST_FOR_CHANGE → dev` (§3.4):** alinear `SLOTS` de `server/server.js:104-113` con
  los `data-slot` reales (`look_ella`, `look_el` y `look_urbano` no existen en ninguna página)
  y hacer coincidir las proporciones anunciadas con las de los contenedores, que son todos
  `media--4x5`. *Efecto esperado:* que las fotos que resuelven C6 se puedan subir y se vean
  bien recortadas.
- **`REQUEST_FOR_CHANGE → aria` (E1, E3):** la sección de tiendas necesita filtro por ciudad
  y ficha por sede; la portada apila cuatro objetivos en 19,8 pantallas con tres de ellos
  por debajo del 79 % de profundidad. *Evidencia:* posiciones y alturas medidas.
- **`REQUEST_FOR_CHANGE → hero` (C6, Q3, Q6):** el hero se apoya en un marcador
  `FOTO DE PORTADA`, declara «60 marcas» frente a las 24 que muestra el carrusel, y su CTA
  secundario «Ver categorías» entra en un bucle porque las cuatro tarjetas vuelven a
  `#tiendas`.
- **`REQUEST_FOR_CHANGE → copy` (Q14, prioritario):** el hero promete «con garantía de
  autenticidad» (`index.html:113`) mientras el recuadro contiguo dice «Revisa la prenda en
  tienda antes de llevártela» (`:145-148`); la promesa persiste en `meta description` y
  `og:description` (`:8`, `:16`). *Evidencia:* ambos textos conviven en el mismo pliegue del
  HTML servido. *Efecto esperado:* una sola posición sobre la garantía, coherente en las
  cuatro apariciones. Requiere antes saber si la política de garantía existe **[VALIDAR con
  la empresa]**.
- **`REQUEST_FOR_CHANGE → copy` (E2, E4, E5):** la promesa del newsletter ofrece «campañas en
  tu ciudad» sin pedir la ciudad, no dice qué llega ni cada cuánto; los tres testimonios no
  tienen respaldo verificable; `/trabaja` no responde a «¿hay vacante?, ¿qué puesto?,
  ¿cuándo me contestan?», ni explica por qué se pide el DNI.
- **`REQUEST_FOR_CHANGE → search` (E6):** añadir `LocalBusiness`/`Store` por sede; hoy sólo
  existe `Organization` (`index.html:37-53`), lo que deja fuera el paquete local de Google,
  que es el canal natural del objetivo 1.
- **`REQUEST_FOR_CHANGE → launch` (C3):** elegir herramienta de analítica y plan de medición
  antes de publicar; el plan de 30 días depende por completo de que los eventos de §5 existan
  desde el primer día.

## Output para el siguiente agente

**Archivos que debe leer:**
- Este documento, empezando por §0 y §3.1.
- `css/site.css:26`, `:244-253`, `:377-396` · `css/base.css:128`, `:583-591`
- `index.html:59-65`, `:74-93`, `:113`, `:122`, `:130-135`, `:145-148`, `:163-185`,
  `:298-308`, `:329-336`, `:345-361`, `:377-382`, `:484`
- `trabaja.html:55`, `:117-180` · `privacidad.html:64`, `:117`
- `js/config.js` · `js/ui.js` (`initWhatsApp`, `submitOnce`) · `js/site.js` (`mapsUrl`,
  `cargarTiendas`) · `js/trabaja.js:40-70`
- `server/server.js:104-113` (huecos de imagen) · `server/db.js:43-48`, `:71-82`, `:114-128`

**Decisiones que debe respetar:**
- La arquitectura vigente (HTML/CSS/JS sin framework, Express, SQLite) no se toca.
- La promesa «Mejores marcas, mejores precios» y la identidad de marca se conservan: ningún
  hallazgo de este informe pide cambiarlas.
- Lo listado en §4 funciona bien y no debe romperse al corregir: foco visible,
  `prefers-reduced-motion`, etiquetas de formulario, estados de error y vacío, bloqueo de
  doble envío.
- C2 se corrige en el mecanismo, no ajustando el `translateY`.
- Ningún dato marcado `[VALIDAR]` o `[PENDIENTE]` se rellena inventándolo: se pide a quien
  corresponde en §«Información faltante».

**Preguntas que siguen abiertas:**
1. ¿Se lanza sin fotografía real, o el lanzamiento espera al material? Es la decisión que más
   condiciona el resto del plan.
2. ¿Quién y cuándo aporta razón social, RUC, domicilio fiscal y plazo de conservación? Sin
   eso, `/privacidad` no puede publicarse.
3. ¿Qué herramienta de analítica se instala y quién la configura?
4. ¿WhatsApp entra como canal de atención? De ello dependen C4, Q12 y la utilidad de las 12
   fichas de tienda.
5. ¿RR. HH. acepta quitar el DNI del formulario público y pedirlo tras la preselección?
6. ¿Los tres testimonios se verifican y se atribuyen, o se retiran?
