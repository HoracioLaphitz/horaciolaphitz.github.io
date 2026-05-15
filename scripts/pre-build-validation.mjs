#!/usr/bin/env node

/**
 * Pre-Build Validation Script
 * 
 * Ejecuta todas las validaciones necesarias antes del build:
 * 1. Validación de tamaños de archivo
 * 2. Verificación de .gitignore
 * 3. Limpieza de archivos temporales
 * 4. Validación de estructura de proyecto
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CRITICAL_PATTERNS = [
  '**/*.pbix',
  'Proyectos/**/DB/',
  'Proyectos/**/Datos en si/',
  '**/*.sqlite',
  '**/*.db',
  '**/dump.*.sql',
];

class PreBuildValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    console.log(`${icons[type]}  ${message}`);
  }

  async validateGitignore() {
    this.log('Validando .gitignore...', 'info');
    
    try {
      const gitignorePath = join(process.cwd(), '.gitignore');
      
      if (!existsSync(gitignorePath)) {
        this.errors.push('.gitignore no existe');
        return false;
      }

      const content = readFileSync(gitignorePath, 'utf-8');
      const missingPatterns = [];

      for (const pattern of CRITICAL_PATTERNS) {
        if (!content.includes(pattern)) {
          missingPatterns.push(pattern);
        }
      }

      if (missingPatterns.length > 0) {
        this.warnings.push(
          `Patrones faltantes en .gitignore: ${missingPatterns.join(', ')}`
        );
      }

      this.log('Validación de .gitignore completada', 'success');
      return true;
    } catch (error) {
      this.errors.push(`Error validando .gitignore: ${error.message}`);
      return false;
    }
  }

  async validateFileSizes() {
    this.log('Validando tamaños de archivo...', 'info');
    
    try {
      execSync('node scripts/validate-file-sizes.mjs', {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      this.log('Validación de tamaños completada', 'success');
      return true;
    } catch (error) {
      this.errors.push('Validación de tamaños falló');
      return false;
    }
  }

  async checkDistFolder() {
    this.log('Verificando carpeta dist...', 'info');
    
    const distPath = join(process.cwd(), 'dist');
    
    if (existsSync(distPath)) {
      this.log('Carpeta dist existe (será recreada en build)', 'info');
    } else {
      this.log('Carpeta dist no existe (se creará en build)', 'info');
    }
    
    return true;
  }

  async validateProjectStructure() {
    this.log('Validando estructura del proyecto...', 'info');
    
    const requiredPaths = [
      'src',
      'src/content',
      'src/presentation',
      'public',
      'astro.config.mjs',
      'package.json',
    ];

    const missing = [];
    
    for (const path of requiredPaths) {
      if (!existsSync(join(process.cwd(), path))) {
        missing.push(path);
      }
    }

    if (missing.length > 0) {
      this.errors.push(`Rutas faltantes: ${missing.join(', ')}`);
      return false;
    }

    this.log('Estructura del proyecto válida', 'success');
    return true;
  }

  generateReport() {
    console.log('\n' + '═'.repeat(60));
    console.log('📋 REPORTE DE VALIDACIÓN PRE-BUILD');
    console.log('═'.repeat(60) + '\n');

    if (this.errors.length > 0) {
      console.log('❌ ERRORES CRÍTICOS:\n');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  ADVERTENCIAS:\n');
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning}`);
      });
      console.log('');
    }

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ Todas las validaciones pasaron exitosamente\n');
    }

    console.log('═'.repeat(60) + '\n');

    return this.errors.length === 0;
  }

  async run() {
    console.log('\n🚀 Iniciando validaciones pre-build...\n');

    const validations = [
      () => this.validateProjectStructure(),
      () => this.validateGitignore(),
      () => this.checkDistFolder(),
      () => this.validateFileSizes(),
    ];

    for (const validation of validations) {
      const result = await validation();
      if (!result && this.errors.length > 0) {
        // Si hay errores críticos, detener
        break;
      }
    }

    const success = this.generateReport();

    if (!success) {
      console.log('❌ Pre-build validation FAILED\n');
      console.log('💡 Soluciones:');
      console.log('   1. Revisa los errores listados arriba');
      console.log('   2. Ejecuta: pnpm run validate-files');
      console.log('   3. Verifica que archivos grandes estén en .gitignore\n');
      process.exit(1);
    }

    console.log('✅ Pre-build validation PASSED\n');
    console.log('🎯 Listo para ejecutar build\n');
    process.exit(0);
  }
}

const validator = new PreBuildValidator();
validator.run();
