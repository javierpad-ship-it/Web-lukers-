# Decisiones sobre el contenido publicado

Notas para quien edite el sitio. No viajan al navegador del visitante.

## 1. Promesa de devolución retirada de la portada

En el bloque de la portada (`index.html`, la caja junto a la foto) llegó a
publicarse la frase **«Si no es original, te devolvemos tu dinero»**.

Esa frase **no existía en la versión anterior del sitio**: se introdujo por
error durante el rediseño. Publicarla es asumir un compromiso legal frente al
consumidor, y no consta que Lukers tenga esa política formal.

Se ha sustituido por un texto que sí es verificable: *«Marcas originales —
Revisa la prenda en tienda antes de llevártela.»*

**Qué hay que decidir:**

- Si la política de devolución **existe**, recupérala y publícala con sus
  condiciones (plazo, estado de la prenda, comprobante) en una página propia
  enlazada desde ese bloque. Una garantía sin condiciones escritas es una
  garantía imposible de cumplir.
- Si **no existe**, el texto actual se queda como está.

## 2. Afirmaciones publicadas pendientes de validar

Estas frases vienen de la versión anterior del sitio y **nadie las ha
verificado**. Están recogidas con detalle en
`docs/agent-workflow/deliverables/WEBSITE_COPY.md`.

| Afirmación | Dónde | Problema |
|---|---|---|
| «Más de 60 marcas» | portada, varias veces | La base de datos carga 24 marcas. Cualquiera puede contarlas en el carrusel de la propia web. |
| «Hasta 70% de descuento» | portada | Sin precio de referencia documentado. En Perú, INDECOPI exige poder sustentar el descuento anunciado. |
| «100% original, garantizado» | portada | Afirmación absoluta, sin matices ni respaldo documentado. |
| «Más de 300 compañeros» | página de empleo | Sin confirmar. |
| Testimonios de Carlos R., María S. y Luis A. | portada | Se desconoce si son personas reales. Si no lo son, hay que retirarlos o sustituirlos por reseñas reales de Google. |

Ninguna se ha modificado por cuenta propia: cambiarlas sin dato es sustituir
una invención por otra.

## 3. La política de privacidad es un borrador

`privacidad.html` sigue la estructura que exige la **Ley N.º 29733** de
Protección de Datos Personales del Perú, pero **no es asesoría legal** y debe
revisarla un abogado antes de darla por definitiva.

Faltan por confirmar, y aparecen marcados en la propia página:

- Razón social exacta de la empresa
- Número de RUC
- Domicilio fiscal
- Plazo de conservación de las postulaciones (sugerido: 12 meses)

Mientras tanto la página muestra un aviso visible explicando que está en
revisión, en lugar de enseñar marcadores rotos al visitante.

## 4. Libro de Reclamaciones

El texto actual asume que el Libro de Reclamaciones es **físico y está en cada
tienda**, que es lo que corresponde a un negocio con locales.

Si Lukers quiere ofrecer además un **Libro de Reclamaciones virtual**, INDECOPI
exige un formulario con campos y plazos concretos: hay que construirlo aparte,
el texto actual no sirve.

## 5. Medición: el sitio no mide nada

No hay ninguna herramienta de analítica instalada. Hoy es imposible saber
cuánta gente entra, de dónde viene o si alguien pulsa «Cómo llegar».

Recomendación: **Plausible** o **Umami** (sin cookies, así no hace falta banner
de cookies y la política de privacidad actual sigue siendo cierta) por encima
de Google Analytics 4.

Decisión pendiente del dueño: qué herramienta se contrata.

## 6. CORRECCIÓN DE FONDO: el contenido de este repositorio es ficticio

**Fecha:** 18 de septiembre de 2026.

Durante buena parte del trabajo se asumió que este repositorio contenía la web
de Lukers. **No es así.** La web real es `www.lukers.pe`; este repositorio es
una maqueta que **nunca ha estado publicada**, construida por sesiones de IA
anteriores, y su contenido sobre Lukers es inventado:

- Las **12 tiendas y sus direcciones** (al menos 7 no coinciden con la realidad)
- La **lista de 24 marcas**
- Los **tres testimonios** firmados por Carlos R., María S. y Luis A.
- La **línea de tiempo** que arranca en 2001
- Las cifras: «más de 60 marcas», «más de 300 compañeros», «hasta 70%»

Esto reinterpreta los puntos 1 y 2 de este documento: no eran afirmaciones sin
verificar de la empresa, eran **invenciones de una IA sobre una empresa real**,
que es bastante peor.

**Medidas tomadas:**

- Aviso permanente en `server/db.js`, sobre los datos de origen.
- Los datos estructurados de tienda para Google quedan **desactivados**; solo se
  publican con `TIENDAS_VERIFICADAS=1`.
- Plan de trabajo en `docs/PLAN-REDISENO.md`, cuya fase 0 es obtener el
  contenido real.

**Nada de este repositorio debe publicarse hasta sustituir ese contenido.**

---

## 7. Los testimonios inventados, fuera (22/09/2026)

La portada tenía tres testimonios firmados con nombre y apellido —«Carlos R.,
cliente, San Miguel», «María S., jefa de tienda, Trujillo», «Luis A., socio
comercial»— que **no existen**. Los escribió una sesión de IA anterior como
relleno. Poner palabras en boca de personas inventadas sobre una empresa real
no es un detalle de copy: es una afirmación falsa sobre Lukers, y encima la
más fácil de desmontar.

**En su lugar:** vídeos publicados por clientas reales en TikTok
(`@annys_cas`, `@lenaahurtado`, `@kennethtristanm`), con crédito visible al
autor y enlace al vídeo original. El reproductor de TikTok se carga solo
cuando alguien toca un vídeo, así que la página no arrastra rastreadores de
terceros mientras nadie lo pide.

**Lo que falta ahí:** la nota y el número de reseñas de Google. Están marcados
como dato pendiente, sin cifra inventada. Es el dato que de verdad convence a
alguien antes de ir a una tienda, y es verificable.

**Aviso de mantenimiento:** una sección de vídeos se pudre si nadie la toca.
El tercero es de octubre de 2024. Tres vídeos de hace dos años dan peor
impresión que no tener sección.

## 8. El plano de tiendas empieza cerrado (22/09/2026)

Se puede elegir una tienda y ver dónde está sin salir de la página. Pero
Google Maps incrustado pesa cerca de 1 MB e instala cookies de Google en
cuanto carga, mire o no el visitante el plano. Por eso empieza cerrado, con
una tapa que lo dice, y no se pide nada a Google hasta que alguien lo abre.

El botón «Cómo llegar» no cambia: en móvil, lo que lleva a alguien a la tienda
es abrir su propia app de mapas con la ruta empezada.

**Deuda técnica asumida:** la dirección del plano no lleva clave y no está
documentada por Google. Funciona hoy; si dejara de responder hay que contratar
la clave de la Embed API y rellenar `CLAVE_MAPS` en `js/site.js`. El código ya
construye las dos formas y «Cómo llegar» no depende de eso.

**Sin verificar:** no se ha podido ver ninguno de los diez planos porque
Google está bloqueado en el entorno de desarrollo. Si alguna tienda cae en el
sitio equivocado, se le pone `data-coords="lat,lon"` a su tarjeta.

## 9. Lukers vende ropa de niño (22/09/2026)

Confirmado por el propietario. Con eso, el titular **«Ropa de marca para toda
la familia»** y la bajada que nombra a mujer, hombre y niños quedan
respaldados: no son una promesa inventada.

También queda en pie el hueco de foto `cat_deportivo`, que pide una foto de
niños con ropa deportiva.

## 10. Las categorías son cuatro mundos, no cuatro cosas (22/09/2026)

Eran Formal, Casual, Calzado y Accesorios: dos estilos y dos tipos de producto
en la misma fila. Ahora son **Formal, Casual, Urbano y Deportivo**: un solo
criterio.

**A quién va dirigido no lo dice la etiqueta, lo dice la foto.** Una mujer con
terno dice «formal» y dice «mujer» a la vez, así que la etiqueta no tiene que
cargar con las dos cosas. Por eso cada hueco de foto pide una persona distinta
y entre los cuatro salen mujer, hombre y niños.

## 11. El horario y el distrito que ve Google salen de los datos reales (22/09/2026)

Dos fallos en los datos estructurados de tiendas, los dos encontrados al
revisar el bloque antes de encenderlo:

1. **El horario estaba escrito a mano**: `openingHours: "Mo-Su 10:00-22:00"`
   fijo para las diez tiendas. Chiclayo, Tarapoto e Iquitos abren de 9:30 a
   21:30. Google habría publicado un horario falso para tres locales, y alguien
   habría llegado a las 21:45 a una tienda cerrada. Ahora se calcula desde la
   columna `hours`, y si el texto no se puede interpretar la ficha sale **sin
   horario**: una ficha sin horario es correcta, una con el horario equivocado
   manda a la gente a una puerta cerrada.
2. **El distrito no llegaba**: las seis tiendas de Lima mandaban
   `addressLocality: "Lima"` y el distrito se perdía dentro del texto libre de
   la dirección. El distrito es la señal que decide «ropa cerca de mí» y
   «outlet en Chorrillos». Ahora va como `addressLocality`.

El bloque **sigue apagado** (`TIENDAS_VERIFICADAS`). Solo se enciende cuando
Lukers confirme el distrito de la ficha de Google de La Marina y el horario de
Trujillo.

## 12. La foto de tienda cambió de trabajo (22/09/2026)

Al pasar la tarjeta de tienda a una fila sin miniatura, la foto dejó de verse
en la web. Pero no es un botón muerto: alimenta el campo `image` de la ficha de
Google. El panel no lo decía, así que se añadió un aviso encima de la tabla
explicando para qué sirve y qué foto conviene (fachada, de día, con el cartel).

## 13. Trujillo tiene horario propio (22/09/2026)

Confirmado por Lukers: **9:30 a. m. – 10:30 p. m.** Estaba con el horario de
Lima porque, al dar el horario corto, solo se nombró a Chiclayo, Tarapoto e
Iquitos.

Con esto los horarios pasan de dos a tres, y las constantes de `server/db.js`
se renombraron: `HORARIO_LIMA` y `HORARIO_9Y30` dejaron de decir la verdad en
cuanto aparecieron dos horarios que empiezan a las 9:30. Ahora los nombres
llevan las dos horas (`HORARIO_10_22`, `HORARIO_930_2230`, `HORARIO_930_2130`).

`horarioSchema()` no hizo falta tocarla: ya convertía cualquier hora, no solo
las dos que había. Comprobado antes de darlo por bueno.

## 14. El aviso de novedades sube a la segunda posición, como franja (22/09/2026)

Estaba en la posición 9 de 10, enterrado. Para un outlet, enterarse antes de
las llegadas nuevas es el gancho: la prenda buena se va en días.

**Pero va como franja, no como sección completa.** Una sección entera ahí
pediría el correo antes de haber enseñado nada —el visitante aún no sabe qué
marcas hay ni que existen diez tiendas— y empujaría «Encuentra tu tienda»
medio scroll hacia abajo, que es el objetivo principal del sitio. La franja se
ve igual de pronto y ocupa 237 px en vez de unos 500.

### Contraste: el azul de marca no puede llevar texto pequeño

Al medirlo salió algo que venía de antes: **sobre el azul de marca (#008CFF)
ni el blanco puro llega al mínimo** (3,39:1, cuando el texto normal pide
4,5:1). La crema se queda en 2,93:1 y el texto del consentimiento en 2,64:1.

La franja usa **`--azul-hondo` (#005CA8)**: crema 5,87:1, texto pequeño
5,28:1, mensajes 5,45:1 y 5,74:1. Sigue siendo azul Lukers, pero se lee.

Importa más aquí que en otros sitios porque esta franja es lo segundo que se
ve y lleva un formulario: si no se lee el consentimiento, no hay
consentimiento informado.

> **Pendiente, del mismo problema:** la barra de anuncio de arriba del todo
> (`.announce`) usa crema sobre `--azul`, o sea los mismos 2,93:1. No se ha
> tocado porque cambiar el color de la barra superior es una decisión de marca,
> no un arreglo técnico. Hay que decidirlo.
