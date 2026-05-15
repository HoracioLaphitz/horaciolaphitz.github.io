#!/usr/bin/env node

/**
 * Script para verificar el estado del deploy
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

async function checkGitStatus() {
  log('\n📊 Estado de Git', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const { stdout: branch } = await execAsync('git branch --show-current');
    log(`Rama actual: ${branch.trim()}`, 'yellow');
    
    const { stdout: status } = await execAsync('git status --porcelain');
    if (status.trim()) {
      log('⚠️  Hay cambios sin commitear:', 'yellow');
      console.log(status);
    } else {
      log('✅ No hay cambios pendientes', 'green');
    }
    
    const { stdout: lastCommit } = await execAsync('git log -1 --oneline');
    log(`\nÚltimo commit: ${lastCommit.trim()}`, 'yellow');
    
  } catch (error) {
    log('❌ Error al verificar Git', 'red');
  }
}

async function checkBuildStatus() {
  log('\n🏗️  Estado del Build', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const distPath = path.join(process.cwd(), 'dist');
    
    if (fs.existsSync(distPath)) {
      const stats = fs.statSync(distPath);
      const files = fs.readdirSync(distPath);
      
      log('✅ Build existe', 'green');
      log(`Archivos: ${files.length}`, 'yellow');
      log(`Última modificación: ${stats.mtime.toLocaleString()}`, 'yellow');
    } else {
      log('⚠️  No hay build. Ejecuta: pnpm build', 'yellow');
    }
  } catch (error) {
    log('❌ Error al verificar build', 'red');
  }
}

async function checkRemoteBranches() {
  log('\n🌐 Ramas Remotas', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const { stdout } = await execAsync('git branch -r');
    const branches = stdout.trim().split('\n').map(b => b.trim());
    
    const hasGhPages = branches.some(b => b.includes('gh-pages'));
    const hasMain = branches.some(b => b.includes('main'));
    const hasMaster = branches.some(b => b.includes('master'));
    
    if (hasGhPages) {
      log('✅ Rama gh-pages existe', 'green');
    } else {
      log('⚠️  Rama gh-pages no existe (se creará en el primer deploy)', 'yellow');
    }
    
    if (hasMain) {
      log('✅ Rama main existe', 'green');
    } else if (hasMaster) {
      log('⚠️  Usando rama master (considera renombrar a main)', 'yellow');
    }
    
  } catch (error) {
    log('❌ Error al verificar ramas remotas', 'red');
  }
}

async function showDeployInfo() {
  log('\n🚀 Información de Deploy', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const { stdout } = await execAsync('git remote get-url origin');
    const repoUrl = stdout.trim();
    
    // Extraer usuario/repo de la URL
    const match = repoUrl.match(/github\.com[:/](.+?)\.git/);
    if (match) {
      const [, userRepo] = match;
      const siteUrl = `https://${userRepo.split('/')[0]}.github.io`;
      
      log(`Repositorio: ${repoUrl}`, 'yellow');
      log(`Sitio: ${siteUrl}`, 'green');
      log(`\nPara deployar: pnpm run deploy`, 'cyan');
    }
  } catch (error) {
    log('❌ Error al obtener información del repositorio', 'red');
  }
}

async function showNextSteps() {
  log('\n📋 Próximos Pasos', 'cyan');
  log('─'.repeat(50), 'cyan');
  
  try {
    const { stdout: status } = await execAsync('git status --porcelain');
    
    if (status.trim()) {
      log('1. Commitear cambios:', 'yellow');
      log('   git add .', 'reset');
      log('   git commit -m "feat: descripción"', 'reset');
      log('2. Deploy:', 'yellow');
      log('   pnpm run deploy', 'reset');
    } else {
      const fs = await import('fs');
      const distExists = fs.existsSync('dist');
      
      if (!distExists) {
        log('1. Build del proyecto:', 'yellow');
        log('   pnpm build', 'reset');
        log('2. Deploy:', 'yellow');
        log('   pnpm run deploy', 'reset');
      } else {
        log('✅ Todo listo para deploy:', 'green');
        log('   pnpm run deploy', 'reset');
      }
    }
  } catch (error) {
    log('❌ Error al determinar próximos pasos', 'red');
  }
}

async function main() {
  log('\n🔍 Verificación de Deploy', 'cyan');
  log('═'.repeat(50), 'cyan');
  
  await checkGitStatus();
  await checkBuildStatus();
  await checkRemoteBranches();
  await showDeployInfo();
  await showNextSteps();
  
  log('\n' + '═'.repeat(50), 'cyan');
  log('✅ Verificación completada\n', 'green');
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
