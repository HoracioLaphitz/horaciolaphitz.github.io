#!/usr/bin/env node

/**
 * Setup Git Hooks
 * 
 * Configura hooks de Git para validación automática
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';

const HOOKS_DIR = '.git/hooks';
const PRE_COMMIT_HOOK = join(HOOKS_DIR, 'pre-commit');

const PRE_COMMIT_SCRIPT = `#!/bin/sh

echo "🔍 Ejecutando validaciones pre-commit..."

# Validar tamaños de archivo
node scripts/validate-file-sizes.mjs

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Validación de tamaños falló"
  echo "💡 Revisa los archivos listados arriba"
  echo "💡 Mueve archivos grandes a carpetas excluidas"
  echo "💡 Actualiza .gitignore si es necesario"
  echo ""
  echo "Para saltear esta validación (NO RECOMENDADO):"
  echo "git commit --no-verify"
  echo ""
  exit 1
fi

echo "✅ Validaciones pre-commit completadas"
`;

function setupHooks() {
  console.log('🔧 Configurando Git hooks...\n');

  // Verificar que estamos en un repositorio Git
  if (!existsSync('.git')) {
    console.error('❌ No se encontró repositorio Git');
    console.error('   Ejecuta este script desde la raíz del proyecto');
    process.exit(1);
  }

  // Crear directorio de hooks si no existe
  if (!existsSync(HOOKS_DIR)) {
    mkdirSync(HOOKS_DIR, { recursive: true });
  }

  // Crear pre-commit hook
  writeFileSync(PRE_COMMIT_HOOK, PRE_COMMIT_SCRIPT);
  
  // Hacer el hook ejecutable (Unix/Mac)
  if (process.platform !== 'win32') {
    chmodSync(PRE_COMMIT_HOOK, '755');
  }

  console.log('✅ Pre-commit hook instalado');
  console.log(`   Ubicación: ${PRE_COMMIT_HOOK}`);
  console.log('');
  console.log('📋 El hook ejecutará:');
  console.log('   - Validación de tamaños de archivo');
  console.log('   - Verificación de archivos grandes');
  console.log('');
  console.log('💡 Para saltear validación (NO RECOMENDADO):');
  console.log('   git commit --no-verify');
  console.log('');
}

try {
  setupHooks();
  console.log('✅ Git hooks configurados exitosamente\n');
} catch (error) {
  console.error('❌ Error configurando hooks:', error.message);
  process.exit(1);
}
