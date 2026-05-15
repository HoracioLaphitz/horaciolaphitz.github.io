#!/usr/bin/env node

/**
 * Script para corregir problemas de deploy a GitHub Pages
 * 
 * Problemas que resuelve:
 * 1. Archivos grandes en public/notebooks
 * 2. Configuración de base path en Astro
 * 3. Workflow de GitHub Actions
 * 
 * Uso:
 *   node scripts/fix-github-pages-deploy.mjs
 *   node scripts/fix-github-pages-deploy.mjs --dry-run
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

console.log('🔧 Fix GitHub Pages Deploy');
console.log('═'.repeat(60));
console.log(`Modo: ${DRY_RUN ? '🔍 DRY RUN (sin cambios)' : '✍️  APLICANDO CAMBIOS'}`);
console.log('═'.repeat(60));
console.log();

// ============================================================================
// PASO 1: Detectar nombre del repositorio y tipo
// ============================================================================

console.log('📦 Paso 1: Detectar configuración del repositorio');

let repoName = null;
let username = null;
let isUserPage = false;
let needsBasePath = false;

try {
  const gitRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  const match = gitRemote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
  
  if (match) {
    username = match[1];
    repoName = match[2];
    
    // Detectar si es un repositorio tipo username.github.io
    // Debe coincidir exactamente: username.github.io (case insensitive)
    const repoLower = repoName.toLowerCase();
    const usernameLower = username.toLowerCase();
    isUserPage = repoLower === `${usernameLower}.github.io` || 
                 repoLower.replace('.github.io', '') === usernameLower;
    needsBasePath = !isUserPage;
    
    console.log(`   Usuario: ${username}`);
    console.log(`   Repositorio: ${repoName}`);
    console.log(`   Tipo: ${isUserPage ? '👤 User Page (username.github.io)' : '📁 Project Page'}`);
    console.log(`   Base path necesario: ${needsBasePath ? '✅ Sí' : '❌ No'}`);
  } else {
    console.log(`   ⚠️  No se pudo detectar la configuración`);
  }
} catch (error) {
  console.log(`   ⚠️  Error detectando repo: ${error.message}`);
}

console.log();

// ============================================================================
// PASO 2: Limpiar notebooks grandes
// ============================================================================

console.log('🧹 Paso 2: Limpiar notebooks grandes de public/');

const notebooksDir = join(ROOT_DIR, 'public', 'notebooks');
let removedFiles = [];
let ipynbFiles = [];

if (existsSync(notebooksDir)) {
  const files = readdirSync(notebooksDir);
  ipynbFiles = files.filter(f => f.endsWith('.ipynb'));
  
  if (ipynbFiles.length > 0) {
    console.log(`   Encontrados ${ipynbFiles.length} notebooks:`);
    
    ipynbFiles.forEach(file => {
      const filePath = join(notebooksDir, file);
      const stats = existsSync(filePath) ? 
        { size: readFileSync(filePath).length } : 
        { size: 0 };
      
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   - ${file} (${sizeMB} MB)`);
      
      if (!DRY_RUN) {
        unlinkSync(filePath);
        removedFiles.push(file);
      }
    });
    
    if (!DRY_RUN) {
      console.log(`   ✅ Removidos ${removedFiles.length} notebooks`);
    } else {
      console.log(`   🔍 Se removerían ${ipynbFiles.length} notebooks`);
    }
  } else {
    console.log('   ✅ No hay notebooks para remover');
  }
} else {
  console.log('   ℹ️  Directorio public/notebooks no existe');
}

console.log();

// ============================================================================
// PASO 3: Actualizar astro.config.mjs
// ============================================================================

console.log('⚙️  Paso 3: Actualizar astro.config.mjs');

const astroConfigPath = join(ROOT_DIR, 'astro.config.mjs');
let astroConfig = readFileSync(astroConfigPath, 'utf-8');

// Verificar configuración de site
const currentSite = astroConfig.match(/site:\s*["']([^"']+)["']/);
const expectedSite = username ? `https://${username.toLowerCase()}.github.io` : null;

if (expectedSite && currentSite && currentSite[1] !== expectedSite) {
  console.log(`   📝 Actualizando site URL...`);
  console.log(`      Actual: ${currentSite[1]}`);
  console.log(`      Esperado: ${expectedSite}`);
  
  astroConfig = astroConfig.replace(
    /site:\s*["'][^"']+["']/,
    `site: "${expectedSite}"`
  );
  
  if (!DRY_RUN) {
    writeFileSync(astroConfigPath, astroConfig, 'utf-8');
    console.log('   ✅ Site URL actualizado');
  } else {
    console.log('   🔍 Se actualizaría el site URL');
  }
} else {
  console.log('   ✅ Site URL correcto');
}

// Verificar si ya tiene base configurado
const hasBase = astroConfig.includes('base:');

if (needsBasePath && !hasBase) {
  console.log('   📝 Agregando configuración de base path...');
  
  // Agregar base después de site
  astroConfig = astroConfig.replace(
    /site:\s*["'][^"']+["']/,
    `site: "${expectedSite}",\n  base: "/${repoName}"`
  );
  
  if (!DRY_RUN) {
    writeFileSync(astroConfigPath, astroConfig, 'utf-8');
    console.log('   ✅ Base path configurado');
  } else {
    console.log(`   🔍 Se agregaría: base: "/${repoName}"`);
  }
} else if (!needsBasePath && hasBase) {
  console.log('   📝 Removiendo base path (no necesario para user page)...');
  
  // Remover línea de base
  astroConfig = astroConfig.replace(/,?\s*base:\s*["'][^"']*["'],?\s*\n/g, '\n');
  
  if (!DRY_RUN) {
    writeFileSync(astroConfigPath, astroConfig, 'utf-8');
    console.log('   ✅ Base path removido');
  } else {
    console.log('   🔍 Se removería el base path');
  }
} else if (needsBasePath && hasBase) {
  console.log('   ✅ Base path ya configurado');
} else {
  console.log('   ✅ Base path no necesario (user page)');
}

// Verificar si tiene exclusión de notebooks
const hasNotebookExclusion = astroConfig.includes('external:') && 
                             astroConfig.includes('.ipynb');

if (!hasNotebookExclusion) {
  console.log('   📝 Agregando exclusión de notebooks...');
  
  // Buscar la sección de rollupOptions
  if (astroConfig.includes('rollupOptions:')) {
    // Ya existe rollupOptions, agregar external
    astroConfig = astroConfig.replace(
      /rollupOptions:\s*{/,
      `rollupOptions: {
        external: [
          /\\.ipynb$/,
          /notebooks\\//
        ],`
    );
  } else {
    // No existe rollupOptions, agregarlo
    astroConfig = astroConfig.replace(
      /build:\s*{/,
      `build: {
      rollupOptions: {
        external: [
          /\\.ipynb$/,
          /notebooks\\//
        ],
      },`
    );
  }
  
  if (!DRY_RUN) {
    writeFileSync(astroConfigPath, astroConfig, 'utf-8');
    console.log('   ✅ Exclusión de notebooks configurada');
  } else {
    console.log('   🔍 Se agregaría exclusión de notebooks');
  }
} else {
  console.log('   ✅ Exclusión de notebooks ya configurada');
}

console.log();

// ============================================================================
// PASO 4: Actualizar workflow de GitHub Actions
// ============================================================================

console.log('🔄 Paso 4: Actualizar workflow de GitHub Actions');

const workflowPath = join(ROOT_DIR, '.github', 'workflows', 'deploy.yml');
let workflow = readFileSync(workflowPath, 'utf-8');

let workflowChanged = false;

// Remover trigger de pull_request si existe
if (workflow.includes('pull_request:')) {
  console.log('   📝 Removiendo trigger de pull_request...');
  
  workflow = workflow.replace(
    /pull_request:\s*\n\s*branches:\s*\[main\]\s*\n/,
    ''
  );
  
  workflowChanged = true;
}

// Agregar condición al job de deploy si no existe
if (!workflow.includes("if: github.ref == 'refs/heads/main'")) {
  console.log('   📝 Agregando condición al deploy...');
  
  workflow = workflow.replace(
    /deploy:\s*\n\s*needs: build/,
    `deploy:
    needs: build
    if: github.ref == 'refs/heads/main'`
  );
  
  workflowChanged = true;
}

if (workflowChanged) {
  if (!DRY_RUN) {
    writeFileSync(workflowPath, workflow, 'utf-8');
    console.log('   ✅ Workflow actualizado');
  } else {
    console.log('   🔍 Se actualizaría el workflow');
  }
} else {
  console.log('   ✅ Workflow ya está correcto');
}

console.log();

// ============================================================================
// RESUMEN
// ============================================================================

console.log('═'.repeat(60));
console.log('📊 RESUMEN');
console.log('═'.repeat(60));

if (DRY_RUN) {
  console.log('🔍 Modo DRY RUN - No se aplicaron cambios');
  console.log();
  console.log('Cambios que se aplicarían:');
  console.log(`  - Remover ${removedFiles.length || ipynbFiles?.length || 'N'} notebooks de public/`);
  
  if (needsBasePath) {
    console.log(`  - Configurar base path: /${repoName}`);
  } else {
    console.log('  - Remover base path (user page)');
  }
  
  console.log('  - Excluir notebooks del build');
  console.log('  - Optimizar workflow de GitHub Actions');
  console.log();
  console.log('Para aplicar los cambios, ejecuta:');
  console.log('  node scripts/fix-github-pages-deploy.mjs');
} else {
  console.log('✅ Cambios aplicados exitosamente');
  console.log();
  console.log('Próximos pasos:');
  console.log('  1. Verificar cambios: git status');
  console.log('  2. Build local: pnpm run build');
  console.log('  3. Validar dist: pnpm run validate-dist');
  console.log('  4. Commit: git add . && git commit -m "fix: configure GitHub Pages deploy"');
  console.log('  5. Push: git push origin main');
  console.log('  6. Monitorear: GitHub Actions > Deploy to GitHub Pages');
  console.log();
  console.log('URLs esperadas:');
  
  if (isUserPage) {
    console.log(`  - Homepage: https://${username.toLowerCase()}.github.io/`);
    console.log(`  - Proyectos: https://${username.toLowerCase()}.github.io/proyectos/`);
  } else {
    console.log(`  - Homepage: https://${username.toLowerCase()}.github.io/${repoName}/`);
    console.log(`  - Proyectos: https://${username.toLowerCase()}.github.io/${repoName}/proyectos/`);
  }
}

console.log('═'.repeat(60));
