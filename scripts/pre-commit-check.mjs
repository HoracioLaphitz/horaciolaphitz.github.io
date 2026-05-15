#!/usr/bin/env node

/**
 * Pre-commit hook para prevenir problemas de submódulos y archivos grandes
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';

console.log('🔍 Ejecutando verificaciones pre-commit...\n');

let hasErrors = false;

// 1. Verificar que no hay referencias de submódulos
console.log('1️⃣ Verificando referencias de submódulos...');
try {
  const lsFiles = execSync('git ls-files --stage', { encoding: 'utf8' });
  const submoduleEntries = lsFiles.split('\n').filter(line => line.startsWith('160000'));
  
  if (submoduleEntries.length > 0) {
    console.error('❌ ERROR: Se encontraron referencias de submódulos:');
    submoduleEntries.forEach(entry => {
      const path = entry.split('\t')[1];
      console.error(`   - ${path}`);
    });
    console.error('\n💡 Ejecuta: node scripts/fix-submodules-complete.mjs');
    hasErrors = true;
  } else {
    console.log('   ✅ No hay referencias de submódulos');
  }
} catch (error) {
  console.error('   ⚠️  Error al verificar submódulos');
}

// 2. Verificar archivos grandes en staging
console.log('\n2️⃣ Verificando archivos grandes...');
try {
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\n')
    .filter(f => f.trim());
  
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  const largeFiles = [];
  
  for (const file of stagedFiles) {
    if (existsSync(file)) {
      const stats = statSync(file);
      if (stats.size > MAX_SIZE) {
        largeFiles.push({
          path: file,
          size: (stats.size / 1024 / 1024).toFixed(2) + ' MB'
        });
      }
    }
  }
  
  if (largeFiles.length > 0) {
    console.error('❌ ERROR: Archivos demasiado grandes para commit:');
    largeFiles.forEach(({ path, size }) => {
      console.error(`   - ${path} (${size})`);
    });
    console.error('\n💡 Agrega estos archivos a .gitignore');
    hasErrors = true;
  } else {
    console.log('   ✅ No hay archivos grandes en staging');
  }
} catch (error) {
  console.log('   ℹ️  No se pudieron verificar archivos grandes');
}

// 3. Verificar que .gitmodules está limpio
console.log('\n3️⃣ Verificando .gitmodules...');
if (existsSync('.gitmodules')) {
  try {
    const gitmodules = execSync('git config --file .gitmodules --list', { encoding: 'utf8' });
    if (gitmodules.trim()) {
      console.error('❌ ERROR: .gitmodules contiene configuración de submódulos');
      console.error('\n💡 Ejecuta: node scripts/fix-submodules-complete.mjs');
      hasErrors = true;
    } else {
      console.log('   ✅ .gitmodules está limpio');
    }
  } catch (error) {
    console.log('   ✅ .gitmodules está limpio');
  }
} else {
  console.log('   ✅ No existe .gitmodules');
}

// Resultado final
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.error('❌ Pre-commit check FALLÓ');
  console.error('   Corrige los errores antes de hacer commit');
  process.exit(1);
} else {
  console.log('✅ Pre-commit check EXITOSO');
  console.log('   Puedes proceder con el commit');
}
console.log('='.repeat(60) + '\n');
