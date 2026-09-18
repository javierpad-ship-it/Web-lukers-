# Información pública de Lukers encontrada fuera del repositorio

**Fecha:** 18 de septiembre de 2026
**Cómo se obtuvo:** búsqueda web pública. **No se pudo acceder a lukers.pe**:
el entorno de desarrollo tiene la salida a internet restringida a una lista de
dominios permitidos y el dominio devuelve 403 antes de llegar al servidor.

> ⚠️ **Nada de este documento debe publicarse en la web sin que Lukers lo
> confirme.** Procede de redes sociales y de resúmenes de buscador, no de una
> fuente oficial de la empresa. Es material para *verificar*, no para *copiar*.

---

## 1. LO MÁS GRAVE: las direcciones de las tiendas no coinciden

La base de datos del sitio (`server/db.js`) tiene unas direcciones y las
publicaciones públicas de Lukers indican otras. **Siete de las doce no
coinciden.**

| Tienda | Dirección en la web actual | Dirección encontrada públicamente | |
|---|---|---|---|
| San Miguel | Av. La Marina 1666 | Av. La Marina 1666 | ✅ coincide |
| Chorrillos | Av. El Sol 1175 | Av. El Sol 1175 | ✅ coincide |
| Independencia | Av. Carlos Izaguirre 210 | **Av. Alfredo Mendiola 3688** | ❌ distinta |
| Lince | Av. Arequipa 1890 | **Av. Prolongación Iquitos 2635** | ❌ distinta |
| Breña | Av. Brasil 1099 | **Av. Alfonso Ugarte 1234** | ❌ distinta |
| Trujillo | Jr. Pizarro 540 | **Jr. Pizarro 519** | ❌ distinta |
| Chiclayo | Av. Balta 1050 | **Av. Luis Gonzales 1285** | ❌ distinta |
| Tarapoto | Jr. San Martín 320 | **Jr. Martínez de Compañón 246** | ❌ distinta |
| Iquitos | Jr. Próspero 615 | **Jr. Sargento Lores 162** | ❌ distinta |
| Jr. de la Unión | Jr. de la Unión 455 | (no encontrada) | ⚠️ sin verificar |
| Pueblo Libre | Av. Sucre 545 | (no encontrada) | ⚠️ sin verificar |
| Surco Outlet | Av. Tomás Marsano 3025 | (no encontrada) | ⚠️ sin verificar |

**Por qué importa ahora y no dentro de un mes:**

1. El visitante que pulsa «Cómo llegar» acaba en el sitio equivocado.
2. Desde el commit `5767158`, esas direcciones se publican además como datos
   estructurados `ClothingStore` para Google. Si son incorrectas, se le está
   enseñando a Google la ubicación equivocada de siete locales, justo el dato
   sobre el que se construye todo el SEO local.

**Acción requerida:** alguien de Lukers tiene que confirmar las doce
direcciones, una por una, contra la realidad. Hasta entonces, conviene decidir
si se retiran los datos estructurados.

---

## 2. Lukers antes se llamaba «Remate de Fábrica»

Varias publicaciones dicen literalmente *«Remate de Fábrica ahora es Lukers»*.

Es un hecho de marca importante y **no aparece en la línea de tiempo del
sitio**, que salta de 2019 a 2026. Si se confirma, merece su propio hito: el
cambio de nombre explica la marca actual y da continuidad a la historia.

---

## 3. «Más de 60 marcas» sí es una afirmación de la empresa

Aparece en sus propias publicaciones: *«más de 60 mejores marcas de USA y
Europa, 100% originales»*.

Esto **resuelve la contradicción** detectada antes: la cifra no era inventada
por el sitio, pero la base de datos solo carga **24 marcas**. El arreglo no es
cambiar el texto, es **cargar las marcas que faltan** en el panel.

Marcas mencionadas públicamente que **no están** en la base de datos:

- Bershka
- Pull & Bear
- Stradivarius
- Tommy Hilfiger

(La base sí tiene Puma, que también aparece públicamente.)

---

## 4. Precios reales mencionados

- Prendas **desde S/ 9.90**
- En Trujillo, **desde S/ 19.90**

El sitio habla de «hasta 70% de descuento», que es una afirmación distinta y
más difícil de sustentar. Un precio de entrada concreto es más creíble, más
verificable y más atractivo que un porcentaje.

---

## 5. Redes sociales: hay prueba social sin usar

- **Instagram** `@lukers.pe`: **143 000 seguidores**
- **Facebook**: `Lukers.pe`, activa
- **TikTok**: existe presencia (varias cuentas y vídeos mencionan Lukers)

El sitio enlaza Facebook e Instagram, pero **no menciona en ningún sitio los
143 000 seguidores**, que es una señal de confianza real y verificable, al
contrario que los tres testimonios sin origen conocido.

El enlace de TikTok del sitio anterior apuntaba a `tiktok.com` a secas, sin
cuenta. Hay que poner la cuenta real o quitarlo.

---

## 6. Confirmado: el horario

**10:00 a. m. – 10:00 p. m., todos los días, en todas las sedes.**
Coincide con lo que publica el sitio. ✅

---

## 7. Lo que sigue sin aparecer

No se encontró públicamente, y solo puede darlo la empresa:

- Razón social y **RUC**
- Domicilio fiscal
- **Teléfono** de central
- **Número de WhatsApp**
- Política de devolución o garantía formal
- Origen de los testimonios publicados
- Número real de empleados («más de 300»)

---

## Fuentes

- [Lukers (@lukers.pe) en Instagram](https://www.instagram.com/lukers.pe/)
- [Lukers (@Lukers.pe) en Facebook](https://www.facebook.com/Lukers.pe/)
- [«Remate de Fábrica ahora es Lukers» — Facebook](https://www.facebook.com/Lukers.pe/posts/remate-de-f%C3%A1brica-ahora-es-lukersviste-tu-mejor-luk-con-las-mejores-marcas-de-us/847020214184838/)
- [«Ya abrimos Lukers Jr. de la Unión» — Facebook](https://www.facebook.com/Lukers.pe/posts/atenci%C3%B3n-lima-ya-abrimos-lukers-jr-de-la-uni%C3%B3n-visita-nuestra-nueva-m%C3%A1s-moderna-/1152635000290023/)
- [Lukers Trujillo — TikTok](https://www.tiktok.com/@pepevlogger/video/7416128600761453830)

---

# Segunda tanda de hallazgos

No se pudo abrir ninguna página: en este entorno **solo funciona el buscador**;
Instagram, Facebook y el propio lukers.pe devuelven conexión bloqueada. Lo que
sigue procede de resultados de búsqueda, no de las páginas originales.

## 8. Datos de la empresa encontrados en un directorio público

| Dato | Valor encontrado |
|---|---|
| **RUC** | **20605007784** |
| **Razón social** | **LUKERS SOCIEDAD ANÓNIMA CERRADA** |
| Nombre comercial | Lukers |
| Tipo | Sociedad Anónima Cerrada |
| Estado | Activo |
| **Inicio de actividades** | **16 de julio de 2019** |
| Actividad | Venta minorista de productos textiles y calzado |
| **Domicilio fiscal** | **Av. Los Faisanes 420, Urb. La Campiña, Chorrillos, Lima** |

> ⚠️ Procede de un directorio de terceros, **no de SUNAT**. Antes de publicarlo
> en la política de privacidad hay que verificarlo en la consulta oficial de
> RUC de SUNAT. Es el dato que identifica legalmente al responsable del
> tratamiento de datos: no puede ir de oídas.

## 9. CONTRADICCIÓN: 2001 contra 2019

El sitio publica **«2001 · Nace Lukers»** y **«Más de dos décadas de
crecimiento»**. El registro público dice que las actividades empezaron el
**16 de julio de 2019**.

La explicación probable es que el negocio operaba antes como **Remate de
Fábrica** y en 2019 se constituyó la sociedad actual con el nombre Lukers. Si
es así, la historia es cierta pero está mal contada: la marca Lukers no nace en
2001, nace del rebranding.

**Hay que decidir cómo se cuenta**, porque «más de dos décadas» junto a una
empresa registrada en 2019 es justo el tipo de detalle que un competidor o
INDECOPI pueden señalar. Una redacción honesta y igual de potente sería contar
el origen en 2001 como Remate de Fábrica y el nacimiento de Lukers como etapa.

## 10. Ya existe un Libro de Reclamaciones en la web actual

Se encontró la página `lukers.pe/institucional/tiendasel-reclamacion`, dentro de
una sección **«Institucional»**.

Esto **cambia lo que escribimos**: `privacidad.html` asume que el Libro de
Reclamaciones es solo físico. Si ya hay uno virtual, hay que enlazarlo en lugar
de explicar que se pida en tienda.

## 11. Existe un catálogo online: `lukers.kyte.site`

Es un catálogo de productos montado en Kyte, separado del sitio institucional.

⚠️ En ese catálogo aparece **un número de teléfono con prefijo +591, que es
Bolivia**, no Perú (+51). Si es el contacto de atención, está mal configurado y
los clientes no pueden llamar.

## 12. Redes sociales reales

| Red | Cuenta | Nota |
|---|---|---|
| Instagram | `@lukers.pe` | 143 000 seguidores |
| Facebook | `Lukers.pe` | activa |
| **TikTok** | **`@lukers.pe`** | la web anterior enlazaba a `tiktok.com` sin cuenta |
| Threads | `@lukers.pe` | no enlazada en la web |

## 13. Otra discrepancia en el número de tiendas

Una publicación de Facebook dice **«visítanos en nuestras 7 tiendas»**. La base
de datos del sitio tiene **12**. Puede ser una publicación antigua, pero hay que
confirmar cuántas hay hoy: la portada anuncia «12 tiendas en el Perú» como cifra
destacada.

---

## Resumen: lo que hay que confirmar, por orden de urgencia

1. **Las 12 direcciones**, una por una (siete no coinciden con lo publicado).
2. **Cuántas tiendas hay realmente** hoy.
3. **RUC y razón social** contra SUNAT, antes de publicarlos.
4. **Cómo se cuenta la historia**: 2001, 2019 o ambas.
5. **URL real del Libro de Reclamaciones** en el sitio actual.
6. **Teléfono y WhatsApp** correctos, con prefijo peruano.
7. Si el catálogo `kyte.site` sigue activo y si debe enlazarse.
8. Cuenta de TikTok, para enlazarla bien.
