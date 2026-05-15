import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas
const GITHUB_DATA_PATH = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "github-repos-simple.json"
);

console.log("🔨 Preparando build de producción...\n");

// Función para verificar si el caché es válido
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

// Ejecutar script con manejo de errores
const runScript = (command, description) => {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: "inherit" });
    console.log(`✅ ${description} completado\n`);
  } catch (error) {
    console.error(`❌ Error en ${description}`);
    throw error;
  }
};

// 1. Fetch GitHub repos (con caché inteligente)
if (!isCacheValid(GITHUB_DATA_PATH)) {
  runScript(
    "node scripts/get-github-repos.mjs",
    "Obteniendo repositorios de GitHub"
  );
} else {
  console.log("✅ Usando caché de GitHub (menos de 24h)\n");
}

console.log("✅ Preparación completada, iniciando build...\n");
