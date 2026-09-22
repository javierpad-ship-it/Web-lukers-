# Información pública de Lukers encontrada fuera del repositorio

> 🔴 **CORRECCIÓN IMPORTANTE (18/09/2026).** Cuando se escribió este documento
> se creía que el sitio del repositorio era la web publicada de Lukers. **No lo
> es.** La web real es `www.lukers.pe` y este repositorio nunca ha estado en
> línea: es una maqueta cuyo contenido —tiendas, direcciones, marcas,
> testimonios e historia— **fue inventado por sesiones de IA anteriores**.
>
> Por tanto, las «discrepancias» que se describen abajo no son datos
> desactualizados: son **datos ficticios frente a datos reales**. Lo encontrado
> públicamente es, casi con seguridad, lo correcto — pero igualmente debe
> confirmarlo Lukers antes de publicarse.
>
> Ver `docs/PLAN-REDISENO.md`.

**Fecha:** 18 de septiembre de 2026
**Cómo se obtuvo:** búsqueda web pública. **No se pudo acceder a lukers.pe**:
el entorno de desarrollo tiene la salida a internet restringida a una lista de
dominios permitidos y el dominio devuelve 403 antes de llegar al servidor.

> ⚠️ **Nada de este documento debe publicarse en la web sin que Lukers lo
> confirme.** Procede de redes sociales y de resúmenes de buscador, no de una
> fuente oficial de la empresa. Es material para *verificar*, no para *copiar*.

---

## 1. RESUELTO EN PARTE: las direcciones de las tiendas

**Estado: corregido en el código el 22/09/2026. Pendiente de que Lukers lo confirme.**

Las doce tiendas que tenía la maqueta eran inventadas; siete direcciones no
coincidían con nada publicado. Se han sustituido por **las diez que Lukers
publica en sus propias cuentas**, donde la misma lista se repite en varias
publicaciones distintas a lo largo de 2024, 2025 y 2026.

### Las diez tiendas (en `server/db.js`)

| # | Tienda | Dirección | Confianza |
|---|---|---|---|
| 1 | Jr. de la Unión (Cercado de Lima) | Jr. de la Unión 455 | Alta · apertura reciente anunciada por Lukers |
| 2 | Chorrillos | Av. El Sol 1175 | Alta · ver duda abajo |
| 3 | Independencia | Av. Alfredo Mendiola 3688 | Alta |
| 4 | Lince | Av. Prolongación Iquitos 2635 | Alta |
| 5 | San Miguel | Av. La Marina 1666 | Alta |
| 6 | Breña | Av. Alfonso Ugarte 1234-1236 | Alta |
| 7 | Trujillo | Jr. Pizarro 519 | Alta |
| 8 | Chiclayo | Av. Luis Gonzales 1285 | Alta |
| 9 | Tarapoto | Jr. Martínez de Compagñón 246 | Alta |
| 10 | Iquitos | Jr. Sargento Lores 162 | Alta · ver duda abajo |

Coincide con las **diez** que indicó el propietario.

### De dónde salen

De las cuentas oficiales de Lukers: TikTok `@lukers.pe`, Threads `@lukers.pe` y
Facebook `Lukers.pe`. Publicaciones en las que la lista aparece completa:

- «El verano es para disfrutar…» — Threads, 2026
- «¡Ven a Lukers y transforma tu luk de oficina…» — Threads, 2024
- «El viernes 30 de agosto, feriado, estaremos atendiendo…» — Threads, 2024
- «En Remate de fábrica encontrarás marcas nacionales e internacionales…» — TikTok
- «¡ATENCIÓN LIMA, YA ABRIMOS LUKERS JR DE LA UNIÓN!» — Facebook e Instagram

**Importante:** NO se han leído desde `www.lukers.pe`. Ese dominio está
bloqueado por la política de red de este entorno, igual que Instagram,
Facebook y Threads. Solo se ha podido llegar a los textos que el buscador
muestra de esas publicaciones.

### Las dudas, cerradas por Lukers el 22/09/2026

1. **Chorrillos: 1175.** Confirmado. El 1197 de la publicación antigua era de
   la etapa Remate de Fábrica.
2. **Iquitos: 162.** Confirmado. El 182 de una publicación era un error.
3. **Pueblo Libre no es una tienda aparte:** es la de **Av. La Marina 1666**.
   La publicación antigua la llamaba Pueblo Libre. Siguen siendo diez.
4. **Horarios.** Hay dos:
   - Lima (seis tiendas) y Trujillo → **10:00 a 22:00**, todos los días.
   - **Chiclayo, Tarapoto e Iquitos → 9:30 a 21:30**, todos los días.

### Cerrado: la tienda de Av. La Marina se llama «Lukers La Marina»

Las publicaciones de Lukers la anuncian como **San Miguel** y dentro de la
empresa se la conoce como **Pueblo Libre**. Av. La Marina separa los dos
distritos en ese tramo, así que ninguna de las dos es falsa. Decisión de
Lukers (22/09/2026): **se nombra por la avenida**, que es además como la
llaman los clientes.

El distrito sigue apareciendo en la dirección (**San Miguel**, que es lo que
Lukers publica). Ese dato tiene que coincidir con el de la ficha de Google
Business de esa tienda: si no coincide, Google recibe dos versiones de la
misma ubicación y eso resta en las búsquedas locales. Conviene abrir la ficha
y comprobarlo antes de encender `TIENDAS_VERIFICADAS`.

### Lo que sigue apagado a propósito

Los **datos estructurados** de tiendas para Google (`ClothingStore`) siguen sin
publicarse. Se activan poniendo `TIENDAS_VERIFICADAS=1` en las variables de
entorno, y solo debe hacerse **después** de que alguien de Lukers revise las
diez direcciones y cierre las cuatro dudas de arriba. Enseñarle a Google una
ubicación equivocada es peor que no enseñarle ninguna.

### Cómo llegó esto a la base de datos que ya está desplegada

La base de datos de Railway ya tenía dentro las doce tiendas inventadas, y la
semilla original solo se ejecutaba con la tabla vacía. Se ha añadido una
sustitución **de una sola vez** (`server/db.js`, marca `stores_seed_reales_2026_09`):
en el primer arranque tras este cambio borra las ficticias y escribe las
reales, y deja constancia para no volver a hacerlo nunca más. Probado: lo que
se edite después desde el panel sobrevive a los reinicios.

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

## 13. RESUELTO: cuántas tiendas hay

Eran **diez**, confirmadas por el propietario el 22/09/2026 y coincidentes con
la lista que Lukers publica en sus redes. La maqueta decía doce; la publicación
antigua de Facebook que decía «nuestras 7 tiendas» es de una etapa anterior.

Queda por revisar cualquier sitio del código o del copy que siga diciendo
«12 tiendas».

---

## Resumen: lo que hay que confirmar, por orden de urgencia

Actualizado el 22/09/2026.

1. **Distrito de la ficha de Google de La Marina.** ¿Dice San Miguel o Pueblo
   Libre? La web manda San Miguel. **Es lo único que falta para encender
   `TIENDAS_VERIFICADAS=1`** y que Google vea las diez ubicaciones.
2. **Horario de Trujillo.** ¿10:00–22:00 o 9:30–21:30? Hoy está con el de
   Lima, porque Lukers solo nombró a Chiclayo, Tarapoto e Iquitos al dar el
   horario corto. Es la otra tienda de provincia.
3. **Nota y número de reseñas de Google**, sumando las diez tiendas. Es el
   único hueco de la sección de comunidad.
4. **RUC y razón social** contra SUNAT, antes de publicarlos.
5. **Cómo se cuenta la historia**: 2001, 2019 o ambas.
6. **URL real del Libro de Reclamaciones** en el sitio actual.
7. **Teléfono y WhatsApp** correctos, con prefijo peruano (+51). Mientras
   `WHATSAPP_NUMBER` esté vacío en `js/config.js`, los botones no se muestran.
8. Si el catálogo `kyte.site` sigue activo y si debe enlazarse.

### Resueltos

- ~~Las direcciones de las diez tiendas~~ → confirmadas.
- ~~Cuántas tiendas hay~~ → diez.
- ~~Horarios~~ → dos: Lima 10–22, y Chiclayo, Tarapoto e Iquitos 9:30–21:30.
- ~~Si Pueblo Libre es una tienda aparte~~ → no, es la de Av. La Marina.
- ~~Si Lukers vende ropa de niño~~ → sí.

### Pendiente de decidir (no es un dato, es una decisión)

- **La pestaña «Ofertas» del panel no la ve nadie.** Deja crear ofertas con
  título y descripción, pero **ninguna página del sitio las muestra**: no hay
  sección de ofertas ni nada que llame a `/api/offers`. Quien escriba ahí
  estará escribiendo en el vacío. Hay que elegir: montar la sección en la web,
  o retirar la pestaña. Comprobado el 22/09/2026 buscando `api/offers` en todo
  el HTML y el JavaScript público.
