---
name: marca-lukers
description: Aplica la identidad visual oficial de Lukers (manual de marca 2024) a cualquier entregable que se genere — presentaciones PowerPoint, reportes HTML, dashboards, pantallas de sistemas, archivos Excel, PDFs y piezas gráficas. Usa este skill SIEMPRE que el usuario mencione Lukers, "estilo de marca", "manual de marca", "brandbook", o pida generar un reporte, presentación, dashboard, oferta o documento para Lukers, aunque no pida explícitamente aplicar la marca. También cuando pida "aplicar el estilo Lukers" a algo ya generado.
---

# Marca Lukers

Lukers es una tienda de ropa de marca a buen precio. Concepto de marca: **"Mejores marcas, mejores precios"**. La identidad busca ser distintiva, funcional y distinguida: carisma visual, fácil de decodificar, con estatura. El azul #008CFF es EL color que define a la marca; todo lo demás lo acompaña.

Para detalles completos (códigos Pantone/CMYK, reglas de logo, estilos fotográficos, construcción del brillo), lee `references/guia-marca.md`. Lo esencial está aquí abajo.

## Paleta rápida

| Rol | Color | Hex |
|---|---|---|
| Azul Lukers (principal, define la marca) | Pantone 2172 C | `#008CFF` |
| Crema (fondo claro de marca — NO uses blanco puro) | Warm Gray 1 C | `#EFEFE8` |
| Gris oscuro (texto secundario) | Pantone 440 C | `#424242` |
| Casi negro (texto principal sobre claro) | Pantone 432 C | `#212121` |
| Pasteles de acento (solo para brillos/acentos): verde `#AADE88`, turquesa `#68D8D9`, lila `#A6A1F5`, rosa `#E698E6` | | |
| Remate (SOLO material ofertero): rojo `#F03D00`, amarillo `#FFDC00` | | |

Elección de paleta según el documento:
- **Reportes, dashboards, presentaciones a directorio, material institucional** → paleta de marca: azul + crema + grises. Pasteles solo como acentos puntuales (brillos, highlights de un dato).
- **Material de ofertas / remate** → se suman rojo `#F03D00` y amarillo `#FFDC00` para llamar la atención (precios, "REMATE"). Nunca para construir marca: el logo y la estructura siguen en azul/crema.
- El azul siempre domina. Si dudas, azul sobre crema o crema sobre azul.

## Tipografía

La oficial es **MD Nichrome** (comercial, normalmente no instalada). Sustitutos en orden de preferencia:
- **HTML/web**: Google Fonts `Archivo` — "Archivo Black" o Archivo 800-900 para titulares y precios, Archivo 400-600 para cuerpo. Cargar con `<link>` de Google Fonts.
- **PowerPoint/Excel**: "Montserrat" si está disponible; si no, "Arial Black" para titulares y "Arial" para cuerpo (siempre se ven bien en cualquier máquina).
- **PDF generado por código**: incrustar Archivo/Archivo Black (descargable de Google Fonts).

Jerarquía (imita el uso de MD Nichrome del manual): titulares muy pesados (Black/900), cuerpo regular, legales/notas finas. Genera contraste fuerte entre pesos (Regular+Bold, o Thin+Black). MAYÚSCULAS solo excepcionalmente, para gritar una oferta o componer en bloque.

## Logos (en `assets/`)

| Archivo | Qué es | Cuándo usarlo |
|---|---|---|
| `logo_azul_transparente.png` | Logo azul + slogan, fondo transparente | Sobre fondos claros (crema `#EFEFE8`) |
| `logo_crema_transparente.png` | Logo crema + slogan, fondo transparente | Sobre azul `#008CFF` o fondos oscuros |
| `logo_azul_fondo_crema.png` / `logo_crema_fondo_azul.png` | Versiones con fondo incluido | Cuando el bloque entero va de ese color |
| `simbolo_LL_fondo_azul.png` | Símbolo responsive "LL" | Espacios muy chicos: favicon, avatar, esquina de dashboard |

Reglas duras: no estirar, no inclinar, no outline, no sombras ni resplandor, no recolorear fuera de la paleta. Dejar aire alrededor (área de seguridad ≈ la altura del tagline). Tamaño mínimo 14 px de alto en pantalla / 0.5 cm impreso; si no entra legible, usar el símbolo LL. El logo con slogan resiste menos reducción: úsalo en portadas (primera diapositiva, cabecera de reporte); en interiores puede ir la versión sin tanto protagonismo o el símbolo.

## El "brillo" (elemento gráfico distintivo)

Estrella de 4 puntas (puntas en vertical, como ✦). Es el hilo conductor del sistema gráfico. PNGs transparentes en `assets/`: `brillo_azul.png`, `brillo_verde.png`, `brillo_turquesa.png`, `brillo_lila.png`, `brillo_rosa.png`.

Cómo usarlo bien:
- Como acento decorativo en esquinas, separadores, viñetas o junto a un dato destacado. Preferir azul y pasteles.
- En patrones: repetido en retícula cuadriculada, alternando posiciones y colores, siempre con ancho = alto (nunca deformado).
- Como contenedor de un dato corto (un precio de 2 dígitos, un %) — el texto va dentro del brillo agrandado.
- En cajas de contenido: el brillo se coloca en la esquina superior izquierda o inferior derecha de un rectángulo de color que protege la legibilidad del texto sobre fondos complejos.
- En HTML/SVG puedes dibujarlo: cuadrado al que se le restan 4 círculos en los bordes, girado 45° (puntas verticales). O usar el carácter ✦ como recurso ligero en texto.
- No saturar: pocos brillos, que no tapen información ni fotos.

## Recetas por formato

### HTML / dashboards / pantallas de sistemas
- Fondo general crema `#EFEFE8` (no blanco puro); tarjetas pueden ir blancas `#FFFFFF` o crema con borde sutil.
- Cabecera azul `#008CFF` con `logo_crema_transparente.png` (o texto "Lukers" en Archivo Black crema si el archivo no está disponible) y un ✦.
- Texto `#212121`; secundario `#424242`. KPIs y números grandes en Archivo Black; el dato más importante puede ir azul.
- Gráficos: serie principal azul `#008CFF`; series secundarias pasteles (turquesa, lila, verde, rosa); evitar rojos/amarillos salvo alertas o contexto de remate. Variaciones negativas pueden usar `#F03D00` con moderación.
- Botones/acciones primarias: azul con texto crema, esquinas levemente redondeadas. Hover: azul más oscuro (`#0070CC`).
- Footer o franja inferior opcional con el concepto "Mejores marcas ✦ Mejores precios" en neutros (crema/gris), discreta.

### PowerPoint
- Portada: fondo azul `#008CFF` pleno, `logo_crema_transparente.png` grande y centrado o título gigante en crema; el logo con slogan va bien aquí.
- Slides interiores: fondo crema, titulares en azul o `#212121` muy pesados, símbolo o logo pequeño en una esquina (superior derecha o inferior), constante en todas las slides.
- Slide de cierre/divisores de sección: azul pleno con texto crema y brillos pasteles.
- Para decks motivacionales puedes ser más expresivo: brillos más grandes, frases en bloque, MAYÚSCULAS puntuales. Para directorio: sobrio, datos protagonistas, brillos mínimos.

### Excel
- Fila de encabezado: relleno azul `#008CFF`, texto crema/blanco en negrita.
- Fondo de hoja/área de trabajo claro; bandas alternas crema `#EFEFE8` y blanco.
- Totales o KPIs destacados: negrita, azul; negativos en `#F03D00`.
- Título del reporte en celda grande con fuente pesada; opcional insertar `logo_azul_transparente.png` arriba a la izquierda.
- Gráficos con la misma lógica de colores que HTML.

### PDF / piezas gráficas
- Misma lógica que HTML (cabecera azul, cuerpo crema). Si es material de remate: fondos rojo `#F03D00` o amarillo `#FFDC00`, precios enormes en tipografía Black, brillo como contenedor del precio, pero logo siempre en sus colores oficiales.

## Errores que delatan que NO se aplicó la marca

Blanco puro como fondo principal, logo deformado o con sombra, arcoíris de colores en gráficos, rojo/amarillo en un reporte institucional, tipografía fina y tímida en titulares, cero brillos. Si el resultado podría ser de cualquier empresa, falta marca: el azul debe dominar y debería haber al menos un ✦ a la vista.
