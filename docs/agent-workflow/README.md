# Flujo multiagente de Web Lukers

Este repositorio incluye ocho agentes personalizados de Codex en `.codex/agents/`. Codex los descubre al abrir el proyecto y el agente principal los coordina según `AGENTS.md`.

## Mapa del proceso

| Etapa | Agente | Entregable |
|---|---|---|
| 1 | `aria` | `SITE_BLUEPRINT.md` |
| 2A | `hero` | `HERO_UX_SPEC.md` |
| 2B | `search` (estrategia) | `SEO_STRATEGY.md` |
| 3 | `motion` | `MOTION_SYSTEM.md` |
| 4 | `copy` | `WEBSITE_COPY.md` |
| 5 | `dev` | `BUILD_SPEC.md` + código |
| 6A | `cro` | `CRO_AUDIT.md` |
| 6B | `search` (auditoría) | `SEO_TECH_AUDIT.md` |
| 7 | `dev` | Correcciones aprobadas + verificación |
| 8 | `launch` | `30_DAY_LAUNCH_PLAN.md` |

Los entregables viven en `docs/agent-workflow/deliverables/`. Cada especialista escribe un archivo distinto; solo `dev` modifica el producto.

## Cómo pedir una ejecución completa

Usa un pedido explícito como:

> Construye la siguiente versión de Web Lukers usando el flujo completo de ocho agentes definido en AGENTS.md. Respeta sus dependencias, ejecuta en paralelo solo las fases independientes, espera sus resultados, implementa con dev y devuelve un resumen de decisiones, cambios, pruebas y pendientes.

Para una tarea puntual, invoca solo lo necesario:

- “Pide a `hero` tres alternativas para el primer viewport; no cambies código.”
- “Pide a `search` la fase de auditoría SEO y luego a `dev` corregir solo los hallazgos críticos.”
- “Pide a `cro` auditar el formulario de newsletter y devolver experimentos medibles.”

## Regla de gobernanza

Un agente no reemplaza silenciosamente decisiones de otro. Cuando detecta un conflicto, registra `REQUEST_FOR_CHANGE → agente`, explica la evidencia y espera que el agente principal decida si reabre la fase.
