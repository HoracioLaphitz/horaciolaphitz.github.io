#!/usr/bin/env node
/**
 * Script para reorganizar la estructura de componentes
 * Elimina la duplicación de carpetas en src/presentation/components/
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, cp, rm, rename } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const componentsDir = join(rootDir, 'src/presentation/components');
const oldStructure = join(componentsDir, 'components');

async function reorganize() {
  console.log('🔄 Iniciando reorganización de componentes...\n');

  try {
    // 1. Verificar que existe la estructura antigua
    if (!existsSync(oldStructure)) {
      console.log('✅ La estructura ya está correcta');
      return;
    }

    // 2. Copiar archivos a la estructura correcta
    console.log('📁 Copiando archivos...');
    const folders = ['layout', 'proyectos', 'sections', 'ui'];
    
    for (const folder of folders) {
      const source = join(oldStructure, folder);
      const dest = join(componentsDir, `${folder}_new`);
      
      if (existsSync(source)) {
        await cp(source, dest, { recursive: true });
        console.log(`  ✓ ${folder}/`);
      }
    }

    // 3. Eliminar carpetas antiguas
    console.log('\n🗑️  Eliminando estructura antigua...');
    await rm(oldStructure, { recursive: true, force: true });
    
    // Eliminar carpetas vacías
    const emptyFolders = ['proyectos', 'sections', 'ui'];
    for (const folder of emptyFolders) {
      const path = join(componentsDir, folder);
      if (existsSync(path)) {
        await rm(path, { recursive: true, force: true });
      }
    }

    // 4. Renombrar carpetas nuevas
    console.log('\n📝 Renombrando carpetas...');
    for (const folder of folders) {
      const oldName = join(componentsDir, `${folder}_new`);
      const newName = join(componentsDir, folder);
      
      if (existsSync(oldName)) {
        await rename(oldName, newName);
        console.log(`  ✓ ${folder}/`);
      }
    }

    console.log('\n✅ Reorganización completada exitosamente!\n');
    console.log('📂 Nueva estructura:');
    console.log('src/presentation/components/');
    console.log('├── layout/');
    console.log('├── proyectos/');
    console.log('├── sections/');
    console.log('└── ui/');

  } catch (error) {
    console.error('❌ Error durante la reorganización:', error);
    process.exit(1);
  }
}

reorganize();
