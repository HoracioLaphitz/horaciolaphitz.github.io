#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PROJECTS_DIR = path.join(__dirname, '../../public/Proyectos');
const CONTENT_PROJECTS_DIR = path.join(__dirname, '../src/content/proyectos');
const GITHUB_DATA_PATH = path.join(__dirname, '../src/data/github-repos-simple.json');

// ─── Professional Descriptions Map ──────────────────────────────────────────
// These override raw GitHub descriptions with technically precise, professional
// descriptions for the portfolio. Key = slugified project id.
const PROFESSIONAL_DESCRIPTIONS = {
  'eda-procesos': 'Pipeline automatizado de Análisis Exploratorio de Datos (EDA) con generación de reportes estadísticos, detección de outliers, análisis de correlaciones y visualizaciones avanzadas.',
  'prediceprecioacciones': 'Modelo de regresión para predicción de series temporales financieras utilizando datos históricos del NYSE, con ingeniería de features y evaluación de métricas de rendimiento.',
  'clustering': 'Segmentación geoespacial no supervisada mediante K-Means y clustering jerárquico aplicado al mercado inmobiliario de California, con análisis de silueta y reducción de dimensionalidad PCA.',
  'analisis-datos-2': 'Framework genérico de análisis exploratorio con pipeline modular para ingestión, limpieza, transformación, visualización automática y exportación de reportes estadísticos.',
  'etl': 'Pipeline de Ingeniería de Datos: extracción desde fuentes heterogéneas, transformación con reglas de negocio y carga en bases de datos relacionales.',
  'extraer-transformar-cargar': 'Pipeline ETL modular con soporte para formatos XML, CSV y JSON, orientado a la preparación y normalización de datos para modelos de machine learning.',
  'prediccionimagenes': 'Clasificador de imágenes basado en redes neuronales con preprocesamiento de píxeles, normalización, aumentación de datos y evaluación multiclase.',
  'redes-convolucionales': 'Arquitectura CNN dual: clasificación de dígitos manuscritos MNIST y clasificación binaria perros vs gatos con TensorFlow, dropout y early stopping.',
  'warriors-games': 'Análisis estadístico comparativo del rendimiento local vs visitante de los Golden State Warriors, con visualización de distribuciones y métricas descriptivas.',
  'regresion-lineal': 'Modelo de regresión lineal univariante implementado desde cero con descenso del gradiente, incluyendo visualización de función de costo y convergencia.',
  'titanic-arbol-de-decision': 'Modelo predictivo de supervivencia basado en árboles de decisión con análisis de factores demográficos, ingeniería de features y validación cruzada sobre el dataset Titanic.',
  'autoencoder': 'Autoencoder convolutional para reducción de dimensionalidad y denoising de imágenes del dataset MNIST, con visualización de espacio latente y reconstrucción.',
  'deepdreams': 'Implementación del algoritmo DeepDream para visualización y análisis de patrones aprendidos por redes neuronales convolucionales en diferentes capas.',
  'redes-generativas-adversariales': 'Arquitectura GAN (Generative Adversarial Network) para generación de datos sintéticos mediante optimización competitiva entre generador y discriminador.',
  'capitalizacion-del-mercado-de-los-bancos-mas-grandes': 'Pipeline de web scraping y ETL para extracción, transformación y análisis de capitalización de mercado del sector bancario global desde fuentes financieras.',
  'django-crud-react': 'API RESTful construida con Django REST Framework y frontend React con operaciones CRUD completas, serialización y validación de datos.',
  'cancer-issue': 'Análisis de factores predictivos de supervivencia en pacientes oncológicos mediante modelos estadísticos y algoritmos de clasificación supervisada.',
  'marketbasketanalytics': 'Análisis de reglas de asociación aplicando el algoritmo Apriori para descubrimiento de patrones de compra y cross-selling en retail transaccional.',
  'eda-ibm': 'Análisis exploratorio de datos del dataset IBM HR Analytics Attrition para identificación de factores determinantes de rotación de personal mediante técnicas estadísticas.',
  'proyecto-sanoyfresco': 'Análisis integral de retail con Market Basket Analysis, segmentación de clientes y optimización de estrategia de merchandising para tienda de productos orgánicos.',
  'analisis': 'Pipeline integral de análisis exploratorio de datos multidimensionales con visualizaciones estadísticas, clustering y detección de patrones subyacentes.',
  'dashboards': 'Tablero de control interactivo con métricas de negocio, indicadores KPI y visualizaciones dinámicas para monitoreo y análisis de rendimiento organizacional.',
};

// Utility: Slugify string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Utility: Detect category from name and description
function detectCategory(name, description = '', topics = []) {
  const text = `${name} ${description} ${topics.join(' ')}`.toLowerCase();

  if (text.includes('dashboard') || text.includes('power bi') || text.includes('tableau') || text.includes('business intelligence')) {
    return 'Business Intelligence';
  }
  if (text.includes('deep') || text.includes('neural') || text.includes('cnn') || text.includes('gan') || text.includes('tensorflow') || text.includes('autoencoder')) {
    return 'Deep Learning';
  }
  if (text.includes('machine learning') || text.includes('ml') || text.includes('prediccion') || text.includes('regresion') || text.includes('clasificacion')) {
    return 'Machine Learning';
  }
  if (text.includes('analisis') || text.includes('eda') || text.includes('exploratorio') || text.includes('analytics')) {
    return 'Análisis de Datos';
  }
  if (text.includes('notebook') || text.includes('jupyter')) {
    return 'Notebooks';
  }
  if (text.includes('etl') || text.includes('pipeline') || text.includes('data engineering')) {
    return 'Ingeniería de Datos';
  }
  if (text.includes('web') || text.includes('frontend') || text.includes('react') || text.includes('astro') || text.includes('portfolio')) {
    return 'Desarrollo Web';
  }
  if (text.includes('api') || text.includes('backend') || text.includes('fastapi') || text.includes('django')) {
    return 'Backend';
  }

  return 'Otros';
}

// Utility: Extract technologies from description and topics
function extractTechnologies(description, topics = [], languages = []) {
  const techMap = {
    'python': 'Python',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'astro': 'Astro',
    'react': 'React',
    'tensorflow': 'TensorFlow',
    'keras': 'Keras',
    'pytorch': 'PyTorch',
    'scikit-learn': 'Scikit-learn',
    'pandas': 'Pandas',
    'numpy': 'NumPy',
    'matplotlib': 'Matplotlib',
    'seaborn': 'Seaborn',
    'jupyter': 'Jupyter',
    'opencv': 'OpenCV',
    'power bi': 'Power BI',
    'tableau': 'Tableau',
    'sql': 'SQL',
    'r': 'R',
    'bigquery': 'BigQuery',
    'fastapi': 'FastAPI',
    'django': 'Django',
    'docker': 'Docker',
    'git': 'Git',
  };

  const found = new Set();
  const text = `${description} ${topics.join(' ')} ${languages.join(' ')}`.toLowerCase();

  for (const [key, value] of Object.entries(techMap)) {
    if (text.includes(key)) {
      found.add(value);
    }
  }

  // Add languages directly
  languages.forEach(lang => {
    if (lang && !found.has(lang)) {
      found.add(lang);
    }
  });

  return Array.from(found);
}

// Clean all generated projects
async function cleanAllProjects() {
  try {
    const files = await fs.readdir(CONTENT_PROJECTS_DIR);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        await fs.unlink(path.join(CONTENT_PROJECTS_DIR, file));
      }
    }
    
    console.log(`🗑️  Limpiados ${files.length} proyectos anteriores\n`);
  } catch (error) {
    // Directory might not exist yet
  }
}

// Generate markdown file
function generateMarkdown(projectData) {
  const frontmatter = {
    title: projectData.title,
    description: projectData.description,
    category: projectData.category,
    featured: projectData.featured || false,
    status: projectData.status || 'completed',
    technologies: projectData.technologies || [],
  };

  if (projectData.githubUrl) {
    frontmatter.githubUrl = projectData.githubUrl;
  }
  if (projectData.demoUrl) {
    frontmatter.demoUrl = projectData.demoUrl;
  }

  let content = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      content += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
      const escapedValue = value.replace(/"/g, '\\"').replace(/\n/g, ' ');
      content += `${key}: "${escapedValue}"\n`;
    } else {
      content += `${key}: ${value}\n`;
    }
  }
  content += '---\n\n';

  content += `## Descripción del Proyecto\n\n`;
  content += `${projectData.description}\n\n`;

  if (projectData.readme) {
    content += `${projectData.readme}\n\n`;
  }

  if (projectData.technologies && projectData.technologies.length > 0) {
    content += `### Tecnologías Utilizadas\n\n`;
    projectData.technologies.forEach(tech => {
      content += `- ${tech}\n`;
    });
    content += '\n';
  }

  if (projectData.githubUrl) {
    content += `### Código Fuente\n\n`;
    content += `[Ver en GitHub](${projectData.githubUrl})\n\n`;
  }

  if (projectData.demoUrl) {
    content += `### Demo en Vivo\n\n`;
    content += `[Ver Demo](${projectData.demoUrl})\n\n`;
  }

  return content;
}

// Process GitHub repositories
async function processGitHubRepos() {
  try {
    const githubData = JSON.parse(await fs.readFile(GITHUB_DATA_PATH, 'utf-8'));
    const projects = [];

    const portfolioNamePattern = /portfolio|portafolio|porfolio/i;
    const portfolioDescPattern = /portfolio|portafolio|porfolio/i;
    for (const repo of githubData.repositories) {
      if (portfolioNamePattern.test(repo.name) || (repo.description && portfolioDescPattern.test(repo.description))) {
        console.log(`   ⏭️  Omitiendo repositorio portfolio: ${repo.name}`);
        continue;
      }
      const projectData = {
        id: slugify(repo.name),
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: PROFESSIONAL_DESCRIPTIONS[slugify(repo.name)] || repo.description || `Proyecto: ${repo.name}`,
        readme: repo.readme ? repo.readme.substring(0, 500) : '',
        category: detectCategory(repo.name, repo.description, repo.topics),
        technologies: extractTechnologies(repo.description || '', repo.topics, repo.languages),
        githubUrl: repo.html_url,
        demoUrl: null,
        featured: repo.stargazers_count > 0,
        status: 'completed',
        source: 'github',
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
      };

      // Check if it's the portfolio repo (demo URL)
      if (repo.name === 'HoracioLaphitz.github.io') {
        projectData.demoUrl = 'https://horaciolaphitz.vercel.app';
        projectData.featured = true;
      }

      projects.push(projectData);
    }

    return projects;
  } catch (error) {
    console.error('❌ Error leyendo datos de GitHub:', error.message);
    return [];
  }
}

// Process local projects from public/Proyectos
async function processLocalProjects() {
  const projects = [];

  try {
    const entries = await fs.readdir(PUBLIC_PROJECTS_DIR, { withFileTypes: true });
    const folders = entries.filter(entry => entry.isDirectory() && entry.name !== 'Notebooks');

    for (const folder of folders) {
      const folderPath = path.join(PUBLIC_PROJECTS_DIR, folder.name);
      
      // Check for README
      let description = `Proyecto: ${folder.name}`;
      let readme = '';
      
      try {
        const readmePath = path.join(folderPath, 'README.md');
        readme = await fs.readFile(readmePath, 'utf-8');
        
        // Extract first paragraph as description
        const paragraphs = readme.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
        if (paragraphs.length > 0) {
          description = paragraphs[0].replace(/\n/g, ' ').substring(0, 200);
        }
      } catch {
        // No README
      }

      // Professional descriptions override raw README content
      const professionalDesc = PROFESSIONAL_DESCRIPTIONS[slugify(folder.name)];
      if (professionalDesc) {
        description = professionalDesc;
      }

      const projectData = {
        id: slugify(folder.name),
        title: folder.name,
        description,
        readme: readme.substring(0, 500),
        category: detectCategory(folder.name, description),
        technologies: extractTechnologies(description),
        githubUrl: null,
        demoUrl: null,
        featured: false,
        status: 'completed',
        source: 'local',
      };

      projects.push(projectData);
    }
  } catch (error) {
    console.error('❌ Error leyendo proyectos locales:', error.message);
  }

  return projects;
}

// Main execution
async function main() {
  console.log('🚀 Sincronizando TODOS los proyectos...\n');

  try {
    // Clean all existing projects
    await cleanAllProjects();
    
    // Ensure content directory exists
    await fs.mkdir(CONTENT_PROJECTS_DIR, { recursive: true });

    // Process GitHub repos
    console.log('📦 Procesando repositorios de GitHub...');
    const githubProjects = await processGitHubRepos();
    console.log(`   ✅ ${githubProjects.length} proyectos de GitHub\n`);

    // Process local projects
    console.log('📁 Procesando proyectos locales...');
    const localProjects = await processLocalProjects();
    console.log(`   ✅ ${localProjects.length} proyectos locales\n`);

    // Merge and deduplicate (GitHub takes precedence)
    const allProjects = [...githubProjects];
    const githubIds = new Set(githubProjects.map(p => p.id));

    for (const localProject of localProjects) {
      if (!githubIds.has(localProject.id)) {
        allProjects.push(localProject);
      }
    }

    // Sort by featured, then by stars, then by date
    allProjects.sort((a, b) => {
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (a.stars !== b.stars) return (b.stars || 0) - (a.stars || 0);
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });

    // Generate markdown files
    console.log('📝 Generando archivos markdown...');
    let count = 0;

    for (const project of allProjects) {
      const counter = String(count + 1).padStart(3, '0');
      const filename = `${counter}-${project.id}.md`;
      const outputPath = path.join(CONTENT_PROJECTS_DIR, filename);
      
      const markdown = generateMarkdown(project);
      await fs.writeFile(outputPath, markdown, 'utf-8');
      
      count++;
    }

    console.log(`\n✨ Sincronización completada:`);
    console.log(`   - Total de proyectos: ${allProjects.length}`);
    console.log(`   - Desde GitHub: ${githubProjects.length}`);
    console.log(`   - Locales únicos: ${allProjects.length - githubProjects.length}`);
    console.log(`\n📝 Archivos generados en: ${CONTENT_PROJECTS_DIR}`);
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

main();
