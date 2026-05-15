#!/usr/bin/env node
/**
 * Script para actualizar imports después de reorganizar componentes
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Patrones de imports a actualizar
const importPatterns = [
  {
    old: '@presentation/components/components/layout',
    new: '@presentation/components/layout'
  },
  {
    old: '@presentation/components/components/proyectos',
    new: '@presentation/components/proyectos'
  },
  {
    old: '@presentation/components/components/sections',
    new: '@presentation/components/sections'
  },
  {
    old: '@presentation/components/components/ui',
    new: '@presentation/components/ui'
  },
  {
    old: '../components/layout',
    new: '../layout'
  },
  {
    old: '../components/proyectos',
    new: '../proyectos'
  },
  {
    old: '../components/sections',
    new: '../sections'
  },
  {
    old: '../components/ui',
    new: '../ui'
  }
];

async function updateFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf-8');
    let updated = false;

    for (const pattern of importPatterns) {
      if (content.includes(pattern.old)) {
        content = content.replaceAll(pattern.old, pattern.new);
        updated = true;
      }
    }

    if (updated) {
      await writeFile(filePath, content, 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message);
    return false;
  }
}

async function scanDirectory(dir, extensions = ['.tsx', '.ts', '.astro']) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...await scanDirectory(fullPath, extensions));
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error escaneando ${dir}:`, error.message);
  }
  
  return files;
}

async function updateImports() {
  console.log('🔄 Actualizando imports...\n');

  try {
    const srcDir = join(rootDir, 'src');
    const files = await scanDirectory(srcDir);
    
    console.log(`📁 Encontrados ${files.length} archivos para revisar\n`);
    
    let updatedCount = 0;
    
    for (const file of files) {
      const relativePath = file.replace(rootDir, '').replace(/\\/g, '/');
      const wasUpdated = await updateFile(file);
      
      if (wasUpdated) {
        console.log(`  ✓ ${relativePath}`);
        updatedCount++;
      }
    }
    
    console.log(`\n✅ Actualizados ${updatedCount} archivos`);
    
  } catch (error) {
    console.error('❌ Error actualizando imports:', error);
    process.exit(1);
  }
}

updateImports();
