#!/usr/bin/env node

/**
 * Script de Verificación de Configuración de Deploy
 * 
 * Verifica que todo esté configurado correctamente para deploy a GitHub Pages
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Colores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function section(title) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`  ${title}`, 'blue');
  log('='.repeat(60), 'blue');
}

// Ejecutar comando y capturar output
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf-8', cwd: rootDir }).trim();
  } catch (err) {
    return null;
  }
}

// Verificaciones
const checks = {
  // 1. Verificar package.json
  packageJson: () => {
    section('1. Verificando package.json');
    const packagePath = join(rootDir, 'package.json');
    
    if (!existsSync(packagePath)) {
      error('package.json no encontrado');
      return false;
    }
    
    success('package.json encontrado');
    
    try {
      const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
      
      // Verificar scripts
      const requiredScripts = ['dev', 'build', 'preview'];
      const missingScripts = requiredScripts.filter(s => !pkg.scripts[s]);
      
      if (missingScripts.length > 0) {
        error(`Scripts faltantes: ${missingScripts.join(', ')}`);
        return false;
      }
      
      success('Scripts requeridos presentes');
      
      // Verificar dependencias
      if (!pkg.dependencies || !pkg.dependencies.astro) {
        error('Astro no está en dependencies');
        return false;
      }
      
      success(`Astro ${pkg.dependencies.astro} instalado`);
      
      return true;
    } catch (err) {
      error(`Error leyendo package.json: ${err.message}`);
      return false;
    }
  },

  // 2. Verificar astro.config.mjs
  astroConfig: () => {
    section('2. Verificando astro.config.mjs');
    const configPath = join(rootDir, 'astro.config.mjs');
    
    if (!existsSync(configPath)) {
      error('astro.config.mjs no encontrado');
      return false;
    }
    
    success('astro.config.mjs encontrado');
    
    try {
      const config = readFileSync(configPath, 'utf-8');
      
      // Verificar site
      if (!config.includes('site:')) {
        warning('Propiedad "site" no encontrada en config');
      } else {
        const siteMatch = config.match(/site:\s*["']([^"']+)["']/);
        if (siteMatch) {
          success(`Site configurado: ${siteMatch[1]}`);
        }
      }
      
      // Verificar base
      if (!config.includes('base:')) {
        warning('Propiedad "base" no encontrada en config');
      } else {
        const baseMatch = config.match(/base:\s*["']([^"']+)["']/);
        if (baseMatch) {
          success(`Base configurado: ${baseMatch[1]}`);
        }
      }
      
      // Verificar output
      if (config.includes('output: "static"') || config.includes("output: 'static'")) {
        success('Output configurado como "static"');
      } else {
        error('Output debe ser "static" para GitHub Pages');
        return false;
      }
      
      return true;
    } catch (err) {
      error(`Error leyendo astro.config.mjs: ${err.message}`);
      return false;
    }
  },

  // 3. Verificar .gitignore
  gitignore: () => {
    section('3. Verificando .gitignore');
    const gitignorePath = join(rootDir, '.gitignore');
    
    if (!existsSync(gitignorePath)) {
      error('.gitignore no encontrado');
      return false;
    }
    
    success('.gitignore encontrado');
    
    try {
      const gitignore = readFileSync(gitignorePath, 'utf-8');
      
      const requiredPatterns = ['node_modules/', 'dist/', '.env'];
      const missingPatterns = requiredPatterns.filter(p => !gitignore.includes(p));
      
      if (missingPatterns.length > 0) {
        error(`Patrones faltantes en .gitignore: ${missingPatterns.join(', ')}`);
        return false;
      }
      
      success('Patrones requeridos presentes en .gitignore');
      return true;
    } catch (err) {
      error(`Error leyendo .gitignore: ${err.message}`);
      return false;
    }
  },

  // 4. Verificar GitHub Actions workflow
  githubWorkflow: () => {
    section('4. Verificando GitHub Actions workflow');
    const workflowPath = join(rootDir, '.github', 'workflows', 'deploy.yml');
    
    if (!existsSync(workflowPath)) {
      error('Workflow de GitHub Actions no encontrado');
      info('Crea .github/workflows/deploy.yml');
      return false;
    }
    
    success('Workflow encontrado: .github/workflows/deploy.yml');
    
    try {
      const workflow = readFileSync(workflowPath, 'utf-8');
      
      // Verificar triggers
      if (workflow.includes('push:') && workflow.includes('branches: [main]')) {
        success('Trigger configurado para push a main');
      } else {
        warning('Trigger de push a main no encontrado');
      }
      
      // Verificar permissions
      if (workflow.includes('pages: write')) {
        success('Permisos de pages configurados');
      } else {
        error('Falta permiso "pages: write"');
        return false;
      }
      
      // Verificar jobs
      const hasValidate = workflow.includes('validate:') || workflow.includes('name: Pre-Deployment Validation');
      const hasBuild = workflow.includes('build:') || workflow.includes('name: Build Site');
      const hasDeploy = workflow.includes('deploy:') || workflow.includes('name: Deploy to GitHub Pages');
      
      if (hasValidate) success('Job "validate" encontrado');
      if (hasBuild) success('Job "build" encontrado');
      if (hasDeploy) success('Job "deploy" encontrado');
      
      if (!hasBuild || !hasDeploy) {
        error('Faltan jobs requeridos en el workflow');
        return false;
      }
      
      return true;
    } catch (err) {
      error(`Error leyendo workflow: ${err.message}`);
      return false;
    }
  },

  // 5. Verificar configuración de Git
  gitConfig: () => {
    section('5. Verificando configuración de Git');
    
    // Verificar que es un repositorio Git
    if (!existsSync(join(rootDir, '.git'))) {
      error('No es un repositorio Git');
      info('Ejecuta: git init');
      return false;
    }
    
    success('Repositorio Git inicializado');
    
    // Verificar user.name
    const userName = exec('git config user.name');
    if (!userName) {
      error('Git user.name no configurado');
      info('Ejecuta: git config --global user.name "Tu Nombre"');
      return false;
    }
    success(`Git user.name: ${userName}`);
    
    // Verificar user.email
    const userEmail = exec('git config user.email');
    if (!userEmail) {
      error('Git user.email no configurado');
      info('Ejecuta: git config --global user.email "tu@email.com"');
      return false;
    }
    success(`Git user.email: ${userEmail}`);
    
    // Verificar remote
    const remote = exec('git remote get-url origin');
    if (!remote) {
      warning('Remote "origin" no configurado');
      info('Ejecuta: git remote add origin <URL>');
    } else {
      success(`Remote origin: ${remote}`);
      
      // Verificar que es un repositorio de GitHub
      if (!remote.includes('github.com')) {
        warning('El remote no parece ser de GitHub');
      }
    }
    
    // Verificar rama actual
    const branch = exec('git branch --show-current');
    if (branch !== 'main') {
      warning(`Rama actual: ${branch} (se recomienda "main")`);
    } else {
      success('Rama actual: main');
    }
    
    return true;
  },

  // 6. Verificar node_modules
  nodeModules: () => {
    section('6. Verificando node_modules');
    const nodeModulesPath = join(rootDir, 'node_modules');
    
    if (!existsSync(nodeModulesPath)) {
      error('node_modules no encontrado');
      info('Ejecuta: pnpm install');
      return false;
    }
    
    success('node_modules encontrado');
    
    // Verificar que Astro está instalado
    const astroPath = join(nodeModulesPath, 'astro');
    if (!existsSync(astroPath)) {
      error('Astro no está instalado en node_modules');
      info('Ejecuta: pnpm install');
      return false;
    }
    
    success('Astro instalado en node_modules');
    return true;
  },

  // 7. Verificar que dist/ no está en Git
  distNotInGit: () => {
    section('7. Verificando que dist/ no está en Git');
    
    const distTracked = exec('git ls-files dist/');
    if (distTracked && distTracked.length > 0) {
      error('dist/ está siendo tracked por Git');
      info('Ejecuta:');
      info('  git rm -r --cached dist/');
      info('  git commit -m "chore: remove dist/ from git tracking"');
      return false;
    }
    
    success('dist/ no está en Git (correcto)');
    return true;
  },

  // 8. Test build local
  testBuild: () => {
    section('8. Verificando que el build funciona');
    
    info('Ejecutando build de prueba...');
    info('Esto puede tardar unos segundos...');
    
    const buildResult = exec('pnpm build 2>&1');
    
    if (!buildResult || buildResult.includes('error') || buildResult.includes('Error')) {
      error('El build falló');
      if (buildResult) {
        console.log('\nOutput del build:');
        console.log(buildResult);
      }
      return false;
    }
    
    success('Build exitoso');
    
    // Verificar que dist/ fue creado
    const distPath = join(rootDir, 'dist');
    if (!existsSync(distPath)) {
      error('dist/ no fue creado después del build');
      return false;
    }
    
    success('dist/ creado correctamente');
    
    // Verificar que index.html existe
    const indexPath = join(distPath, 'index.html');
    if (!existsSync(indexPath)) {
      error('dist/index.html no encontrado');
      return false;
    }
    
    success('dist/index.html encontrado');
    return true;
  },
};

// Ejecutar todas las verificaciones
async function main() {
  log('\n🔍 VERIFICACIÓN DE CONFIGURACIÓN DE DEPLOY\n', 'cyan');
  log('Este script verifica que tu proyecto esté configurado correctamente');
  log('para deploy a GitHub Pages.\n');

  const results = {};
  let allPassed = true;

  for (const [name, check] of Object.entries(checks)) {
    try {
      results[name] = check();
      if (!results[name]) {
        allPassed = false;
      }
    } catch (err) {
      error(`Error en verificación ${name}: ${err.message}`);
      results[name] = false;
      allPassed = false;
    }
  }

  // Resumen
  section('RESUMEN');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  log(`\nVerificaciones pasadas: ${passed}/${total}\n`);
  
  if (allPassed) {
    success('✨ ¡Todo está configurado correctamente!');
    log('\nPróximos pasos:', 'cyan');
    log('1. Hacer commit de cualquier cambio pendiente');
    log('2. Ejecutar: git push origin main');
    log('3. Configurar GitHub Pages en el repositorio');
    log('4. Verificar que el workflow se ejecute correctamente\n');
  } else {
    error('❌ Hay problemas que necesitan ser corregidos');
    log('\nRevisa los errores arriba y corrígelos antes de hacer deploy.\n', 'yellow');
    process.exit(1);
  }
}

main().catch(err => {
  error(`Error fatal: ${err.message}`);
  process.exit(1);
});
