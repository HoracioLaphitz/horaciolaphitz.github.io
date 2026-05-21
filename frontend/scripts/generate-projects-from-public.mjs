#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_PROJECTS_DIR = path.join(__dirname, '../../public/Proyectos');
const CONTENT_PROJECTS_DIR = path.join(__dirname, '../src/content/proyectos');

// Clean old generated projects (100+)
async function cleanOldProjects() {
  try {
    const files = await fs.readdir(CONTENT_PROJECTS_DIR);
    const generatedFiles = files.filter(f => {
      const match = f.match(/^(\d+)-/);
      return match && parseInt(match[1]) >= 100;
    });
    
    for (const file of generatedFiles) {
      await fs.unlink(path.join(CONTENT_PROJECTS_DIR, file));
    }
    
    if (generatedFiles.length > 0) {
      console.log(`🗑️  Eliminados ${generatedFiles.length} proyectos antiguos\n`);
    }
  } catch (error) {
    // Directory might not exist yet
  }
}

// Utility: Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

// Utility: Extract text from README
async function extractTextFromReadme(readmePath) {
  try {
    const content = await fs.readFile(readmePath, 'utf-8');
    // Remove markdown syntax
    let text = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`(.+?)`/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .trim();
    
    return text;
  } catch {
    return '';
  }
}

// Utility: Extractive summarization
function summarizeText(text, maxChars = 200) {
  if (!text || text.length <= maxChars) return text;

  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (sentences.length === 0) return text.substring(0, maxChars) + '...';

  // Simple heuristic: take first sentences until we reach maxChars
  let summary = '';
  for (const sentence of sentences) {
    if ((summary + sentence).length > maxChars) break;
    summary += sentence + '. ';
  }

  return summary.trim() || text.substring(0, maxChars) + '...';
}

// Utility: Detect category from folder name or content
function detectCategory(folderName, readmeContent = '') {
  const name = folderName.toLowerCase();
  const content = readmeContent.toLowerCase();

  if (name.includes('dashboard') || content.includes('dashboard') || content.includes('power bi') || content.includes('tableau')) {
    return 'Business Intelligence';
  }
  if (name.includes('red') || name.includes('neural') || name.includes('cnn') || name.includes('gan') || content.includes('deep learning') || content.includes('tensorflow')) {
    return 'Deep Learning';
  }
  if (name.includes('regresion') || name.includes('clasificacion') || name.includes('prediccion') || content.includes('machine learning') || content.includes('scikit-learn')) {
    return 'Machine Learning';
  }
  if (name.includes('analisis') || name.includes('eda') || content.includes('análisis exploratorio') || content.includes('pandas')) {
    return 'Análisis de Datos';
  }
  if (name.includes('notebook')) {
    return 'Notebooks';
  }

  return 'Otros';
}

// Utility: Extract technologies from README
function extractTechnologies(readmeContent) {
  const techMap = {
    'python': 'Python',
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
    'r ': 'R',
    'bigquery': 'BigQuery',
    'google analytics': 'Google Analytics',
  };

  const found = new Set();
  const content = readmeContent.toLowerCase();

  for (const [key, value] of Object.entries(techMap)) {
    if (content.includes(key)) {
      found.add(value);
    }
  }

  return Array.from(found);
}

// Utility: Find files recursively
async function findFiles(dir, extensions = []) {
  const results = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip .git directories
        if (entry.name === '.git') continue;
        results.push(...await findFiles(fullPath, extensions));
      } else if (entry.isFile()) {
        if (extensions.length === 0 || extensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Ignore permission errors
  }
  
  return results;
}

// Main: Process a single project folder
async function processProjectFolder(projectPath, folderName) {
  const projectData = {
    id: slugify(folderName),
    title: folderName,
    description: '',
    summary: '',
    category: 'Otros',
    technologies: [],
    githubUrl: null,
    pdfUrl: null,
    pdfSize: null,
    thumbnail: null,
    featured: false,
    status: 'completed',
  };

  // Check for README
  const readmePath = path.join(projectPath, 'README.md');
  let readmeContent = '';
  let readmeExists = false;

  try {
    await fs.access(readmePath);
    readmeExists = true;
    readmeContent = await fs.readFile(readmePath, 'utf-8');
    
    // Extract title from first heading
    const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      projectData.title = titleMatch[1].trim();
    }

    // Extract full text for summarization
    const fullText = await extractTextFromReadme(readmePath);
    projectData.description = summarizeText(fullText, 150);
    projectData.summary = summarizeText(fullText, 250);

    // Detect category
    projectData.category = detectCategory(folderName, readmeContent);

    // Extract technologies
    projectData.technologies = extractTechnologies(readmeContent);
  } catch {
    // No README, use folder name
    projectData.description = `Proyecto: ${folderName}`;
    projectData.summary = `Proyecto de análisis y desarrollo: ${folderName}`;
    projectData.category = detectCategory(folderName);
  }

  // Check for package.json (GitHub repo info)
  try {
    const packagePath = path.join(projectPath, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf-8');
    const packageData = JSON.parse(packageContent);
    
    if (packageData.repository) {
      if (typeof packageData.repository === 'string') {
        projectData.githubUrl = packageData.repository;
      } else if (packageData.repository.url) {
        projectData.githubUrl = packageData.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
      }
    }
    
    if (packageData.description && !readmeExists) {
      projectData.description = packageData.description;
    }
  } catch {
    // No package.json
  }

  // Check for .git folder (GitHub repo)
  try {
    const gitPath = path.join(projectPath, '.git');
    await fs.access(gitPath);
    
    // Try to read git config
    try {
      const gitConfigPath = path.join(gitPath, 'config');
      const gitConfig = await fs.readFile(gitConfigPath, 'utf-8');
      const urlMatch = gitConfig.match(/url\s*=\s*(.+)/);
      if (urlMatch && !projectData.githubUrl) {
        projectData.githubUrl = urlMatch[1].trim().replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
      }
    } catch {
      // Could not read git config
    }
  } catch {
    // No .git folder
  }

  // Find PDFs
  const pdfs = await findFiles(projectPath, ['.pdf']);
  if (pdfs.length > 0) {
    const pdfPath = pdfs[0];
    const pdfRelativePath = path.relative(path.join(__dirname, '../../public'), pdfPath).replace(/\\/g, '/');
    projectData.pdfUrl = `/${pdfRelativePath}`;
    
    try {
      const stats = await fs.stat(pdfPath);
      projectData.pdfSize = formatFileSize(stats.size);
    } catch {
      // Could not get file size
    }
  }

  // Find thumbnail (first image)
  const images = await findFiles(projectPath, ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
  if (images.length > 0) {
    const imgPath = images[0];
    const imgRelativePath = path.relative(path.join(__dirname, '../../public'), imgPath).replace(/\\/g, '/');
    projectData.thumbnail = `/${imgRelativePath}`;
  }

  return projectData;
}

// Main: Generate markdown file
function generateMarkdown(projectData) {
  const frontmatter = {
    title: projectData.title,
    description: projectData.description,
    category: projectData.category,
    featured: projectData.featured,
    status: projectData.status,
    technologies: projectData.technologies,
  };

  if (projectData.githubUrl) {
    frontmatter.githubUrl = projectData.githubUrl;
  }

  let content = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      content += `${key}: [${value.map(v => `"${v}"`).join(', ')}]\n`;
    } else if (typeof value === 'string') {
      // Escape quotes and handle multiline strings
      const escapedValue = value.replace(/"/g, '\\"').replace(/\n/g, ' ');
      content += `${key}: "${escapedValue}"\n`;
    } else {
      content += `${key}: ${value}\n`;
    }
  }
  content += '---\n\n';

  content += `## Descripción del Proyecto\n\n`;
  content += `${projectData.summary}\n\n`;

  if (projectData.technologies.length > 0) {
    content += `### Tecnologías Utilizadas\n\n`;
    projectData.technologies.forEach(tech => {
      content += `- ${tech}\n`;
    });
    content += '\n';
  }

  if (projectData.pdfUrl) {
    content += `### Recursos\n\n`;
    content += `- [Descargar PDF](${projectData.pdfUrl})`;
    if (projectData.pdfSize) {
      content += ` (${projectData.pdfSize})`;
    }
    content += '\n\n';
  }

  if (projectData.githubUrl) {
    content += `### Código Fuente\n\n`;
    content += `[Ver en GitHub](${projectData.githubUrl})\n`;
  }

  return content;
}

// Main execution
async function main() {
  console.log('🚀 Generando proyectos desde public/Proyectos/...\n');

  try {
    // Clean old generated projects first
    await cleanOldProjects();
    
    // Ensure content directory exists
    await fs.mkdir(CONTENT_PROJECTS_DIR, { recursive: true });

    // Read all folders in public/Proyectos
    const entries = await fs.readdir(PUBLIC_PROJECTS_DIR, { withFileTypes: true });
    const folders = entries.filter(entry => entry.isDirectory());

    console.log(`📁 Encontradas ${folders.length} carpetas de proyectos\n`);

    let processedCount = 0;
    let skippedCount = 0;

    for (const folder of folders) {
      const folderPath = path.join(PUBLIC_PROJECTS_DIR, folder.name);
      
      try {
        console.log(`⚙️  Procesando: ${folder.name}`);
        
        const projectData = await processProjectFolder(folderPath, folder.name);
        const markdown = generateMarkdown(projectData);
        
        // Generate filename with counter prefix
        const counter = String(processedCount + 100).padStart(3, '0');
        const filename = `${counter}-${projectData.id}.md`;
        const outputPath = path.join(CONTENT_PROJECTS_DIR, filename);
        
        await fs.writeFile(outputPath, markdown, 'utf-8');
        
        console.log(`   ✅ Generado: ${filename}`);
        processedCount++;
      } catch (error) {
        console.error(`   ❌ Error procesando ${folder.name}:`, error.message);
        skippedCount++;
      }
    }

    console.log(`\n✨ Proceso completado:`);
    console.log(`   - Proyectos procesados: ${processedCount}`);
    console.log(`   - Proyectos omitidos: ${skippedCount}`);
    console.log(`\n📝 Archivos generados en: ${CONTENT_PROJECTS_DIR}`);
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

main();
