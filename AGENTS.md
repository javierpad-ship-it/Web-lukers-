# Web Lukers — instrucciones para Codex

## Objetivo del repositorio

Construir y operar el sitio institucional de Lukers como una experiencia de marca clara, rápida, accesible y orientada a conversión. La promesa vigente es **“Mejores marcas, mejores precios”**.

Antes de proponer diseño, copy o código, lee:

1. `README.md` para entender la arquitectura y el despliegue.
2. `.claude/skills/marca-lukers/SKILL.md`.
3. `.claude/skills/marca-lukers/references/guia-marca.md` cuando la tarea afecte diseño, contenido visual o identidad.
4. Los entregables existentes en `docs/agent-workflow/deliverables/`.

No reconstruyas ni recolorees los logos. No inventes marcas comercializadas, precios, promociones, testimonios, métricas, tiendas, ubicaciones ni afirmaciones sobre Lukers. Señala esas necesidades como información pendiente.

## Equipo de ocho agentes

Usa los agentes personalizados de `.codex/agents/` cuando una solicitud abarque una creación, rediseño, optimización o lanzamiento sustancial del sitio:

1. `aria` — dirección creativa, estrategia y arquitectura UI.
2. `hero` — experiencia inicial y conversión above-the-fold.
3. `motion` — movimiento, interacción y accesibilidad.
4. `copy` — copywriting de conversión.
5. `dev` — arquitectura e implementación frontend/backend.
6. `cro` — auditoría independiente de conversión.
7. `launch` — lanzamiento, analítica y plan de 30 días.
8. `search` — SEO estratégico y técnico.

No invoques los ocho para una corrección pequeña. Usa solo el especialista necesario y `dev` cuando haya que modificar código.

## Dos copias del mismo equipo: Codex y Claude Code

Los ocho agentes existen por duplicado porque cada herramienta lee un formato
distinto:

| Herramienta | Dónde busca | Formato |
|---|---|---|
| Codex | `.codex/agents/*.toml` | TOML |
| Claude Code | `.claude/agents/*.md` | Markdown con cabecera YAML |

Los nombres (`aria`, `hero`, `motion`, `copy`, `dev`, `cro`, `search`,
`launch`), los roles, los entregables y el flujo son **los mismos** en ambos.
La versión de Claude Code añade al final de cada agente el contrato común y,
en los siete agentes que no son `dev`, la restricción explícita de escribir
únicamente dentro de `docs/agent-workflow/deliverables/`.

**Si cambias un agente, cámbialo en los dos sitios.** Si divergen, manda este
archivo (`AGENTS.md`), que es el que leen ambas herramientas.

## Flujo obligatorio para proyectos completos

El agente principal coordina, conserva las decisiones del usuario y sintetiza los resultados. Delega en este orden:

1. `aria` crea `SITE_BLUEPRINT.md`.
2. Ejecuta en paralelo, cuando sea útil:
   - `hero` crea `HERO_UX_SPEC.md`.
   - `search` crea la primera fase de `SEO_STRATEGY.md`.
3. `motion` crea `MOTION_SYSTEM.md`.
4. `copy` crea `WEBSITE_COPY.md`, incorporando el mapa SEO sin degradar claridad ni conversión.
5. `dev` crea o actualiza `BUILD_SPEC.md` e implementa el código.
6. Ejecuta en paralelo:
   - `cro` crea `CRO_AUDIT.md`.
   - `search` agrega la auditoría a `SEO_TECH_AUDIT.md`.
7. El agente principal prioriza hallazgos; `dev` implementa correcciones aprobadas y verifica el sitio.
8. `launch` crea `30_DAY_LAUNCH_PLAN.md` cuando el sitio esté listo para publicar.

No paralelices tareas con dependencias incompletas. Evita que dos agentes editen el mismo archivo al mismo tiempo. Los agentes de estrategia y auditoría escriben únicamente sus entregables; `dev` es el único propietario de cambios en el producto, salvo instrucción expresa del agente principal.

## Contrato de trabajo

Cada agente debe:

- trabajar con evidencia del repositorio y citar rutas concretas;
- distinguir hechos, supuestos e información faltante;
- respetar las decisiones ya aceptadas;
- no cambiar silenciosamente el alcance de otro agente;
- emitir `REQUEST_FOR_CHANGE → <agente>` si una decisión previa necesita revisión;
- cerrar su entregable con el formato de `docs/agent-workflow/HANDOFF_TEMPLATE.md`;
- guardar sus documentos en `docs/agent-workflow/deliverables/`;
- mantener los nombres canónicos definidos arriba para que los siguientes agentes encuentren sus inputs.

## Reglas técnicas

- Mantén la arquitectura actual: HTML, CSS y JavaScript sin framework, servidor Express y SQLite de Node, salvo que el usuario apruebe una migración.
- Conserva `index.html`, `trabaja.html`, `postulaciones.html` y `admin.html` como experiencias responsivas y funcionales.
- Prioriza mobile-first, navegación con teclado, foco visible, HTML semántico, contraste, `prefers-reduced-motion`, rendimiento y Core Web Vitals.
- Ninguna animación debe bloquear lectura, navegación o interacción.
- Mantén secretos fuera del repositorio y usa `.env.example` para documentar variables.
- No modifiques datos persistentes, archivos subidos ni bases de datos reales durante pruebas.
- Antes de entregar cambios de código, ejecuta las verificaciones disponibles, inicia el servidor cuando sea seguro y prueba las rutas afectadas.

## Criterio de terminado

Una tarea no está terminada solo porque compila. Debe conservar el comportamiento existente, verse correctamente en móvil y escritorio, ser navegable con teclado, no introducir errores de consola o servidor, y dejar documentados los supuestos que requieren validación humana.
