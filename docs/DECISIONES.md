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
