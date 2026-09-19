# SITE_BLUEPRINT — Web Lukers

**Agente:** `aria` (dirección creativa, estrategia y arquitectura UI)
**Fecha:** 19 de septiembre de 2026
**Alcance de este documento:** **estructura y sistema**. No define mensaje,
claims ni narrativa de marca.

---

## 0. Advertencia de partida, que condiciona todo lo que sigue

Este documento **no usa como hecho ningún contenido del repositorio sobre
Lukers**. Según `docs/PLAN-REDISENO.md` y `docs/DECISIONES.md:§6`, el contenido
de esta maqueta —las 12 tiendas y sus direcciones, la lista de 24 marcas, los
tres testimonios, la línea de tiempo que arranca en 2001 y las cifras de
portada— **fue inventado por sesiones de IA anteriores sobre una empresa real**.
El propio código lo advierte (`server/db.js:12-26`).

Por eso este blueprint define **el plano del edificio, no lo que se cuelga en
las paredes**. Cada vez que una decisión necesita un dato que Lukers no ha
entregado, aparece marcado así:

> `[PENDIENTE DE LUKERS: <la pregunta exacta>]`

Además, cada bloque de §4 declara si su contenido existe o está pendiente, y
§11 reúne las 28 preguntas concretas que hay que responder. Prefiero declarar
los huecos a rellenarlos.

### 0.1 Lo que sí damos por bueno

Procede de `docs/HALLAZGOS-WEB-PUBLICA.md`, que lo obtuvo de fuentes públicas.
**Sigue necesitando confirmación de Lukers antes de publicarse**, pero es
suficientemente fiable para *decidir arquitectura*:

| Hecho | Fuente | Qué decide en este documento |
|---|---|---|
| Cadena peruana de tiendas **físicas**; no vende online | HALLAZGOS §1, §11 | Toda la arquitectura gira en torno a la visita física |
| Tiendas en **Lima** (varios distritos), **Trujillo, Chiclayo, Tarapoto, Iquitos** | HALLAZGOS §1 | Justifica el árbol `/tiendas/<ciudad>/<sede>` |
| Número de sedes **sin confirmar** (una publicación dice 7; la maqueta, 12) | HALLAZGOS §13 | La arquitectura no puede depender de un número fijo |
| Horario **10:00–22:00 todos los días** | HALLAZGOS §6 | Componente de estado «Abierto ahora» |
| Instagram `@lukers.pe`, **143 000 seguidores**; Facebook, TikTok y Threads | HALLAZGOS §5, §12 | Sustituye a los testimonios inventados como prueba social |
| Antes se llamaba **«Remate de Fábrica»** | HALLAZGOS §2 | Da contenido real a `/nosotros` |
| Precio de entrada mencionado: **desde S/ 9.90** | HALLAZGOS §4 | Dato de portada, si Lukers lo confirma |
| Existe catálogo aparte en `lukers.kyte.site` | HALLAZGOS §11 | Decisión de enlace externo, §6.7 |
| Existe ya una página de **Libro de Reclamaciones** | HALLAZGOS §10 | No se reconstruye: se enlaza |

### 0.2 Objetivos de negocio, en el orden declarado por el dueño

1. **Que la gente vaya a las tiendas físicas.** Es el objetivo principal.
2. Captar suscriptores para novedades.
3. Recibir postulaciones de trabajo para tienda.
4. Una sección **pequeña** para proveedores.

Esta jerarquía es la regla de desempate de todo el documento. Cuando dos
bloques compiten por el mismo espacio, gana el que sirve al objetivo 1.
Cuando un bloque no sirve a ninguno de los cuatro, no existe.

### 0.3 Lo que se conserva porque ya funciona

Examinado antes de proponer nada:

- **Sistema de diseño** `css/base.css` (612 líneas) y `css/site.css` (449):
  tokens de marca (`base.css:13-81`), escala de espaciado base 8
  (`base.css:47-57`), escala tipográfica (`base.css:146-190`), botones
  (`base.css:223-278`), formularios (`base.css:436-541`), el brillo ✦ dibujado
  en CSS con la construcción del manual (`base.css:285-349`), sistema de imagen
  con proporción fija y hueco de marca (`base.css:358-411`), tema negativo
  crema-sobre-azul (`base.css:84-98`).
- **Servidor Express + SQLite de Node**, panel de administración, formularios
  de newsletter, postulación y contacto (`server/server.js`, `server/db.js`).
- **Prácticas ya resueltas**: foco visible innegociable (`base.css:130-139`),
  `prefers-reduced-motion` (`base.css:596-604`), red de seguridad del reveal
  (`js/reveal.js:42-44`), `skip-link` (`base.css:569-582`).

**No se propone migrar a ningún framework.** Todo lo que sigue se puede
construir con HTML, CSS, JavaScript sin framework, Express y SQLite.

---

## 1. Audiencias y tareas

No hay investigación de usuarios en el repositorio y **no la voy a inventar**.
Lo que sigue se deriva de los cuatro objetivos declarados y del hecho de que
el negocio es físico. Es una **hipótesis de trabajo**, no un hallazgo.

| # | Audiencia | Tarea que trae a la web | Qué necesita en menos de 30 s | Objetivo que sirve |
|---|---|---|---|---|
| A1 | Comprador que ya conoce Lukers (viene de Instagram o del boca a boca) | Saber **dónde está la tienda más cercana y si está abierta** | Dirección exacta, horario, «Cómo llegar» | 1 |
| A2 | Comprador que **no** conoce Lukers (llega por búsqueda local o por un anuncio) | Entender **qué es** y si merece el viaje | Qué se vende, a qué precio de entrada, que son marcas originales | 1 |
| A3 | Comprador que duda | Saber si **venden online**, si hacen cambios, qué tallas, si aceptan Yape | Respuestas en una página, sin escribir a nadie | 1 (evita el viaje inútil y la consulta inútil) |
| A4 | Candidata o candidato a trabajar en tienda | Postular rápido, desde el móvil | Qué puestos, en qué sede, formulario corto | 3 |
| A5 | Proveedor o marca | A quién escribir y qué enviar | Un correo y un criterio | 4 |
| A6 | Seguidor de la marca | Enterarse de aperturas y novedades | Un campo de correo y una promesa concreta | 2 |

**Nota sobre A2 y A3:** ambas están hoy sin resolver en la maqueta. `CRO_AUDIT.md:60-85`
midió que la comprensión en los primeros segundos falla, y `PLAN-REDISENO.md`
fase 2 identifica las preguntas frecuentes reales como contenido ausente.

### 1.1 Los primeros tres segundos

Lo que un visitante debe entender **antes de hacer scroll**, en este orden:

1. **Qué es esto**: una cadena peruana de tiendas de ropa de marca.
2. **Dónde**: hay una tienda cerca, y puedo verla ahora mismo.
3. **Por qué merece la pena**: la razón concreta, verificable, por la que
   vale la pena ir.

El punto 3 es el único que no puedo escribir, porque depende de datos.

> `[PENDIENTE DE LUKERS: ¿cuál es la razón verificable, en una frase, por la
> que alguien debería ir a una tienda Lukers en vez de a otra tienda? Necesito
> el hecho, no el eslogan: precio de entrada, procedencia de la mercancía,
> rotación de stock, garantía, lo que sea, pero comprobable.]` → decide el
> hero, la meta description y la promesa de portada. Lo responde el dueño.

Lo que **no** debe intentar decirse en esos tres segundos: la historia de la
empresa, los valores, el número de marcas y ninguna cifra sin verificar.

---

## 2. Inventario de páginas

Regla que he aplicado: **si no puedo escribir para qué sirve una página, no
existe.** Cada fila tiene objetivo, audiencia y acción prioritaria; las que no
la tenían están en §2.3, descartadas y con motivo.

### 2.1 Nivel 1 — el sitio mínimo publicable

| URL | Página | Objetivo (negocio) | Audiencia | Acción prioritaria | Estado del contenido |
|---|---|---|---|---|---|
| `/` | Portada | 1 · derivar a la sede correcta en el menor número de pasos | A1, A2, A6 | Pulsar «Encuentra tu tienda» o elegir ciudad | **Pendiente entero** |
| `/tiendas/` | Índice de tiendas | 1 · orientar por ciudad y recoger las búsquedas de marca + «tiendas» | A1, A2 | Elegir ciudad o sede | Pendiente (datos reales) |
| `/tiendas/<ciudad>/` | Página de ciudad (solo si hay ≥2 sedes) | 1 · ganar «tiendas de ropa en <ciudad>» | A1, A2 | Elegir sede | Pendiente |
| `/tiendas/<ciudad>/<sede>/` | Ficha de sede | 1 · **la página que convierte**: dirección, horario, cómo llegar | A1 | Pulsar «Cómo llegar» | Pendiente |
| `/trabaja` | Trabaja con nosotros | 3 | A4 | Enviar postulación | Parcial: el formulario existe (`trabaja.html:116-181`); el texto está sin verificar |
| `/contacto` | Contacto y preguntas frecuentes | 1 y 3 · resolver dudas sin gastar un viaje ni una llamada | A3, A5 | Resolver la duda; si no, escribir | Pendiente |
| `/privacidad` | Política de privacidad | Obligación legal (Ley 29733) | Todas | Leer | Borrador con huecos (`docs/DECISIONES.md:§3`) |
| *(externa)* | Libro de Reclamaciones | Obligación legal (INDECOPI) | Todas | Presentar reclamo | **Ya existe en el sitio real**; se enlaza, no se reconstruye |
| `/404` | Página no encontrada | Recuperar al visitante perdido | Todas | Volver a `/tiendas/` | Existe (`404.html`) |

### 2.2 Nivel 2 — se construyen cuando exista el contenido que las justifica

| URL | Página | Objetivo | Por qué no va en el nivel 1 | Condición de existencia |
|---|---|---|---|---|
| `/nosotros` | Institucional | 1 (confianza) y 3 | Hoy su único contenido sería la línea de tiempo inventada | Que Lukers cuente la historia real (Remate de Fábrica → Lukers) |
| `/marcas` | Marcas que encuentras | 1 · captar «dónde comprar <marca> en Perú» | La lista de 24 marcas del repositorio es inventada; publicar marcas ajenas sin base es un riesgo legal | Lista verificada **y** revisión de uso de marcas de terceros |
| `/preguntas-frecuentes` | FAQ propia | 1 | Mientras sean pocas, viven dentro de `/contacto` | Que superen 8 preguntas reales |
| `/proveedores` | Proveedores | 4 | Es el objetivo de menor prioridad y no debe robar espacio a la portada | Que exista un proceso real de recepción de propuestas |
| `/tiendas/<ciudad>/<sede>/` en estado «próxima apertura» | Ficha previa a la inauguración | 1 y 2 | — | Que haya una apertura confirmada |

### 2.3 Páginas que NO deben existir, y por qué

| Candidata | Motivo del descarte |
|---|---|
| `/novedades`, `/blog` | No hay quien lo mantenga ni contenido comprometido. Un blog abandonado es una señal de sitio muerto. El objetivo 2 se resuelve con un módulo de suscripción, no con una página. |
| `/catalogo`, ficha de producto, carrito | **Lukers no vende online** (HALLAZGOS §1). Una ficha de producto promete una compra que el negocio no puede cumplir. |
| `/testimonios` | Los tres testimonios del repositorio están sin origen conocido (`docs/DECISIONES.md:§2`). La prueba social real —143 000 seguidores y reseñas de Google— es un módulo, no una página. |
| `/ofertas` o «hasta 70%» como página | «Hasta 70% de descuento» no tiene precio de referencia documentado y en Perú INDECOPI exige poder sustentarlo (`docs/DECISIONES.md:§2`). |
| Páginas por categoría (`/hombre`, `/mujer`, `/calzado`) | Sin venta online y sin stock por sede, serían páginas sin contenido propio que competirían con las fichas de sede. Reconsiderar solo si algún día hay stock por tienda. |
| Landing por marca (`/marcas/levis`) | Contenido casi idéntico entre sí y riesgo de uso indebido de marcas de terceros. |

### 2.4 Páginas internas (fuera del sitemap, `noindex`)

`/admin` y `/postulaciones` ya existen y ya están excluidas
(`server/server.js:454,458` y `robots.txt` en `:488-504`). **No se tocan.**

---

## 3. LA DECISIÓN DE ARQUITECTURA: de una página con anclas a un directorio de sedes

Es la decisión que condiciona todo el SEO local y es donde está el objetivo 1.
Le dedico el espacio que merece.

### 3.1 El problema, con evidencia

Hoy las sedes viven **todas dentro del ancla `/#tiendas`** de la portada
(`index.html:196-205`, tarjetas inyectadas por `server/server.js:356-380`).
El `sitemap.xml` declara **tres URL** en total (`server/server.js:466-487`):
`/`, `/trabaja` y `/privacidad`.

Un ancla `#` no es una URL indexable. Consecuencias verificables:

1. **Una sola página compite por N mercados locales.** «tiendas de ropa en
   Trujillo», «ropa de marca Iquitos» y «Lukers San Miguel» son intenciones
   distintas, con competidores distintos, y una portada no puede servirlas
   todas. Ya lo señaló `search` en `SEO_TECH_AUDIT.md:300-347` (hallazgo A1).
2. **No hay destino para la ficha de Google Business Profile.** El plan de SEO
   local (`PLAN-REDISENO.md` fase 6) pide una ficha por tienda enlazada a «su»
   página. Hoy todas tendrían que apuntar a `/#tiendas`, que es la misma URL
   para las N sedes: se desperdicia la señal más valiosa del negocio.
3. **No hay dónde poner el contenido que de verdad convierte**: referencias
   para llegar, foto de la fachada, mapa, excepciones de horario. En una
   tarjeta de una cuadrícula no caben.
4. **La portada se hace enorme.** `CRO_AUDIT.md:248-259` midió 19,8 pantallas
   con cuatro objetivos apilados y tres de ellos por debajo del 79 % de
   profundidad de scroll.

### 3.2 La decisión: **las dos cosas, pero con una regla que impide páginas vacías**

> **Se construyen páginas por ciudad Y páginas por sede, con esta regla:
> una ciudad tiene página de ciudad propia solo cuando tiene dos o más sedes.
> Si tiene una sola, la página de la ciudad *es* la página de esa sede.**

**Por qué las dos y no una.** Son intenciones de búsqueda distintas y ninguna
sustituye a la otra: quien busca «tiendas de ropa de marca en Chiclayo» quiere
elegir; quien busca «Lukers San Miguel» quiere una dirección y un horario. Con
solo páginas de ciudad, en Lima se apilarían varios distritos en un documento
y ninguno tendría fuerza propia. Con solo páginas de sede, no habría dónde
colocar «Lukers en Lima» ni un punto de entrada para quien no sabe qué distrito
le queda cerca.

**Por qué la regla del umbral.** Una página de ciudad con una sola sede y una
ficha de esa sede contienen exactamente la misma información: misma dirección,
mismo horario, misma foto. Son dos documentos casi idénticos compitiendo entre
sí. En vez de inventar texto de relleno para diferenciarlas —que es
exactamente lo que este proyecto no puede permitirse— **se publica una sola
página** que hace los dos trabajos.

### 3.3 El esquema de URL

```
/tiendas/                              índice · todas las sedes agrupadas por ciudad
/tiendas/<ciudad>/                     ciudad con ≥2 sedes → concentrador
/tiendas/<ciudad>/<sede>/              una sede de esa ciudad
/tiendas/<ciudad>/                     ciudad con 1 sede → ES la ficha de esa sede
```

Ejemplos de forma (los nombres de sede son **ilustrativos**, no datos de
Lukers):

```
/tiendas/
/tiendas/lima/                         concentrador (varias sedes)
/tiendas/lima/<distrito>/              ficha de sede
/tiendas/trujillo/                     ficha de sede única + contexto de ciudad
```

**Reglas de construcción del slug** (para `dev`):

1. Minúsculas, ASCII, guiones. Sin tildes ni `ñ` (`ñ` → `n`), sin artículos
   sobrantes, sin `lukers-` repetido en el slug.
2. El slug de ciudad es el nombre de la ciudad. El slug de sede es **el
   distrito** (en Lima) o el rasgo que la distingue (nombre del centro
   comercial, o de la avenida si hay dos sedes en el mismo distrito).
3. **Nunca** el número de portal: las numeraciones cambian y la URL no debe.
   **Nunca** `tienda-1`, `sede-2`: no dicen nada a nadie.
4. El slug se **almacena en una columna** de `stores`, no se deriva del nombre.
   Si mañana la sede cambia de nombre comercial, la URL sobrevive. Es la
   diferencia entre un directorio estable y una fuente de 404.
5. Una vez publicado, **el slug es inmutable**. Si hay que cambiarlo, es un
   301, no una edición.
6. **Barra final consistente.** Elijo **con** barra final para las páginas de
   directorio, porque son colecciones y porque evita el problema que ya
   ocurrió en `/trabaja/` (`SEO_TECH_AUDIT.md:352-390`: devolvía 200 con la
   página rota). La variante sin barra hace 301 a la canónica. `dev` debe
   además pasar las rutas de recursos a **absolutas** (`/css/base.css`), o
   `/tiendas/lima/san-miguel/` reproducirá el mismo fallo a dos niveles de
   profundidad.

> `[PENDIENTE DE LUKERS: la lista definitiva de sedes con nombre comercial
> exacto, ciudad, distrito y dirección tal como aparece en Google Maps.]`
> → sin esto no se puede fijar ni un solo slug. Lo responde el dueño;
> `docs/DATOS-QUE-NECESITO.md` bloque 1 ya tiene la plantilla.

### 3.4 Cómo se navega entre ellas

- **Cabecera:** el enlace «Tiendas» deja de ser `#tiendas` y pasa a `/tiendas/`.
  Es el enlace más importante del sitio y debe estar en la navegación principal
  y en el botón de acción de la cabecera.
- **Portada:** un **localizador** (no una cuadrícula de N tarjetas) que
  pregunta la ciudad y lleva al concentrador o a la ficha. `CRO_AUDIT.md:302-320`
  ya propuso exactamente esto como experimento 1.
- **Migas de pan** en toda página de sede: `Inicio › Tiendas › <Ciudad> › <Sede>`,
  con `BreadcrumbList`. Es navegación real, no adorno: en móvil es la única
  forma barata de subir un nivel.
- **Enlace lateral:** cada ficha enlaza «Otras sedes en <ciudad>» (o «Otras
  ciudades», si es sede única). Reparte autoridad y resuelve el caso real de
  «esta me queda lejos, ¿hay otra?».
- **Pie:** lista de ciudades, no de sedes. Se mantiene corto y no envejece.
- **Fichas de Google Business Profile:** cada una apunta a **la URL canónica de
  su sede**, nunca a la portada. Es el enlace de mayor valor del proyecto.

### 3.5 Qué pasa cuando Lukers abre o cierra una tienda

Esto es lo que convierte una idea bonita en una arquitectura que sobrevive.
Propongo sustituir el `active 0/1` actual (`server/db.js:94`) por un **estado**
con cuatro valores, porque «visible / no visible» no basta:

| Estado | Qué se publica | URL | Sitemap | Datos estructurados |
|---|---|---|---|---|
| `proxima` | Ficha con «Próxima apertura» y fecha si la hay; sin horario | Viva | Sí | Sin `openingHours` |
| `activa` | Ficha completa | Viva | Sí | Completos |
| `pausa` (cierre temporal: obra, mudanza) | Ficha con aviso visible y motivo; no aparece en el localizador | Viva, indexable | Sí | Sin `openingHours` |
| `cerrada` (definitivo) | Nada | **301** al concentrador de su ciudad; si la ciudad se queda sin sedes, 301 a `/tiendas/` | Fuera | Retirados |

Reglas de operación:

1. **Una sede cerrada nunca devuelve 404 y nunca se queda publicada.** El 404
   tira a la basura los enlaces y las reseñas acumuladas; dejarla publicada
   envía gente a una puerta cerrada, que es el peor fallo posible para el
   objetivo 1.
2. **Abrir la segunda sede de una ciudad no rompe ninguna URL.**
   `/tiendas/trujillo/` deja de ser ficha y pasa a ser concentrador; la sede
   original obtiene `/tiendas/trujillo/<sede>/`. La URL antigua **sigue viva y
   sigue siendo relevante**, así que no hace falta redirección. El único coste
   operativo es actualizar el enlace de la ficha de Google de esa sede para
   que apunte a la ficha nueva: una tarea de dos minutos, documentada.
3. **El sitemap se genera desde la tabla**, no a mano. Hoy son tres URL fijas
   (`server/server.js:468-472`); debe pasar a recorrer `stores`.
4. **El cierre de una tienda se marca primero en Google Business Profile**
   («cerrado permanentemente») y después en la web. La ficha de Google es la
   fuente que ve la mayoría de la gente.
5. **Nada de datos estructurados de sede hasta que las direcciones estén
   verificadas.** El interruptor `TIENDAS_VERIFICADAS` ya existe
   (`server/server.js:435`) y **se queda**. Publicar una dirección falsa como
   `ClothingStore` enseña a Google una ubicación equivocada, y eso es más
   difícil de deshacer que de hacer.

### 3.6 Lo que cuesta esta decisión, dicho sin adornos

- Pasa de 3 a **7 + 2N** URL aproximadamente (`/`, `/tiendas/`, `/trabaja`,
  `/contacto`, `/privacidad`, `/404`, más nivel 2, más una por ciudad con ≥2
  sedes y una por sede). Con las sedes sin confirmar, no puedo dar el número.
- **Cada ficha necesita contenido propio**: una foto real y unas referencias
  para llegar que no se repitan entre sedes. N fichas clonadas con la dirección
  cambiada son N páginas de contenido pobre, y eso empeora la situación en vez
  de mejorarla. Este es el verdadero coste, y recae en Lukers, no en el código.
- Obliga a `dev` a hacer las rutas de recursos absolutas antes de nada
  (`SEO_TECH_AUDIT.md:376-390`).

**Aun así se hace**, porque el objetivo 1 del negocio vive exactamente ahí.

---

## 4. Estructura de cada página, bloque a bloque

Notación de la columna **Trabajo**: `C` = comprensión (ayuda a entender),
`X` = conversión (empuja a actuar), `L` = legal u operativo.
Notación de **Contenido**: `Existe` / `Pendiente` / `Pendiente + verificación`.

### 4.1 Portada `/`

Objetivo único: **llevar a la ficha de sede correcta**. Todo lo demás está
subordinado. Meta de longitud: **por debajo de 10 pantallas en móvil**, frente
a las 19,8 medidas hoy (`CRO_AUDIT.md:248-259`).

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Barra de anuncio (**condicional**) | C | `.announce` (site.css:7-18) | Pendiente. **Solo si hay algo real que anunciar** (apertura, cambio de horario). Sin noticia, el bloque no se pinta. Hoy anuncia una apertura no verificada (`index.html:59-64`) |
| 2 | Cabecera fija | X | `.header .nav` (site.css:20-89) | Existe. Cambia: «Tiendas» → `/tiendas/`; el botón de acción pasa a «Encuentra tu tienda» |
| 3 | **Hero** | C + X | `.hero` (site.css:92-151) | **Pendiente entero.** Una frase de qué es Lukers, una prueba verificable, una acción: «Encuentra tu tienda». Ver §9 para el input a `hero` |
| 4 | **Localizador de sede** — el bloque más importante de la web | X | `.store-finder` (**nuevo**) | Pendiente (datos). Selector de ciudad → sedes de esa ciudad → «Cómo llegar» y «Ver la tienda» |
| 5 | Por qué merece el viaje — 3 pruebas | C | `.value` (site.css:233-241) o `.brillo-box` | **Pendiente + verificación.** Tres hechos comprobables, no adjetivos |
| 6 | Qué vas a encontrar — 4 categorías con foto | C | `.cat-card` (site.css:154-165) | Pendiente (fotos + nombres de categoría reales) |
| 7 | Marcas (**condicional**) | C | `.marquee` + `.brand-chip` (site.css:168-188) | **Bloqueado.** No se publica hasta tener lista verificada y revisión de uso de marcas ajenas |
| 8 | Prueba social real | C | `.proof-strip` (**nuevo**) | Pendiente. Instagram y reseñas de Google. **Sustituye a los tres testimonios inventados**, que se retiran |
| 9 | Novedades por correo | X (obj. 2) | `.newsletter` (site.css:244-253) | Pendiente: hace falta la promesa concreta de qué se envía y cada cuánto |
| 10 | Trabaja con nosotros — tira corta | X (obj. 3) | `.section--azul` + `.btn` | Pendiente. Un enlace a `/trabaja`, no el formulario |
| 11 | Pie | C + L | `.footer` (site.css:266-305) | Parcial. Ciudades, legales, redes reales, Libro de Reclamaciones |
| 12 | WhatsApp flotante (**condicional**) | X | `.wa-fab` (site.css:308-327) | **Pendiente**: hoy no hay número (`js/config.js:20`) y el botón se oculta solo. Correcto: mejor nada que un botón roto |

**Se van de la portada** (con destino): la línea de tiempo → `/nosotros`; los
testimonios → se retiran; la sección de proveedores → `/proveedores`; el
formulario de contacto → `/contacto`. Cuatro bloques menos y un objetivo más
claro por pantalla.

### 4.2 Índice de tiendas `/tiendas/`

Objetivo: orientar en un vistazo y repartir hacia la ficha correcta.

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Migas `Inicio › Tiendas` | C | `.breadcrumb` (**nuevo**) | Estructural |
| 2 | Encabezado: H1 + una línea de contexto + horario general | C | `.section-head` (base.css:207-213) | Pendiente (horario confirmado: 10:00–22:00) |
| 3 | Selector de ciudad | X | `.store-finder` (**nuevo**) | Pendiente |
| 4 | Lista agrupada por ciudad | C + X | `.store-list` (**nuevo**) + `.store-card` (site.css:191-197) | Pendiente |
| 5 | Mapa general (opcional, escritorio) | C | `.map-embed` (**nuevo**) | Pendiente |
| 6 | Preguntas de alcance: ¿venden online?, ¿todas tienen lo mismo? | C | `.faq` (**nuevo**) | Pendiente |
| 7 | Pie | — | `.footer` | — |

### 4.3 Página de ciudad `/tiendas/<ciudad>/` (solo con ≥2 sedes)

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Migas `Inicio › Tiendas › <Ciudad>` | C | `.breadcrumb` | Estructural |
| 2 | H1 «Tiendas Lukers en <Ciudad>» + párrafo **propio de esa ciudad** | C | `.section-head` | **Pendiente. Innegociable: si este párrafo se clona entre ciudades, la página no vale nada** |
| 3 | Sedes de la ciudad, con foto, dirección, horario y «Cómo llegar» | X | `.store-card` | Pendiente |
| 4 | Mapa con todas las sedes de la ciudad | C | `.map-embed` | Pendiente |
| 5 | Otras ciudades | C | `.city-list` (**nuevo**) | Estructural |
| 6 | Novedades por correo (versión compacta) | X | `.newsletter` | Pendiente |

### 4.4 Ficha de sede `/tiendas/<ciudad>/<sede>/` — **la página que convierte**

Es la página de mayor valor del sitio. Se diseña para una persona que está en
la calle, con el móvil en la mano, con datos lentos y con una sola pregunta:
**¿dónde está y está abierta?**

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Migas | C | `.breadcrumb` | Estructural |
| 2 | **Encabezado de sede**: H1 «Lukers <Sede>», ciudad, dirección completa, horario, estado «Abierto ahora / Cierra a las 22:00» | C | `.store-hero` + `.store-status` (**nuevos**) | **Pendiente + verificación de dirección** |
| 3 | Acciones: «Cómo llegar» (primaria), «Llamar» / WhatsApp (si existen) | X | `.btn--primary` + `.action-bar` (**nuevo**, fija abajo en móvil) | Pendiente (teléfono/WhatsApp) |
| 4 | **Foto real de la fachada** | C | `.media--3x2` (base.css:358-375) | **Pendiente. Obligatoria y real.** Es cómo se reconoce el local desde la vereda |
| 5 | Galería: interior, 1-3 fotos | C | `.gallery` (**nuevo**) | Pendiente, reales |
| 6 | Mapa + **cómo llegar en texto**: referencias, paraderos, dónde estacionar | C | `.map-embed` + texto | **Pendiente. Es el contenido único que diferencia una ficha de otra** |
| 7 | Horario detallado y excepciones (feriados) | C | `.contact-item` (site.css:256-263) | Pendiente |
| 8 | Qué encuentras en esta sede | C | `.tag` (base.css:544-557) | **Pendiente**: ¿varía el surtido entre sedes? Si no varía, este bloque **no** se pone, porque sería idéntico en todas |
| 9 | Otras sedes cerca | C + X | `.nearby` (**nuevo**) | Estructural |
| 10 | Trabaja en esta sede | X (obj. 3) | `.btn--outline` → `/trabaja` con la sede preseleccionada | Estructural |
| 11 | Novedades por correo (compacta) | X (obj. 2) | `.newsletter` | Pendiente |
| 12 | Datos estructurados `ClothingStore` + `BreadcrumbList` | — | — | **Bloqueado por `TIENDAS_VERIFICADAS`** |

### 4.5 `/trabaja`

Se conserva la página y su formulario, que funcionan (`trabaja.html`,
`js/trabaja.js`, `server/server.js:752-769`).

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Hero azul | C | `.jobs-hero` (site.css:359-362) | **Pendiente + verificación.** Hoy afirma «más de 300 compañeros», sin confirmar (`docs/DECISIONES.md:§2`) |
| 2 | Qué ofrecemos | C | `.perk` (site.css:365-369) | Pendiente: solo condiciones que Lukers pueda sostener |
| 3 | Qué buscamos / puestos | C | `.value` o lista | Pendiente |
| 4 | Formulario de postulación | X | `.jobs-form` (site.css:370-372) | **Existe y funciona** |
| 5 | Aviso de tratamiento de datos (pide DNI) | L | `.consent` (base.css:513-527) | Existe; depende del cierre de `/privacidad` |
| 6 | Foto real del equipo | C | `.media--3x2` | **Pendiente. Real, con consentimiento de imagen firmado** |

Cambio pedido por CRO y que apoyo: **el DNI sale del primer paso**
(`CRO_AUDIT.md:339-361`). Pedir un documento de identidad antes de saber si
hay interés es el mayor freno del formulario.

### 4.6 `/contacto`

| # | Bloque | Trabajo | Componente | Contenido |
|---|---|---|---|---|
| 1 | Encabezado + «¿Buscas una tienda?» → `/tiendas/` | C | `.section-head` | Estructural |
| 2 | Canales: WhatsApp, teléfono, correo, horario de atención | X | `.contact-item` | **Pendiente entero** |
| 3 | Preguntas frecuentes (acordeón + `FAQPage`) | C | `.faq` (**nuevo**) | **Pendiente.** Las preguntas reales están listadas en `PLAN-REDISENO.md` fase 2 |
| 4 | Formulario de contacto | X | `.jobs-form` reutilizado | Existe (`server/server.js:537`) |
| 5 | Libro de Reclamaciones y datos de la empresa | L | `.legal` (site.css:352-356) | Pendiente (URL real, RUC, razón social) |

### 4.7 `/nosotros` (nivel 2)

Bloques: migas · H1 y una idea · historia en línea de tiempo
(`.timeline`, site.css:214-230) con **Remate de Fábrica → Lukers** contado
honestamente · valores (`.value`) · foto real del equipo · enlaces a
`/tiendas/` y `/trabaja`. Contenido pendiente entero.

> `[PENDIENTE DE LUKERS: ¿en qué año empezó el negocio y en qué año pasó a
> llamarse Lukers? ¿Qué hitos quieres que aparezcan?]` → decide si existe
> `/nosotros`. Lo responde el dueño. Recordatorio: el registro público indica
> inicio de actividades en julio de 2019 (HALLAZGOS §8) y la maqueta publica
> 2001, incluido el `foundingDate: "2001"` del JSON-LD de `index.html:46`,
> que hay que retirar hasta que se decida.

### 4.8 `/proveedores` (nivel 2, y pequeña a propósito)

Una sola pantalla: qué tipo de propuestas interesan · qué enviar · un correo o
un formulario mínimo · un aviso de que no se garantiza respuesta. Se enlaza
**solo desde el pie**. Componente `.supplier` ya existe (site.css:412-415).

### 4.9 `/privacidad`, `/404` y páginas internas

Se conservan tal cual. `/privacidad` se cierra cuando lleguen RUC, razón
social y domicilio fiscal verificados en SUNAT. El aviso visible de «en
revisión» (`.aviso-pendiente`, site.css:429-441) es la decisión correcta
mientras tanto y se mantiene.

---

## 5. Inventario de componentes

### 5.1 Ya existen y se reutilizan sin tocar

Miré el CSS antes de escribir esta lista.

| Componente | Dónde vive | Se usa en |
|---|---|---|
| Tokens de marca, espaciado base 8, radios, sombras, tipografía | `base.css:13-81` | Todo |
| Tema negativo (crema sobre azul) | `base.css:84-98` | Bloques azules, conmutador |
| Escala tipográfica `.display-1/2/3`, `.lead`, `.eyebrow` | `base.css:146-190` | Todo |
| `.container`, `.section` (+`--tight`, `--sunken`, `--azul`), `.section-head`, `.grid-2/3/4`, `.stack` | `base.css:193-220` | Todo |
| `.btn` (+`--primary`, `--outline`, `--crema`, `--sm`, `--block`) | `base.css:223-278` | Todo |
| **`.brillo`** (construcción del manual, ancho = alto, sin rotar) y `.brillo-box` | `base.css:285-349` | Acentos, cajas de contenido |
| **`.media`** con proporción fija, `--1x1/4x5/3x2/16x9`, `--scrim`, `.media__placeholder` | `base.css:358-411` | Toda foto |
| `.card`, `.card__body`, `.card--hover` | `base.css:413-429` | Sedes, categorías |
| Formularios: `.field`, `.input`, `.select`, `.textarea`, `.choice`, `.consent`, `.form-msg` | `base.css:436-541` | 3 formularios |
| `.tag` | `base.css:544-557` | Categorías por sede |
| `.visually-hidden`, `.skip-link`, foco visible, `prefers-reduced-motion` | `base.css:130-139, 560-582, 596-604` | Todo |
| `.reveal` con red de seguridad | `base.css:589-594` + `js/reveal.js` | Todo |
| `.announce`, `.header/.nav/.burger`, menú móvil | `site.css:7-89, 374-404` | Todo |
| `.hero` + `.hero__brillos/__stats/__note` | `site.css:92-151` | Portada |
| `.cat-card` | `site.css:154-165` | Portada |
| `.marquee` + `.brand-chip` | `site.css:168-188` | Portada (condicional) |
| `.store-card` | `site.css:191-197` | Listas de sedes |
| `.empty-state` | `site.css:200-211` | Listas vacías |
| `.timeline` | `site.css:214-230` | `/nosotros` |
| `.value` | `site.css:233-241` | Portada, `/nosotros` |
| `.newsletter` | `site.css:244-253` | Portada, ciudad, sede |
| `.contact-item` | `site.css:256-263` | `/contacto`, sede |
| `.footer`, `.socials`, `.footer__concept` | `site.css:266-305` | Todo |
| `.wa-fab` | `site.css:308-327` | Condicional al número |
| `.toast` | `site.css:331-349` | Formularios |
| `.legal` | `site.css:352-356` | Legales |
| `.jobs-hero`, `.perk`, `.jobs-form` | `site.css:359-372` | `/trabaja`, `/contacto` |
| `.supplier` | `site.css:412-415` | `/proveedores` |
| `.aviso-pendiente`, `.dato-pendiente` | `site.css:429-441` | Legales en revisión |

**El sistema cubre bastante más de lo que la maqueta usa.** No hace falta
rehacerlo; hace falta aplicarlo a una arquitectura mayor.

### 5.2 Hay que crearlos

| Componente | Para qué sirve | Dónde | Nota para `dev` |
|---|---|---|---|
| `.breadcrumb` | Subir de nivel en móvil y dar `BreadcrumbList` | Tiendas, ciudad, sede, legales | `<nav aria-label="Migas">` + `<ol>`; el actual sin enlace |
| `.store-finder` | Elegir ciudad y ver sus sedes sin recargar | Portada, `/tiendas/` | **Debe funcionar sin JS**: renderizado en servidor con todas las sedes agrupadas; el JS solo filtra. `<select>` nativo en móvil |
| `.store-list` | Lista compacta ciudad → sedes, sin foto | `/tiendas/`, pie de ciudad | Más barata que `.store-card`; es la que se ve primero en móvil |
| `.city-list` | Saltar entre ciudades | Ciudad, sede, pie | — |
| `.store-hero` | Encabezado de ficha: NAP + estado + acciones | Ficha de sede | El NAP debe ser texto seleccionable, nunca imagen |
| `.store-status` | «Abierto ahora / Cierra a las 22:00 / Abre mañana a las 10:00» | Tarjetas y ficha | Se calcula del horario. **Sin JS debe mostrar el horario literal**, nunca un hueco |
| `.action-bar` | Barra fija inferior en móvil con «Cómo llegar» | Ficha de sede | Reservar altura con un token; no puede tapar el último bloque ni el `.wa-fab` |
| `.map-embed` | Mapa con proporción fija y **carga diferida tras clic** | Sede, ciudad, `/tiendas/` | Fachada estática + botón; el iframe de terceros solo se carga si se pide. Ahorra peso y evita cargar terceros sin consentimiento |
| `.gallery` | 1-3 fotos de interior | Ficha de sede | Scroll horizontal con `scroll-snap` en móvil; cuadrícula en escritorio; navegable con teclado |
| `.faq` | Preguntas frecuentes + `FAQPage` | `/contacto`, `/tiendas/` | `<details>/<summary>` nativos: accesible y sin JS |
| `.proof-strip` | Prueba social **verificable** | Portada | Sustituye a los testimonios. Cifras solo si Lukers las confirma |
| `.notice` | «Próxima apertura», «Cerrada temporalmente» | Ficha de sede | Puede derivar de `.aviso-pendiente`, que ya tiene el tratamiento correcto |
| `.nearby` | «Otras sedes cerca» | Ficha de sede | — |
| `.statement` | Bloque tipográfico a pantalla, azul pleno | Portada, `/nosotros` | Soporte del momento de firma S4 (§6) |
| Estado `.is-loading` / esqueleto | Mientras el localizador filtra | Localizador | Sin él, en conexión lenta el bloque parece roto |

### 5.3 Huecos del sistema de tokens

Hechos verificados, con propuesta:

1. **No hay escala de movimiento.** Solo existen `--t: .24s` y `--ease`
   (`base.css:75-76`), usados para absolutamente todo. Para lo que pide el
   dueño hacen falta al menos tres duraciones y dos curvas. **Lo define
   `motion`**, yo solo señalo el hueco.
2. **No hay escala de `z-index`.** Hay siete valores sueltos: 80 en la
   cabecera (`site.css:24`), 70 en el WhatsApp (`:312`), 95 en el toast
   (`:335`), 999 en el `skip-link` (`base.css:572`), y 0/1/2 locales. Con una
   barra de acción fija y un menú a pantalla completa, esto se rompe. Propongo
   `--z-base/--z-sticky/--z-header/--z-menu/--z-fab/--z-toast/--z-skip`.
3. **Falta `--actionbar-h`**, equivalente a `--header-h` (`base.css:78`), para
   reservar el espacio de la barra fija móvil sin tapar contenido.
4. **Desajuste de proporciones en los huecos de imagen.** El panel pide a
   quien sube la foto una proporción que no es la que usa la página:
   `server/server.js:109` anuncia `1 / 1` (800 × 800) para `hero_main` y
   `:113-116` anuncia `16 / 10` (800 × 500) para las categorías, mientras que
   los cinco contenedores reales son `media--4x5` (`index.html:130,156,162,168,174`)
   y la clase `16x10` ni siquiera existe en CSS (`base.css:372-375`). Quien
   suba la foto la verá recortada. Ya lo detectó `CRO_AUDIT.md` (§3.4).
   **Decisión: se conserva lo construido, `4 / 5` vertical, y se corrige el
   texto del panel**, que es lo barato de cambiar. Ver §7.
5. **Los `SLOTS` del panel no coinciden con los `data-slot` de las páginas**:
   `look_ella`, `look_el` y `look_urbano` (`server/server.js:110-112`) no
   existen en ninguna página. `dev` debe alinear la lista con §7.

---

## 6. Momentos de firma

El dueño pide una web **«súper profesional, muy moderna, con animaciones muy
llamativas»**. Tomarlo al pie de la letra sería un error, así que lo traduzco.

### 6.0 Evaluación franca de lo que hay, y de dónde viene la sensación de «caro»

**Lo que existe hoy:** una única animación de entrada (aparecer + 22 px hacia
arriba, `base.css:589-594`), la traslación de 2 px de los botones al pasar el
cursor (`base.css:244`), el carrusel de marcas (`site.css:170-173`), el menú
móvil (`site.css:398`) y el aviso emergente (`site.css:349`). Todo respeta
`prefers-reduced-motion` (`base.css:596-604`).

**Dónde se queda corto, sin adornos:**

1. **No hay orquestación.** Todos los elementos entran igual, al mismo tiempo y
   a la misma velocidad. Eso es exactamente lo que hace que una web se lea como
   una plantilla: no hay jerarquía en el movimiento, y por tanto el movimiento
   no comunica nada.
2. **Una sola duración para todo** (`--t: .24s`, `base.css:76`). Un menú a
   pantalla completa y el cambio de color de un borde no pueden durar lo mismo.
3. **No hay continuidad entre páginas.** Con la arquitectura de §3, el
   recorrido pasa a tener saltos de página; hoy cada salto es un parpadeo en
   blanco.
4. **El movimiento no está donde está el trabajo.** Se anima la decoración del
   hero y no se anima lo único que el visitante va a manipular: el localizador.

**Y ahora lo importante, que no es movimiento.** Una web cuyos huecos de foto
están todos vacíos —los cinco del panel (`server/server.js:108-117`) más uno o
dos por sede— no puede sentirse cara por muchas animaciones que se le pongan. **La
mayor parte de la sensación de profesionalidad la aportan, por este orden: la
fotografía, el aire entre bloques, el tamaño y la seguridad de la tipografía, y
solo después el movimiento.** El sistema ya tiene tipografía grande
(`base.css:153-158`: hasta 5 rem) y espaciado generoso (`base.css:200`:
hasta 8 rem entre secciones). Lo que falta son fotos. Si hay que elegir entre
pagar un fotógrafo y pagar animaciones, se paga el fotógrafo.

Dicho esto, sí hay margen para cinco momentos que hagan memorable el recorrido.

### 6.1 Los cinco momentos

#### S1 · La entrada de la portada

- **Dónde:** primer pliegue de `/`.
- **Disparador:** carga de la página, una sola vez por sesión.
- **Qué debe sentir:** que ha llegado a una marca con criterio, no a un
  catálogo improvisado. Aplomo, no fuegos artificiales.
- **Qué trabajo hace además de ser bonito:** establece la jerarquía de lectura.
  El titular se asienta primero, la acción principal después: el orden del
  movimiento **es** el orden en que queremos que se lea.
- **Coste y degradación:** casi nulo si es CSS puro y no depende de JavaScript.
  **Restricción dura: el elemento LCP —el titular o la foto del hero— nunca
  puede empezar en `opacity: 0`.** Animar el LCP retrasa la métrica que más
  pesa en móvil. Se anima lo que lo acompaña, no él. Con
  `prefers-reduced-motion`, todo aparece ya colocado.

#### S2 · El localizador respondiendo

- **Dónde:** bloque 4 de la portada y `/tiendas/`.
- **Disparador:** el visitante elige una ciudad.
- **Qué debe sentir:** que la web le ha hecho caso al instante. Esta es la
  sensación de «producto caro» de verdad: respuesta inmediata a una acción
  propia, no una animación que ocurre sola.
- **Qué trabajo hace:** confirma que el filtro funcionó y mantiene la
  orientación mientras la lista se recompone. Sin esa confirmación, en móvil
  el cambio de contenido pasa desapercibido y la gente vuelve a pulsar.
- **Coste y degradación:** barato, porque las sedes ya están en el DOM
  (renderizadas en servidor) y solo se muestran u ocultan; no hay petición de
  red. En conexión lenta funciona igual: el filtro es local. **Sin JavaScript,
  se ven todas las sedes agrupadas por ciudad** y el bloque sigue sirviendo.
  Con `prefers-reduced-motion`, el cambio es instantáneo.

#### S3 · La continuidad al entrar en una sede

- **Dónde:** de `/tiendas/` o del localizador a `/tiendas/<ciudad>/<sede>/`.
- **Disparador:** pulsar una sede.
- **Qué debe sentir:** que no ha cambiado de sitio, que ha entrado. La foto de
  la tarjeta se convierte en la foto de la ficha.
- **Qué trabajo hace:** **elimina la desorientación del salto de página.** Con
  N sedes parecidas, la pregunta «¿es esta la que pulsé?» es real. La
  continuidad visual la responde sin texto.
- **Cómo:** transiciones de vista entre documentos, declaradas en CSS. **Cero
  JavaScript.** En navegadores que no lo soportan, la navegación es la normal
  de siempre: no hay nada que degradar porque no hay nada añadido.
- **Coste y degradación:** el coste real no es la transición, es **la foto**:
  si la de la ficha pesa 2 MB, la transición se ve rota en 3G. Por eso las
  fotos de sede llevan `srcset` obligatorio (§7). Con
  `prefers-reduced-motion`, se degrada a un fundido corto o a nada.
- **Aviso:** el soporte es amplio en navegadores basados en Chromium.
  `[VALIDAR con launch: qué navegadores usa realmente el tráfico de Lukers,
  cuando haya analítica.]` Aunque el soporte fuera bajo, el coste de incluirlo
  es cero para quien no lo tiene.

#### S4 · El bloque azul pleno

- **Dónde:** una vez por página como máximo. En la portada, el bloque de
  novedades por correo; en `/nosotros`, la declaración de marca.
- **Disparador:** aparecer en pantalla al hacer scroll.
- **Qué debe sentir:** un cambio de respiración. Se acaba el crema, entra el
  azul de marca a sangre, tipografía grande, un ✦ a gran escala.
- **Qué trabajo hace:** **separa las secciones y marca el momento de pedir
  algo.** El objetivo 2 (suscripción) necesita un lugar que no se confunda con
  el resto de la página. El color hace ese trabajo mejor que cualquier flecha.
  Además es marca aplicada literalmente: el manual pide que el azul domine y
  que haya al menos un ✦ a la vista (`SKILL.md`, «Errores que delatan»).
- **Coste y degradación:** el color no cuesta nada. El ✦ está dibujado en CSS
  con máscaras (`base.css:285-317`), sin imagen que descargar. La única
  precaución: las máscaras y los degradados a pantalla completa pueden
  encarecer el pintado en móviles modestos, así que **el ✦ decorativo grande se
  reduce o se retira por debajo de cierto ancho** (§8). Con
  `prefers-reduced-motion`, el bloque simplemente está ahí.

#### S5 · «Abierto ahora»

- **Dónde:** tarjetas de sede y encabezado de ficha.
- **Disparador:** renderizado del componente.
- **Qué debe sentir:** que la información está viva y es de este momento, no
  una página que alguien dejó ahí en 2019.
- **Qué trabajo hace:** **responde la pregunta que decide el viaje.** Es el
  momento de firma con más valor de negocio de los cinco: es utilidad
  disfrazada de detalle de diseño.
- **Coste y degradación:** unas pocas líneas de JavaScript y ningún recurso.
  **El espacio se reserva siempre**, aunque el cálculo falle, para que no haya
  desplazamiento de contenido. **Sin JavaScript se muestra el horario
  literal** — nunca un hueco, nunca «cargando». Con `prefers-reduced-motion`,
  el estado aparece sin ningún énfasis animado.
- **Condición:** el horario 10:00–22:00 está razonablemente confirmado
  (HALLAZGOS §6), pero
  `[PENDIENTE DE LUKERS: ¿alguna sede tiene horario distinto? ¿qué pasa en
  feriados?]` Si la respuesta no llega, **este componente no se publica**:
  decirle a alguien que una tienda está abierta cuando está cerrada es peor
  que no decir nada.

### 6.2 Momentos descartados, con motivo

| Descartado | Por qué |
|---|---|
| **Contadores animados de cifras** (ya implementados en `js/site.js:9-34`) | Puramente decorativos: retrasan la lectura del dato y no aportan nada. Y hoy animan cifras sin verificar (`docs/DECISIONES.md:§2`), lo que convierte un adorno en un riesgo. **Se retiran** mientras las cifras no estén confirmadas |
| Paralaje de fondo | Coste de pintado en cada fotograma de scroll, exactamente en los móviles modestos que son la mayoría del tráfico, a cambio de nada |
| Cursor personalizado | No existe en móvil, que es donde está el tráfico; en escritorio rompe la expectativa del sistema operativo |
| Pantalla de carga | Añadir espera a un sitio que debe ser rápido es empeorarlo a propósito |
| Scroll secuestrado, secciones a pantalla completa con avance forzado | Quita al visitante el control de lo único que controla |
| Letras que se descomponen o se revuelven | Retrasa la lectura del único mensaje del primer pliegue |
| Elementos entrando desde izquierda y derecha alternativamente | Es la firma visual de una plantilla comprada, no de una marca |

### 6.3 Lo que NUNCA se mueve

Esta lista importa tanto como la anterior. Es innegociable.

1. **Precios.** Cuando existan, aparecen quietos y legibles. Nunca se animan,
   nunca se cuentan hacia arriba, nunca se revelan con retardo.
2. **Direcciones y datos de contacto.** El NAP (nombre, dirección, teléfono)
   es texto plano, seleccionable, sin animación de entrada y **nunca dentro de
   una imagen**. Si alguien quiere copiar la dirección, tiene que poder.
3. **Horarios y el estado «Abierto ahora».** El dato no parpadea ni cambia de
   color para llamar la atención.
4. **Cualquier formulario en uso.** Ni los campos, ni las etiquetas, ni las
   ayudas, ni —sobre todo— el botón: **nada puede desplazarse bajo el dedo**
   mientras alguien escribe. Un mensaje de validación que aparece empujando el
   botón hacia abajo provoca pulsaciones erróneas.
5. **Mensajes de error y de éxito.** Aparecen en su sitio, con espacio ya
   reservado, y se anuncian por `role="status"` — que ya está puesto
   (`index.html:360,417`). No se deslizan, no rebotan.
6. **La cabecera.** Puede ganar una sombra al hacer scroll —ya lo hace
   (`site.css:30`)— pero **no se esconde ni se encoge**: contiene el enlace a
   «Tiendas», que es el objetivo 1, y debe estar siempre a un toque.
7. **El botón flotante de WhatsApp y la barra de acción de la ficha de sede.**
   Fijos significa fijos.
8. **Las migas de pan.**
9. **El contenido legal** (`/privacidad`, Libro de Reclamaciones): sin
   animación de entrada. Se lee, no se presenta.
10. **Nada se re-anima.** Un elemento que ya apareció no vuelve a aparecer al
    volver a pasar por él. `js/reveal.js:30` ya deja de observar tras el primer
    cruce: esa decisión se mantiene.
11. **El elemento LCP nunca empieza invisible.**

### 6.4 Ambición sí, ruido no — la definición operativa

**«Moderno y llamativo» significa aquí:** tipografía grande y segura;
composición con aire de sobra; el azul de marca usado con audacia en bloques a
sangre; el ✦ como firma, pocos y grandes; fotografía con presencia y bien
recortada; transiciones precisas y cortas en las cosas que el visitante toca.

**No significa:** elementos entrando desde todos lados al hacer scroll,
paralaje, cursores personalizados, pantallas de carga, vídeo de fondo
autoreproducido, ni «wow» que tape una dirección.

**Regla de arbitraje, para cuando haya dudas:** *si un efecto no se puede
degradar con elegancia en una conexión lenta o con `prefers-reduced-motion`, no
entra. Si retrasa la lectura de una dirección, un horario o un precio, no
entra.*

`motion` recibe esta intención y estos límites; **las duraciones, las curvas y
las distancias las fija él**, no yo.

---

## 7. Plan fotográfico

Es lo más accionable a corto plazo: el dueño tiene que encargar estas fotos.

### 7.1 Las tres reglas antes de la tabla

1. **Tiendas y personas: fotografía real, siempre.** Ninguna imagen generada
   puede representar un local de Lukers ni a alguien que trabaja allí. No es
   una cuestión de gusto: enseñar una fachada que no es la tuya hace que quien
   llegue no reconozca el sitio, y enseñar «empleados» inventados es
   exactamente el error del que viene este proyecto.
2. **La IA vale para ambiente y piezas editoriales.** Fondos, texturas,
   bodegones de categoría, planos cerrados de prenda sin rostro ni local
   reconocible. **Hay un matiz del manual que conviene explicitar:** la guía de
   marca dice, en su estilo «Personas en tienda», *«el más frecuente; prioriza
   IA»* (`guia-marca.md:62`). Eso sirve para una pieza de Instagram donde nadie
   afirma que sea una tienda concreta. **En la web no sirve para el mismo
   propósito**, porque aquí la foto acompaña a una dirección: el visitante la
   lee como «así es esa tienda». Resolución: en las páginas de sede, foto real
   y sin excepción; en el hero y en ambiente, si aún no hay foto real, se
   permite IA **solo con encuadre que no identifique un local** (plano cerrado,
   sin rótulos, sin interior reconocible) y sin pie de foto que afirme que es
   una tienda Lukers.
3. **Marcas visibles en fotos de producto: cuidado.** Un logotipo de un tercero
   en primer plano afirma que esa marca se vende ahí. Si no se vende, es
   publicidad engañosa; y el uso de marcas ajenas tiene sus propias reglas.
   **Regla práctica:** en fotos de categoría, planos cerrados de prendas
   básicas sin logotipo visible (es lo que ya pide el manual,
   `guia-marca.md:63`). Si se quiere mostrar una marca concreta, que sea una
   marca que Lukers confirme que vende, con foto real de una prenda real.
   **Y nunca una prenda generada por IA con un logotipo inventado o deformado**:
   es lo que más delata una imagen falsa y además falsifica una marca ajena.

### 7.2 La tabla

Los tamaños mínimos son del archivo que se entrega (el doble del tamaño de
presentación, para pantallas de alta densidad). Prioridad: **P1** = sin esto no
se publica; **P2** = necesario para que la página funcione bien; **P3** =
mejora.

| # | Hueco | Página y bloque | Qué debe mostrar | Proporción | Mínimo | Real o IA | Prioridad |
|---|---|---|---|---|---|---|---|
| F1 | `hero_main` | `/` · hero | La idea central de Lukers en una imagen. Persona con prendas básicas, actitud natural, luz cálida, fondo desenfocado | **4 / 5** | 1200 × 1500 px | **Real preferida.** IA solo con encuadre que no identifique un local | **P1** |
| F2 | `cat_1` | `/` · categorías | Categoría 1. Plano cerrado de prenda, sin rostro, fondo neutro de color entero | **4 / 5** | 1000 × 1250 px | Real o IA | P2 |
| F3 | `cat_2` | `/` · categorías | Categoría 2, mismo tratamiento | 4 / 5 | 1000 × 1250 px | Real o IA | P2 |
| F4 | `cat_3` | `/` · categorías | Categoría 3, mismo tratamiento | 4 / 5 | 1000 × 1250 px | Real o IA | P2 |
| F5 | `cat_4` | `/` · categorías | Categoría 4, mismo tratamiento | 4 / 5 | 1000 × 1250 px | Real o IA | P2 |
| F6 | `sede_<slug>_fachada` | Ficha de sede · bloque 4; tarjeta de sede | **La fachada, de día, con el rótulo legible y la entrada visible.** Encuadre frontal o a tres cuartos, desde la vereda de enfrente | **3 / 2** | 1600 × 1067 px | **REAL. Obligatoria** | **P1 · una por sede** |
| F7 | `sede_<slug>_interior` | Ficha de sede · galería | Pasillo o sala de la tienda con mercancía, sin rostros identificables de clientes | 3 / 2 | 1600 × 1067 px | **REAL** | P2 · una por sede |
| F8 | `sede_<slug>_detalle` | Ficha de sede · galería | Probadores, caja, una zona característica | 1 / 1 | 1200 × 1200 px | **REAL** | P3 · una por sede |
| F9 | `equipo_trabaja` | `/trabaja` · hero | Personas reales del equipo trabajando en una tienda real | 3 / 2 | 1600 × 1067 px | **REAL. Con consentimiento de imagen firmado** | P2 |
| F10 | `equipo_nosotros` | `/nosotros` | Grupo o retrato de equipo | 3 / 2 | 1600 × 1067 px | **REAL. Con consentimiento firmado** | P3 |
| F11 | `historia_archivo` | `/nosotros` · línea de tiempo | Foto de archivo de la etapa «Remate de Fábrica», si existe | libre, encuadrable a 3 / 2 | lo que haya | **REAL de archivo** | P3 — pero es la foto con más valor de marca de la lista |
| F12 | `proveedores` | `/proveedores` | Ambiente de almacén o recepción de mercancía, sin marcas ajenas visibles | 3 / 2 | 1200 × 800 px | Real o IA | P3 |
| F13 | `og-lukers` | Todas · previsualización al compartir | Composición de marca con logotipo legible | 1200 × 630 fijo | 1200 × 630 px | Pieza gráfica | **Ya existe** (`assets/og-lukers.png`) |
| F14 | Favicon / símbolo | Todas | Símbolo LL | 1 / 1 | — | **Ya existe** (`assets/simbolo_LL_fondo_azul.png`) | — |

**Con N sedes sin confirmar, el encargo real es: `N × 2` fotos obligatorias
(F6 + F7) más 5 de portada más 1 de equipo.**
> `[PENDIENTE DE LUKERS: cuántas sedes hay, para cerrar el número de fotos.]`

### 7.3 Cómo se entregan (para el fotógrafo y para `dev`)

- **Formato de entrega:** JPEG o PNG al máximo tamaño disponible, **sin
  recortar** a la proporción final. El recorte lo hace el sistema: los
  contenedores ya tienen proporción fija (`base.css:358-375`), así que una foto
  con el motivo pegado al borde se corta. **Deja aire alrededor del sujeto.**
- **Lo que publica el sitio:** AVIF o WebP con respaldo JPEG, `srcset` en
  480/768/1200/1600, `width` y `height` siempre declarados —si no, hay salto de
  contenido—, `loading="lazy"` en todas menos en la del primer pliegue, que
  lleva `fetchpriority="high"`.
- **Presupuesto de peso:** ninguna imagen por encima de **200 KB** en la
  variante móvil. La foto de fachada es la que más se va a pedir desde la
  calle, con datos móviles.
- **Texto alternativo:** descriptivo y distinto en cada sede («Fachada de la
  tienda Lukers de <sede>, en <dirección>»). N textos idénticos son N avisos de
  contenido duplicado.
- **Mientras no haya foto:** el hueco muestra la pieza de marca en crema con
  brillos (`.media__placeholder`, `base.css:388-411`). **Nunca un emoji, nunca
  una foto de banco de imágenes genérica y nunca una foto de otra sede.** El
  hueco declarado es mejor que la foto equivocada. Esa decisión ya está tomada
  en el sistema y se respeta.
- **Fotos de personas:** hace falta autorización de uso de imagen por escrito,
  archivada. Con la Ley 29733 de por medio y siendo empleados, no es opcional.

---

## 8. Prioridades móvil y escritorio

**Supuesto de partida:** en Perú el tráfico de un negocio de retail con
143 000 seguidores en Instagram es casi todo móvil, buena parte con datos
móviles y teléfonos de gama media. **Es un supuesto, no un dato medido**: el
sitio no tiene analítica (`docs/DECISIONES.md:§5`).
`[VALIDAR con launch, en cuanto haya medición.]`
Mientras tanto, **el móvil manda y el escritorio es la versión ampliada**.

### 8.1 Qué cambia entre ambos

| Bloque | Móvil | Escritorio |
|---|---|---|
| Hero | Una columna. Titular, una línea de apoyo, **una sola acción visible sin hacer scroll**. La foto puede quedar debajo | Dos columnas, foto con presencia, acción primaria y secundaria |
| Localizador | Selector de ciudad nativo (`<select>`) + lista; sin mapa | Selector en fila + mapa a la derecha |
| Lista de sedes | Lista compacta sin foto: nombre, dirección, estado, «Cómo llegar» | Cuadrícula de 3 con foto (`.grid-3`, `base.css:215`) |
| Ficha de sede | **Barra de acción fija abajo** con «Cómo llegar»; el resto en una columna | Sin barra fija; acciones en el encabezado junto al mapa |
| Mapa | Imagen estática + «Abrir en Google Maps». **Nunca un iframe** | Mapa incrustado bajo demanda tras un clic |
| Galería de sede | Carrusel con `scroll-snap`, arrastrable | Cuadrícula |
| Marcas | Una sola fila, más lenta | Dos filas en sentidos opuestos, como está hoy (`site.css:169-171`) |
| Línea de tiempo | Lista vertical simple | Cuadrícula con hitos |
| Navegación | Menú a pantalla completa (ya existe, `site.css:374-404`) | Enlaces en línea + botón de acción |
| Brillos decorativos del hero | **Reducidos a uno, o ninguno** | Los tres (`site.css:97-99`) |

### 8.2 Qué se sacrifica en pantalla pequeña, dicho explícitamente

1. **Los brillos decorativos de fondo.** Son tres capas absolutas a pantalla
   completa con máscaras: cuestan pintado y no informan de nada.
2. **El mapa incrustado.** Se sustituye por imagen + enlace. Ahorra el peso y
   las conexiones a terceros, y además es lo que la gente quiere: abrir su
   aplicación de mapas, no mirar un mapa dentro de una web.
3. **La segunda fila del carrusel de marcas.**
4. **Las fotos de las tarjetas de sede en la lista larga.** En la ficha sí hay
   foto; en la lista, la dirección pesa más que la imagen.
5. **La galería de interior se reduce a una foto** por defecto; las demás se
   cargan si la persona desplaza el carrusel.
6. **El bloque de marcas entero, si el presupuesto de rendimiento aprieta.**

### 8.3 Qué NO se sacrifica nunca en móvil

La dirección completa, el horario y el estado; el botón «Cómo llegar»; la foto
de la fachada (es cómo se reconoce el local); el foco visible; los objetivos
táctiles de 48 px, que el sistema ya garantiza (`base.css:232`, `:455`, `:493`).

### 8.4 Presupuesto de rendimiento (propuesta para `dev` y `launch`)

- LCP por debajo de 2,5 s en móvil de gama media con conexión 4G.
- CLS por debajo de 0,1: espacio reservado para la barra de anuncio, la barra
  de acción, el estado «Abierto ahora» y toda imagen.
- Las tipografías ya cargan con `display=swap` y `preconnect`
  (`index.html:25-27`). **No se añade una tercera familia.**
- **Ninguna página debe depender de JavaScript para mostrar una dirección o un
  horario.** Las sedes ya se renderizan en el servidor
  (`server/server.js:413-438`); esa decisión se conserva y se extiende a las
  páginas nuevas.

---

## 9. Recorridos clave

**R1 · Encontrar la tienda (objetivo 1, el que importa).**
Instagram o búsqueda → `/` → localizador → ficha de sede → «Cómo llegar» →
aplicación de mapas. **Cuatro toques como máximo desde la portada.**
Variante corta, la que debería ser mayoritaria con el tiempo: ficha de Google
Business Profile → ficha de sede → «Cómo llegar». Dos toques.

**R2 · Resolver la duda antes de viajar (objetivo 1).**
Búsqueda de «¿Lukers vende online?» → `/contacto` → FAQ → `/tiendas/`.

**R3 · Suscribirse (objetivo 2).**
Cualquier página → bloque de novedades → correo + consentimiento → confirmación.
El consentimiento va **antes** del botón (`CRO_AUDIT.md:321-338`).

**R4 · Postular (objetivo 3).**
`/` o ficha de sede → `/trabaja` con la sede preseleccionada → formulario →
confirmación. **Sin DNI en el primer paso.**

**R5 · Proveedor (objetivo 4).**
Pie → `/proveedores` → correo. No se optimiza más: es el objetivo 4 de 4.

---

## 10. Qué NO debe hacer esta web

Límites explícitos, para que nadie los cruce después.

1. **No vende, no reserva y no aparta.** No hay carrito, ni ficha de producto,
   ni «consulta disponibilidad». Lukers no vende online (HALLAZGOS §1) y
   prometer lo contrario genera una decepción que se paga en la tienda.
2. **No publica stock ni disponibilidad por sede** mientras no exista un
   sistema que lo sostenga en tiempo real. «Teníamos» no es «tenemos».
3. **No publica cifras sin fuente.** Ni número de marcas, ni de empleados, ni
   porcentajes de descuento, ni años de historia. Toda cifra necesita quién la
   confirma y dónde se sostiene.
4. **No publica testimonios sin persona identificable y verificable.** La
   prueba social real —seguidores e reseñas— vale más y no hay que inventarla.
5. **No publica descuentos anunciados como porcentaje** sin precio de
   referencia documentado. INDECOPI exige poder sustentarlo
   (`docs/DECISIONES.md:§2`).
6. **No promete garantías, cambios ni devoluciones** que no existan por
   escrito, con plazo y condiciones (`docs/DECISIONES.md:§1`).
7. **No publica direcciones ni datos estructurados de sede sin verificación
   humana.** El interruptor `TIENDAS_VERIFICADAS` (`server/server.js:435`) se
   queda y no se activa por comodidad.
8. **No usa imágenes generadas para representar locales, empleados o clientes
   reales**, ni prendas con logotipos de marcas inventados o deformados.
9. **No pide más datos de los necesarios.** Cada campo nuevo de un formulario
   tiene que justificar para qué se usa y aparecer en la política de
   privacidad.
10. **No instala analítica con cookies sin banner.** La recomendación
    (Plausible o Umami, `docs/DECISIONES.md:§5`) mantiene la política de
    privacidad cierta sin añadir un banner que estorba.
11. **No reconstruye el Libro de Reclamaciones.** Ya existe uno en el sitio
    real (HALLAZGOS §10): se enlaza. Un formulario paralelo mal hecho es un
    problema legal, no una mejora.
12. **No enlaza el catálogo de `lukers.kyte.site`** mientras tenga un teléfono
    con prefijo de otro país (HALLAZGOS §11). Y si se enlaza, se enlaza como lo
    que es —un catálogo para mirar— no como una tienda.
13. **No convierte la portada en un escaparate de todo.** Un objetivo por
    bloque; el objetivo 1 primero.
14. **No añade movimiento que no se pueda apagar**, ni efectos que retrasen la
    lectura de una dirección, un horario o un precio (§6.3 y §6.4).
15. **No añade un framework, ni una tercera tipografía, ni una biblioteca de
    animación** sin que alguien demuestre que el sistema actual no llega.

---

## 11. Qué necesita `aria` de Lukers

Preguntas concretas, en el orden en que desbloquean trabajo. Las responde el
**dueño de Lukers**, salvo donde se indique otra cosa.

### Bloque A — sin esto no hay arquitectura (bloquea a `dev`, `search` y `copy`)

1. **¿Cuántas sedes hay hoy, y cuáles?** Nombre comercial exacto, ciudad,
   distrito, dirección tal como sale en Google Maps.
   → Desbloquea: el árbol `/tiendas/<ciudad>/<sede>/`, los slugs, el sitemap,
   el número de fotos a encargar y todo el SEO local.
2. **¿Alguna sede tiene horario distinto de 10:00–22:00? ¿Y en feriados?**
   → Desbloquea el componente «Abierto ahora» (S5). Sin respuesta, no se
   publica.
3. **¿Alguna sede está por abrir o cerrada temporalmente?**
   → Desbloquea los estados `proxima` y `pausa` de §3.5.
4. **¿Hay teléfono por sede, o solo una central?**
   → Decide si la ficha lleva botón «Llamar» y qué `telephone` va en los datos
   estructurados.

### Bloque B — el mensaje (bloquea a `hero` y a `copy`)

5. **¿Cuál es la razón verificable, en una frase, por la que alguien debería ir
   a Lukers?** El hecho, no el eslogan.
   → Desbloquea el hero, la promesa de portada y la meta description.
6. **De las afirmaciones de la maqueta, ¿cuáles son ciertas?** «más de 60
   marcas», «hasta 70%», «desde S/ 9.90», «más de 300 trabajadores»,
   «100% original».
   → Decide qué se puede escribir y qué se retira. Ninguna se publica sin un
   sí explícito.
7. **¿Existe política de devolución, cambio o garantía por escrito?** Si
   existe, el texto completo con plazos y condiciones.
   → Decide si hay página de garantía y si el hero puede mencionarla.
8. **¿En qué año empezó el negocio y en qué año pasó a llamarse Lukers? ¿Qué
   hitos deben aparecer?**
   → Decide si existe `/nosotros` y qué `foundingDate` va en los datos
   estructurados. Hoy la maqueta publica 2001 (`index.html:46`) frente a un
   registro de 2019.
9. **¿Qué categorías de producto quieres destacar, y cómo se llaman en
   Lukers?**
   → Decide las cuatro tarjetas de categoría y sus cuatro fotos.

### Bloque C — contenido de las páginas

10. **Las cinco preguntas que más os hacen en tienda y por Instagram, con su
    respuesta.** ¿Venden online? ¿Hacen cambios? ¿Qué tallas? ¿Aceptan Yape?
    → Desbloquea la FAQ, que es lo que evita viajes y consultas inútiles.
11. **Para cada sede: dos o tres referencias de cómo llegar** (paradero,
    esquina, centro comercial, dónde estacionar).
    → Es el contenido que hace que las N fichas no sean clones. **Sin esto, las
    páginas por sede pierden la mitad de su valor.**
12. **¿El surtido cambia entre sedes?**
    → Decide si existe el bloque 8 de la ficha de sede.
13. **¿Qué se envía a quien se suscribe, y cada cuánto?**
    → Desbloquea la promesa del bloque de newsletter (objetivo 2). «Novedades»
    a secas no convence a nadie.
14. **¿Qué puestos se ofrecen normalmente y qué se ofrece a quien entra?**
    → Desbloquea `/trabaja`.
15. **¿Qué buscáis de un proveedor y a qué correo se escribe?**
    → Decide si `/proveedores` existe.

### Bloque D — datos operativos y legales

16. **Teléfono de central, WhatsApp de atención (con prefijo +51) y correo de
    contacto.**
    → Desbloquea `/contacto`, el botón flotante (`js/config.js:20` está vacío)
    y el botón «Llamar» de las fichas.
17. **Razón social, RUC y domicilio fiscal, verificados en SUNAT** (no en un
    directorio de terceros).
    → Cierra `/privacidad`. **Debe revisarlo además un abogado**
    (`docs/DECISIONES.md:§3`).
18. **La URL exacta del Libro de Reclamaciones** que ya existe en el sitio real.
    → Desbloquea el enlace obligatorio del pie.
19. **Las cuentas reales de TikTok y Threads**, para enlazarlas bien.
    → Hoy el enlace de TikTok apuntaba al dominio sin cuenta (HALLAZGOS §5).
20. **¿A quién debe avisar la web cuando llega una postulación o un mensaje?**
    → Hoy se guardan en el panel y nadie recibe nada.

### Bloque E — fotografía y marcas

21. **¿Quién hace las fotos y para cuándo?** Ver el encargo de §7.
    → Es el camino crítico de todo lo demás.
22. **¿Hay fotos de archivo de la etapa «Remate de Fábrica»?**
    → Es la foto con más valor de marca de toda la lista.
23. **La lista real de marcas que se venden hoy**, y si hay alguna restricción
    para nombrarlas en la web.
    → Decide si existen el carrusel de marcas y la página `/marcas`.
    `[VALIDAR además con alguien de legal el uso de marcas de terceros.]`
24. **¿Se puede fotografiar al equipo y tenéis consentimiento de imagen
    firmado?**
    → Decide F9, F10 y el hero de `/trabaja`.

### Bloque F — decisiones de negocio

25. **¿El catálogo de `lukers.kyte.site` sigue activo? ¿Se enlaza?** Y el
    teléfono con prefijo +591 que aparece allí, ¿es un error?
    → Decide si hay una acción secundaria en el hero.
26. **¿Qué herramienta de analítica se contrata?** (Plausible o Umami
    recomendadas).
    → Sin esto no se puede validar ninguna decisión posterior.
27. **¿Están reclamadas las fichas de Google Business Profile de cada sede?**
    → Es lo que más clientes trae y no depende de la web. Se puede empezar hoy.
28. **De la web actual `www.lukers.pe`: el texto de cada página y el mapa del
    sitio**; qué se conserva, qué se reescribe y qué sobra.
    → Es la fase 0 de `docs/PLAN-REDISENO.md` y sigue bloqueando la validación
    de este blueprint contra lo que ya existe.

---

## 12. Inputs accionables para los siguientes agentes

### Para `hero` (HERO_UX_SPEC.md)

- El hero tiene **una acción primaria: «Encuentra tu tienda» → `/tiendas/`**.
  La secundaria queda abierta hasta resolver la pregunta 25.
- **No hay CTA de compra.** No existe.
- El hero no puede sostenerse sobre ninguna cifra hasta la pregunta 6.
- El bloque inmediatamente siguiente es el **localizador**: el hero no tiene
  que explicarlo todo, tiene que entregar a quien viene.
- Restricción técnica: **el elemento LCP no empieza en `opacity: 0`** (§6.1).
- Los tres brillos decorativos (`site.css:97-99`) se reducen en móvil.
- Las cifras animadas (`js/site.js:9-34`) se retiran mientras no se confirmen.
- Foto F1 en `4 / 5` (no `1 / 1` como dice el panel hoy).

### Para `search` (SEO_STRATEGY.md)

- **Se acepta y se amplía tu hallazgo A1** (`SEO_TECH_AUDIT.md:300-347`).
  La arquitectura aprobada es `/tiendas/` + `/tiendas/<ciudad>/` +
  `/tiendas/<ciudad>/<sede>/`, **con la regla del umbral de §3.2**: una ciudad
  con una sola sede no tiene página de ciudad aparte, para no crear dos
  documentos casi idénticos.
- Reglas de slug, barra final y ciclo de vida de una sede: §3.3 y §3.5.
- El sitemap debe generarse desde la tabla `stores`, no de una lista fija.
- `ClothingStore` y `BreadcrumbList` siguen bloqueados por
  `TIENDAS_VERIFICADAS` hasta que Lukers confirme las direcciones.
- `FAQPage` en `/contacto` cuando existan las preguntas reales.
- **Retirar `foundingDate: "2001"`** del JSON-LD de `index.html:46` hasta
  resolver la pregunta 8.
- Necesito de ti: si la regla del umbral tiene algún inconveniente que no haya
  visto, dilo como `REQUEST_FOR_CHANGE` antes de que `dev` construya.

### Para `motion` (MOTION_SYSTEM.md)

- Cinco momentos de firma, con su trabajo y su degradación: §6.1.
- Momentos descartados y por qué, para que no vuelvan: §6.2.
- **Lo que nunca se mueve: §6.3. Es una lista cerrada e innegociable.**
- La definición operativa de «moderno sin ruido» y la regla de arbitraje: §6.4.
- Huecos del sistema que te tocan: **no hay escala de duraciones** (solo
  `--t: .24s`, `base.css:76`) y **no hay escala de `z-index`** (siete valores
  sueltos, §5.3). Las duraciones, curvas y distancias son tuyas.
- Defecto concreto que te dejo verificado: con `prefers-reduced-motion`, el
  bloque de `base.css:596-604` reduce la duración de **todas** las animaciones
  a 0,01 ms, incluida la del carrusel de marcas (`site.css:170-173`), que
  salta al final de su recorrido (`translateX(-50%)`) y queda como una fila
  desplazada a medias. Con movimiento reducido, ese bloque debería convertirse
  en una **rejilla estática y legible** de nombres, no en un carrusel congelado.

### Para `copy` (WEBSITE_COPY.md)

- Sitemap y objetivo por página: §2. Bloques y su trabajo: §4.
- **Todo el contenido está pendiente.** Las 28 preguntas de §11 son tu lista de
  entrada; no escribas nada que dependa de una que siga sin responder.
- Lo que queda prohibido escribir: §10.
- Contenido único que hay que conseguir sí o sí, porque es lo que hace que las
  páginas de sede valgan algo: el párrafo propio de cada ciudad y las
  referencias de cómo llegar de cada sede (preguntas 11 y 12).
- Textos alternativos de foto distintos por sede (§7.3).
- La prueba social sustituye a los testimonios: Instagram y reseñas de Google,
  nunca citas sin dueño.

### Para `dev` (BUILD_SPEC.md)

Por orden:

1. **Rutas de recursos absolutas** (`/css/…`, `/js/…`, `/assets/…`) en todas
   las páginas, **antes** de crear rutas anidadas. Con `/tiendas/lima/sede/`,
   las rutas relativas actuales reproducen el fallo de
   `SEO_TECH_AUDIT.md:352-390` a dos niveles.
2. Escala de `z-index`, `--actionbar-h` y escala de duraciones en tokens
   (§5.3), coordinado con `motion`.
3. Columna `slug` (y `city_slug`) en `stores`, **almacenada, no derivada**, y
   estado de cuatro valores en lugar de `active` (§3.5).
4. Enrutado `/tiendas/`, `/tiendas/<ciudad>/`, `/tiendas/<ciudad>/<sede>/` con
   301 desde la variante sin barra final.
5. Sitemap generado desde la tabla.
6. Componentes nuevos de §5.2. El localizador y el estado «Abierto ahora»
   deben funcionar sin JavaScript.
7. Alinear `SLOTS` (`server/server.js:108-117`) con la tabla de §7.2: retirar
   `look_ella`, `look_el` y `look_urbano`, que no existen en ninguna página, y
   corregir las proporciones anunciadas a `4 / 5`.
8. Imágenes con `srcset`, `width`/`height` y presupuesto de 200 KB (§7.3).
9. Retirar de la portada: testimonios, línea de tiempo, sección de proveedores
   y formulario de contacto (§4.1), con sus destinos.
10. Mantener `TIENDAS_VERIFICADAS` desactivado.

---

# Contrato de entrega

## Decisiones tomadas

1. **Este blueprint define estructura y sistema, no mensaje.** Razón: el
   mensaje depende de datos que Lukers no ha entregado, y el contenido del
   repositorio es ficticio (`docs/PLAN-REDISENO.md`, `docs/DECISIONES.md:§6`).
   Todo lo que dependería de esos datos queda marcado como pendiente: 28
   preguntas numeradas en §11, siete bloqueos `[PENDIENTE DE LUKERS]` insertados
   donde se toma la decisión, y el estado del contenido declarado bloque a
   bloque en §4.
2. **Se adopta una arquitectura de directorio de sedes: `/tiendas/` +
   `/tiendas/<ciudad>/` + `/tiendas/<ciudad>/<sede>/`, con la regla del
   umbral** (una ciudad con una sola sede no tiene página de ciudad aparte).
   Razón: el objetivo 1 del negocio es la visita física y hoy las N sedes
   compiten dentro de un ancla no indexable (`server/server.js:466-487`,
   `SEO_TECH_AUDIT.md:300-347`). La regla del umbral evita crear pares de
   páginas casi idénticas, que es el riesgo de la solución ingenua.
3. **Ciclo de vida de una sede con cuatro estados** (`proxima`, `activa`,
   `pausa`, `cerrada`) en lugar del `active 0/1` actual (`server/db.js:94`),
   con 301 al concentrador de ciudad en el cierre definitivo y **sin ninguna
   redirección necesaria cuando una ciudad pasa de una a dos sedes**.
4. **La portada pasa de diez secciones de contenido a ocho**, y cuatro de las
   actuales salen con destino: testimonios (se retiran), historia (a
   `/nosotros`), proveedores (a `/proveedores`) y formulario de contacto (a
   `/contacto`); entran el localizador de sede y la prueba social verificable.
   Razón: `CRO_AUDIT.md:248-259` midió 19,8 pantallas con cuatro objetivos
   apilados.
5. **Nueve páginas en el nivel 1 y cinco condicionadas al nivel 2.** Razón:
   una página sin contenido real es peor que su ausencia. Las descartadas
   están en §2.3 con motivo.
6. **Se conserva íntegro el sistema de diseño y la arquitectura técnica.** No
   se propone framework, ni tercera tipografía, ni biblioteca de animación. Se
   señalan tres huecos de tokens (movimiento, `z-index`, `--actionbar-h`) y
   dos desajustes verificados entre el panel y las páginas (§5.3).
7. **Cinco momentos de firma, siete descartados y once elementos que nunca se
   mueven** (§6). Cada momento declara su coste y su degradación; el que no
   podía degradarse no entró.
8. **La proporción de los huecos de imagen se fija en `4 / 5`** para hero y
   categorías, que es lo que ya está construido (`index.html:130,156-174`), y
   se corrige el texto del panel en vez del CSS.
9. **Las fotos de sede y de equipo son reales, sin excepción**, y se explicita
   el matiz frente al manual de marca, que prioriza IA en el estilo «personas
   en tienda» (`guia-marca.md:62`): eso vale para redes sociales, no para una
   página que va acompañada de una dirección (§7.1).
10. **La prueba social pasa a ser verificable** (Instagram y reseñas de
    Google) y los tres testimonios se retiran.
11. **No se propone tocar `TIENDAS_VERIFICADAS`** ni ningún dato ficticio: no
    es mi alcance y la decisión de mantenerlo desactivado es correcta.

## Evidencia utilizada

- `AGENTS.md`, `.claude/agents/aria.md`, `docs/agent-workflow/HANDOFF_TEMPLATE.md`.
- `docs/PLAN-REDISENO.md` — fases, dependencias y estado real del proyecto.
- `docs/HALLAZGOS-WEB-PUBLICA.md` — lo poco que se sabe de la Lukers real.
- `docs/DECISIONES.md` — decisiones ya aceptadas sobre contenido publicado.
- `docs/DATOS-QUE-NECESITO.md` — plantilla de datos ya enviada al dueño.
- `.claude/skills/marca-lukers/SKILL.md` y `references/guia-marca.md` — paleta,
  tipografía, brillo, estilos fotográficos (§5, §6).
- `css/base.css` (612 líneas) y `css/site.css` (449) — inventario de
  componentes y tokens de §5, leídos completos.
- `index.html` — orden de secciones (`:97-424`), `data-slot` (`:130,156-174`),
  JSON-LD (`:37-52`), carga de tipografías (`:25-27`).
- `trabaja.html`, `postulaciones.html`, `privacidad.html`, `404.html`.
- `server/server.js` — rutas (`:447-464`), sitemap (`:466-487`), `robots.txt`
  (`:488-504`), `SLOTS` (`:108-117`), tarjetas y JSON-LD de tienda
  (`:355-438`), interruptor `TIENDAS_VERIFICADAS` (`:435`).
- `server/db.js` — esquema de `stores` (`:87-104`), aviso de datos ficticios
  (`:12-26`).
- `js/config.js` (WhatsApp vacío, `:20`), `js/reveal.js`, `js/site.js`
  (contadores, `:9-34`).
- Entregables previos: `SEO_TECH_AUDIT.md` (hallazgos A1, A2, A3 y §C1),
  `CRO_AUDIT.md` (§1.2, §3.3, §3.4, experimentos 1-3, peticiones a `aria`).

## Supuestos

1. **El tráfico de Lukers es mayoritariamente móvil y con datos.** Es
   razonable para retail peruano con presencia fuerte en Instagram, pero **no
   está medido**: el sitio no tiene analítica. Condiciona §8 entero.
2. **Las audiencias de §1 son una hipótesis derivada de los cuatro objetivos
   declarados**, no una investigación de usuarios. No hay investigación en el
   repositorio y no la he inventado.
3. **Lima concentra varias sedes y las ciudades de provincia tienen una cada
   una.** Se deduce de HALLAZGOS §1. Si Trujillo tuviera dos, la regla del
   umbral de §3.2 ya lo contempla sin cambios.
4. **El horario 10:00–22:00 es común a todas las sedes** (HALLAZGOS §6). El
   componente «Abierto ahora» depende de ello y no se publica sin confirmar.
5. **El soporte de transiciones entre documentos es suficiente** en los
   navegadores del tráfico real (S3). El coste de equivocarse es cero: quien
   no lo soporta navega normal.
6. **Las categorías de producto seguirán siendo cuatro.** Es lo que hay
   construido; si Lukers dice otra cosa, la cuadrícula lo admite.
7. **El sitio real `www.lukers.pe` tiene una sección «Institucional»**
   (HALLAZGOS §10), lo que sugiere que parte de la arquitectura propuesta ya
   existe allí con otros nombres. **Este blueprint no se ha podido contrastar
   con el sitio real**, que nadie del proyecto ha visto.

## Información faltante

Las 28 preguntas de §11 son la lista completa. Las que bloquean de verdad:

1. **Cuántas sedes hay y cuáles son sus direcciones exactas** — lo confirma el
   dueño. Bloquea: toda la arquitectura de §3, los slugs, el sitemap, el
   encargo fotográfico y el SEO local. *Es el camino crítico del proyecto.*
2. **La razón verificable por la que ir a Lukers** — el dueño. Bloquea el hero,
   la portada y la meta description.
3. **Qué afirmaciones de la maqueta son ciertas** — el dueño. Bloquea todo el
   copy.
4. **Referencias de cómo llegar, por sede** — el dueño o los jefes de tienda.
   Sin esto las fichas de sede son clones y pierden la mitad de su valor.
5. **Horarios excepcionales y feriados** — el dueño. Bloquea el componente
   «Abierto ahora».
6. **RUC, razón social y domicilio fiscal verificados en SUNAT**, más revisión
   de un abogado — el dueño y un abogado. Bloquea `/privacidad`.
7. **URL real del Libro de Reclamaciones** — el dueño. Bloquea el pie.
8. **Teléfono y WhatsApp con prefijo peruano** — el dueño. Bloquea `/contacto`,
   el botón flotante y el botón «Llamar».
9. **Lista real de marcas y permiso para nombrarlas** — el dueño y legal.
   Bloquea el carrusel y `/marcas`.
10. **Quién hace las fotos y cuándo** — el dueño. Bloquea §7, que es lo que
    más tarda.
11. **Texto y mapa del sitio actual `www.lukers.pe`** — el dueño. Sin esto no
    se puede saber qué se conserva ni qué URL habría que redirigir.
12. **Qué analítica se contrata** — el dueño. Sin medición no se puede validar
    ninguna decisión de este documento.

## Riesgos identificados

1. **Publicar N fichas de sede clonadas.** Probabilidad alta si no llegan las
   referencias de cómo llegar (pregunta 11); impacto alto: contenido pobre
   multiplicado por N empeora el SEO en vez de mejorarlo. *Mitigación:* no
   publicar una ficha de sede sin foto real y sin al menos dos referencias
   propias; mientras tanto, dejarla dentro del concentrador de ciudad.
2. **Publicar direcciones equivocadas.** Probabilidad media-alta (siete de doce
   no coincidían, HALLAZGOS §1); impacto muy alto: gente enviada a la puerta
   equivocada y a Google enseñándole la ubicación falsa. *Mitigación:*
   `TIENDAS_VERIFICADAS` sigue desactivado y la verificación es una por una.
3. **Que el encargo fotográfico no se haga y la web se publique con huecos.**
   Probabilidad media; impacto alto: ninguna cantidad de animación compensa la
   ausencia de fotos (§6.0). *Mitigación:* §7.2 está pensada para poderse
   pasar tal cual a un fotógrafo; empezar por F6 (fachadas), que es lo único
   verdaderamente obligatorio.
4. **Que «animaciones llamativas» se interprete como espectáculo.**
   Probabilidad media; impacto alto en móvil y en accesibilidad. *Mitigación:*
   §6.2, §6.3 y §6.4 son listas cerradas y la regla de arbitraje es explícita.
5. **Que la arquitectura de §3 choque con la del sitio real**, que nadie ha
   visto. Probabilidad media; impacto medio: obligaría a un plan de
   redirecciones. *Mitigación:* pedir el mapa del sitio actual (pregunta 28)
   antes de que `dev` construya rutas.
6. **Complejidad operativa del ciclo de vida de sedes.** Probabilidad media;
   impacto medio: si abrir o cerrar una tienda exige tocar código, no se hará
   bien. *Mitigación:* los cuatro estados se gestionan desde el panel; ninguna
   de las operaciones de §3.5 debería requerir un despliegue.
7. **Que el bloque de marcas nunca se pueda publicar** por no poder verificar
   la lista. Probabilidad media; impacto bajo-medio: la portada pierde un
   bloque de apoyo a la promesa. *Mitigación:* la portada de §4.1 funciona sin
   él; el bloque es condicional por diseño.
8. **Dependencia de un único interlocutor.** Las 28 preguntas las responde
   prácticamente la misma persona. *Mitigación:* §11 está ordenada por lo que
   desbloquea, para poder ir por partes; `docs/DATOS-QUE-NECESITO.md` ya
   ofrece el formato.

## Cambios solicitados a otros agentes

- **`REQUEST_FOR_CHANGE → search`:** tu hallazgo A1
  (`SEO_TECH_AUDIT.md:300-347`) propone `/tiendas` + `/tiendas/<slug>` plano.
  *Cambio:* pasar a `/tiendas/<ciudad>/<sede>/` con la regla del umbral de
  §3.2. *Evidencia:* con un solo nivel no hay dónde colocar la intención «ropa
  de marca en <ciudad>», y con ciudades de sede única el esquema plano crea dos
  documentos casi idénticos. *Efecto esperado:* una URL por intención real, sin
  páginas duplicadas. **No he tocado tu documento**; si ves un inconveniente,
  respóndelo antes de que `dev` construya.
- **`REQUEST_FOR_CHANGE → dev`:** retirar los contadores animados de cifras
  (`js/site.js:9-34`) y el `foundingDate: "2001"` del JSON-LD
  (`index.html:46`). *Evidencia:* ambos animan o declaran datos que
  `docs/DECISIONES.md:§6` identifica como inventados. *Efecto esperado:* dejar
  de publicar afirmaciones sin respaldo.
- **`REQUEST_FOR_CHANGE → dev`:** alinear `SLOTS` (`server/server.js:108-117`)
  con §7.2. *Evidencia:* `look_ella`, `look_el` y `look_urbano` no aparecen en
  ninguna página, y las proporciones anunciadas (`1/1` y `16/10`) no coinciden
  con los contenedores reales, que son `media--4x5`
  (`index.html:130,156,162,168,174`). *Efecto esperado:* que quien suba una
  foto obtenga el recorte que esperaba. *(Coincide con `CRO_AUDIT.md` §3.4.)*
- **`REQUEST_FOR_CHANGE → motion`:** el bloque de `prefers-reduced-motion`
  (`base.css:596-604`) deja el carrusel de marcas congelado a mitad de
  recorrido en lugar de neutralizarlo. *Efecto esperado:* con movimiento
  reducido, una rejilla estática legible.
- **Respuesta a `CRO_AUDIT.md` (petición E1/E3 a `aria`):** aceptada e
  incorporada. El filtro por ciudad es el componente `.store-finder` (§5.2) y
  el bloque 4 de la portada; la ficha por sede es §4.4; la portada baja de
  cuatro objetivos apilados a uno dominante (§4.1).
- **Ninguno para `hero`, `copy` ni `launch`:** sus entregables aún no existen o
  no entran en conflicto con este.

## Output para el siguiente agente

**Archivos que debe leer, en este orden:**

1. `docs/PLAN-REDISENO.md` y `docs/HALLAZGOS-WEB-PUBLICA.md` — **antes que
   nada**: explican por qué el contenido del repositorio no se puede usar.
2. `docs/DECISIONES.md` — decisiones ya aceptadas sobre lo publicable.
3. Este documento.
4. `docs/agent-workflow/deliverables/SEO_TECH_AUDIT.md` (hallazgos A1-A3, C1) y
   `CRO_AUDIT.md` (§1.2, §3.3, experimentos 1-3).
5. `.claude/skills/marca-lukers/SKILL.md` y `references/guia-marca.md`.

**Decisiones que debe respetar:**

- La jerarquía de objetivos: tiendas físicas > suscriptores > postulaciones >
  proveedores. Es la regla de desempate de todo.
- La arquitectura `/tiendas/<ciudad>/<sede>/` con la regla del umbral (§3.2) y
  el ciclo de vida de §3.5.
- Los límites de §10 y la lista de lo que nunca se mueve (§6.3).
- Fotos de sede y de equipo reales, sin excepción (§7.1).
- Conservar el sistema de diseño, Express y SQLite; nada de framework.
- No publicar ningún dato de la maqueta y mantener `TIENDAS_VERIFICADAS`
  desactivado.

**Preguntas que siguen abiertas:** las 28 de §11. Las cuatro que bloquean el
camino crítico son la 1 (cuántas sedes y sus direcciones), la 5 (la razón
verificable para ir), la 11 (referencias de cómo llegar por sede) y la 21
(quién hace las fotos).

**Siguiente paso según `AGENTS.md`:** `hero` (HERO_UX_SPEC.md) y `search`
(primera fase de SEO_STRATEGY.md), en paralelo. Ambos pueden avanzar en
estructura, pero **ninguno puede cerrar mensaje ni copy** hasta que lleguen las
respuestas del bloque B de §11.
