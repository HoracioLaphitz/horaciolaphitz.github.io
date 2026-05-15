#!/usr/bin/env node

/**
 * ============================================================================
 * BUILD PREPARATION SCRIPT
 * ============================================================================
 * Prepares the project for build by:
 * 1. Fetching GitHub repositories (with caching)
 * 2. Generating build metadata
 * 3. Validating build prerequisites
 * 
 * Build Metadata Includes:
 * - Version from package.json
 * - Build timestamp
 * - Git commit hash
 * - Git branch name
 * - Node.js version
 * 
 * This metadata is used for:
 * - Debugging deployment issues
 * - Tracking build history
 * - Cache busting
 * - Version display in UI
 * ============================================================================
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const GITHUB_DATA_PATH = path.join(__dirname, "..", "src", "data", "github-repos-simple.json");
const BUILD_METADATA_PATH = path.join(__dirname, "..", "src", "build-metadata.json");
const PACKAGE_JSON_PATH = path.join(__dirname, "..", "package.json");

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if a cached file is still valid
 * @param {string} filePath - Path to the cached file
 * @returns {boolean} - True if cache is valid, false otherwise
 */
const isCacheValid = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stats = fs.statSync(filePath);
    const now = new Date().getTime();
    const fileTime = new Date(stats.mtime).getTime();
    return now - fileTime < CACHE_DURATION;
  } catch {
    return false;
  }
};

/**
 * Runs a shell command and handles errors
 * @param {string} command - Command to execute
 * @param {string} description - Human-readable description
 */
const runCommand = (command, description) => {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}`);
    throw error;
  }
};

/**
 * Safely executes a git command
 * @param {string} command - Git command to execute
 * @param {string} fallback - Fallback value if command fails
 * @returns {string} - Command output or fallback
 */
const safeGitCommand = (command, fallback = "unknown") => {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (error) {
    console.warn(`⚠️  Git command failed: ${command}`);
    return fallback;
  }
};

// ============================================================================
// GITHUB REPOSITORIES FETCHING
// ============================================================================

console.log("🔨 Preparando build...\n");
console.log("═".repeat(60));

// Check if GitHub data needs to be fetched
if (!isCacheValid(GITHUB_DATA_PATH)) {
  console.log("\n📡 Caché de GitHub expirado o no existe");
  runCommand("node scripts/get-github-repos.mjs", "Obteniendo repositorios de GitHub");
} else {
  console.log("\n✅ Usando caché de GitHub (menos de 24h)");
  const stats = fs.statSync(GITHUB_DATA_PATH);
  const age = Math.round((Date.now() - stats.mtime) / (1000 * 60 * 60));
  console.log(`   Edad del caché: ${age} horas\n`);
}

// ============================================================================
// BUILD METADATA GENERATION
// ============================================================================

console.log("📝 Generando metadata de build...\n");

// Read package.json
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, "utf-8"));
} catch (error) {
  console.error("❌ Error leyendo package.json:", error.message);
  process.exit(1);
}

// Gather build metadata
const buildMetadata = {
  // Version from package.json
  version: packageJson.version || "0.0.0",
  
  // Build timestamp (ISO 8601 format)
  buildTime: new Date().toISOString(),
  
  // Git information
  git: {
    commit: safeGitCommand("git rev-parse HEAD"),
    commitShort: safeGitCommand("git rev-parse --short HEAD"),
    branch: safeGitCommand("git rev-parse --abbrev-ref HEAD"),
    tag: safeGitCommand("git describe --tags --abbrev=0", null),
    isDirty: safeGitCommand("git status --porcelain") !== "",
  },
  
  // Environment information
  environment: {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    ci: process.env.CI === "true",
    githubActions: process.env.GITHUB_ACTIONS === "true",
  },
  
  // Build configuration
  build: {
    mode: process.env.NODE_ENV || "production",
    timestamp: Date.now(),
  },
};

// Write metadata to file
try {
  fs.writeFileSync(
    BUILD_METADATA_PATH,
    JSON.stringify(buildMetadata, null, 2),
    "utf-8"
  );
  console.log("✅ Metadata de build generada:");
  console.log(`   Version: ${buildMetadata.version}`);
  console.log(`   Commit: ${buildMetadata.git.commitShort}`);
  console.log(`   Branch: ${buildMetadata.git.branch}`);
  console.log(`   Node: ${buildMetadata.environment.nodeVersion}`);
  console.log(`   Timestamp: ${buildMetadata.buildTime}\n`);
} catch (error) {
  console.error("❌ Error escribiendo metadata:", error.message);
  process.exit(1);
}

// ============================================================================
// BUILD PREREQUISITES VALIDATION
// ============================================================================

console.log("🔍 Validando prerequisitos de build...\n");

// Check if required directories exist
const requiredDirs = ["src", "public"];
for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`❌ Directorio requerido no encontrado: ${dir}`);
    process.exit(1);
  }
}
console.log("✅ Directorios requeridos existen");

// Check if required files exist
const requiredFiles = ["package.json", "astro.config.mjs"];
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, "..", file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Archivo requerido no encontrado: ${file}`);
    process.exit(1);
  }
}
console.log("✅ Archivos requeridos existen");

// ============================================================================
// COMPLETION
// ============================================================================

console.log("\n═".repeat(60));
console.log("✅ Preparación de build completada exitosamente\n");
console.log("📦 Listo para ejecutar: pnpm build\n");
