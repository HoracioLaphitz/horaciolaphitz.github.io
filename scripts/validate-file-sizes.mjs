#!/usr/bin/env node

/**
 * Script de validación de tamaños de archivo para GitHub Pages
 * 
 * Propósito:
 * - Prevenir que archivos grandes (>100MB) rompan el deploy
 * - Validar que el build total no exceda límites de GitHub Pages
 * - Generar reportes de archivos problemáticos
 * 
 * Límites de GitHub Pages:
 * - Archivo individual: 100MB
 * - Repositorio total: 1GB recomendado
 * - Build artifact: 10GB máximo
 */

import { readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de límites
const LIMITS = {
  SINGLE_FILE_MB: 100,
  SINGLE_FILE_WARNING_MB: 50,
  TOTAL_SIZE_WARNING_GB: 0.5,
  TOTAL_SIZE_ERROR_GB: 1,
};

// Patrones de archivos a excluir de la validación
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.astro/,
  /\.cache/,
  /\.vscode/,
  /\.idea/,
];

// Extensiones de archivos grandes conocidos
const LARGE_FILE_EXTENSIONS = [
  '.pbix',      // Power BI
  '.sqlite',    // SQLite databases
  '.db',        // Databases
  '.sql',       // SQL dumps
  '.csv',       // Large datasets
  '.xlsx',      // Excel files
  '.zip',       // Archives
  '.tar',       // Archives
  '.gz',        // Compressed
  '.mp4',       // Videos
  '.avi',       // Videos
  '.mov',       // Videos
  '.pdf',       // Large PDFs
];

class FileSizeValidator {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.largeFiles = [];
    this.warningFiles = [];
    this.totalSize = 0;
    this.fileCount = 0;
  }

  shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async scanDirectory(dir) {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(this.rootDir, fullPath);

      if (this.shouldExclude(relativePath)) {
        continue;
      }

      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else {
        await this.checkFile(fullPath, relativePath);
      }
    }
  }

  async checkFile(fullPath, relativePath) {
    try {
      const stats = await stat(fullPath);
      const sizeMB = stats.size / (1024 * 1024);

      this.totalSize += stats.size;
      this.fileCount++;

      // Archivo excede límite crítico
      if (sizeMB > LIMITS.SINGLE_FILE_MB) {
        this.largeFiles.push({
          path: relativePath,
          size: stats.size,
          sizeMB: sizeMB.toFixed(2),
          formatted: this.formatBytes(stats.size),
        });
      }
      // Archivo excede límite de advertencia
      else if (sizeMB > LIMITS.SINGLE_FILE_WARNING_MB) {
        this.warningFiles.push({
          path: relativePath,
          size: stats.size,
          sizeMB: sizeMB.toFixed(2),
          formatted: this.formatBytes(stats.size),
        });
      }
    } catch (error) {
      console.warn(`⚠️  No se pudo leer: ${relativePath}`);
    }
  }

  generateReport() {
    const totalSizeGB = this.totalSize / (1024 * 1024 * 1024);
    
    console.log('\n📊 REPORTE DE VALIDACIÓN DE TAMAÑOS\n');
    console.log('═'.repeat(60));
    
    // Resumen general
    console.log('\n📈 Resumen General:');
    console.log(`   Archivos escaneados: ${this.fileCount.toLocaleString()}`);
    console.log(`   Tamaño total: ${this.formatBytes(this.totalSize)} (${totalSizeGB.toFixed(2)} GB)`);
    
    // Archivos críticos (>100MB)
    if (this.largeFiles.length > 0) {
      console.log('\n🚨 ARCHIVOS CRÍTICOS (>100MB):');
      console.log('   Estos archivos ROMPERÁN el deploy de GitHub Pages\n');
      
      this.largeFiles
        .sort((a, b) => b.size - a.size)
        .forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.path}`);
          console.log(`      Tamaño: ${file.formatted} (${file.sizeMB} MB)`);
          console.log('');
        });
    }

    // Archivos de advertencia (>50MB)
    if (this.warningFiles.length > 0) {
      console.log('\n⚠️  ARCHIVOS DE ADVERTENCIA (>50MB):');
      console.log('   Estos archivos son grandes pero no romperán el deploy\n');
      
      this.warningFiles
        .sort((a, b) => b.size - a.size)
        .slice(0, 10) // Top 10
        .forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.path}`);
          console.log(`      Tamaño: ${file.formatted} (${file.sizeMB} MB)`);
          console.log('');
        });
      
      if (this.warningFiles.length > 10) {
        console.log(`   ... y ${this.warningFiles.length - 10} archivos más\n`);
      }
    }

    // Validación de tamaño total
    if (totalSizeGB > LIMITS.TOTAL_SIZE_ERROR_GB) {
      console.log('\n❌ ERROR: Tamaño total excede 1GB');
      console.log('   GitHub Pages recomienda repositorios menores a 1GB');
    } else if (totalSizeGB > LIMITS.TOTAL_SIZE_WARNING_GB) {
      console.log('\n⚠️  ADVERTENCIA: Tamaño total cercano al límite');
      console.log(`   Actual: ${totalSizeGB.toFixed(2)} GB / Recomendado: <1GB`);
    } else {
      console.log('\n✅ Tamaño total dentro de límites aceptables');
    }

    console.log('\n═'.repeat(60));

    return {
      hasErrors: this.largeFiles.length > 0 || totalSizeGB > LIMITS.TOTAL_SIZE_ERROR_GB,
      hasWarnings: this.warningFiles.length > 0 || totalSizeGB > LIMITS.TOTAL_SIZE_WARNING_GB,
      largeFiles: this.largeFiles,
      warningFiles: this.warningFiles,
      totalSize: this.totalSize,
      totalSizeGB,
    };
  }

  generateSolutions() {
    if (this.largeFiles.length === 0) return;

    console.log('\n💡 SOLUCIONES RECOMENDADAS:\n');

    this.largeFiles.forEach((file, index) => {
      const ext = file.path.split('.').pop().toLowerCase();
      
      console.log(`${index + 1}. Para ${file.path}:`);

      if (ext === 'pbix') {
        console.log('   → Mover a carpeta excluida: Proyectos/**/Desarrollo.pbix');
        console.log('   → Agregar a .gitignore: **/*.pbix');
        console.log('   → Alternativa: Publicar en Power BI Service y enlazar');
      } else if (ext === 'sqlite' || ext === 'db' || ext === 'sql') {
        console.log('   → Mover a carpeta excluida: Proyectos/**/DB/');
        console.log('   → Agregar a .gitignore: Proyectos/**/DB/');
        console.log('   → Alternativa: Usar muestra de datos (<10MB)');
      } else if (ext === 'csv' || ext === 'xlsx') {
        console.log('   → Comprimir con gzip');
        console.log('   → Usar muestra representativa de datos');
        console.log('   → Subir a servicio externo (Google Drive, S3)');
      } else {
        console.log('   → Mover fuera del repositorio');
        console.log('   → Agregar a .gitignore');
        console.log('   → Usar servicio de hosting externo');
      }
      console.log('');
    });
  }
}

async function main() {
  const targetDir = process.argv[2] || process.cwd();
  
  console.log('🔍 Iniciando validación de tamaños de archivo...');
  console.log(`📁 Directorio: ${targetDir}\n`);

  const validator = new FileSizeValidator(targetDir);
  
  try {
    await validator.scanDirectory(targetDir);
    const report = validator.generateReport();
    
    if (report.hasErrors) {
      validator.generateSolutions();
      console.log('\n❌ VALIDACIÓN FALLIDA: Se encontraron archivos que exceden los límites\n');
      process.exit(1);
    } else if (report.hasWarnings) {
      console.log('\n⚠️  VALIDACIÓN COMPLETADA CON ADVERTENCIAS\n');
      process.exit(0);
    } else {
      console.log('\n✅ VALIDACIÓN EXITOSA: Todos los archivos dentro de límites\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n❌ Error durante la validación:', error.message);
    process.exit(1);
  }
}

main();
