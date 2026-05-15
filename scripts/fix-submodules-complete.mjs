#!/usr/bin/env node

/**
 * Script para eliminar completamente referencias a submódulos
 * y limpiar el repositorio de cualquier configuración corrupta
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔧 Iniciando limpieza completa de submódulos...\n');

const steps = [
  {
    name: 'Eliminar configuración de submódulos en .git/config',
    action: () => {
      try {
        execSync('git config --local --remove-section submodule.proyectos/PrediccionImagenes', { stdio: 'ignore' });
        console.log('✅ Configuración de submódulo eliminada');
      } catch (error) {
        console.log('ℹ️  No había configuración de submódulo');
      }
    }
  },
  {
    name: 'Limpiar .git/modules',
    action: () => {
      const modulesPath = '.git/modules';
      if (existsSync(modulesPath)) {
        rmSync(modulesPath, { recursive: true, force: true });
        console.log('✅ Directorio .git/modules eliminado');
      } else {
        console.log('ℹ️  No existía .git/modules');
      }
    }
  },
  {
    name: 'Verificar y limpiar .gitmodules',
    action: () => {
      const gitmodulesPath = '.gitmodules';
      const cleanContent = '# Git Submodules Configuration\n# This file is intentionally empty to override any corrupted submodule references\n';
      
      writeFileSync(gitmodulesPath, cleanContent, 'utf8');
      console.log('✅ .gitmodules limpiado');
    }
  },
  {
    name: 'Eliminar referencias en el índice de Git',
    action: () => {
      try {
        // Buscar y eliminar cualquier entrada de submódulo en el índice
        const lsFiles = execSync('git ls-files --stage', { encoding: 'utf8' });
        const submoduleEntries = lsFiles.split('\n').filter(line => line.startsWith('160000'));
        
        if (submoduleEntries.length > 0) {
          console.log(`⚠️  Encontradas ${submoduleEntries.length} referencias de submódulo en el índice`);
          
          submoduleEntries.forEach(entry => {
            const path = entry.split('\t')[1];
            if (path) {
              try {
                execSync(`git rm --cached "${path}"`, { stdio: 'ignore' });
                console.log(`   ✅ Eliminada referencia: ${path}`);
              } catch (e) {
                console.log(`   ⚠️  No se pudo eliminar: ${path}`);
              }
            }
          });
        } else {
          console.log('✅ No hay referencias de submódulo en el índice');
        }
      } catch (error) {
        console.log('ℹ️  Error al verificar índice (puede ser normal)');
      }
    }
  },
  {
    name: 'Actualizar .gitignore para prevenir problemas futuros',
    action: () => {
      const gitignorePath = '.gitignore';
      let content = '';
      
      if (existsSync(gitignorePath)) {
        content = readFileSync(gitignorePath, 'utf8');
      }
      
      const linesToAdd = [
        '\n# Prevenir submódulos accidentales',
        '.git/modules/',
        '*.submodule'
      ];
      
      let modified = false;
      linesToAdd.forEach(line => {
        if (!content.includes(line.trim())) {
          content += line + '\n';
          modified = true;
        }
      });
      
      if (modified) {
        writeFileSync(gitignorePath, content, 'utf8');
        console.log('✅ .gitignore actualizado');
      } else {
        console.log('ℹ️  .gitignore ya estaba actualizado');
      }
    }
  },
  {
    name: 'Verificar estado final',
    action: () => {
      try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        console.log('\n📊 Estado del repositorio:');
        if (status.trim()) {
          console.log(status);
        } else {
          console.log('   ✅ Repositorio limpio');
        }
      } catch (error) {
        console.log('⚠️  Error al verificar estado');
      }
    }
  }
];

// Ejecutar todos los pasos
let success = true;
for (const step of steps) {
  console.log(`\n🔄 ${step.name}...`);
  try {
    step.action();
  } catch (error) {
    console.error(`❌ Error en: ${step.name}`);
    console.error(error.message);
    success = false;
  }
}

console.log('\n' + '='.repeat(60));
if (success) {
  console.log('✅ Limpieza completada exitosamente');
  console.log('\n📝 Próximos pasos:');
  console.log('   1. git add .gitmodules .gitignore');
  console.log('   2. git commit -m "fix: eliminar referencias de submódulos corruptos"');
  console.log('   3. git push origin main');
} else {
  console.log('⚠️  Limpieza completada con advertencias');
  console.log('   Revisa los errores anteriores');
}
console.log('='.repeat(60) + '\n');
