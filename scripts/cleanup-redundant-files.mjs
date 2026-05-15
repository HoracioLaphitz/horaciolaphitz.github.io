#!/usr/bin/env node

/**
 * Script para limpiar archivos redundantes del proyecto
 * - Archivos sin extensión en Notebooks/
 * - Documentación redundante (excepto los permitidos en .gitignore)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");

// Archivos sin extensión en Notebooks que deben ser renombrados o eliminados
const filesWithoutExtension = [
  "Proyectos/Notebooks/Banks_Project",
  "Proyectos/Notebooks/Celcius_a_Fahrenheit",
  "Proyectos/Notebooks/Clean_for_google_bigquery",
];

// Archivos duplicados (ya deberían estar eliminados, pero verificamos)
const duplicateFiles = [
  "Proyectos/Notebooks/Arboles De Decision(1).ipynb",
  "Proyectos/Notebooks/PROYECTO-FINAL(1).ipynb",
];

console.log("🧹 Iniciando limpieza de archivos redundantes...\n");

let removedCount = 0;
let renamedCount = 0;
let errorCount = 0;

// Eliminar archivos sin extensión
console.log("📁 Procesando archivos sin extensión...");
filesWithoutExtension.forEach((file) => {
  const filePath = path.join(projectRoot, file);

  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);

      // Verificar si es un archivo
      if (stats.isFile()) {
        // Leer primeras líneas para determinar si es notebook
        const content = fs.readFileSync(filePath, "utf-8").substring(0, 100);

        if (content.includes('"cells"') || content.includes('"nbformat"')) {
          // Es un notebook, renombrar
          const newPath = filePath + ".ipynb";
          fs.renameSync(filePath, newPath);
          console.log(`✓ Renombrado: ${file} → ${file}.ipynb`);
          renamedCount++;
        } else {
          // No es notebook, eliminar
          fs.unlinkSync(filePath);
          console.log(`✓ Eliminado: ${file}`);
          removedCount++;
        }
      }
    } else {
      console.log(`⚠ No encontrado: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error procesando ${file}:`, error.message);
    errorCount++;
  }
});

// Eliminar duplicados
console.log("\n📋 Procesando archivos duplicados...");
duplicateFiles.forEach((file) => {
  const filePath = path.join(projectRoot, file);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ Eliminado: ${file}`);
      removedCount++;
    } else {
      console.log(`⚠ Ya eliminado: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error eliminando ${file}:`, error.message);
    errorCount++;
  }
});

// Resumen
console.log("\n" + "=".repeat(60));
console.log("📊 RESUMEN DE LIMPIEZA");
console.log("=".repeat(60));
console.log(`✓ Archivos eliminados: ${removedCount}`);
console.log(`✓ Archivos renombrados: ${renamedCount}`);
console.log(`✗ Errores: ${errorCount}`);
console.log("");

if (errorCount === 0) {
  console.log("✅ Limpieza completada exitosamente\n");
} else {
  console.log("⚠️  Limpieza completada con errores\n");
  process.exit(1);
}
