#!/usr/bin/env node

/**
 * Fix Submodule Issue
 * 
 * Limpia referencias corruptas a submódulos de Git
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

console.log('🔧 Limpiando referencias a submódulos...\n');

// 1. Verificar si existe .gitmodules
const gitmodulesPath = '.gitmodules';
if (existsSync(gitmodulesPath)) {
  console.log('✅ Eliminando .gitmodules');
  unlinkSync(gitmodulesPath);
}

// 2. Limpiar configuración de Git
const gitConfigPath = '.git/config';
if (existsSync(gitConfigPath)) {
  console.log('✅ Limpiando .git/config');
  
  try {
    let config = readFileSync(gitConfigPath, 'utf-8');
    
    // Remover secciones de submodule
    config = config.replace(/\[submodule[^\]]*\][^\[]*(?=\[|$)/g, '');
    
    writeFileSync(gitConfigPath, config);
    console.log('   Configuración limpiada');
  } catch (error) {
    console.warn('   ⚠️  No se pudo limpiar .git/config:', error.message);
  }
}

// 3. Limpiar .git/modules si existe
const gitModulesPath = '.git/modules';
if (existsSync(gitModulesPath)) {
  console.log('✅ Eliminando .git/modules');
  try {
    execSync('rm -rf .git/modules', { stdio: 'inherit' });
  } catch (error) {
    console.warn('   ⚠️  No se pudo eliminar .git/modules');
  }
}

// 4. Limpiar index de Git
console.log('✅ Limpiando index de Git');
try {
  execSync('git rm --cached -r proyectos/PrediccionImagenes', { stdio: 'pipe' });
  console.log('   Submódulo removido del index');
} catch (error) {
  console.log('   (No había submódulo en el index)');
}

// 5. Verificar estado
console.log('\n📊 Verificando estado...');
try {
  const status = execSync('git status --short', { encoding: 'utf-8' });
  if (status.trim()) {
    console.log('\n📝 Cambios detectados:');
    console.log(status);
  } else {
    console.log('✅ No hay cambios pendientes');
  }
} catch (error) {
  console.warn('⚠️  No se pudo verificar estado');
}

console.log('\n✅ Limpieza completada');
console.log('\n💡 Próximos pasos:');
console.log('   1. git add .');
console.log('   2. git commit -m "fix: remove corrupted submodule references"');
console.log('   3. git push origin main\n');
