# Visor de notebooks Jupyter en el portfolio

Status: approved
Date: 2026-07-02

## Problema

Los proyectos de análisis de datos incluyen notebooks (`.ipynb`) que hoy solo se pueden **descargar** (`ResourceDownload.tsx`), no visualizar. Un reclutador no va a clonar el repo ni abrir Jupyter local para revisar el trabajo. El schema de contenido ya prevé `resources.notebooks[]`, pero ningún archivo de contenido lo usa todavía (0 proyectos tienen ese campo poblado hoy).

Fuera de alcance de este documento: la integración del proyecto Streamlit "Data-Analysis-Ecommerce" (se define en un cambio aparte cuando el deploy de Streamlit esté listo).

## Restricción de plataforma

El sitio es 100% estático: Astro `output: "static"`, sin adapter, deploy en Vercel sin servidor. Streamlit/ejecución en vivo quedan descartados para notebooks — la única opción viable es **HTML pre-generado servido como estático**.

## Decisión de diseño (acordada con el usuario)

- La conversión usa **nbconvert real** (Python/Jupyter), no un parser JS que simule el render.
- **No se re-ejecutan las celdas** (`--execute` descartado): se usa el motor de Jupyter para convertir a HTML preservando las salidas ya guardadas en cada `.ipynb`. Motivo: `--execute` exige que todas las dependencias y datasets de cada notebook estén disponibles en el entorno de build, y una falla en un solo notebook tumbaría el deploy completo del sitio.
- La generación ocurre como **paso previo al build de Astro**, dentro del mismo comando de build de Vercel (no vía GitHub Actions — el usuario reporta problemas con Actions en su cuenta).
- Cada notebook tiene una **vista dedicada** (ruta propia), no un panel embebido dentro de la página del proyecto. Se accede por un link que abre en pestaña nueva.

## Inventario actual de notebooks físicos

24 archivos `.ipynb` bajo `public/Proyectos/**`, con nombres inconsistentes (espacios, acentos, prefijos "Copia de"). Ejemplos:

- `public/Proyectos/Notebooks/Pandas_Profiling/Pandas_Profiling.ipynb`
- `public/Proyectos/Notebooks/PROYECTO-FINAL/Copia de PROYECTO-FINAL.ipynb`
- `public/Proyectos/Notebooks/Red-Neuronal-Convolucional/experiments/01_exploratory_analysis.ipynb` (+ notebook principal en la misma carpeta — caso de **2 notebooks para 1 proyecto**)
- `public/Proyectos/Proyecto SanoYFresco/Notebooks/TPE_MarketBasketAnalysis_colab.ipynb`

Existen 14 entradas de contenido `nb-*.md` en `src/content/proyectos/` que corresponden 1:1 (o 1:N) a estos archivos, pero **ninguna tiene `resources.notebooks` seteado todavía**. Poblar ese campo es parte de la implementación, no contenido preexistente.

## Arquitectura

### 1. Script de conversión (prebuild)

Nuevo archivo `scripts/build-notebooks.mjs`, invocado antes de `astro build`:

- Lee la collection `proyectos` (via `astro:content` en modo script, o parseo directo de frontmatter con `gray-matter` si `astro:content` no es invocable fuera del contexto Astro — a resolver en el plan de implementación).
- Por cada `resources.notebooks[]` con `path` a un `.ipynb` existente, corre:
  `jupyter nbconvert --to html "<path>" --output-dir "public/notebooks-html/<project-slug>/" --output "<notebook-slug>.html"`
- `<notebook-slug>` se deriva de `notebook.name` con una función `slugify()` compartida (nueva, no existe hoy en el repo) en `src/shared/slugify.ts`, reutilizada también en la ruta Astro.
- Si la conversión de un notebook falla: se loguea el error con el nombre del proyecto/notebook y el script **continúa** con el resto. Al final imprime un resumen (`N convertidos, M fallidos`) pero **no** hace `process.exit(1)` — no debe tumbar el build por un notebook roto.
- `package.json`: `"build": "pip install --quiet nbconvert nbformat && node scripts/build-notebooks.mjs && astro build"`.

Riesgo abierto: falta validar que Vercel permita `pip install` en el build de un proyecto Node. Si falla, se resuelve en un ciclo aparte (alternativa: correr la conversión en local y commitear el HTML generado a `public/notebooks-html/`, dejando el build de Vercel sin ese paso).

### 2. Ruta dedicada

`src/pages/proyectos/[slug]/notebook/[notebook].astro`:

- `getStaticPaths()` itera `getCollection("proyectos")` × `resources.notebooks[]`, generando `{ slug, notebook: slugify(nb.name) }` por cada combinación.
- Usa el `Layout`/`PageLayout` existente del sitio (header + navegación), con un link "← Volver al proyecto" hacia `/proyectos/{slug}`.
- Cuerpo: `<iframe sandbox="allow-same-origin" src={`/notebooks-html/${slug}/${notebookSlug}.html`} title={notebook.name} />` a ancho completo, para aislar el CSS/JS que nbconvert inyecta del Tailwind del sitio.

### 3. Entry point desde el proyecto

`ArticleLayout.astro` gana un nuevo bloque de acciones (mismo patrón visual que los botones "Ver código" / "Ver dashboard" ya existentes): por cada notebook en `resources.notebooks[]`, un botón "Ver notebook: {name}" → `/proyectos/{slug}/notebook/{notebookSlug}`, `target="_blank"`.

### 4. Contenido

Poblar `resources.notebooks[]` en los 14 archivos `nb-*.md` (y en `Proyecto SanoYFresco` si corresponde), apuntando cada uno al `.ipynb` real bajo `public/Proyectos/...`. El caso de `Red-Neuronal-Convolucional` (2 notebooks) valida que el diseño soporta arrays de más de un elemento.

## Testing / validación

- Build local (`npm run build`) debe generar `public/notebooks-html/<slug>/<notebook>.html` para cada notebook poblado, y `astro build` debe completar sin errores aunque algún notebook individual falle la conversión.
- Verificación manual: abrir `/proyectos/<slug>/notebook/<notebook>` para al menos un proyecto con 1 notebook y el de `Red-Neuronal-Convolucional` (2 notebooks), confirmar que el iframe renderiza celdas + salidas y que el link "Volver al proyecto" funciona.
- Confirmar que el deploy en Vercel completa el `pip install` sin error (validación en el primer deploy real, no simulable en local si el entorno de build difiere).
