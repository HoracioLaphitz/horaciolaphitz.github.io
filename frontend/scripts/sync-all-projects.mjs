#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PROJECTS_DIR = path.join(__dirname, '../../public/Proyectos');
const CONTENT_PROJECTS_DIR = path.join(__dirname, '../src/content/proyectos');
const GITHUB_DATA_PATH = path.join(__dirname, '../src/data/github-repos-simple.json');

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

    for (const repo of githubData.repositories) {
      const projectData = {
        id: slugify(repo.name),
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `Proyecto: ${repo.name}`,
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
    const folders = entries.filter(entry => entry.isDirectory());

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
