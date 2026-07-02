# Portfolio Positioning & Content — Design Spec

**Date:** 2026-07-01
**Status:** Approved
**Goal:** Reposicionar el mensaje del portfolio hacia Data Scientist / ML Engineer con capacidad demostrada de arquitectura de software, y reemplazar contenido genérico por case studies con hechos reales (arquitectura, decisiones, métricas donde existan).
**RELEVANT LINKS**: <link>https://sqltutorial.mode.com/</link>, <link>https://sqlzoo.net/</link>, <link>https://www.w3schools.com/sql/</link>, <link>https://use-the-index-luke.com/es</link>, <link>https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf</link>, <link>https://towardsdatascience.com/</link>, <link>https://realpython.com/</link>, <link>https://public.tableau.com/app/discover</link>,  <link>https://datavizproject.com/</link>, <link>https://data.world/</link>, <link>https://www.kaggle.com/datasets</link>
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

### 2. Case study `Data-Analysis-Ecommerce.md`

**Archivo:** `src/content/proyectos/Data-Analysis-Ecommerce.md`

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

### 5. Rediseño visual acotado — Hero, Stack, Trayectoria

**Archivos:** `src/presentation/components/sections/Hero.tsx`, `src/presentation/components/sections/Skills.tsx`, `src/presentation/components/sections/Timeline.tsx`

Dentro del sistema de tokens existente (`design-tokens.ts`, `tailwind.config.mjs`) — sin paleta ni escala tipográfica nueva.

- **Hero → estilo Apple:** de layout 2 columnas (texto + foto cuadrada) a contenido centrado, un mensaje fuerte. Headline gigante centrado, una sola línea de subtítulo, un CTA primario + un link secundario (sin fila de 3 botones/iconos compitiendo). Íconos de contacto (GitHub/LinkedIn/mail) bajan a ubicación secundaria (footer/nav), la foto de perfil se vuelve secundaria o se retira del hero.
- **Stack → menos espacio vertical:** de 6 grupos apilados full-width a grid `md:grid-cols-3` (2 filas en vez de 6 bloques verticales). Mismo contenido, misma interacción, sin agregar tabs/clicks nuevos.
- **Trayectoria → minimalista:** quitar chips de color por tipo, íconos por card, punto animado `ping`, bordes gruesos y `hover:scale-105`. Reemplazar por: línea divisoria fina, fecha en texto chico/muted, rol+empresa en peso medio, tipo distinguido por texto en vez de color+ícono. Botones de filtro pasan de píldoras sólidas a tabs de texto con subrayado. Se mantiene scroll horizontal y modal de certificados sin cambios funcionales.

### 6. Rename Factory → Facade

**Archivo:** `src/main/factories/project.factory.ts` (+ imports que lo referencian)

`ProjectFactory` delega al `ProjectService` vía el DI container — es un Facade, no un Factory Method (no construye instancias variables de un tipo). Renombrar el archivo/clase/export a `ProjectFacade` (o equivalente) para que el nombre refleje el patrón real aplicado. `CompositeProjectRepository` y el DI container (`src/main/di/container.ts`) no cambian — ya son patrones bien aplicados (Composite/Repository, inversión de dependencias).

### 7. Dependencia de fuente externa

**Archivo:** `src/presentation/styles/fonts.css`

`fonts.css` carga SF Pro Display desde `sf.abarba.me`, un dominio de terceros no oficial de Apple — riesgo de disponibilidad/seguridad para un sitio en producción. Reemplazar por fuentes auto-hospedadas (vendorizar los `.woff2` en `public/fonts/`) o un fallback de sistema (`-apple-system, "SF Pro Display"` con fallback real) que no dependa de un CDN externo no confiable.

### 8. Repo externo `Data-Analysis-Ecommerce`

**Ubicación:** `C:\Users\Horacio\Desktop\proyectos\Data-Analysis-Ecommerce` (clonado localmente, repo separado)

Auditoría encontró: código pequeño y coherente, sin necesidad urgente de patrones GoF (forzar Strategy en `charts.py` o Repository en `loader.py` hoy sería cosmético — no hay múltiples tipos/fuentes que lo justifiquen). Dos gaps reales sí verificados:

- **Bug de documentación:** `README.md` documenta `GROQ_API_KEY` / Groq llama3-70b-8192, pero el código (`agent.py`, `app.py`) usa `ChatNVIDIA` y la variable `NVAPI` — desalinea el onboarding de cualquiera que siga el README.
- **Tests sin edge cases:** `test_loader.py`, `test_analysis.py`, `test_charts.py` cubren solo caso feliz — falta DataFrame vacío, nulls, `order_status` faltante. `test_agent.py` no cubre `intermediate_steps` vacío ni parsing de outputs malformados del LLM.

**Patrón aplicado (a pedido explícito, con justificación real):** Factory Method para la construcción del LLM en `agent.py::build_agent` (línea ~24). Hoy es un solo proveedor (`ChatNVIDIA`) instanciado inline; extraer un `LLMFactory` (o función `build_llm(provider: str) -> BaseChatModel`) desacopla la instanciación del resto de `build_agent`, resuelve la confusión Groq/NVIDIA del README (el factory documenta explícitamente qué proveedor se usa y por qué), y deja un punto de extensión real si se suma otro proveedor a futuro — no es un patrón decorativo, resuelve el bug de documentación y el acoplamiento en el mismo cambio.

No se agregan Strategy/Repository en este repo — no hay justificación real hoy.

---

## Fuera de alcance (fases futuras)

- Trabajo sobre el pipeline de churn en `feat/sqlite-data-mart` (archivos borrados en working tree — se mantienen borrados, WIP en otro lado).
- Cualquier extensión multi-proveedor LLM o multi-fuente de datos real en `Data-Analysis-Ecommerce` (el Factory Method de la sección 8 deja el punto de extensión listo, pero no se implementan proveedores adicionales).

## Testing

- **Portfolio-26:** cambios de contenido y componentes — validar con `pnpm astro check` y build local (`pnpm build`). El rename Factory→Facade y el cambio de fuentes se validan con el mismo build + revisión visual manual (`pnpm dev`).
- **Data-Analysis-Ecommerce:** correr suite existente (`pytest`) antes y después; agregar tests nuevos para los edge cases listados en la sección 8 y para el `LLMFactory` nuevo. README se corrige para reflejar `NVAPI`/`ChatNVIDIA` real.
