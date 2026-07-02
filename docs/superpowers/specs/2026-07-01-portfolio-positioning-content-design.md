# Portfolio Positioning & Content — Design Spec

**Date:** 2026-07-01
**Status:** Approved
**Goal:** Reposicionar el mensaje del portfolio hacia Data Scientist / ML Engineer con capacidad demostrada de arquitectura de software, y reemplazar contenido genérico por case studies con hechos reales (arquitectura, decisiones, métricas donde existan).

---

## Contexto

Auditoría previa (2026-07-01) encontró:

- El Hero y el `<title>` de `index.astro` posicionan el sitio como "Applied GenAI Data Analyst" — desalineado con el objetivo de entrevistas DS/ML.
- `ai-sales-assistant.md` está `featured: true` pero tiene 3 líneas de descripción genérica; la arquitectura real (separación `loader/analysis/agent/charts`, tests) no se muestra.
- El código de ese proyecto vive ahora en un repo externo, `github.com/HoracioLaphitz/Data-Analysis-Ecommerce` (cambio de metodología/enfoque), no en `Proyectos/ai-sales-assistant/` local.
- `redes-convolucionales.md` y `prediccion-imagenes.md` usan estructura Situación/Desafío/Solución/Impacto pero sin ninguna métrica cuantitativa.
- El README raíz es 100% instrucciones de deploy, no comunica quién es el autor.

Fuera de alcance en esta fase: pulido visual, rename Factory→Facade, dependencia de fuente externa, y cualquier trabajo sobre el repo externo `Data-Analysis-Ecommerce` o el pipeline de churn (branch `feat/sqlite-data-mart`) — quedan para fases posteriores.

---

## Cambios

### 1. Hero + homepage

**Archivos:** `src/presentation/components/sections/Hero.tsx`, `src/pages/index.astro`

- Reemplazar titular "Analista de Datos orientado al desarrollo agéntico" / `<title>` "Applied GenAI Data Analyst — Python, LangChain & RAG" por un mensaje con eje en Data Science/ML Engineering + capacidad de construir software de producción (arquitectura limpia, no solo notebooks).
- LangChain/GenAI se menciona como parte del stack, no como titular.
- CTAs existentes ("Ver proyectos", "Descargar CV") se mantienen sin cambios estructurales.

### 2. Case study `ai-sales-assistant.md`

**Archivo:** `src/content/proyectos/ai-sales-assistant.md`

- Reestructurar en: Situación → Arquitectura → Decisiones técnicas → Resultado.
- Contenido basado en hechos verificados del repo `Data-Analysis-Ecommerce`: separación de responsabilidades (`loader.py` carga/merge, `analysis.py` KPIs, `agent.py` orquestación LLM, `charts.py` visualización), cobertura de tests (`test_loader`, `test_analysis`, `test_agent`, `test_charts`), dataset Olist (100k+ órdenes, 5 tablas mergeadas).
- Encuadre DS/ML: destacar el pipeline de datos y la separación de capas como evidencia de ingeniería, no el chat LLM como feature central.
- Actualizar `github:` de `horaciolaphitz/ai-sales-assistant` (no válido) a `https://github.com/HoracioLaphitz/Data-Analysis-Ecommerce`.
- No inventar métricas de modelo — el proyecto es un agente sobre datos limpios, no un clasificador; no reporta accuracy/loss.

### 3. Proyectos ML locales

**Archivos:** `src/content/proyectos/redes-convolucionales.md`, `src/content/proyectos/prediccion-imagenes.md`

Métricas reales verificadas en los notebooks, a incorporar en la sección de resultado:

- **Redes-Convolucionales:** accuracy de entrenamiento 99.76%, loss 0.0072 (época final de 10).
- **PrediccionImagenes** (transfer learning): val_accuracy 100% / val_loss 0.0179 en la época final; progresión desde 79.69% → 100% muestra el efecto del fine-tuning.

Mantener estructura Situación/Desafío/Solución/Impacto existente, solo enriquecer "Impacto" con estos números y una línea sobre qué demuestran técnicamente (ej. capacidad de transfer learning, generalización).

### 4. README raíz

**Archivo:** `README.md`

- Agregar sección introductoria (antes de las instrucciones de deploy) con: quién es el autor, especialización (Data Science/ML Engineering + arquitectura de software), y 2-3 proyectos a mirar primero con link directo.
- No tocar las secciones técnicas de deploy/CI existentes.

---

## Fuera de alcance (fases futuras)

- Pulido visual / UX del sitio.
- Rename `main/factories/project.factory.ts` → nombre que refleje que es un Facade, no un Factory Method.
- Resolver dependencia de fuente externa (`sf.abarba.me` en `fonts.css`).
- Trabajo sobre el repo externo `Data-Analysis-Ecommerce` (código, tests) o sobre el proyecto de churn en `feat/sqlite-data-mart`.

## Testing

Cambios son de contenido (Markdown/JSX texto) — validar con `pnpm astro check` y build local (`pnpm build`) para confirmar que no rompen el content collection schema ni el build. Sin tests nuevos necesarios.
