#!/usr/bin/env node

/**
 * Cleanup Large Files Script
 * 
 * Limpia archivos grandes detectados del repositorio
 * ADVERTENCIA: Este script elimina archivos permanentemente
 */

import { unlink, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const LARGE_FILES_TO_REMOVE = [
  // Bases de datos
  'Proyectos/Proyecto SanoYFresco/DB/sanoyfresco/sanoyfresco.db',
  'public/Proyectos/Proyecto SanoYFresco/DB/sanoyfresco/sanoyfresco.db',
  'dist/Proyectos/Proyecto SanoYFresco/DB/sanoyfresco/sanoyfresco.db',
  
  // Datasets grandes
  'Proyectos/Proyecto SanoYFresco/Datos en si/tickets.csv',
  'public/Proyectos/Proyecto SanoYFresco/Datos en si/tickets.csv',
  'dist/Proyectos/Proyecto SanoYFresco/Datos en si/tickets.csv',
  
  // Power BI
  'Proyectos/Proyecto SanoYFresco/Desarrollo.pbix',
  'public/Proyectos/Proyecto SanoYFresco/Desarrollo.pbix',
  'dist/Proyectos/Proyecto SanoYFresco/Desarrollo.pbix',
  'Proyectos/dashboards/Dash-MarketBasketAnalystics.pbix',
  'public/Proyectos/dashboards/Dash-MarketBasketAnalystics.pbix',
  'dist/Proyectos/dashboards/Dash-MarketBasketAnalystics.pbix',
  
  // Notebooks grandes
  'public/notebooks-html/Copia de DeepDreams.html',
  'dist/notebooks-html/Copia de DeepDreams.html',
  'dist/notebooks/Copia de DeepDreams.ipynb',
  
  // Python packages
  'Proyectos/Notebooks/noteooks/Lib/site-packages/tensorflow/python/_pywrap_tensorflow_common.dll',
  'Proyectos/Notebooks/venv/Lib/site-packages/cv2/cv2.pyd',
];

const DIRECTORIES_TO_REMOVE = [
  'Proyectos/Notebooks/venv',
  'Proyectos/Notebooks/noteooks',
  'dist',
];

class FileCleanup {
  constructor() {
    this.removed = [];
    this.notFound = [];
    this.errors = [];
  }

  async removeFile(filePath) {
    try {
      if (existsSync(filePath)) {
        await unlink(filePath);
        this.removed.push(filePath);
        console.log(`✅ Eliminado: ${filePath}`);
      } else {
        this.notFound.push(filePath);
        console.log(`⚠️  No encontrado: ${filePath}`);
      }
    } catch (error) {
      this.errors.push({ path: filePath, error: error.message });
      console.error(`❌ Error eliminando ${filePath}:`, error.message);
    }
  }

  async removeDirectory(dirPath) {
    try {
      if (existsSync(dirPath)) {
        await rm(dirPath, { recursive: true, force: true });
        this.removed.push(dirPath);
        console.log(`✅ Directorio eliminado: ${dirPath}`);
      } else {
        this.notFound.push(dirPath);
        console.log(`⚠️  Directorio no encontrado: ${dirPath}`);
      }
    } catch (error) {
      this.errors.push({ path: dirPath, error: error.message });
      console.error(`❌ Error eliminando directorio ${dirPath}:`, error.message);
    }
  }

  generateReport() {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 REPORTE DE LIMPIEZA');
    console.log('═'.repeat(60) + '\n');

    console.log(`✅ Archivos eliminados: ${this.removed.length}`);
    console.log(`⚠️  Archivos no encontrados: ${this.notFound.length}`);
    console.log(`❌ Errores: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORES:\n');
      this.errors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err.path}`);
        console.log(`      Error: ${err.error}`);
      });
    }

    console.log('\n' + '═'.repeat(60) + '\n');
  }

  async run() {
    console.log('🧹 Iniciando limpieza de archivos grandes...\n');
    console.log('⚠️  ADVERTENCIA: Esta operación eliminará archivos permanentemente\n');

    // Eliminar archivos individuales
    console.log('📁 Eliminando archivos...\n');
    for (const file of LARGE_FILES_TO_REMOVE) {
      await this.removeFile(file);
    }

    // Eliminar directorios
    console.log('\n📂 Eliminando directorios...\n');
    for (const dir of DIRECTORIES_TO_REMOVE) {
      await this.removeDirectory(dir);
    }

    this.generateReport();

    if (this.errors.length > 0) {
      console.log('⚠️  Limpieza completada con errores\n');
      process.exit(1);
    }

    console.log('✅ Limpieza completada exitosamente\n');
    console.log('💡 Próximos pasos:');
    console.log('   1. Ejecutar: pnpm run validate-files');
    console.log('   2. Verificar que no hay archivos grandes');
    console.log('   3. Commit y push\n');
    process.exit(0);
  }
}

const cleanup = new FileCleanup();
cleanup.run();
