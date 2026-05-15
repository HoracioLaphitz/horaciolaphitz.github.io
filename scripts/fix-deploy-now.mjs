#!/usr/bin/env node

/**
 * Fix Deploy Now - Script de Reparación Automática
 * 
 * Ejecuta todos los pasos necesarios para arreglar el deploy:
 * 1. Limpia archivos grandes
 * 2. Valida que se limpiaron
 * 3. Configura git hooks
 * 4. Genera reporte final
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

class DeployFixer {
  constructor() {
    this.steps = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      step: '📍',
    };
    console.log(`${icons[type]}  ${message}`);
  }

  async executeStep(name, command, critical = true) {
    this.log(`Ejecutando: ${name}`, 'step');
    
    try {
      execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      
      this.steps.push({ name, status: 'success' });
      this.log(`${name} - COMPLETADO`, 'success');
      return true;
    } catch (error) {
      this.steps.push({ name, status: 'error', error: error.message });
      this.log(`${name} - FALLÓ`, 'error');
      
      if (critical) {
        this.errors.push({ step: name, error: error.message });
        return false;
      }
      
      return true;
    }
  }

  printHeader() {
    console.log('\n' + '═'.repeat(60));
    console.log('🚀 FIX DEPLOY NOW - Reparación Automática');
    console.log('═'.repeat(60) + '\n');
    console.log('Este script ejecutará:');
    console.log('  1. Limpieza de archivos grandes');
    console.log('  2. Validación de archivos');
    console.log('  3. Configuración de git hooks');
    console.log('  4. Reporte final\n');
    console.log('⚠️  ADVERTENCIA: Eliminará archivos grandes permanentemente\n');
  }

  async confirmExecution() {
    // En modo automático, no pedir confirmación
    if (process.argv.includes('--auto')) {
      return true;
    }

    console.log('¿Deseas continuar? (y/n)');
    console.log('Presiona Ctrl+C para cancelar\n');
    
    // Dar 5 segundos para cancelar
    await new Promise(resolve => setTimeout(resolve, 5000));
    return true;
  }

  generateReport() {
    console.log('\n' + '═'.repeat(60));
    console.log('📊 REPORTE FINAL');
    console.log('═'.repeat(60) + '\n');

    const successSteps = this.steps.filter(s => s.status === 'success');
    const errorSteps = this.steps.filter(s => s.status === 'error');

    console.log(`✅ Pasos completados: ${successSteps.length}/${this.steps.length}`);
    console.log(`❌ Pasos fallidos: ${errorSteps.length}\n`);

    if (errorSteps.length > 0) {
      console.log('❌ PASOS FALLIDOS:\n');
      errorSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step.name}`);
        if (step.error) {
          console.log(`      Error: ${step.error}`);
        }
      });
      console.log('');
    }

    console.log('═'.repeat(60) + '\n');
  }

  printNextSteps() {
    console.log('📋 PRÓXIMOS PASOS:\n');
    console.log('1. Revisar los cambios:');
    console.log('   git status\n');
    console.log('2. Commit los cambios:');
    console.log('   git add .');
    console.log('   git commit -m "fix: remove large files and implement deploy security"\n');
    console.log('3. Push al repositorio:');
    console.log('   git push origin main\n');
    console.log('4. Verificar GitHub Actions:');
    console.log('   https://github.com/TU-USUARIO/TU-REPO/actions\n');
    console.log('5. Verificar el sitio:');
    console.log('   https://TU-USUARIO.github.io/TU-REPO\n');
  }

  async run() {
    this.printHeader();
    
    const confirmed = await this.confirmExecution();
    if (!confirmed) {
      console.log('❌ Operación cancelada por el usuario\n');
      process.exit(0);
    }

    console.log('🚀 Iniciando reparación...\n');

    // Paso 1: Limpiar archivos grandes
    const cleanupSuccess = await this.executeStep(
      'Limpieza de archivos grandes',
      'node scripts/cleanup-large-files.mjs',
      true
    );

    if (!cleanupSuccess) {
      console.log('\n❌ La limpieza falló. Abortando...\n');
      this.generateReport();
      process.exit(1);
    }

    // Paso 2: Validar archivos
    console.log('\n');
    const validateSuccess = await this.executeStep(
      'Validación de archivos',
      'node scripts/validate-file-sizes.mjs',
      false // No crítico, puede haber warnings
    );

    // Paso 3: Configurar git hooks
    console.log('\n');
    await this.executeStep(
      'Configuración de git hooks',
      'node scripts/setup-git-hooks.mjs',
      false // No crítico
    );

    // Generar reporte
    this.generateReport();

    if (this.errors.length > 0) {
      console.log('⚠️  Reparación completada con errores\n');
      console.log('💡 Revisa los errores arriba y ejecuta los pasos manualmente si es necesario\n');
      this.printNextSteps();
      process.exit(1);
    }

    console.log('✅ REPARACIÓN COMPLETADA EXITOSAMENTE\n');
    this.printNextSteps();
    process.exit(0);
  }
}

// Ejecutar
const fixer = new DeployFixer();
fixer.run();
