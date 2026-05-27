#!/usr/bin/env node

/**
 * style-notebooks.mjs
 * 
 * 1. Crea notebook-style.css con el theme visual del portfolio
 * 2. Envuelve todos los HTMLs fragmento en documentos completos con estilo
 * 3. Convierte .ipynb a HTML estilizado para los que faltan
 * 4. Crea caso de estudio para dashboards
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const NOTEBOOKS_HTML_DIR = path.join(ROOT, 'public', 'notebooks-html');
const PROYECTOS_DIR = path.join(ROOT, 'public', 'Proyectos');
const CSS_PATH = path.join(NOTEBOOKS_HTML_DIR, 'notebook-style.css');

// ─── CSS Theme ──────────────────────────────────────────────────────────────

const CSS_THEME = `/* Notebook Case Study — Portfolio Theme */
:root {
  --bg: #fafafa;
  --bg-code: #f5f5f5;
  --text: #1a1a2e;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --accent: #6366f1;
  --accent-light: #eef2ff;
  --max-width: 960px;
  --radius: 8px;
  --font: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f0f1a;
    --bg-code: #1a1a2e;
    --text: #e2e8f0;
    --text-muted: #94a3b8;
    --border: #2d2d44;
    --accent: #818cf8;
    --accent-light: #1e1b4b;
  }
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  padding: 2rem 1rem;
}

.nb-container {
  max-width: var(--max-width);
  margin: 0 auto;
}

/* Header / branding bar */
.nb-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.nb-header a {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
}
.nb-header a:hover { text-decoration: underline; }
.nb-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--text);
}

/* Notebook cells */
.nb-notebook { width: 100%; }
.nb-worksheet { width: 100%; }
.nb-cell {
  margin-bottom: 1.5rem;
  border-radius: var(--radius);
  overflow: hidden;
}

/* Markdown cells */
.nb-markdown-cell {
  padding: 0.5rem 0;
}
.nb-markdown-cell h1,
.nb-markdown-cell h2,
.nb-markdown-cell h3,
.nb-markdown-cell h4 {
  margin: 1.5rem 0 0.75rem;
  line-height: 1.3;
  color: var(--text);
}
.nb-markdown-cell h1 { font-size: 1.75rem; }
.nb-markdown-cell h2 { font-size: 1.4rem; }
.nb-markdown-cell h3 { font-size: 1.15rem; }
.nb-markdown-cell p { margin-bottom: 0.75rem; }
.nb-markdown-cell ul,
.nb-markdown-cell ol { margin: 0.5rem 0 0.75rem 1.5rem; }
.nb-markdown-cell li { margin-bottom: 0.25rem; }
.nb-markdown-cell a { color: var(--accent); }
.nb-markdown-cell img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  margin: 1rem 0;
}
.nb-markdown-cell blockquote {
  border-left: 3px solid var(--accent);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: var(--accent-light);
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-muted);
}
.nb-markdown-cell code:not([class]) {
  background: var(--bg-code);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.875em;
  font-family: var(--font-mono);
}
.nb-markdown-cell pre {
  background: var(--bg-code);
  padding: 1rem;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid var(--border);
}
.nb-markdown-cell pre code {
  background: none;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.5;
}

/* Code cells */
.nb-code-cell {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
}
.nb-input {
  background: var(--bg-code);
  padding: 1rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
}
.nb-input pre {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
}
.nb-input code {
  font-family: var(--font-mono);
}
.nb-output {
  background: var(--bg);
  padding: 1rem;
  overflow-x: auto;
}
.nb-output pre {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--text-muted);
  white-space: pre-wrap;
  word-break: break-word;
}
.nb-output img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
  margin: 0.5rem 0;
}
.nb-output table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
  font-size: 0.85rem;
}
.nb-output th,
.nb-output td {
  border: 1px solid var(--border);
  padding: 0.4rem 0.6rem;
  text-align: left;
}
.nb-output th {
  background: var(--bg-code);
  font-weight: 600;
}
.nb-output .text-plain {
  white-space: pre-wrap;
}
.nb-output .ansi-escape-sequence {
  white-space: pre-wrap;
}

/* Error outputs */
.nb-output .ansi-red-fg,
.nb-output [style*="color:red"],
.nb-output [style*="color: #a00"],
.nb-output [style*="color:#a00"] {
  color: #ef4444;
}

/* Prompt numbers */
[data-prompt-number]::before {
  content: "In [" attr(data-prompt-number) "]:";
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

/* Image outputs */
.nb-output img[src^="data:image"] {
  max-width: 100%;
  height: auto;
}

/* Footer */
.nb-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.nb-footer a { color: var(--accent); text-decoration: none; }
.nb-footer a:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 640px) {
  body { padding: 1rem 0.5rem; }
  .nb-input, .nb-output { padding: 0.75rem; }
}
`;

// ─── Helpers ────────────────────────────────────────────────────────────────

function wrapHTML(title, bodyContent) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(title)} — Caso de Estudio</title>
  <link rel="stylesheet" href="notebook-style.css">
</head>
<body>
  <div class="nb-container">
    <div class="nb-header">
      <a href="/notebooks">← Volver a Casos de Estudio</a>
      <h1>${escapeHTML(title)}</h1>
    </div>
    ${bodyContent}
    <div class="nb-footer">
      <p>Portafolio — <a href="/">Horacio Laphitz</a></p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─── Step 1: Write CSS ─────────────────────────────────────────────────────

async function writeCSS() {
  await fs.writeFile(CSS_PATH, CSS_THEME, 'utf-8');
  console.log('✅ notebook-style.css creado');
}

// ─── Step 2: Wrap existing HTML fragments ──────────────────────────────────

async function wrapExistingHTMLs() {
  const files = await fs.readdir(NOTEBOOKS_HTML_DIR);
  let count = 0;

  for (const file of files) {
    if (!file.endsWith('.html') || file === 'notebook-style.css') continue;
    const filePath = path.join(NOTEBOOKS_HTML_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');

    // Skip if already a full document
    if (content.trimStart().startsWith('<!DOCTYPE') || content.trimStart().startsWith('<html')) {
      continue;
    }

    const title = path.basename(file, '.html')
      .replace(/^Copia\s+(de\s+)?/i, '')
      .replace(/\(\d+\)$/, '')
      .trim();

    const wrapped = wrapHTML(title, content);
    await fs.writeFile(filePath, wrapped, 'utf-8');
    count++;
  }

  console.log(`✅ ${count} HTMLs envueltos con estilo`);
}

// ─── Step 3: Convert .ipynb to styled HTML ─────────────────────────────────

function convertNotebookToHTML(notebookJson, title) {
  const cells = notebookJson.cells || [];
  let bodyHTML = '';

  for (const cell of cells) {
    const cellType = cell.cell_type;
    const source = (cell.source || []).join('');

    if (cellType === 'markdown') {
      bodyHTML += `<div class="nb-cell nb-markdown-cell">${source}</div>`;
    } else if (cellType === 'code') {
      const codeHTML = `<pre><code class="language-python">${escapeHTML(source)}</code></pre>`;
      let outputHTML = '';

      const outputs = cell.outputs || [];
      for (const output of outputs) {
        const outputType = output.output_type;

        if (outputType === 'stream') {
          const text = (output.text || []).join('');
          outputHTML += `<pre class="text-plain">${escapeHTML(text)}</pre>`;
        } else if (outputType === 'execute_result' || outputType === 'display_data') {
          const data = output.data || {};
          if (data['text/html']) {
            const htmlContent = Array.isArray(data['text/html']) ? data['text/html'].join('') : data['text/html'];
            outputHTML += `<div class="nb-rendered-html">${htmlContent}</div>`;
          } else if (data['image/png']) {
            outputHTML += `<img src="data:image/png;base64,${data['image/png']}" alt="Output image">`;
          } else if (data['text/plain']) {
            const text = Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
            outputHTML += `<pre class="text-plain">${escapeHTML(text)}</pre>`;
          }
        } else if (outputType === 'error') {
          const traceback = (output.traceback || []).join('\n');
          outputHTML += `<pre class="text-plain" style="color:#ef4444;">${escapeHTML(traceback)}</pre>`;
        }
      }

      bodyHTML += `<div class="nb-cell nb-code-cell">
        <div class="nb-input">${codeHTML}</div>
        ${outputHTML ? `<div class="nb-output">${outputHTML}</div>` : ''}
      </div>`;
    }
  }

  return bodyHTML;
}

async function convertIPYNBtoHTML() {
  const conversions = [
    {
      nbPath: path.join(PROYECTOS_DIR, 'Notebooks', 'RedDeClasificacion2', 'RedDeClasificacion2.ipynb'),
      slug: 'reddeclasificacion2',
      title: 'RedDeClasificacion2',
    },
    {
      nbPath: path.join(PROYECTOS_DIR, 'Notebooks', 'TransferenciaAprendizaje-Copia', 'Copia de TransferenciaAprendizaje.ipynb'),
      slug: 'transferenciaaprendizaje-copia',
      title: 'TransferenciaAprendizaje',
    },
    {
      nbPath: path.join(PROYECTOS_DIR, 'Proyecto SanoYFresco', 'Notebooks', 'TPE_MarketBasketAnalysis_colab.ipynb'),
      slug: 'proyecto-sanoyfresco',
      title: 'SanoYFresco — Market Basket Analysis',
    },
  ];

  let count = 0;
  for (const conv of conversions) {
    try {
      const raw = await fs.readFile(conv.nbPath, 'utf-8');
      const notebook = JSON.parse(raw);
      const bodyHTML = convertNotebookToHTML(notebook, conv.title);
      const fullHTML = wrapHTML(conv.title, bodyHTML);

      const outPath = path.join(NOTEBOOKS_HTML_DIR, `${conv.slug}.html`);
      await fs.writeFile(outPath, fullHTML, 'utf-8');
      console.log(`   ✅ ${conv.title} → ${conv.slug}.html`);
      count++;
    } catch (err) {
      console.error(`   ❌ Error con ${conv.title}: ${err.message}`);
    }
  }

  return count;
}

// ─── Step 4: Create dashboards case study ───────────────────────────────────

async function createDashboardsCaseStudy() {
  const dashboardDir = path.join(PROYECTOS_DIR, 'dashboards');
  let images = [];
  try {
    const files = await fs.readdir(dashboardDir);
    images = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  } catch {
    // no images found
  }

  const imageHTML = images.length > 0
    ? images.map(f =>
        `<div style="margin-bottom:1.5rem;">
          <img src="/Proyectos/dashboards/${f}" alt="${path.basename(f, path.extname(f))}"
               style="max-width:100%;height:auto;border-radius:8px;border:1px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        </div>`
      ).join('\n')
    : '<p style="color:var(--text-muted)">Dashboard images will be added soon.</p>';

  const bodyHTML = `
    <div class="nb-cell nb-markdown-cell">
      <h2>Dashboards Profesionales</h2>
      <p>Colección de dashboards interactivos y visualizaciones de datos creados con Power BI y herramientas de Business Intelligence. Estos paneles muestran métricas clave de negocio, tendencias de ventas, y análisis de rendimiento.</p>
      <p>Cada dashboard está diseñado para proporcionar insights accionables a través de visualizaciones claras y una jerarquía visual bien definida.</p>
    </div>
    ${imageHTML}
  `;

  const fullHTML = wrapHTML('Dashboards — Visualización de Datos', bodyHTML);
  const outPath = path.join(NOTEBOOKS_HTML_DIR, 'dashboards.html');

  // Also copy dashboard images to notebooks-html/ for direct access
  for (const img of images) {
    const src = path.join(dashboardDir, img);
    const dest = path.join(NOTEBOOKS_HTML_DIR, img);
    try {
      await fs.copyFile(src, dest);
    } catch {
      // skip copy errors
    }
  }

  await fs.writeFile(outPath, fullHTML, 'utf-8');
  console.log(`✅ Dashboards case study creado (${images.length} imágenes)`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎨 Estilizando notebooks y creando casos de estudio faltantes...\n');

  // 1. Write CSS
  console.log('📝 Creando stylesheet...');
  await writeCSS();

  // 2. Wrap existing HTMLs
  console.log('\n📦 Envolviendo HTMLs existentes...');
  await wrapExistingHTMLs();

  // 3. Convert .ipynb
  console.log('\n🔄 Convirtiendo notebooks faltantes...');
  const converted = await convertIPYNBtoHTML();
  console.log(`   ${converted} notebooks convertidos`);

  // 4. Dashboard case study
  console.log('\n📊 Creando caso de estudio de dashboards...');
  await createDashboardsCaseStudy();

  console.log('\n✨ Todos los casos de estudio actualizados.');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
