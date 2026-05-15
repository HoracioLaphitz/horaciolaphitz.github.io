#!/usr/bin/env node

/**
 * Script para corregir el remote de Git
 * 
 * Cambia de: hache22/hache22.github.io
 * A: horaciolaphitz/HoracioLaphitz.github.io
 */

import { execSync } from 'child_process';

console.log('🔧 Fix Git Remote');
console.log('═'.repeat(60));

// Verificar remote actual
console.log('📍 Remote actual:');
try {
  const currentRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  console.log(`   ${currentRemote}`);
} catch (error) {
  console.log('   ❌ Error obteniendo remote');
  process.exit(1);
}

console.log();

// Configurar nuevo remote
const newRemote = 'https://github.com/horaciolaphitz/HoracioLaphitz.github.io.git';

console.log('🔄 Actualizando remote...');
console.log(`   Nuevo: ${newRemote}`);

try {
  execSync(`git remote set-url origin ${newRemote}`, { encoding: 'utf-8' });
  console.log('   ✅ Remote actualizado');
} catch (error) {
  console.log('   ❌ Error actualizando remote');
  process.exit(1);
}

console.log();

// Verificar cambio
console.log('✅ Verificación:');
try {
  const verifyRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  console.log(`   ${verifyRemote}`);
  
  if (verifyRemote === newRemote) {
    console.log('   ✅ Remote configurado correctamente');
  } else {
    console.log('   ⚠️  Remote no coincide con el esperado');
  }
} catch (error) {
  console.log('   ❌ Error verificando remote');
}

console.log();
console.log('═'.repeat(60));
console.log('📝 Próximos pasos:');
console.log('   1. Verificar acceso: git fetch origin');
console.log('   2. Si falla, configurar SSH o token de acceso');
console.log('   3. Continuar con: node scripts/fix-github-pages-deploy.mjs');
console.log('═'.repeat(60));
