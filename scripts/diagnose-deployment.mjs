#!/usr/bin/env node

/**
 * Diagnostic script for GitHub Pages deployment
 * Checks repository status, GitHub Pages configuration, and workflow status
 */

import { Octokit } from '@octokit/rest';
import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// ANSI color codes for terminal output
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

function getRepoInfo() {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
  } catch (error) {
    log('❌ Error getting repository info from git remote', 'red');
  }
  return null;
}

function readAstroConfig() {
  try {
    if (!existsSync('./astro.config.mjs')) {
      return null;
    }
    const content = readFileSync('./astro.config.mjs', 'utf-8');
    
    // Extract site and base from config
    const siteMatch = content.match(/site:\s*["']([^"']+)["']/);
    const baseMatch = content.match(/base:\s*["']([^"']+)["']/);
    
    return {
      site: siteMatch ? siteMatch[1] : null,
      base: baseMatch ? baseMatch[1] : null,
    };
  } catch (error) {
    log('❌ Error reading astro.config.mjs', 'red');
    return null;
  }
}

async function checkRepository(octokit, owner, repo) {
  log('\n📦 Checking Repository...', 'cyan');
  
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    
    log(`✅ Repository exists: ${data.html_url}`, 'green');
    log(`   Visibility: ${data.private ? '🔒 Private' : '🌐 Public'}`, data.private ? 'yellow' : 'green');
    log(`   Default branch: ${data.default_branch}`, 'blue');
    
    if (data.private) {
      log('⚠️  Warning: GitHub Pages requires a public repository on free plan', 'yellow');
    }
    
    return {
      exists: true,
      isPublic: !data.private,
      url: data.html_url,
      defaultBranch: data.default_branch,
    };
  } catch (error) {
    log(`❌ Repository not found or not accessible`, 'red');
    log(`   Error: ${error.message}`, 'red');
    return {
      exists: false,
      isPublic: false,
      url: null,
      defaultBranch: null,
    };
  }
}

async function checkGitHubPages(octokit, owner, repo) {
  log('\n🌐 Checking GitHub Pages...', 'cyan');
  
  try {
    const { data } = await octokit.repos.getPages({ owner, repo });
    
    log(`✅ GitHub Pages is enabled`, 'green');
    log(`   URL: ${data.html_url}`, 'blue');
    log(`   Build type: ${data.build_type || 'legacy'}`, 'blue');
    log(`   Status: ${data.status || 'unknown'}`, 'blue');
    
    if (data.build_type !== 'workflow') {
      log('⚠️  Warning: Build type should be "workflow" for GitHub Actions', 'yellow');
      log('   Go to Settings → Pages → Source → GitHub Actions', 'yellow');
    }
    
    return {
      enabled: true,
      source: data.build_type || 'legacy',
      url: data.html_url,
      status: data.status,
    };
  } catch (error) {
    if (error.status === 404) {
      log(`❌ GitHub Pages is not enabled`, 'red');
      log('   Enable it in: Settings → Pages → Source → GitHub Actions', 'yellow');
    } else {
      log(`❌ Error checking GitHub Pages: ${error.message}`, 'red');
    }
    
    return {
      enabled: false,
      source: 'none',
      url: null,
      status: null,
    };
  }
}

async function checkWorkflow(octokit, owner, repo) {
  log('\n⚙️  Checking GitHub Actions Workflow...', 'cyan');
  
  try {
    // Check if workflow file exists
    const workflowPath = '.github/workflows/deploy.yml';
    if (!existsSync(workflowPath)) {
      log(`❌ Workflow file not found: ${workflowPath}`, 'red');
      return {
        exists: false,
        lastRun: null,
      };
    }
    
    log(`✅ Workflow file exists: ${workflowPath}`, 'green');
    
    // Get workflow runs
    const { data: workflows } = await octokit.actions.listRepoWorkflows({ owner, repo });
    const deployWorkflow = workflows.workflows.find(w => w.path.includes('deploy'));
    
    if (!deployWorkflow) {
      log('⚠️  Deploy workflow not found in GitHub Actions', 'yellow');
      return {
        exists: true,
        lastRun: null,
      };
    }
    
    // Get latest run
    const { data: runs } = await octokit.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: deployWorkflow.id,
      per_page: 1,
    });
    
    if (runs.workflow_runs.length === 0) {
      log('⚠️  No workflow runs found', 'yellow');
      return {
        exists: true,
        lastRun: null,
      };
    }
    
    const lastRun = runs.workflow_runs[0];
    const statusIcon = lastRun.conclusion === 'success' ? '✅' : '❌';
    const statusColor = lastRun.conclusion === 'success' ? 'green' : 'red';
    
    log(`${statusIcon} Last run: ${lastRun.conclusion}`, statusColor);
    log(`   Date: ${new Date(lastRun.created_at).toLocaleString()}`, 'blue');
    log(`   URL: ${lastRun.html_url}`, 'blue');
    
    if (lastRun.conclusion !== 'success') {
      log('⚠️  Last deployment failed. Check the workflow logs for details.', 'yellow');
    }
    
    return {
      exists: true,
      lastRun: {
        status: lastRun.conclusion,
        date: lastRun.created_at,
        url: lastRun.html_url,
      },
    };
  } catch (error) {
    log(`❌ Error checking workflow: ${error.message}`, 'red');
    return {
      exists: false,
      lastRun: null,
    };
  }
}

function checkConfiguration() {
  log('\n🔧 Checking Local Configuration...', 'cyan');
  
  const astroConfig = readAstroConfig();
  const gitRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
  
  if (astroConfig) {
    log(`✅ Astro configuration found`, 'green');
    log(`   Site: ${astroConfig.site || 'not set'}`, astroConfig.site ? 'blue' : 'yellow');
    log(`   Base: ${astroConfig.base || 'not set'}`, astroConfig.base ? 'blue' : 'yellow');
    
    if (!astroConfig.site) {
      log('⚠️  Warning: site is not configured in astro.config.mjs', 'yellow');
    }
    
    if (astroConfig.base === undefined) {
      log('⚠️  Warning: base is not configured in astro.config.mjs', 'yellow');
    }
  } else {
    log(`❌ Astro configuration not found`, 'red');
  }
  
  log(`✅ Git remote: ${gitRemote}`, 'green');
  
  return {
    astroConfig,
    gitRemote,
  };
}

async function main() {
  log('🔍 GitHub Pages Deployment Diagnostic', 'cyan');
  log('=====================================\n', 'cyan');
  
  // Check for GITHUB_TOKEN
  if (!process.env.GITHUB_TOKEN) {
    log('⚠️  GITHUB_TOKEN not found in environment', 'yellow');
    log('   Some checks will be limited without authentication', 'yellow');
    log('   Set GITHUB_TOKEN to get full diagnostic information\n', 'yellow');
  }
  
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  // Get repository info
  const repoInfo = getRepoInfo();
  if (!repoInfo) {
    log('❌ Could not determine repository information', 'red');
    log('   Make sure you are in a git repository with a GitHub remote', 'red');
    process.exit(1);
  }
  
  log(`Repository: ${repoInfo.owner}/${repoInfo.repo}\n`, 'blue');
  
  // Run all checks
  const results = {
    repository: await checkRepository(octokit, repoInfo.owner, repoInfo.repo),
    githubPages: await checkGitHubPages(octokit, repoInfo.owner, repoInfo.repo),
    workflow: await checkWorkflow(octokit, repoInfo.owner, repoInfo.repo),
    configuration: checkConfiguration(),
  };
  
  // Summary
  log('\n📊 Summary', 'cyan');
  log('==========', 'cyan');
  
  const issues = [];
  const warnings = [];
  
  if (!results.repository.exists) {
    issues.push('Repository not accessible');
  }
  
  if (results.repository.exists && !results.repository.isPublic) {
    warnings.push('Repository is private (requires paid plan for Pages)');
  }
  
  if (!results.githubPages.enabled) {
    issues.push('GitHub Pages is not enabled');
  }
  
  if (results.githubPages.enabled && results.githubPages.source !== 'workflow') {
    warnings.push('GitHub Pages source should be set to GitHub Actions');
  }
  
  if (!results.workflow.exists) {
    issues.push('Workflow file not found');
  }
  
  if (results.workflow.lastRun && results.workflow.lastRun.status !== 'success') {
    issues.push('Last workflow run failed');
  }
  
  if (!results.configuration.astroConfig?.site) {
    warnings.push('Astro site URL not configured');
  }
  
  if (issues.length === 0 && warnings.length === 0) {
    log('\n✅ No issues found! Deployment should be working.', 'green');
    if (results.githubPages.url) {
      log(`\n🌐 Your site should be available at: ${results.githubPages.url}`, 'cyan');
    }
  } else {
    if (issues.length > 0) {
      log('\n❌ Issues found:', 'red');
      issues.forEach(issue => log(`   • ${issue}`, 'red'));
    }
    
    if (warnings.length > 0) {
      log('\n⚠️  Warnings:', 'yellow');
      warnings.forEach(warning => log(`   • ${warning}`, 'yellow'));
    }
    
    log('\n📝 Next steps:', 'cyan');
    log('   1. Fix the issues listed above', 'blue');
    log('   2. Run this diagnostic again to verify', 'blue');
    log('   3. Check the deployment documentation for help', 'blue');
  }
  
  log(''); // Empty line at the end
}

main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
