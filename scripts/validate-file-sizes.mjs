#!/usr/bin/env node
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const targetDir = process.argv[2] || '.';

async function checkFileSizes(dir) {
  try {
    const files = await readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = join(dir, file.name);
      
      if (file.isDirectory()) {
        if (!file.name.startsWith('.') && file.name !== 'node_modules') {
          await checkFileSizes(fullPath);
        }
      } else {
        const stats = await stat(fullPath);
        if (stats.size > MAX_FILE_SIZE) {
          console.error(`❌ Archivo demasiado grande: ${fullPath} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
          process.exit(1);
        }
      }
    }
  } catch (error) {
    console.error(`Error al validar archivos: ${error.message}`);
    process.exit(1);
  }
}

console.log(`🔍 Validando tamaños de archivos en: ${targetDir}`);
await checkFileSizes(targetDir);
console.log('✅ Todos los archivos tienen tamaños válidos');
