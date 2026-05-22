#!/usr/bin/env node

/**
 * generate-site-data.mjs
 * 
 * Genera manifests JSON estáticos a partir de las fuentes de verdad del proyecto.
 * Esto unifica el serving de datos: en vez de tener datos en markdown + API + TS hardcodeado,
 * todo se consolida en manifests estáticos consumibles por Astro en build-time.
 *
 * Output en: public/data/
 *   - projects.json    → Proyectos desde frontmatter de markdown
 *   - notebooks.json   → Notebooks desde public/Proyectos/ y public/notebooks-html/
 *   - profile.json     → Perfil, contacto y skills
 *   - experience.json  → Experiencia, educación y certificaciones
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ───────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src/content/proyectos');
const PUBLIC_DIR = path.join(ROOT, '..', 'public');
const DATA_DIR = path.join(ROOT, 'src/data/generated');
const DATA_PUBLIC_DIR = path.join(PUBLIC_DIR, 'data');
const PROFILE_TS_PATH = path.join(ROOT, 'src/data/profile-data.ts');
const NOTEBOOKS_PROJECTS_DIR = path.join(PUBLIC_DIR, 'Proyectos/Notebooks');
const NOTEBOOKS_HTML_DIR = path.join(PUBLIC_DIR, 'notebooks-html');
const PROYECTOS_DIR = path.join(PUBLIC_DIR, 'Proyectos');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parsea el frontmatter YAML simple de un archivo markdown.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const data = {};

  const lines = yaml.split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Arrays: [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      if (inner.trim() === '') {
        value = [];
      } else {
        value = inner.split(',').map(v => {
          v = v.trim().replace(/^["']|["']$/g, '');
          return v;
        });
      }
    }
    // Booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Numbers
    else if (/^\d+$/.test(value)) value = parseInt(value, 10);
    // Strings: remove quotes
    else {
      value = value.replace(/^["']|["']$/g, '');
    }

    data[key] = value;
  }

  return data;
}

/**
 * Extrae datos de perfil (nombre, rol, descripciones, contacto, skills)
 * desde el archivo TypeScript real (profile-data.ts).
 * 
 * El archivo tiene la estructura:
 *   const profileEntity = new ProfileEntity(
 *     'Horacio Laphitz',         // name
 *     'Analista de Datos',       // role
 *     ['descripcion...'],         // descriptions
 *     { email: '...', ... },      // contact
 *     [{ period:..., role:..., company:... }],  // experiences
 *     [{ period:..., title:..., issuer:... }],  // certifications
 *     [{ period:..., degree:..., institution:... }],  // education
 *     [{ name:..., category:..., level:... }],  // skills
 *   );
 *   export const PROFILE_DATA = { ...profileEntity, location: '...', skills: [...] };
 */
function extractProfileFromTS(content) {
  // ── Name: primer argumento de new ProfileEntity ──
  const nameMatch = content.match(/new\s+ProfileEntity\s*\(\s*'([^']+)'/);
  const name = nameMatch ? nameMatch[1] : 'Horacio Laphitz';

  // ── Role: segundo argumento ──
  const roleMatch = content.match(/new\s+ProfileEntity\s*\([^)]*?,\s*'([^']+)'/);
  // Use a different approach: find name then the next string
  let role = 'Analista de Datos';
  const roleRegex = /ProfileEntity\s*\([^)]*?'[^']*',\s*'([^']+)'/;
  const roleResult = roleRegex.exec(content);
  if (roleResult) role = roleResult[1];

  // ── Descriptions: array de strings (tercer argumento) ──
  const descriptions = [];
  // Find the descriptions array - it's after the role and before the contact object
  const descSection = content.match(/ProfileEntity\s*\([^)]*?'[^']*',\s*'[^']*',\s*\[([\s\S]*?)\],\s*\{/);
  if (descSection) {
    const descStr = descSection[1];
    const descMatches = descStr.match(/'([^']+)'/g);
    if (descMatches) {
      descMatches.forEach(d => descriptions.push(d.replace(/'/g, '')));
    }
  }

  // ── Contact: objeto literal (cuarto argumento) ──
  const contact = { email: '', location: '', linkedin: '', github: '', credly: '' };
  // Encuentra el bloque del objeto contacto: entre el cierre del array descripciones y el inicio de experiencias
  // Patrón: ], { ... }, [
  const contactSection = content.match(/\],\s*\{([\s\S]*?)\}\s*,\s*\[/);
  if (contactSection) {
    // Extrae pares key: 'value' usando regex que respeta comas dentro de valores
    const keyValRegex = /(\w+):\s*'([^']+)'/g;
    let match;
    while ((match = keyValRegex.exec(contactSection[1])) !== null) {
      contact[match[1]] = match[2];
    }
  }

  // ── Skills: desde PROFILE_DATA.skills (array simple de strings) ──
  const skills = [];
  // Find `skills: [` in PROFILE_DATA
  const skillsSection = content.match(/skills:\s*\[([\s\S]*?)\]\s*,\s*\};/);
  if (skillsSection) {
    const skillsStr = skillsSection[1];
    const skillMatches = skillsStr.match(/'([^']+)'/g);
    if (skillMatches) {
      skillMatches.forEach(s => skills.push(s.replace(/'/g, '')));
    }
  } else {
    // Fallback: buscar en el constructor
    const skillsSection2 = content.match(/\],\s*\[([\s\S]*?)\]\s*\);/);
    // That's the last argument (skills objects)
    if (skillsSection2) {
      const skillMatches = skillsSection2[1].match(/name:\s*'([^']+)'/g);
      if (skillMatches) {
        skillMatches.forEach(s => {
          const m = s.match(/'([^']+)'/);
          if (m) skills.push(m[1]);
        });
      }
    }
  }

  return { name, role, descriptions, contact, skills };
}

/**
 * Extrae experiencias laborales desde profile-data.ts
 */
function extractExperienceFromTS(content) {
  const experiences = [];

  // Find the experiences array (5th argument: array of objects with period, role, company)
  // It's between the contact object and the certifications array
  const expSection = content.match(/\},\s*\[([\s\S]*?)\]\s*,\s*\[/);
  if (!expSection) {
    // Try alternative pattern
    const expSection2 = content.match(/\{[\s\S]*?email:[\s\S]*?credly:[\s\S]*?\}\s*,\s*\[([\s\S]*?)\]\s*,\s*\[/);
    if (expSection2) {
      const block = expSection2[1];
      const entries = block.split(/\},\s*\{/);
      for (const entry of entries) {
        const period = entry.match(/period:\s*'([^']+)'/);
        const role = entry.match(/role:\s*'([^']+)'/);
        const company = entry.match(/company:\s*'([^']+)'/);
        const location = entry.match(/location:\s*'([^']+)'/);
        const description = entry.match(/description:\s*'([^']+)'/);

        if (period && role && company) {
          experiences.push({
            period: period[1],
            role: role[1],
            company: company[1],
            location: location ? location[1] : '',
            description: description ? description[1] : '',
          });
        }
      }
    }
    return experiences;
  }

  const block = expSection[1];
  const entries = block.split(/\},\s*\{/);
  for (const entry of entries) {
    const period = entry.match(/period:\s*'([^']+)'/);
    const role = entry.match(/role:\s*'([^']+)'/);
    const company = entry.match(/company:\s*'([^']+)'/);
    const location = entry.match(/location:\s*'([^']+)'/);
    const description = entry.match(/description:\s*'([^']+)'/);

    if (period && role && company) {
      experiences.push({
        period: period[1],
        role: role[1],
        company: company[1],
        location: location ? location[1] : '',
        description: description ? description[1] : '',
      });
    }
  }

  return experiences;
}

/**
 * Extrae certificaciones desde profile-data.ts
 */
function extractCertificationsFromTS(content) {
  const certifications = [];

  // Find the certifications array (6th argument)
  // After the experiences array (which ends with `]`) and before the education array
  const certSection = content.match(/\],\s*\[([\s\S]*?)\]\s*,\s*\[/);
  // This might match too early or too late. Let me try a more specific pattern.
  // Actually, the structure is: ...experiences], [certifications], [education], [skills]
  // So we need to find: after first `]` of experiences, the next `[certifications]`
  
  const pattern = /\],\s*\[([\s\S]*?)\]\s*,\s*\[/;
  // This will match the first occurrence. We need to skip past experiences.

  // Let me split by sections more carefully
  // Find the whole ProfileEntity constructor call
  const entityMatch = content.match(/new\s+ProfileEntity\s*\(([\s\S]*?)\);/);
  if (!entityMatch) return certifications;

  const argsStr = entityMatch[1];

  // Split by top-level array boundaries
  // Find all [...] arrays in the arguments
  const arrays = [];
  let depth = 0;
  let currentArray = '';
  let inArray = false;

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (ch === '[' && !inArray) {
      inArray = true;
      depth = 1;
      currentArray = '[';
    } else if (ch === '[' && inArray) {
      depth++;
      currentArray += ch;
    } else if (ch === ']' && inArray) {
      depth--;
      if (depth === 0) {
        currentArray += ch;
        arrays.push(currentArray);
        inArray = false;
        currentArray = '';
      } else {
        currentArray += ch;
      }
    } else if (inArray) {
      currentArray += ch;
    }
  }

  // arrays[0] = descriptions (3rd arg)
  // arrays[1] = experiences (5th arg)
  // arrays[2] = certifications (6th arg)
  // arrays[3] = education (7th arg)
  // arrays[4] = skills objects (8th arg)
  
  if (arrays.length >= 3 && arrays[2]) {
    const certStr = arrays[2];
    const entries = certStr.slice(1, -1).split(/\},\s*\{/);
    for (const entry of entries) {
      const period = entry.match(/period:\s*'([^']+)'/);
      const title = entry.match(/title:\s*'([^']+)'/);
      const issuer = entry.match(/issuer:\s*'([^']+)'/);
      const certificateUrl = entry.match(/certificateUrl:\s*'([^']+)'/);

      if (period && title && issuer) {
        certifications.push({
          period: period[1],
          title: title[1],
          issuer: issuer[1],
          certificateUrl: certificateUrl ? certificateUrl[1] : null,
        });
      }
    }
  }

  return certifications;
}

/**
 * Extrae educación desde profile-data.ts
 */
function extractEducationFromTS(content) {
  const education = [];

  // Parse arguments
  const entityMatch = content.match(/new\s+ProfileEntity\s*\(([\s\S]*?)\);/);
  if (!entityMatch) return education;

  const argsStr = entityMatch[1];
  const arrays = [];
  let depth = 0;
  let currentArray = '';
  let inArray = false;

  for (let i = 0; i < argsStr.length; i++) {
    const ch = argsStr[i];
    if (ch === '[' && !inArray) {
      inArray = true;
      depth = 1;
      currentArray = '[';
    } else if (ch === '[' && inArray) {
      depth++;
      currentArray += ch;
    } else if (ch === ']' && inArray) {
      depth--;
      if (depth === 0) {
        currentArray += ch;
        arrays.push(currentArray);
        inArray = false;
        currentArray = '';
      } else {
        currentArray += ch;
      }
    } else if (inArray) {
      currentArray += ch;
    }
  }

  // arrays[3] = education (7th arg)
  if (arrays.length >= 4 && arrays[3]) {
    const eduStr = arrays[3];
    const entries = eduStr.slice(1, -1).split(/\},\s*\{/);
    for (const entry of entries) {
      const period = entry.match(/period:\s*'([^']+)'/);
      const degree = entry.match(/degree:\s*'([^']+)'/);
      const institution = entry.match(/institution:\s*'([^']+)'/);
      const location = entry.match(/location:\s*'([^']+)'/);

      if (period && degree && institution) {
        education.push({
          period: period[1],
          degree: degree[1],
          institution: institution[1],
          location: location ? location[1] : '',
        });
      }
    }
  }

  return education;
}

/**
 * Encuentra archivos .ipynb recursivamente en un directorio.
 */
async function findNotebookFiles(dir) {
  const results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await findNotebookFiles(fullPath));
      } else if (entry.name.endsWith('.ipynb')) {
        results.push(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }
  return results;
}

/**
 * Genera un slug a partir del nombre de un HTML notebook
 */
function slugifyHtmlName(filename) {
  return filename
    .replace(/\.html$/i, '')
    .replace(/^Copia\s+(de\s+)?/i, '')
    .trim();
}

// ─── Generators ──────────────────────────────────────────────────────────────

/**
 * Genera projects.json desde los archivos markdown en src/content/proyectos/
 */
async function generateProjects() {
  const projects = [];

  try {
    const files = await fs.readdir(CONTENT_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md')).sort();

    for (const file of mdFiles) {
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
      const frontmatter = parseFrontmatter(content);

      // Extract slug from filename: "001-eda-procesos.md" → "eda-procesos"
      const slug = file
        .replace(/\.md$/, '')
        .replace(/^\d+-/, '')
        .replace(/^\d+-/, ''); // Some files have 3-digit prefix

      const techs = Array.isArray(frontmatter.technologies)
        ? frontmatter.technologies.map(t => ({ name: t }))
        : [];

      projects.push({
        slug,
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        category: frontmatter.category || 'Otros',
        featured: frontmatter.featured || false,
        status: frontmatter.status || 'completed',
        technologies: techs,
        githubUrl: frontmatter.githubUrl || null,
        demoUrl: frontmatter.demoUrl || null,
      });
    }

    console.log(`   ✅ ${projects.length} proyectos procesados`);
  } catch (error) {
    console.error('   ❌ Error leyendo proyectos:', error.message);
  }

  return projects;
}

/**
 * Genera notebooks.json desde public/Proyectos/Notebooks/ y public/notebooks-html/
 */
async function generateNotebooks() {
  const notebooks = [];
  const seenSlugs = new Set();

  try {
    // Leer carpetas de proyectos de notebooks desde public/Proyectos/Notebooks/
    const entries = await fs.readdir(NOTEBOOKS_PROJECTS_DIR, { withFileTypes: true }).catch(() => []);
    const projectFolders = entries.filter(e => e.isDirectory());

    for (const folder of projectFolders) {
      const folderPath = path.join(NOTEBOOKS_PROJECTS_DIR, folder.name);
      const slug = slugify(folder.name);

      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      // Leer README para descripción
      let title = folder.name.replace(/[-_]/g, ' ');
      let description = '';

      try {
        const readmePath = path.join(folderPath, 'README.md');
        const readmeContent = await fs.readFile(readmePath, 'utf-8');
        const lines = readmeContent.trim().split('\n');
        if (lines[0] && lines[0].startsWith('#')) {
          title = lines[0].replace(/^#\s+/, '');
        }
        const descLine = lines.find(l => l.trim().length > 20 && !l.startsWith('#'));
        if (descLine) description = descLine.trim().slice(0, 200);
      } catch {
        // No README
      }

      // Buscar notebooks .ipynb en la carpeta
      const notebookFiles = await findNotebookFiles(folderPath);
      const notebookUrl = notebookFiles.length > 0
        ? `/Proyectos/Notebooks/${folder.name}/${path.relative(folderPath, notebookFiles[0])}`
        : null;

      // Buscar assets
      const assetDirs = ['assets', 'imagenes', 'datos'];
      const assets = [];
      for (const assetDir of assetDirs) {
        const assetPath = path.join(folderPath, assetDir);
        try {
          const assetFiles = await fs.readdir(assetPath);
          for (const f of assetFiles) {
            assets.push({
              name: f,
              url: `/Proyectos/Notebooks/${folder.name}/${assetDir}/${f}`,
            });
          }
        } catch {
          // Directory doesn't exist
        }
      }

      notebooks.push({
        slug,
        title,
        description,
        has_notebook: notebookFiles.length > 0,
        notebook_url: notebookUrl,
        html_url: null, // Will be matched below
        assets,
      });
    }

    // Leer notebooks desde public/Proyectos/ (carpetas sueltas)
    const proyectoEntries = await fs.readdir(PROYECTOS_DIR, { withFileTypes: true }).catch(() => []);
    const proyectoFolders = proyectoEntries.filter(e => e.isDirectory() && e.name !== 'Notebooks' && e.name !== 'README.md');

    for (const folder of proyectoFolders) {
      const folderPath = path.join(PROYECTOS_DIR, folder.name);
      const slug = slugify(folder.name);

      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      let title = folder.name.replace(/[-_]/g, ' ');
      let description = '';

      try {
        const readmePath = path.join(folderPath, 'README.md');
        const readmeContent = await fs.readFile(readmePath, 'utf-8');
        const lines = readmeContent.trim().split('\n');
        if (lines[0] && lines[0].startsWith('#')) {
          title = lines[0].replace(/^#\s+/, '');
        }
        const descLine = lines.find(l => l.trim().length > 20 && !l.startsWith('#'));
        if (descLine) description = descLine.trim().slice(0, 200);
      } catch {
        // No README
      }

      // Buscar assets
      const assets = [];
      const assetDirs = ['assets', 'imagenes', 'datos', 'DB', 'Media', 'Notebooks', 'reglas'];
      for (const assetDir of assetDirs) {
        const assetPath = path.join(folderPath, assetDir);
        try {
          const assetFiles = await fs.readdir(assetPath);
          for (const f of assetFiles) {
            if (f.startsWith('.')) continue;
            assets.push({
              name: f,
              url: `/Proyectos/${folder.name}/${assetDir}/${f}`,
            });
          }
        } catch {
          // Directory doesn't exist
        }
      }

      notebooks.push({
        slug,
        title,
        description,
        has_notebook: true,
        notebook_url: null,
        html_url: null,
        assets,
      });
    }

    // Matchear con HTML notebooks
    try {
      const htmlFiles = await fs.readdir(NOTEBOOKS_HTML_DIR);
      for (const htmlFile of htmlFiles) {
        if (!htmlFile.endsWith('.html')) continue;

        const htmlSlug = slugify(slugifyHtmlName(htmlFile));

        // Buscar el notebook que coincida
        for (const nb of notebooks) {
          const nbSlug = slugify(nb.title);
          if (nbSlug === htmlSlug || htmlSlug.includes(nbSlug) || nbSlug.includes(htmlSlug)) {
            nb.html_url = `/notebooks-html/${htmlFile}`;
            break;
          }
        }
      }
    } catch {
      // HTML dir doesn't exist
    }

    console.log(`   ✅ ${notebooks.length} notebooks procesados`);
  } catch (error) {
    console.error('   ❌ Error leyendo notebooks:', error.message);
  }

  return notebooks;
}

/**
 * Genera profile.json desde profile-data.ts
 */
async function generateProfile() {
  try {
    const content = await fs.readFile(PROFILE_TS_PATH, 'utf-8');
    const data = extractProfileFromTS(content);

    const profile = {
      name: data.name || 'Horacio Laphitz',
      role: data.role || 'Analista de Datos',
      descriptions: data.descriptions.length > 0 ? data.descriptions : ['Analista de Datos'],
      contact: data.contact,
      skills: data.skills,
    };

    console.log(`   ✅ Profile generado: ${profile.name}`);
    return profile;
  } catch (error) {
    console.error('   ❌ Error leyendo profile:', error.message);
    return {
      name: 'Horacio Laphitz',
      role: 'Analista de Datos',
      descriptions: ['Analista de Datos orientado a la resolución de problemas.'],
      contact: { email: '', location: 'Argentina' },
      skills: [],
    };
  }
}

/**
 * Genera experience.json desde profile-data.ts
 */
async function generateExperience() {
  try {
    const content = await fs.readFile(PROFILE_TS_PATH, 'utf-8');

    const experiences = extractExperienceFromTS(content);
    const certifications = extractCertificationsFromTS(content);
    const education = extractEducationFromTS(content);

    console.log(`   ✅ ${experiences.length} experiencias, ${certifications.length} certificaciones, ${education.length} educación`);
    
    return { experiences, certifications, education };
  } catch (error) {
    console.error('   ❌ Error leyendo experience:', error.message);
    return { experiences: [], certifications: [], education: [] };
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Generando manifests de datos estáticos...\n');

  // Asegurar que los directorios existen
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DATA_PUBLIC_DIR, { recursive: true });

  // 1. Projects
  console.log('📦 Generando projects.json...');
  const projects = await generateProjects();
  await fs.writeFile(
    path.join(DATA_DIR, 'projects.json'),
    JSON.stringify(projects, null, 2),
    'utf-8'
  );

  // 2. Notebooks
  console.log('\n📓 Generando notebooks.json...');
  const notebooks = await generateNotebooks();
  await fs.writeFile(
    path.join(DATA_DIR, 'notebooks.json'),
    JSON.stringify(notebooks, null, 2),
    'utf-8'
  );

  // 3. Profile
  console.log('\n👤 Generando profile.json...');
  const profile = await generateProfile();
  await fs.writeFile(
    path.join(DATA_DIR, 'profile.json'),
    JSON.stringify(profile, null, 2),
    'utf-8'
  );

  // 4. Experience
  console.log('\n💼 Generando experience.json...');
  const experience = await generateExperience();
  await fs.writeFile(
    path.join(DATA_DIR, 'experience.json'),
    JSON.stringify(experience, null, 2),
    'utf-8'
  );

  // Copiar a public/data/ para acceso runtime
  await fs.cp(DATA_DIR, DATA_PUBLIC_DIR, { recursive: true });

  // Resumen
  console.log('\n✨ Manifests generados exitosamente:');
  console.log(`   📁 ${DATA_DIR}/ (build-time imports)`);
  console.log(`   📁 ${DATA_PUBLIC_DIR}/ (runtime access)`);
  console.log(`   ├── projects.json    (${projects.length} proyectos)`);
 console.log(`   ├── notebooks.json   (${notebooks.length} notebooks)`);
  console.log(`   ├── profile.json     (${profile.name})`);
  console.log(`   └── experience.json  (${JSON.stringify(experience).length} chars)`);
  console.log('');
}

main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
