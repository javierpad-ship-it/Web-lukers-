# WEBSITE_COPY — Lukers

Agente: `copy` · Versión 1 · Fecha: 2026-09-18
Alcance: `index.html`, `trabaja.html`, microcopy servida por `server/server.js`,
mensajes de `js/site.js`, `js/trabaja.js`, `js/ui.js`, y una sección de preguntas
frecuentes **nueva**. Referencias legales en `privacidad.html`.

> **Este documento no modifica el producto.** Es el guion de texto que debe
> implementar `dev`. Nada de lo que sigue inventa un hecho: cuando el texto
> actual afirma algo que el repositorio no puede comprobar, se conserva la
> afirmación y se marca `[VALIDAR]` con la pregunta exacta que el dueño debe
> responder. Si una respuesta es "no existe", el texto **no se publica**.

---

## 0. Cómo leer este documento

Cada bloque trae tres cosas:

1. **Trabajo que hace**: `comprensión` (que la persona entienda qué es Lukers y
   qué va a encontrar) o `conversión` (que dé el siguiente paso: ir a la tienda,
   suscribirse, postular, escribir como proveedor).
2. Una tabla **Actual → Propuesta**, para comparar en línea.
3. **Por qué** el cambio, y los `[VALIDAR]` que arrastra.

Cuando un texto ya está bien, aparece marcado **`SE MANTIENE`** y no se toca.
Hay bastantes: el sitio actual está bien escrito y el riesgo aquí no es el
estilo, es la veracidad.

Convenciones:

- `[VALIDAR]` = afirmación existente que se conserva pero que nadie ha
  verificado en el repositorio. Va acompañada de la pregunta concreta.
- `[NO PUBLICAR SIN DATO]` = texto que no puede salir hasta que exista el dato.
  Se marca así cuando publicarlo sin confirmar crea un compromiso legal o
  comercial.

---

## 1. Lo primero: las afirmaciones que hay que validar

Esta es la sección que el dueño debe leer antes que cualquier otra. Todas estas
frases **ya están publicadas** en el sitio. Yo no las invento y no las borro:
las conservo y pido su confirmación.

| # | Afirmación publicada | Dónde | Pregunta concreta que debe responder el dueño | Riesgo si es falsa |
|---|---|---|---|---|
| V1 | «Si no es original, te devolvemos tu dinero.» | `index.html:139` | ¿Existe una política formal escrita de devolución por falta de originalidad? ¿Con qué plazo, qué requisitos (boleta, prenda sin uso, etiqueta) y quién la autoriza en tienda? | **Alto — legal.** Es una promesa de consumo exigible ante INDECOPI. Publicada sin política detrás, cualquier cliente puede reclamarla y el personal de tienda no sabrá qué hacer. |
| V2 | «100% original, garantizado» | `index.html:126` | ¿Toda la mercadería, en las 12 tiendas y en todas las categorías, es original de marca? ¿Se puede sostener el "100%" sin excepciones? | **Alto — legal y reputacional.** Un "100%" no admite matices. |
| V3 | «Más de 60 marcas» / «60 marcas originales» | `index.html:8`, `:16`, `:113`, `:122` | ¿Cuántas marcas se comercializan hoy? La base de datos del propio sitio solo carga **24** (`server/db.js:28-30`). ¿El carrusel está incompleto o la cifra está inflada? | **Alto — contradicción interna verificable.** El visitante cuenta las marcas del carrusel y le salen 24. |
| V4 | «hasta 70% de descuento» | `index.html:8`, `:16`, `:113`, `:124` | ¿Existe hoy mercadería con 70% de descuento sobre el precio regular? ¿Es permanente o solo en campaña? ¿Sobre qué precio se calcula el descuento? | **Alto — legal.** El Código del Consumidor exige que el precio de referencia sea real y que el descuento máximo anunciado exista de verdad en tienda. |
| V5 | «Marcas originales de USA y Europa» · «Sin intermediarios» | `index.html:109`, `:114` | ¿Lukers importa directamente de la marca o compra a distribuidores/mayoristas? "Sin intermediarios" describe una cadena de suministro concreta. | Medio. Si hay distribuidores de por medio, la frase es incorrecta y además debilita la relación con esos proveedores. |
| V6 | «Más de 300 compañeros en todo el Perú» | `trabaja.html:111` | ¿Cuántas personas trabajan hoy en Lukers (planilla, todas las sedes)? | Medio. Es la cifra más fácil de desmentir por un ex trabajador. |
| V7 | «Planilla, beneficios de ley y un ambiente de trabajo sano» · «Línea de carrera real» · «Capacitación constante» | `trabaja.html:82-114` | ¿Todo el personal de tienda está en planilla desde el primer día? ¿Existe un programa de capacitación y una ruta de ascenso documentada? | Medio-alto. Promesa laboral publicada; un postulante puede reclamarla. |
| V8 | Los tres testimonios (Carlos R., María S., Luis A.) | `index.html:286-300` | ¿Son personas reales que dieron su consentimiento por escrito para ser citadas? ¿Se conserva ese consentimiento? | **Alto — legal (Ley 29733) y de confianza.** Un testimonio inventado es publicidad engañosa. Ver apartado 11 y decisión 7. |
| V9 | «Lunes a domingo · 10:00 a. m. – 10:00 p. m.» | `index.html:379`, `server/db.js:78` | ¿Las 12 tiendas abren exactamente en ese horario, también domingos y feriados? ¿Los centros comerciales imponen otro horario? | Medio. Es la causa número uno de viaje en vano, que es justo lo que la web debe evitar. |
| V10 | «Ya abrimos Lukers Jr. de la Unión, nuestra tienda más moderna» | `index.html:62` | ¿Qué fecha tiene la apertura? ¿Hasta cuándo debe seguir el aviso en la barra superior? | Bajo, pero caduca: un "ya abrimos" de hace un año resta credibilidad al resto del sitio. |
| V11 | «Revisamos todas las que llegan» (propuestas de proveedores) | `index.html:321-322` | ¿Hay alguien asignado a leer `hola@lukers.pe`? ¿En cuántos días hábiles se responde a un proveedor? | Medio. Es una promesa de servicio sin dueño operativo. |
| V12 | «Te responderemos pronto» (contacto) y «te contactaremos pronto» (postulación) | `server/server.js:416`, `:631` | ¿Quién revisa los mensajes y las postulaciones, y con qué frecuencia? | **Alto — operativo.** Ver hallazgo H1: hoy nadie recibe un aviso cuando alguien escribe. |
| V13 | Newsletter: «Te avisamos cuando llegan marcas nuevas y cuando empiezan las campañas» | `index.html:340` | ¿Con qué herramienta se enviarán los correos y quién los redacta? ¿Existe enlace de baja? | **Alto — legal.** `privacidad.html` promete que *cada* comunicación incluirá cómo darse de baja. Ver hallazgo H2. |
| V14 | «12 tiendas en el Perú» | `index.html:123` | ¿Se actualizará ese número cada vez que abra o cierre una tienda? | Bajo, pero es una cifra escrita a mano mientras la lista real vive en la base de datos. Ver `REQUEST_FOR_CHANGE → dev`. |

### Hallazgos operativos que afectan al texto

- **H1 — El formulario de contacto no avisa a nadie.** `POST /api/contact`
  (`server/server.js:401-417`) guarda el mensaje en la tabla `messages` y
  responde «Te responderemos pronto». No se envía ningún correo: alguien tiene
  que entrar a `/admin` a mirar. Lo mismo con las postulaciones
  (`server/server.js:616-632`). Mientras no haya un aviso automático o una
  rutina diaria de revisión, **el texto no debe prometer rapidez**; la propuesta
  de abajo dice qué hacer mientras tanto.
- **H2 — El newsletter no tiene cómo enviar ni cómo dar de baja.** El servidor
  solo guarda el correo (`server/server.js:370-393`). No hay proveedor de envío
  ni endpoint de baja, y `privacidad.html` (sección 4) promete lo contrario.
- **H3 — WhatsApp está apagado.** `js/config.js` trae `WHATSAPP_NUMBER: ""`, así
  que todos los botones de WhatsApp se eliminan del DOM (`js/ui.js:64-69`).
  Bien resuelto técnicamente, pero significa que hoy **el único canal de
  contacto es un correo**. La FAQ y el pie se redactan sin dar por hecho el
  WhatsApp, con una variante lista para cuando exista el número.
- **H4 — No hay teléfono.** El bloque de central telefónica está comentado
  (`index.html:372-376`). Para una cadena de tiendas físicas en Perú, el
  teléfono es el dato que más se busca después de la dirección.
- **H5 — No existe componente de FAQ.** No hay estilos ni marcado para
  preguntas frecuentes (`css/site.css` no tiene `.faq` ni `details`). La sección
  nueva del apartado 14 la tiene que construir `dev`.

---

## 2. Voz de Lukers (reglas para escribir, no texto publicable)

Derivadas del concepto de marca (`.claude/skills/marca-lukers/references/guia-marca.md`,
sección 1: distintiva, funcional, distinguida) y del tipo de cliente que entra
a la web: alguien que quiere ropa de marca y está decidiendo **si vale la pena
ir hasta la tienda**.

1. **Hablamos de tú, sin diminutivos ni jerga forzada.** "Encuentra tu tienda",
   no "Encuentre su tienda" ni "Chequea acá".
2. **Un dato antes que un adjetivo.** "12 tiendas, de Lima a Iquitos" pesa más
   que "presencia nacional".
3. **Precio con dignidad.** La promesa es "mejores precios", no "barato". Nunca
   se sugiere que la ropa es de menor calidad por costar menos.
4. **Frases cortas.** Máximo dos ideas por oración. El 70% del tráfico de retail
   peruano es móvil y se lee de pie.
5. **Cada afirmación se puede sostener en tienda.** Si un vendedor no puede
   cumplir lo que dice la web, la web no lo dice.
6. **No se grita.** MAYÚSCULAS solo en material de remate, según el brandbook;
   en la web institucional, no.
7. **El cierre siempre es una acción física**: ir, ver, probarse, preguntar en
   tienda. La web no vende, la web mueve gente a la tienda.
8. **✦ se usa como signo de marca, no como emoji.** Los emoji tipo 🙂 no son del
   sistema gráfico; el brillo sí.

---

## 3. Barra de aviso (announce)

**Trabajo que hace:** conversión — empuja tráfico a la tienda nueva.

| Actual (`index.html:59-66`) | Propuesta |
|---|---|
| ✦ Ya abrimos **Lukers Jr. de la Unión**, nuestra tienda más moderna del Centro Histórico de Lima · [Conoce nuestras sedes] | ✦ Nueva tienda: **Lukers Jr. de la Unión**, en el Centro Histórico de Lima · [Ver dirección y horario] |

**Por qué.** Dos mejoras pequeñas y un riesgo que se retira.
"Ya abrimos" caduca solo; "Nueva tienda" aguanta más tiempo y sigue siendo
cierto. Y el enlace cambia de "Conoce nuestras sedes" (vago) a "Ver dirección y
horario", que es literalmente lo que la persona quiere saber para ir.

Se retira **"nuestra tienda más moderna"**: es un superlativo comparativo contra
las otras 11 tiendas propias, no aporta a la decisión y no se puede sostener.
Si el dueño quiere conservarlo → `[VALIDAR]` **V10**.

**Regla de caducidad (para `dev`):** este aviso debe poder apagarse sin tocar
código. Si no se puede, ponerle fecha de retiro en el calendario.

---

## 4. Navegación

**Trabajo que hace:** comprensión — en seis palabras tiene que quedar claro qué
se puede hacer aquí.

| Actual (`index.html:74-81`) | Propuesta | Motivo |
|---|---|---|
| Categorías | Qué encontrarás | "Categorías" es lenguaje de e-commerce en un sitio que no vende online. |
| Marcas | Marcas | **SE MANTIENE.** Es el término que la gente busca. |
| Tiendas | Tiendas | **SE MANTIENE.** |
| Nosotros | Nosotros | **SE MANTIENE.** |
| Trabaja con nosotros | Trabaja con nosotros | **SE MANTIENE.** Es el término que se busca en Perú ("trabaja con nosotros Lukers"), mejor que "Empleo" o "Únete". |
| Proveedores | Proveedores | **SE MANTIENE.** |
| — | **Preguntas frecuentes** | Entra la sección nueva (apartado 14). |

**Orden propuesto:** Qué encontrarás · Marcas · Tiendas · Preguntas frecuentes ·
Nosotros · Trabaja con nosotros · Proveedores.

Razón del orden: primero lo que resuelve la duda del comprador (qué hay, de qué
marcas, dónde, y las dudas típicas), después lo institucional. Proveedores va al
final porque es la audiencia más pequeña y llega por enlace directo o por el pie.

**Botón de la cabecera**

| Actual (`index.html:87`) | Propuesta |
|---|---|
| Ver tiendas | Ver tiendas |

**SE MANTIENE.** Es corto, es la acción principal del sitio y no promete nada
que no cumpla. No hay razón para cambiarlo.

**Aviso para `dev`:** con siete enlaces, la barra ya no cabe cómoda en escritorio
mediano. Es decisión de `aria`/`dev`, no mía, pero el texto está pensado para
que "Preguntas frecuentes" pueda vivir también solo en el pie si la barra se
satura.

---

## 5. Portada (hero)

**Trabajo que hace:** conversión — en una pantalla: qué vendemos, por qué es
creíble, y adónde ir.

### Eyebrow

| Actual (`index.html:107-110`) | Propuesta |
|---|---|
| ✦ Marcas originales de USA y Europa | ✦ Ropa de marca original, en tienda |

**Por qué.** El eyebrow actual arrastra `[VALIDAR]` **V5** (el origen de la
mercadería). La propuesta dice lo mismo que la marca puede sostener sin saber de
dónde viene cada prenda, y además mete dos términos que la gente busca en Perú
("ropa de marca", "ropa original") sin forzarlos.

Si **V5** se confirma, la versión con origen es mejor y se puede volver a ella:
`✦ Marcas originales de USA y Europa`.

### H1

| Actual (`index.html:111`) | Propuesta |
|---|---|
| Mejores marcas, **mejores precios.** | Mejores marcas, **mejores precios.** |

**SE MANTIENE, y no debe tocarse.** Es el concepto de marca del brandbook
(`guia-marca.md`, sección 1). Un H1 que coincide con la promesa de marca es una
ventaja que pocos negocios tienen.

### Texto de apoyo (lead)

| Actual (`index.html:112-115`) | Propuesta |
|---|---|
| Más de 60 marcas originales con hasta **70% de descuento**, en tu tienda Lukers más cercana. Sin intermediarios y con garantía de autenticidad. | Ropa de marca original para toda la familia, a precio de verdad. Estamos en 12 tiendas, de Lima a Iquitos: ven, pruébatela y llévatela el mismo día. |

**Por qué.** La versión actual apoya toda su credibilidad en tres cifras sin
verificar (**V3**, **V4**, **V5**). La propuesta apoya la credibilidad en el
único hecho que el propio sistema comprueba: 12 tiendas reales con dirección
(`server/db.js:12-25`). Además convierte mejor, porque nombra la ventaja que
tiene una tienda física frente a comprar por internet: **probártela y llevártela
hoy**.

**Versión alternativa, solo si V3 y V4 se confirman tal cual:**

> Más de 60 marcas originales con hasta **70% de descuento**, en tu tienda
> Lukers más cercana. Ven, pruébatela y llévatela el mismo día.

### Botones

| Actual (`index.html:116-119`) | Propuesta |
|---|---|
| Encuentra tu tienda · Ver categorías | Encuentra tu tienda · Qué vas a encontrar |

"Encuentra tu tienda" **SE MANTIENE**: es exactamente la acción que queremos.
El secundario cambia por coherencia con la navegación y porque "categorías"
no significa nada fuera del comercio electrónico.

### Cifras del hero

**Trabajo que hace:** comprensión + prueba.

| Actual (`index.html:122-126`) | Propuesta | Estado |
|---|---|---|
| **60** marcas originales | **24** marcas originales | `[VALIDAR]` **V3**. Mientras no se confirme, la cifra debe salir de la base de datos, no estar escrita a mano. Hoy la base tiene 24. |
| **12** tiendas en el Perú | **12** tiendas en el Perú | **SE MANTIENE** el texto. Coincide con `server/db.js`. `[VALIDAR]` **V14**: que el número se calcule solo. |
| **70%** de descuento | **70%** de descuento | `[NO PUBLICAR SIN DATO]` **V4**. Si el 70% no existe hoy en tienda, esta cifra sale del hero. |
| **100%** original, garantizado | **100%** original, garantizado | `[VALIDAR]` **V2**. Es la cifra más valiosa del sitio si es verdad y la más peligrosa si no. |
| — | **25** años en el Perú | **Propuesta nueva, ya verificable.** La fundación en 2001 está declarada en el JSON-LD del propio sitio (`index.html:46`) y en la línea de tiempo. En retail peruano, la antigüedad es la prueba de confianza más barata y más difícil de falsificar. `[VALIDAR]` menor: ¿2001 es el año exacto de la primera tienda? |

**Si V2, V3 y V4 no se pueden confirmar**, el bloque de cifras honesto sería:
**25** años en el Perú · **12** tiendas · **5** ciudades · **7** días a la semana.
Todos esos datos están hoy en el repositorio y ninguno necesita permiso.

### Caja de garantía

| Actual (`index.html:136-140`) | Propuesta |
|---|---|
| **Garantía de originalidad** — Si no es original, te devolvemos tu dinero. | **Garantía de originalidad** — [texto según V1] |

`[NO PUBLICAR SIN DATO]` **V1**. Esta frase es la más delicada de todo el sitio.
Tres caminos, según lo que responda el dueño:

- **Si existe la política formal:** conservar la frase y añadir el detalle que la
  hace creíble y defendible.
  > **Garantía de originalidad.** Si compras en Lukers y la prenda no es
  > original, te devolvemos tu dinero. Presenta tu boleta en cualquiera de
  > nuestras tiendas. `[VALIDAR: plazo y requisitos exactos]`
- **Si no existe como política escrita pero la empresa la quiere asumir:** hay
  que redactarla, aprobarla y recién después publicarla.
- **Si no existe y no se va a crear:** la frase **debe retirarse** y se sustituye
  por lo que sí es cierto:
  > **Trabajamos solo con marcas originales.** Cada prenda llega con su etiqueta
  > y su marca. Si tienes una duda, pregúntale a cualquier vendedor en tienda.

---

## 6. Qué vas a encontrar (categorías)

**Trabajo que hace:** comprensión — para quién es esta tienda y qué hay adentro.

| Actual (`index.html:147-150`) | Propuesta |
|---|---|
| **Eyebrow:** Qué encuentras | ✦ Qué vas a encontrar |
| **H2:** Ropa de marca para toda la familia | Ropa de marca para toda la familia |
| **Lead:** Formal, casual, calzado y accesorios. Las marcas que conoces, al precio que sí puedes pagar. | Formal, casual, calzado y accesorios. Las marcas que conoces, al precio que sí puedes pagar. |

**El H2 y el lead SE MANTIENEN.** "Al precio que sí puedes pagar" es la mejor
línea del sitio: dice el posicionamiento sin decir "barato" y sin prometer un
porcentaje. No la toquen.

### Tarjetas

| Actual | Propuesta | Motivo |
|---|---|---|
| **Formal** — Ternos, camisas y sastrería | **Formal** — Ternos, camisas y pantalones de vestir | "Sastrería" sugiere confección a medida, que no es lo que se vende. `[VALIDAR]`: ¿se vende terno completo, o saco y pantalón por separado? |
| **Casual** — Jeans, polos y casacas | **Casual** — Jeans, polos y casacas | **SE MANTIENE.** Tres palabras exactas y en peruano. |
| **Calzado** — Zapatillas y zapatos de vestir | **Calzado** — Zapatillas y zapatos de vestir | **SE MANTIENE.** "Zapatillas" es además un término de búsqueda fuerte. |
| **Accesorios** — Correas, carteras y más | **Accesorios** — Correas, carteras y billeteras | "y más" no informa. `[VALIDAR]`: ¿billeteras entra en el surtido habitual? Si no, dejar "Correas y carteras". |

**Nota de conversión:** las cuatro tarjetas enlazan hoy a `#tiendas`
(`index.html:154`, `:160`, `:166`, `:172`). Está bien pensado —no hay catálogo
que mostrar—, pero el texto debe avisarlo para que el clic no se sienta un
engaño. Propuesta de línea de cierre bajo la grilla:

> No vendemos por internet: todo esto lo ves, te lo pruebas y te lo llevas en
> tienda. [Encuentra la tuya →]

**Trabajo que hace:** comprensión — responde por adelantado la segunda pregunta
más frecuente y evita una frustración.

---

## 7. Marcas

**Trabajo que hace:** comprensión + prueba — "¿tienen las marcas que me importan?".

| Actual (`index.html:185-188`) | Propuesta |
|---|---|
| **Eyebrow:** Nuestro portafolio | ✦ Marcas |
| **H2:** Las marcas que encuentras en Lukers | Las marcas que encuentras en Lukers |
| **Lead:** Seleccionadas por calidad y trayectoria. Todas originales, todas con garantía. | Marcas que ya conoces, originales, en todas nuestras tiendas. Lo que hay en stock cambia cada semana: lo más seguro es pasar por tienda. |

**El H2 SE MANTIENE.** "Portafolio" es lenguaje de oficina, no de cliente; el
eyebrow se simplifica.

**Por qué el lead cambia.** "Todas con garantía" repite la afirmación de **V1**
en un segundo lugar del sitio: si esa política se retira, hay que retirarla aquí
también. Y la línea nueva hace un trabajo de conversión real: gestiona la
expectativa de stock (un motivo clásico de reclamo) y vuelve a empujar a la
tienda.

**Estado vacío de la sección** (hoy, si la API falla, la sección entera se
elimina — `js/site.js:154`). Eso está **bien resuelto**: una sección de marcas
vacía es peor que ninguna. **SE MANTIENE la decisión.** Solo una nota: si el
número del hero pasa a leerse de la base de datos (**V3**), ambos deben caer
juntos.

---

## 8. Tiendas

**Trabajo que hace:** conversión — esta es la sección que produce visitas.
Es la más importante del sitio.

| Actual (`index.html:197-200`) | Propuesta |
|---|---|
| **Eyebrow:** Dónde estamos | ✦ Dónde estamos |
| **H2:** Encuentra tu tienda Lukers | Encuentra tu tienda Lukers |
| **Lead:** Estamos en Lima y en provincias. Elige la tuya y ve cómo llegar. | 12 tiendas de ropa de marca en Lima, Trujillo, Chiclayo, Tarapoto e Iquitos. Elige la tuya y ve cómo llegar. |

**El H2 SE MANTIENE.** Es claro, es una orden amable y contiene la marca.

**Por qué cambia el lead.** "Lima y provincias" no le dice nada a alguien de
Tarapoto, que necesita ver su ciudad escrita para saber que le sirve. Nombrar
las cinco ciudades es a la vez el mejor SEO local posible y la información más
útil. Las cinco ciudades están verificadas en `server/db.js:12-25`.

`[VALIDAR]` **V14**: el "12" del lead también debería salir de la base de datos.

### Tarjeta de tienda

| Elemento | Actual (`js/site.js:111-127`) | Propuesta |
|---|---|---|
| Ciudad | Lima | Lima |
| Nombre | Lukers San Miguel | Lukers San Miguel |
| Dirección | Av. La Marina 1666, San Miguel | Av. La Marina 1666, San Miguel |
| Horario | Lun a Dom · 10:00 a. m. – 10:00 p. m. | Lun a Dom · 10:00 a. m. – 10:00 p. m. |
| Botón 1 | Cómo llegar | Cómo llegar |
| Botón 2 | WhatsApp | Consultar por WhatsApp |

**Casi todo SE MANTIENE.** La tarjeta está bien hecha: ciudad, nombre,
dirección, horario y una acción. No le falta nada y no le sobra nada.

Un solo cambio: **"WhatsApp" → "Consultar por WhatsApp"**. Un botón debe decir
qué pasa al pulsarlo, no nombrar la aplicación. (Depende de **H3**: hoy ese
botón no se muestra porque no hay número configurado.)

`[VALIDAR]` **V9**: el horario es un valor por defecto igual para las 12 tiendas.
Si alguna abre distinto —sobre todo las de centro comercial— hay que cargarlo
tienda por tienda desde el panel, no arreglarlo en el texto.

### Estados vacíos y de error

| Situación | Actual (`js/site.js:96-98`, `:135-137`) | Propuesta | Veredicto |
|---|---|---|---|
| La lista viene vacía | Estamos actualizando la lista de tiendas. Escríbenos a hola@lukers.pe y te decimos cuál te queda más cerca. | Igual | **SE MANTIENE.** Está muy bien: explica, no culpa a nadie y ofrece una salida. |
| Falla la carga | No pudimos cargar las tiendas en este momento. Recarga la página o escríbenos a hola@lukers.pe. | Igual | **SE MANTIENE.** |

Este es el mejor microcopy que ya tiene el sitio. Solo una recomendación para
`dev`: cuando exista el WhatsApp (**H3**), añadir ese canal a ambos mensajes,
porque un peruano que quiere una dirección no escribe un correo.

---

## 9. Nosotros

**Trabajo que hace:** comprensión — confianza institucional.

| Actual (`index.html:209-212`) | Propuesta |
|---|---|
| **Eyebrow:** Quiénes somos | ✦ Quiénes somos |
| **H2:** Una empresa con propósito | Una tienda peruana, desde 2001 |
| **Lead:** Creemos que vestir bien no debe ser un lujo. Trabajamos para que la calidad de las grandes marcas esté al alcance de todos. | Creemos que vestir bien no debe ser un lujo. Trabajamos para que la calidad de las grandes marcas esté al alcance de todos. |

**El lead SE MANTIENE.** Es la mejor declaración de propósito del sitio.

**Por qué cambia el H2.** "Una empresa con propósito" podría encabezar la web de
cualquier empresa del mundo; no dice nada de Lukers. "Una tienda peruana, desde
2001" dice dos hechos verificables (`index.html:46`) que en este rubro valen más
que cualquier adjetivo.

### Misión / Visión / Valores

| Bloque | Veredicto |
|---|---|
| **Misión** — «Acercar marcas originales de talla mundial a las familias peruanas, con precios justos, atención cercana y garantía total de autenticidad.» | Cambio mínimo: «garantía **total** de autenticidad» es la tercera aparición de **V1/V2** en la página. Propuesta: «…con precios justos, atención cercana y marcas originales». Si **V2** se confirma, se puede dejar como está. |
| **Visión** — «Ser la cadena de tiendas de ropa de marca más querida y confiable del Perú…» | **SE MANTIENE.** Una visión es una aspiración declarada, no una afirmación de hecho: no necesita validación. |
| **Valores** — «Autenticidad, honestidad en el precio, respeto por el cliente, compromiso con nuestra gente y pasión por el buen vestir.» | **SE MANTIENE.** Cinco valores, cinco palabras cada uno, todos accionables. Está bien escrito. |

---

## 10. Historia

**Trabajo que hace:** comprensión — 25 años son la prueba de que esto es serio.

| Actual (`index.html:244-246`) | Propuesta |
|---|---|
| **Eyebrow:** Nuestra historia | ✦ Nuestra historia |
| **H2:** Más de dos décadas de crecimiento | 25 años vistiendo al Perú |

**Por qué.** "Más de dos décadas" es una manera tímida de decir 25 años. El
número concreto es más fuerte y sale de la fecha de fundación ya declarada
(`index.html:46`).

Las cinco entradas de la línea de tiempo **SE MANTIENEN** tal cual. Están bien
redactadas: un año, un titular, una frase. `[VALIDAR]` general: ¿los años
2008, 2014 y 2019 son correctos? Son hechos históricos de la empresa y nadie
fuera de ella los puede comprobar.

Un detalle: la entrada **2026** dice «Inauguramos nuestra tienda más moderna en
Jr. de la Unión». Aplica el mismo criterio que en la barra de aviso: se propone
«Inauguramos nuestra tienda de Jr. de la Unión y renovamos nuestra identidad de
marca».

---

## 11. Testimonios

**Trabajo que hace:** conversión — prueba social.

`[NO PUBLICAR SIN DATO]` **V8**. No puedo escribir testimonios nuevos y tampoco
puedo confirmar que los tres actuales sean de personas reales.

| Actual (`index.html:286-300`) | Propuesta |
|---|---|
| Tres citas atribuidas a Carlos R. (cliente), María S. (jefa de tienda) y Luis A. (socio comercial) | Se conservan **solo si** existen las personas y su consentimiento por escrito. |

**Decisión recomendada, en orden:**

1. **Si son reales:** conservar los textos tal cual —están bien escritos y cada
   uno habla a una audiencia distinta del sitio (cliente, postulante,
   proveedor), que es un acierto de diseño— y añadir el consentimiento al
   archivo. Recomiendo además nombre completo o inicial + ciudad real, porque
   "Carlos R." con inicial suena a testimonio inventado aunque no lo sea.
2. **Si no son reales:** **retirar la sección completa.** No proponer
   sustitutos: yo no puedo inventarlos y una prueba social falsa destruye más
   confianza de la que construye.
3. **Sustituto honesto disponible hoy**, si se quiere mantener el bloque: los
   1.400 y pico de reseñas que una cadena de 12 tiendas ya tiene en Google Maps.
   `[VALIDAR]`: ¿cuál es la calificación real de las fichas de Google de las
   tiendas? Ese dato es público, verificable y no requiere inventar a nadie.

**Si la sección se retira**, el H2 «Lo que dicen de nosotros» y el eyebrow
«Nuestra comunidad» se retiran con ella.

---

## 12. Proveedores

**Trabajo que hace:** conversión — captar propuestas comerciales útiles y
filtrar las que no lo son.

| Actual (`index.html:305-330`) | Propuesta |
|---|---|
| **Eyebrow:** Proveedores | ✦ Proveedores y marcas |
| **H2:** ¿Quieres que tu marca esté en Lukers? | ¿Quieres que tu marca esté en Lukers? |
| **Cuerpo:** Trabajamos con marcas y distribuidores de USA, Europa y Perú. Ofrecemos cobertura en nuestras tiendas de todo el país, pagos puntuales y una relación comercial transparente. | Trabajamos con marcas y distribuidores de USA, Europa y Perú. Ofrecemos cobertura en 12 tiendas de cinco ciudades del país y una relación comercial clara desde la primera reunión. |
| **Nota:** Escríbenos con tu propuesta, tu catálogo y tus condiciones comerciales. Revisamos todas las que llegan. | Escríbenos con estos cuatro datos y te respondemos: **1)** marca y categoría, **2)** catálogo con precios mayoristas, **3)** condiciones de pago y volumen mínimo, **4)** si ya vendes en Perú y dónde. |
| **Botón:** Enviar propuesta comercial | Enviar propuesta comercial |

**El H2 y el botón SE MANTIENEN.** El H2 hace exactamente la pregunta que el
proveedor se está haciendo, y el botón dice lo que hace.

**Por qué cambia el cuerpo.** «Pagos puntuales» es una afirmación sobre el
comportamiento financiero de la empresa que yo no puedo verificar y que un
proveedor descontento puede desmentir públicamente (**V11**). Se sustituye por
un hecho comprobable: la cobertura en 12 tiendas y 5 ciudades, que además es el
argumento que de verdad le interesa a un proveedor.

**Por qué cambia la nota.** «Revisamos todas las que llegan» es una promesa sin
dueño (**V11**) y no ayuda al proveedor a preparar una buena propuesta. Pedir
cuatro datos concretos sube la calidad de lo que llega, reduce el ida y vuelta y
es honesto sobre lo que se necesita para evaluar.

`[VALIDAR]` **V11**: ¿en cuántos días hábiles responde Lukers a un proveedor?
Si hay un plazo, la nota puede terminar así, que convierte mucho mejor:
«Te respondemos en un máximo de `[X]` días hábiles.»

**Mejora de canal pendiente:** hoy el único canal es un `mailto:`
(`index.html:324-326`). Funciona, pero se pierde en la bandeja compartida
`hola@lukers.pe` junto con reclamos y consultas de clientes. `REQUEST_FOR_CHANGE
→ dev` (ver apartado 20): un correo dedicado o un formulario propio.

---

## 13. Newsletter

**Trabajo que hace:** conversión — captar suscriptores, que es uno de los cuatro
objetivos del sitio.

| Elemento | Actual (`index.html:333-356`) | Propuesta |
|---|---|---|
| H2 | Entérate primero de las llegadas nuevas | Entérate antes que nadie |
| Lead | Te avisamos cuando llegan marcas nuevas y cuando empiezan las campañas de descuento en tu ciudad. Sin spam. | Te escribimos cuando llegan marcas nuevas y cuando empieza una campaña de descuentos en tu ciudad. Nada más. Un correo al mes como máximo, y te das de baja cuando quieras. |
| Etiqueta del campo | Tu correo electrónico (oculta) | Tu correo electrónico (oculta; **SE MANTIENE**) |
| Placeholder | tucorreo@ejemplo.com | tucorreo@ejemplo.com (**SE MANTIENE**) |
| Botón | Suscribirme | Quiero enterarme |
| Consentimiento | Autorizo a Lukers a usar mi correo para enviarme novedades y promociones, según la política de privacidad. Puedo darme de baja cuando quiera. | **SE MANTIENE textualmente.** |

**El consentimiento no se toca.** Está redactado para la Ley 29733 (finalidad
declarada, enlace a la política, derecho de baja) y cualquier "mejora" de estilo
puede debilitarlo legalmente. Si algún día se cambia, que lo revise un abogado,
no un copywriter.

**Por qué el H2 y el lead cambian.** "Las llegadas nuevas" suena a jerga interna
de tienda. Y "Sin spam" es la frase que dice todo el mundo, incluidos los que sí
mandan spam; por eso ya no significa nada. Decir la frecuencia real ("un correo
al mes como máximo") sí es una promesa concreta y se nota.

`[VALIDAR]` **V13**: **¿cuál es la frecuencia real con la que se va a escribir?**
Si no hay nadie que vaya a redactar un correo al mes, esa cifra no se publica y
la línea vuelve a ser genérica. Y `[NO PUBLICAR SIN DATO]`: mientras no exista
mecanismo de baja (**H2**), la promesa "te das de baja cuando quieras" y lo que
dice `privacidad.html` sección 4 no se pueden cumplir.

**Por qué el botón cambia.** "Suscribirme" describe la mecánica; "Quiero
enterarme" describe el beneficio. En formularios de una sola línea, el segundo
tipo de botón rinde mejor.

### Mensajes del formulario

| Situación | Actual | Propuesta | Veredicto |
|---|---|---|---|
| Correo inválido | Ingresa un correo válido. (`js/site.js:170`) | Revisa tu correo: parece que falta algo. | El mensaje actual acusa al usuario de no saber escribir un correo; normalmente fue un dedazo. |
| Sin consentimiento | Necesitamos tu autorización para poder escribirte. (`js/site.js:172`) | Igual | **SE MANTIENE.** Explica el porqué en ocho palabras. Muy bueno. |
| Enviando | Enviando… | Enviando… | **SE MANTIENE.** |
| Éxito | ¡Listo! Te has suscrito al newsletter ✦ (`server/server.js:382`) | ¡Listo! Te escribiremos cuando haya novedades ✦ | "Te has suscrito al newsletter" describe lo que pasó en la base de datos. La propuesta describe lo que gana la persona. El ✦ se queda: es marca. |
| Correo repetido | Este correo ya estaba suscrito 🙂 (`server/server.js:388`) | Este correo ya estaba en la lista ✦ Te avisaremos igual. | El emoji 🙂 no pertenece al sistema gráfico; el brillo sí. Y conviene cerrar la duda ("¿entonces me llegará o no?"). |
| Error del servidor | No se pudo guardar la suscripción (`server/server.js:392`) | No pudimos guardar tu correo. Inténtalo de nuevo en un momento. | El actual no dice qué hacer. |
| Sin conexión | No pudimos conectar. Revisa tu conexión e inténtalo de nuevo. (`js/site.js:190`) | Igual | **SE MANTIENE.** |
| Toast | Listo, te avisaremos de las novedades. (`js/site.js:187`) | Igual | **SE MANTIENE.** |

---

## 14. Preguntas frecuentes (SECCIÓN NUEVA)

**Trabajo que hace:** comprensión **y** conversión. Es la sección que decide si
alguien toma un bus hasta la tienda o se queda con la duda. Responde lo que un
peruano pregunta de verdad antes de ir a una tienda de ropa de marca.

**Importante:** esta sección no existe en el producto (**H5**). Hay que
construirla. Y **la mayoría de las respuestas dependen de datos que no están en
el repositorio**: no las invento. Escribo la pregunta, la estructura de la
respuesta y, entre corchetes, la pregunta exacta que debe responder el dueño.

**Encabezado de la sección**

| Elemento | Propuesta |
|---|---|
| Eyebrow | ✦ Antes de venir |
| H2 | Preguntas frecuentes |
| Lead | Lo que más nos preguntan por Instagram y en tienda. Si tu duda no está aquí, escríbenos. |

`[VALIDAR]`: ¿es cierto que estas son las preguntas más frecuentes que reciben
por Instagram? Si RR. PP. o el community manager tiene la lista real, esa lista
manda sobre la mía.

---

**P1. ¿La ropa de Lukers es original?**
**Trabajo:** comprensión — es la primera duda de cualquiera que ve marcas
conocidas a menos precio.

> Sí. Trabajamos con marcas originales y cada prenda llega con su etiqueta y sus
> códigos de marca. `[VALIDAR V2: ¿se puede afirmar "toda" sin excepción?]`
> `[VALIDAR V1: si existe la política de devolución, esta es la mejor frase para
> cerrar esta respuesta.]`

Esta respuesta es el principal activo comercial del sitio. Vale la pena que sea
la primera y que esté redactada con el dueño delante.

---

**P2. ¿Venden por internet? ¿Hacen delivery?**
**Trabajo:** comprensión — evita frustración y protege la reputación.

> No. Lukers vende únicamente en sus tiendas. Preferimos que veas la prenda, te
> la pruebes y te la lleves el mismo día, sin esperas ni costos de envío.
> [Encuentra tu tienda más cercana →]

Esta respuesta **sí la puedo escribir completa**: es un hecho del negocio
confirmado. `[VALIDAR]` menor: ¿se atienden pedidos o separaciones por WhatsApp
o Instagram, aunque no haya tienda online? Es lo que muchos clientes intentan.

---

**P3. ¿Puedo cambiar una prenda si no me queda?**
**Trabajo:** conversión — es la duda que frena la compra en el probador.

> `[NO PUBLICAR SIN DATO]` Estructura de la respuesta, en cuanto se confirme:
> ¿se aceptan cambios? · ¿en cuántos días? · ¿hace falta boleta? · ¿la prenda
> debe estar sin uso y con etiqueta? · ¿se puede cambiar en cualquier tienda o
> solo donde se compró? · ¿la ropa en liquidación entra en el cambio?

**No escribo esta respuesta.** Publicar una política de cambios inventada es
crear una obligación legal frente al consumidor. `[VALIDAR]`: **¿cuál es la
política de cambios real de Lukers, escrita, tal como la aplica el personal de
tienda hoy?**

---

**P4. ¿Qué tallas manejan?**
**Trabajo:** comprensión — evita el viaje en vano, sobre todo en tallas grandes.

> `[NO PUBLICAR SIN DATO]` Estructura: rango de tallas por categoría (hombre,
> mujer, niño), y si hay tallas grandes.

`[VALIDAR]`: **¿qué rango de tallas se maneja en hombre, mujer y niños? ¿Hay
tallas grandes (XXL, XXXL) de forma habitual?** Esta es la pregunta que más
gente hace por Instagram en este rubro y la que más viajes inútiles evita.

---

**P5. ¿Aceptan Yape, Plin o tarjeta?**
**Trabajo:** conversión — quita la última fricción antes de salir de casa.

> `[NO PUBLICAR SIN DATO]` Estructura: efectivo · Yape · Plin · tarjeta de
> débito · tarjeta de crédito · cuotas sin intereses.

`[VALIDAR]`: **¿qué medios de pago se aceptan, y son los mismos en las 12
tiendas?** Si se aceptan Yape y tarjeta, conviene decirlo también en la tarjeta
de cada tienda, no solo aquí.

---

**P6. ¿Los descuentos aplican en todas las tiendas?**
**Trabajo:** comprensión — previene el reclamo clásico "en la otra tienda estaba
más barato".

> `[NO PUBLICAR SIN DATO]` `[VALIDAR]`: **¿los precios y las campañas son los
> mismos en las 12 tiendas, o cada tienda tiene su propio stock y su propio
> precio?** Depende también de **V4**.

---

**P7. ¿Dan boleta y factura?**
**Trabajo:** comprensión — importa a quien compra ropa de trabajo o uniformes.

> `[VALIDAR]`: **¿se emite factura con RUC a pedido, en todas las tiendas?**
> Si la respuesta es sí, la respuesta se escribe en una línea y conviene
> publicarla: abre la puerta a compras por volumen.

---

**P8. ¿Puedo separar una prenda?**
**Trabajo:** conversión.

> `[VALIDAR]`: **¿existe separación o apartado? ¿Con qué adelanto y por cuántos
> días?** Es una práctica común en retail peruano y, si existe, es un argumento
> de venta que hoy no está en ninguna parte del sitio.

---

**P9. ¿Dónde están las tiendas y a qué hora abren?**
**Trabajo:** conversión — la pregunta que más veces se hace.

> Tenemos 12 tiendas: ocho en Lima (San Miguel, Jr. de la Unión, Chorrillos,
> Breña, Lince, Pueblo Libre, Independencia y Surco) y una en Trujillo,
> Chiclayo, Tarapoto e Iquitos. Abrimos todos los días, de 10:00 a. m. a
> 10:00 p. m. [Ver direcciones y cómo llegar →]

Los distritos y ciudades están verificados en `server/db.js:12-25`.
`[VALIDAR]` **V9**: el horario. Y `[VALIDAR]` **V14**: este párrafo se
desactualiza solo si abre una tienda nueva; mejor si `dev` lo genera desde la
base de datos.

---

**P10. ¿Cómo postulo a trabajar en Lukers?**
**Trabajo:** conversión — desvía a `/trabaja` un tráfico que hoy se pierde.

> Llena el formulario de [Trabaja con nosotros →]. Elige la tienda donde te
> gustaría trabajar y nos llega directo a Recursos Humanos. No hace falta que
> lleves tu CV a la tienda.

Verificado: el formulario existe, pide tienda y jornada, y guarda la postulación
para RR. HH. (`server/server.js:616-632`). `[VALIDAR]` **V12**: ¿se puede
prometer alguna señal de respuesta, aunque sea "si tu perfil encaja te
llamamos en X semanas"?

---

**P11. ¿Cómo presento un reclamo?**
**Trabajo:** comprensión — obligación legal y señal de seriedad.

> Puedes pedir el Libro de Reclamaciones en cualquiera de nuestras tiendas y te
> entregamos una copia de tu registro. También puedes escribirnos a
> hola@lukers.pe. [Más información →]

Coincide con lo que ya declara `privacidad.html` sección 9.
`[VALIDAR]`: **¿el Libro de Reclamaciones es solo físico?** Si se quiere ofrecer
el virtual, INDECOPI exige un formulario con campos y plazos específicos —ya
está advertido en `privacidad.html:165-172`— y esta respuesta cambiaría.

---

**Cierre de la sección**

| Elemento | Propuesta |
|---|---|
| Texto | ¿Tu pregunta no está aquí? Escríbenos a hola@lukers.pe y te respondemos. |
| Variante cuando exista WhatsApp (**H3**) | ¿Tu pregunta no está aquí? Escríbenos por WhatsApp y te respondemos. |

**Nota para `dev` y `search`:** cuando las respuestas estén validadas, esta
sección merece marcado `FAQPage` en JSON-LD. **No antes**: publicar datos
estructurados con información sin confirmar multiplica el alcance del error.

---

## 15. Contacto

**Trabajo que hace:** conversión — canal de atención.

| Elemento | Actual (`index.html:363-365`) | Propuesta |
|---|---|---|
| Eyebrow | Contacto | ✦ Contacto |
| H2 | Hablemos | ¿En qué te ayudamos? |

**Por qué.** "Hablemos" es una invitación de agencia. La persona que llega a
este bloque tiene un problema concreto: quiere saber si tienen su talla, dónde
queda la tienda o cómo reclamar. La pregunta directa encaja con eso.

### Datos de contacto

| Bloque | Actual | Propuesta |
|---|---|---|
| Correo | **Correo** — hola@lukers.pe | **Correo** — hola@lukers.pe · Te respondemos en horario de tienda `[VALIDAR V12]` |
| Teléfono | Comentado (`index.html:372-376`) | `[VALIDAR]` **¿existe una central telefónica o un número de atención?** Ver **H4**: es el dato que más se busca y hoy no está. |
| Horario | **Horario de atención** — Lunes a domingo · 10:00 a. m. – 10:00 p. m. | **Horario de tiendas** — Todos los días, de 10:00 a. m. a 10:00 p. m. `[VALIDAR V9]` |
| Libro de reclamaciones | **Libro de reclamaciones** — Cómo registrar tu reclamo | **SE MANTIENE.** Correcto y bien enlazado. |

El cambio de "Horario de atención" a "Horario de tiendas" evita que se
interprete como el horario en que responden el correo, que es otra cosa.

### Formulario

| Campo | Actual | Propuesta |
|---|---|---|
| Título | Escríbenos | Escríbenos |
| Nombre | **Nombre** | **Nombre** |
| Correo | **Correo electrónico** | **Correo electrónico** |
| Mensaje | **Tu mensaje** | **Tu mensaje** + ayuda: Cuéntanos tu consulta. Si es por una prenda, dinos en qué tienda la viste. |
| Consentimiento | Autorizo a Lukers a usar mis datos para responder a esta consulta, según la política de privacidad. | **SE MANTIENE textualmente.** |
| Botón | Enviar mensaje | Enviar mensaje |

**Las etiquetas SE MANTIENEN.** Son de una palabra, correctas y sin placeholders
que desaparezcan al escribir, que es un error de accesibilidad que este sitio
evita bien.

El único añadido es un texto de ayuda bajo el campo de mensaje: sube la calidad
de las consultas y reduce el ida y vuelta.

### Mensajes de validación y error

| Situación | Actual (`js/site.js:206-213`) | Propuesta | Veredicto |
|---|---|---|---|
| Sin nombre | Ingresa tu nombre. | Igual | **SE MANTIENE.** |
| Correo inválido | Ingresa un correo válido. | Revisa tu correo: parece que falta algo. | Mismo criterio que en el newsletter. |
| Mensaje corto | Cuéntanos un poco más en tu mensaje. | Igual | **SE MANTIENE.** Amable y explica el porqué. |
| Sin consentimiento | Necesitamos tu autorización para responderte. | Igual | **SE MANTIENE.** |
| Éxito | Recibimos tu mensaje. Te responderemos pronto. (`server/server.js:416`) | Recibimos tu mensaje. Te respondemos al correo que nos dejaste. `[VALIDAR V12: plazo]` | **H1**: hoy "pronto" no lo garantiza nadie. Decir por dónde llega la respuesta es más útil y no promete velocidad. |
| Error de envío | No pudimos enviar tu mensaje. Escríbenos a hola@lukers.pe. | Igual | **SE MANTIENE.** Da una salida real. |
| Toast | Mensaje recibido. Te responderemos pronto. | Mensaje recibido. Te escribimos al correo que nos dejaste. | Coherencia con lo anterior. |

**Si V12 se responde con un plazo** (por ejemplo, 48 horas hábiles), la mejor
versión del mensaje de éxito es: «Recibimos tu mensaje. Te respondemos en un
máximo de 48 horas hábiles». Es la que más confianza genera, y solo se puede
publicar si alguien la va a cumplir.

---

## 16. Pie de página

**Trabajo que hace:** comprensión — es el índice del sitio y el sitio donde se
busca lo legal.

| Elemento | Actual (`index.html:416-473`) | Propuesta |
|---|---|---|
| Descripción de marca | Ropa de marca original a buen precio. Acercamos las mejores marcas a todos los peruanos, con garantía de autenticidad. | Ropa de marca original a buen precio, en 12 tiendas de Lima, Trujillo, Chiclayo, Tarapoto e Iquitos. Desde 2001. |
| Columna 1 | **Institucional**: Quiénes somos · Nuestra historia · Marcas · Proveedores | **SE MANTIENE** el contenido. Título → **Lukers**. |
| Columna 2 | **Atención**: Tiendas y horarios · Contacto · Trabaja con nosotros · Libro de reclamaciones | **Atención**: Tiendas y horarios · **Preguntas frecuentes** · Contacto · Trabaja con nosotros · Libro de reclamaciones |
| Columna 3 | **Legal**: Política de privacidad · hola@lukers.pe | **SE MANTIENE.** |
| Concepto | Mejores marcas ✦ Mejores precios | **SE MANTIENE y no se toca.** Es el cierre de marca del brandbook (`guia-marca.md`, sección 7). |
| Línea final | © 2026 Lukers. Todos los derechos reservados. · Hecho en el Perú | **SE MANTIENE.** |

**Por qué cambia la descripción.** La actual repite por cuarta vez la garantía de
autenticidad (**V1/V2**) y dice "acercamos las mejores marcas a todos los
peruanos", que es una frase bonita sin información. La propuesta usa ese espacio
—el más visto del sitio después del hero, y el que más lee Google— para poner
las cinco ciudades y el año de fundación.

`[VALIDAR]` para el pie, importante y hoy ausente:

- **¿Razón social y RUC?** Aparecen como `[PENDIENTE]` en `privacidad.html:62-68`.
  En Perú, el pie de un sitio comercial debería llevar la razón social y el RUC:
  es la señal de legitimidad más barata que existe y la que busca quien duda.
- **¿Domicilio fiscal?** Mismo origen.

**Título de la primera columna:** "Institucional" es lenguaje interno.
Simplemente **Lukers** funciona mejor y cabe igual.

---

## 17. Página «Trabaja con nosotros»

**Trabajo que hace:** conversión — recibir postulaciones, uno de los cuatro
objetivos del sitio.

### Portada de la página

| Elemento | Actual (`trabaja.html:65-75`) | Propuesta |
|---|---|---|
| Eyebrow | ✦ Únete al equipo | ✦ Trabaja en Lukers |
| H1 | Trabaja con nosotros | Trabaja con nosotros |
| Lead | En Lukers creemos en el talento peruano. Buscamos personas con energía, vocación de servicio y ganas de crecer. Postula a la tienda más cercana a ti. | En Lukers creemos en el talento peruano. Buscamos personas con energía, vocación de servicio y ganas de crecer. Postula a la tienda más cercana a ti: te toma dos minutos y no necesitas subir tu CV. |

**El H1 y las dos primeras frases SE MANTIENEN.** Están bien: humanas, concretas
y sin promesas vacías.

**Por qué se añade la última frase.** Es el argumento de conversión más fuerte
que tiene este formulario y hoy no está dicho: **no pide CV**. Para un postulante
joven sin currículum armado —el perfil natural de una vacante de tienda— eso es
la diferencia entre postular y cerrar la página. Y es un hecho verificado: el
formulario no tiene campo de archivo (`trabaja.html:116-180`).

### Beneficios

| Actual | Propuesta | Estado |
|---|---|---|
| **Línea de carrera real** — Crecimiento desde vendedor hasta jefe de tienda y más allá. | **Línea de carrera real** — Crecimiento desde vendedor hasta jefe de tienda. | `[VALIDAR]` **V7**. "Y más allá" es vago; si hay casos reales de ascenso a supervisión o a la central, decirlo así es mucho más potente. |
| **Capacitación constante** — Te enseñamos sobre marcas, atención al cliente y técnicas de venta. | Igual | **SE MANTIENE.** Concreto y creíble. `[VALIDAR]` **V7**. |
| **Empleo formal** — Planilla, beneficios de ley y un ambiente de trabajo sano. | **Empleo formal** — En planilla, con todos los beneficios de ley. | `[VALIDAR]` **V7**, y es el beneficio que más importa en este rubro. "Ambiente de trabajo sano" no se puede comprobar ni prometer; se retira. |
| **Un gran equipo** — Más de 300 compañeros en todo el Perú que te van a recibir bien. | **Un gran equipo** — `[cifra]` compañeros en 12 tiendas del país. | `[VALIDAR]` **V6**. La cifra se conserva pero necesita confirmación. |

### Formulario

| Campo | Actual | Propuesta | Motivo |
|---|---|---|---|
| H2 | Postula aquí | Postula aquí | **SE MANTIENE.** |
| Nombre completo | **Nombre completo** | **Nombre completo** | **SE MANTIENE.** |
| Correo | **Correo electrónico** | **Correo electrónico** + ayuda: Aquí te escribimos si avanzas en el proceso. | Explica por qué se pide. |
| Celular | **Celular** | **Celular** + ayuda: Con WhatsApp, si tienes. | En Perú la coordinación de entrevistas ocurre por WhatsApp. `[VALIDAR]`: ¿RR. HH. contacta por WhatsApp? |
| DNI | **DNI** | **DNI** + ayuda: Solo para identificar tu postulación. | Pedir un documento de identidad sin explicar por qué genera desconfianza y abandono. `[VALIDAR]`: ¿es imprescindible el DNI en esta etapa? Si no lo es, quitarlo subiría el número de postulaciones. |
| Tienda | ¿En qué tienda te gustaría trabajar? | ¿En qué tienda te gustaría trabajar? | **SE MANTIENE.** Está perfecto. |
| Placeholder del selector | Selecciona una tienda… | Elige una tienda… | Mínimo, más natural en español peruano. |
| Jornada | Jornada que buscas → Full time / Part time / Cualquiera | Jornada que buscas → Full time / Part time / Me acomodo a cualquiera | "Cualquiera" solo suena a desinterés; la versión larga dice disponibilidad, que es una virtud. |
| Estudios | ¿Actualmente estás estudiando? → Sí, estudio / No estudio | **SE MANTIENE.** | Bien planteado: sin juicio y con respuestas claras. |
| Mensaje | Cuéntanos sobre ti (opcional) | **SE MANTIENE.** | El "(opcional)" explícito es un acierto. |
| Placeholder del mensaje | Qué experiencia tienes y a qué área te gustaría postular… | Si tienes experiencia en ventas o atención al cliente, cuéntanos dónde. Si no tienes experiencia, también puedes postular. | Abre la puerta al postulante sin experiencia, que es gran parte del público de una vacante de tienda, y da una consigna concreta al que sí la tiene. `[VALIDAR]`: ¿se contrata sin experiencia previa? |
| Consentimiento | Autorizo a Lukers a tratar mis datos personales con la única finalidad de evaluar mi postulación y contactarme durante el proceso de selección, según la política de privacidad. | **SE MANTIENE textualmente.** | Redactado para la Ley 29733. No se toca. |
| Botón | Enviar postulación | Enviar postulación | **SE MANTIENE.** |

### Mensajes de validación, error y estados vacíos

| Situación | Actual (`js/trabaja.js:53-66`) | Propuesta | Veredicto |
|---|---|---|---|
| Nombre corto | Ingresa tu nombre completo. | Igual | **SE MANTIENE.** |
| Correo inválido | Ingresa un correo válido. | Revisa tu correo: parece que falta algo. | Coherencia con el resto del sitio. |
| Celular incompleto | Ingresa tu número de celular. | Ingresa tu número de celular (9 dígitos). | Dice cuál es el formato esperado. `[VALIDAR]`: ¿se aceptan postulantes con número fijo? |
| DNI incompleto | Ingresa tu DNI. | Ingresa tu DNI (8 dígitos). | Igual. `[VALIDAR]`: ¿se acepta carné de extranjería? Hoy el campo admite 12 caracteres pero la etiqueta dice DNI. |
| Sin tienda | Elige la tienda donde quieres trabajar. | Igual | **SE MANTIENE.** |
| Sin jornada | Elige una jornada. | Igual | **SE MANTIENE.** |
| Sin respuesta de estudios | Indícanos si estás estudiando. | Igual | **SE MANTIENE.** |
| Sin consentimiento | Debes autorizar el tratamiento de tus datos para postular. | Necesitamos tu autorización para poder evaluar tu postulación. | "Debes" regaña; el resto del sitio explica el porqué. Coherencia con los otros dos formularios. |
| **No cargan las tiendas** | Opción: "No pudimos cargar las tiendas" + mensaje: No pudimos cargar la lista de tiendas. Recarga la página o escríbenos a hola@lukers.pe | Igual | **SE MANTIENE.** Este estado de error está muy bien resuelto: el postulante no se queda frente a un formulario que no puede enviar y sin saber por qué. |
| Éxito | ¡Gracias! Revisaremos tu postulación y te contactaremos pronto. (`server/server.js:631`) | ¡Gracias! Tu postulación ya está con Recursos Humanos. Si tu perfil encaja con una vacante, te escribimos o te llamamos. | **H1/V12**: "te contactaremos pronto" promete algo que hoy nadie garantiza, y a un postulante esa espera le duele. La propuesta es honesta —"si tu perfil encaja"— y sigue siendo cálida. |
| Toast | Recibimos tu postulación. Te contactaremos pronto. | Recibimos tu postulación. Gracias por postular a Lukers. | Mismo criterio. |

`[VALIDAR]` **V12**: **¿hay un plazo real de respuesta a los postulantes?** Si RR.
HH. puede comprometerse a algo (aunque sea "revisamos las postulaciones cada
lunes"), decirlo mejora muchísimo la experiencia. Si no, la versión propuesta es
la correcta.

### Panel interno de RR. HH. (`postulaciones.html`)

No es público (`noindex`, `server/server.js:324`), así que solo un apunte:

| Actual (`postulaciones.html:67`) | Propuesta |
|---|---|
| Aún no hay postulaciones. | Aún no hay postulaciones. Las que lleguen desde /trabaja aparecerán aquí. |

**Trabajo que hace:** comprensión — que quien abre el panel por primera vez sepa
si está vacío porque nadie postuló o porque algo falló.

---

## 18. Microcopy transversal

| Elemento | Actual | Propuesta | Veredicto |
|---|---|---|---|
| Enlace de salto | Saltar al contenido | Igual | **SE MANTIENE.** Estándar y correcto. |
| Logo (alt) | Lukers — Mejores marcas, mejores precios | Igual | **SE MANTIENE.** |
| Botón de tema | Cambiar entre modo claro y modo azul | Igual | **SE MANTIENE.** "Modo azul" en lugar de "modo oscuro" es una decisión de marca acertada. |
| Menú móvil | Abrir menú | Igual | **SE MANTIENE.** |
| Botón flotante de WhatsApp | Escríbenos por WhatsApp | Igual | **SE MANTIENE.** (Hoy no se muestra — **H3**.) |
| Mensaje inicial de WhatsApp, portada | Hola Lukers 👋 quisiera más información. | Hola Lukers, quisiera hacer una consulta. | El emoji no es del sistema gráfico de marca. Y "más información" no ayuda a quien atiende; "una consulta" tampoco mucho, pero es más natural. |
| Mensaje inicial de WhatsApp, empleo | Hola Lukers 👋 quisiera postular para trabajar con ustedes. | Hola Lukers, quisiera postular para trabajar con ustedes. | Igual. |
| Mensaje inicial de WhatsApp, tienda | Hola Lukers 👋 quiero consultar por la tienda {nombre}. | Hola Lukers, quiero consultar por la tienda {nombre}. | Igual. Muy buena idea incluir el nombre de la tienda: **SE MANTIENE**. |

---

## 19. Títulos, descripciones y términos de búsqueda

Los términos que la gente busca en Perú se integran donde caben solos: **ropa de
marca**, **ropa original**, **ropa de marca a buen precio**, y los nombres de
ciudad y distrito. No hay que forzarlos: el sitio ya tiene la estructura que los
soporta (tiendas con dirección, categorías, marcas).

| Página | Actual | Propuesta |
|---|---|---|
| Inicio · `<title>` | Lukers — Ropa de marca original a buen precio en Perú | **SE MANTIENE.** Contiene marca, categoría, diferencial y país en 58 caracteres. Está bien hecho. |
| Inicio · `description` | Más de 60 marcas originales de USA y Europa con hasta 70% de descuento. Encuentra tu tienda Lukers en Lima, Trujillo, Chiclayo, Tarapoto e Iquitos. | Ropa de marca original a buen precio, en 12 tiendas de Lima, Trujillo, Chiclayo, Tarapoto e Iquitos. Encuentra la tuya y ven a probártela. `[Si V3 y V4 se confirman, la versión actual es mejor y se conserva.]` |
| Inicio · `og:title` | Lukers — Mejores marcas, mejores precios | **SE MANTIENE.** |
| Inicio · `og:description` | Más de 60 marcas originales de USA y Europa con hasta 70% de descuento, en nuestras tiendas de todo el Perú. | Mismo criterio que la `description`: depende de **V3** y **V4**. |
| Trabaja · `<title>` | Trabaja con nosotros — Lukers | **SE MANTIENE.** |
| Trabaja · `description` | Únete al equipo Lukers. Postula a nuestras tiendas en Lima y provincias: empleo formal, línea de carrera y capacitación constante. | Postula a las tiendas Lukers de Lima, Trujillo, Chiclayo, Tarapoto e Iquitos. Empleo formal y no necesitas subir tu CV. `[VALIDAR V7]` |
| Privacidad · `<title>` | Política de privacidad \| Lukers | **SE MANTIENE.** |

**Dónde entran los términos de forma natural, sin repetir de más:**

- "Ropa de marca" — H1 no (ahí manda la promesa de marca), pero sí en el lead
  del hero, en el H2 de categorías (ya está) y en el pie.
- "Ropa original" / "original" — eyebrow del hero, P1 de la FAQ, caja de
  garantía.
- Ciudades — lead de tiendas, pie, P9 de la FAQ, `description` de ambas páginas.
- Distritos (San Miguel, Breña, Lince, Chorrillos, Pueblo Libre,
  Independencia, Surco, Centro de Lima) — ya salen solos en las tarjetas de
  tienda, que es donde deben estar.

**Para `search`:** las páginas por ciudad (`/tiendas/lima`, `/tiendas/trujillo`…)
serían la mayor oportunidad de este sitio, porque las búsquedas reales son
"tienda de ropa de marca en Trujillo", no "Lukers". Eso es decisión de
arquitectura, no mía; lo dejo señalado y con el copy listo para adaptarse.

---

## 20. Resumen de cambios por prioridad

**Bloquean la publicación** (compromiso legal o contradicción comprobable):
V1 (devolución del dinero), V2 (100% original), V3 (60 vs. 24 marcas),
V4 (70% de descuento), V8 (testimonios), V13 (baja del newsletter).

**Hay que resolver antes de prometer atención:** H1 (nadie recibe aviso de los
mensajes), V12 (plazo de respuesta), H4 (no hay teléfono).

**Mejoran la conversión y no dependen de nadie:** lead del hero centrado en las
12 tiendas, "no vendemos por internet" dicho a tiempo, "no necesitas subir tu
CV" en `/trabaja`, los cuatro datos pedidos al proveedor, la sección de
preguntas frecuentes, las cinco ciudades en el pie.

**Lo que ya está bien y no se toca:** el H1, "al precio que sí puedes pagar",
los estados vacíos y de error de tiendas, los tres textos de consentimiento, el
mensaje de "Necesitamos tu autorización…", el error de carga de tiendas en
`/trabaja`, el concepto del pie y la mayoría de las etiquetas de formulario.

---

# Contrato de entrega

## Decisiones tomadas

1. **Ninguna afirmación existente se borra por decisión mía.** Se conservan
   todas y se marcan `[VALIDAR]` con la pregunta que las desbloquea. Lo único
   que propongo retirar activamente son dos superlativos que nadie puede
   sostener ("nuestra tienda más moderna", "ambiente de trabajo sano") y una
   frase de comportamiento financiero ("pagos puntuales").
2. **El hero deja de apoyarse en cifras sin verificar y pasa a apoyarse en las
   12 tiendas reales**, que es el único hecho que el propio sistema comprueba
   (`server/db.js:12-25`). La versión con las cifras queda escrita y lista por si
   V3 y V4 se confirman.
3. **La promesa de devolución del dinero se marca `[NO PUBLICAR SIN DATO]`** y se
   ofrecen tres salidas redactadas según lo que responda el dueño, incluida la
   versión honesta para el caso de que la política no exista.
4. **Se añade "25 años en el Perú" como cifra de prueba**, porque la fundación en
   2001 ya está declarada por el propio sitio y no necesita permiso de nadie.
5. **La sección de preguntas frecuentes se escribe con las preguntas completas
   pero con las respuestas abiertas** cuando dependen de datos operativos
   (cambios, tallas, medios de pago, separaciones, factura). Prefiero entregar
   once preguntas correctas con seis respuestas pendientes que once respuestas
   inventadas.
6. **Los tres textos de consentimiento se conservan palabra por palabra.** Están
   redactados para la Ley 29733 y no son territorio de copywriting.
7. **Los testimonios no se sustituyen ni se reescriben.** Se marcan y se propone
   una alternativa que no requiere inventar a nadie (las reseñas públicas de
   Google Maps, previa verificación).
8. **Los mensajes de éxito dejan de prometer velocidad** ("pronto") y pasan a
   prometer canal ("te escribimos al correo que nos dejaste"), porque hoy nadie
   recibe un aviso cuando llega un mensaje.

## Evidencia utilizada

- `index.html` — copy completo de la portada, meta etiquetas, JSON-LD
  (`:38-56`), barra de aviso (`:59-66`), hero (`:98-142`), cifras (`:122-126`),
  caja de garantía (`:136-140`), testimonios (`:286-300`), proveedores
  (`:305-330`), newsletter (`:333-356`), contacto (`:358-414`), pie (`:416-473`).
- `trabaja.html` — portada (`:65-75`), beneficios (`:82-114`), formulario
  completo (`:116-180`).
- `privacidad.html` — pendientes legales (`:38-55`, `:62-68`), plazo de
  conservación, compromiso de baja del newsletter (sección 4), Libro de
  Reclamaciones (`:164-182`).
- `postulaciones.html:67` — estado vacío del panel de RR. HH.
- `server/server.js` — rutas y mensajes reales: `/api/subscribe` (`:370-393`),
  `/api/contact` (`:401-417`), `/api/jobs` (`:616-632`), `/api/stores`
  (`:518-527`), `/api/brands` (`:589-594`), `sitemap.xml` (`:332-352`),
  `robots.txt` (`:354-368`). Ningún endpoint envía correo.
- `server/db.js` — 12 tiendas con dirección y ciudad (`:12-25`), **24 marcas**
  (`:27-31`), horario por defecto (`:78`), esquema de `job_applications`,
  `messages` y `subscribers`.
- `js/site.js` — validaciones y mensajes del newsletter (`:160-195`) y de
  contacto (`:199-232`), estados vacíos de tiendas (`:96-98`, `:135-137`),
  eliminación de la sección de marcas al fallar (`:154`).
- `js/trabaja.js` — validaciones de la postulación (`:53-66`), estado de error
  del selector de tiendas (`:13-24`).
- `js/ui.js` — `setMsg`, `showToast`, y la lógica que elimina el botón de
  WhatsApp cuando no hay número (`:60-70`).
- `js/config.js` — `WHATSAPP_NUMBER` vacío.
- `.claude/skills/marca-lukers/SKILL.md` y `references/guia-marca.md` —
  concepto de marca, uso del brillo ✦, reglas de mayúsculas y tono.
- `AGENTS.md` — objetivo del repositorio, promesa vigente y prohibición de
  inventar datos.

## Supuestos

1. Que el sitio no vende online es un hecho del negocio confirmado por el
   encargo, no por el código; el código simplemente no tiene carrito, lo cual es
   coherente.
2. Que el público principal es un comprador peruano en móvil que está decidiendo
   si se desplaza hasta una tienda. Todo el orden de la copia parte de ahí.
3. Que la lista de tiendas de `server/db.js` refleja las tiendas abiertas hoy.
   Es el dato inicial de la base; el panel permite cambiarla.
4. Que `hola@lukers.pe` es una dirección real y vigente.
5. Que las 24 marcas cargadas en la base son marcas efectivamente
   comercializadas y no un ejemplo de maqueta. Si fueran de maqueta, el problema
   es mayor que el número: habría nombres de marca publicados sin respaldo.
6. Que no existe todavía `SITE_BLUEPRINT.md`, `HERO_UX_SPEC.md` ni
   `SEO_STRATEGY.md` (la carpeta `deliverables/` estaba vacía), por lo que este
   documento no depende de decisiones previas de `aria`, `hero` ni `search` y
   deberá revisarse si esos entregables aparecen después.

## Información faltante

1. **Política de devolución por falta de originalidad** (V1) — la valida el
   dueño con apoyo legal. Bloquea el hero, la sección de marcas, la misión, el
   pie y la P1 de la FAQ.
2. **Alcance del "100% original"** (V2) — dueño. Bloquea las cifras del hero y la
   FAQ.
3. **Número real de marcas comercializadas** (V3) — dueño / compras. Bloquea
   cuatro textos y contradice la propia base de datos del sitio.
4. **Existencia y vigencia del "hasta 70%"** (V4) — dueño / comercial. Bloquea
   meta etiquetas, hero y FAQ. Riesgo INDECOPI.
5. **Origen de la mercadería y "sin intermediarios"** (V5) — compras.
6. **Número de trabajadores** (V6) — RR. HH.
7. **Condiciones laborales: planilla, capacitación, línea de carrera** (V7) —
   RR. HH. Bloquea los cuatro beneficios de `/trabaja`.
8. **Veracidad y consentimiento de los testimonios** (V8) — marketing / legal.
   Bloquea la sección entera.
9. **Horario real de cada tienda, incluidos domingos y feriados** (V9) —
   operaciones. Afecta a 12 tarjetas, al contacto y a la FAQ.
10. **Política de cambios y devoluciones** (P3) — dueño. Es la respuesta más
    pedida de una FAQ de ropa y hoy no existe en ninguna parte del sitio.
11. **Rango de tallas por categoría** (P4) — compras / tienda.
12. **Medios de pago aceptados: Yape, Plin, tarjeta, cuotas** (P5) —
    administración. ¿Son iguales en las 12 tiendas?
13. **¿Precios y campañas iguales en todas las tiendas?** (P6) — comercial.
14. **¿Se emite factura con RUC?** (P7) — administración.
15. **¿Existe separación o apartado de prendas?** (P8) — operaciones.
16. **Razón social, RUC y domicilio fiscal** — administración. Hoy figuran como
    `[PENDIENTE]` en `privacidad.html` y faltan en el pie.
17. **Número de WhatsApp de atención y central telefónica** — dueño. Sin ellos,
    el único canal es un correo.
18. **Quién revisa mensajes y postulaciones, y con qué frecuencia** (V12) —
    operaciones / RR. HH. Determina qué se puede prometer.
19. **Herramienta de envío del newsletter y mecanismo de baja** (V13) —
    marketing. Sin esto hay una promesa incumplible publicada en la política de
    privacidad.
20. **Fecha de apertura de Jr. de la Unión y caducidad de la barra de aviso**
    (V10) — marketing.

## Riesgos identificados

1. **Promesa de devolución del dinero sin política detrás** — probabilidad
   media, impacto alto (reclamo ante INDECOPI, personal de tienda sin guion).
   Mitigación: no publicar hasta que exista la política escrita; mientras tanto,
   usar la versión alternativa ya redactada en el apartado 5.
2. **"Hasta 70% de descuento" sin sustento** — probabilidad media, impacto alto.
   Publicidad con precio de referencia irreal es infracción del Código del
   Consumidor. Mitigación: retirar la cifra del hero y de las meta etiquetas
   hasta confirmar, o acotarla a una campaña con fechas.
3. **"Más de 60 marcas" contra 24 en la propia base de datos** — probabilidad
   alta de que alguien lo note, impacto medio. Mitigación: que la cifra se
   calcule desde la base de datos, o completar el catálogo de marcas.
4. **Testimonios sin consentimiento documentado** — probabilidad media, impacto
   alto (Ley 29733 y publicidad engañosa). Mitigación: verificar o retirar.
5. **Prometer respuesta "pronto" sin que nadie reciba aviso** (H1) —
   probabilidad alta, impacto medio-alto. Un formulario que no responde es peor
   que no tener formulario. Mitigación: cambiar el texto (ya propuesto) y, en
   paralelo, pedir a `dev` una notificación por correo.
6. **Newsletter sin mecanismo de baja mientras la política lo promete** (H2) —
   probabilidad alta en cuanto se envíe el primer correo, impacto alto.
   Mitigación: no enviar hasta tener baja funcionando.
7. **Horario uniforme para 12 tiendas** — probabilidad media, impacto medio
   (viajes en vano y reseñas negativas). Mitigación: cargar horarios reales
   tienda por tienda desde el panel, que ya lo permite.
8. **Sitio sin teléfono ni WhatsApp** — probabilidad alta, impacto medio. En
   retail peruano, un sitio sin número de contacto pierde consultas y genera
   desconfianza. Mitigación: configurar `WHATSAPP_NUMBER` y descomentar el
   bloque de teléfono cuando exista.
9. **La barra de aviso caduca sola** — probabilidad alta, impacto bajo.
   Mitigación: fecha de retiro o gestión desde el panel.

## Cambios solicitados a otros agentes

- `REQUEST_FOR_CHANGE → dev`: **la cifra de marcas del hero
  (`index.html:122`) debe calcularse desde `/api/brands`, y la de tiendas
  (`index.html:123`) desde `/api/stores`.** Evidencia: el hero dice 60 marcas y
  `server/db.js:27-31` carga 24; el "12" está escrito a mano mientras la lista
  real es editable desde el panel. Efecto esperado: la portada deja de poder
  contradecir a su propia base de datos.
- `REQUEST_FOR_CHANGE → dev`: **construir la sección de preguntas frecuentes**
  (apartado 14). No existe componente ni estilos (`css/site.css` no tiene `.faq`
  ni `details`). Efecto esperado: responder las once dudas que hoy se resuelven
  por WhatsApp —que además está apagado— o no se resuelven.
- `REQUEST_FOR_CHANGE → dev`: **avisar por correo cuando entra un mensaje de
  contacto o una postulación.** Evidencia: `server/server.js:401-417` y
  `:616-632` solo escriben en SQLite. Efecto esperado: que los textos de éxito
  puedan prometer una respuesta real.
- `REQUEST_FOR_CHANGE → dev`: **mecanismo de baja del newsletter.** Evidencia:
  no hay endpoint de baja y `privacidad.html` sección 4 lo promete. Efecto
  esperado: cumplir lo que ya está publicado antes de enviar el primer correo.
- `REQUEST_FOR_CHANGE → aria`: **decidir qué pasa con la sección de
  testimonios** (`index.html:278-303`) según la respuesta a V8, y **dónde entra
  "Preguntas frecuentes"** en una navegación que pasaría a siete enlaces.
- `REQUEST_FOR_CHANGE → search`: evaluar **páginas por ciudad**
  (`/tiendas/lima`, `/tiendas/trujillo`…). Las búsquedas reales son "tienda de
  ropa de marca en Trujillo", no "Lukers". El copy de este documento está
  preparado para adaptarse a esa estructura.
- `REQUEST_FOR_CHANGE → hero`: si `hero` produce después `HERO_UX_SPEC.md`,
  tener en cuenta que el bloque de cuatro cifras puede quedarse en dos o tres
  según V2, V3 y V4, y que se propone añadir "25 años en el Perú".

## Output para el siguiente agente

**Archivos que debe leer** (`dev`, y `cro` en la auditoría):

- Este documento completo, empezando por el apartado 1.
- `index.html`, `trabaja.html`, `js/site.js`, `js/trabaja.js`, `js/ui.js`,
  `server/server.js`, `server/db.js`.
- `privacidad.html` para los `[PENDIENTE]` legales que también afectan al pie.

**Decisiones que debe respetar:**

- No implementar ningún texto marcado `[NO PUBLICAR SIN DATO]` hasta que el
  dueño responda. En concreto: la garantía de devolución, el 70%, el "100%
  original", los testimonios y las respuestas P3 a P8 de la FAQ.
- Los tres textos de consentimiento se copian **literalmente**.
- El H1 «Mejores marcas, mejores precios.» y el concepto del pie **no se
  tocan**: son el concepto de marca del brandbook.
- Todo lo marcado **SE MANTIENE** se deja tal cual; hay bastante, y cambiarlo
  sería empeorar el sitio.
- Los estados vacíos y de error actuales de tiendas y del selector de
  `/trabaja` se conservan: son el mejor microcopy que ya tiene el producto.

**Preguntas que siguen abiertas:**

1. Las veinte de *Información faltante*, en ese orden de prioridad.
2. ¿La sección de testimonios se conserva, se sustituye por reseñas de Google
   verificadas, o se retira?
3. ¿La barra de aviso se gestiona desde el panel o se fija una fecha de retiro?
4. ¿Se publica la razón social y el RUC en el pie?
5. ¿Existirá un correo o formulario dedicado para proveedores, separado de
   `hola@lukers.pe`?
