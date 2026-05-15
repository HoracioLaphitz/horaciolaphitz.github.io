#!/usr/bin/env node

/**
 * Script para validar el formato de READMEs con frontmatter
 *
 * Uso:
 *   node scripts/validate-readme.mjs <archivo-readme>
 *   node scripts/validate-readme.mjs README.md
 */

import fs from "fs/promises";
import path from "path";

// Valores válidos
const VALID_CATEGORIES = [
  "Predictive Analytics",
  "Business Intelligence",
  "Data Visualization",
  "Machine Learning",
  "Data Engineering",
  "Exploratory Data Analysis",
];

const VALID_DOMAINS = [
  "Healthcare",
  "Retail",
  "Finance",
  "Manufacturing",
  "Gaming",
  "HR Analytics",
  "Marketing Analytics",
  "Government & Public Policy",
  "Agriculture & AgTech",
  "Technology & SaaS",
  "General",
];

const VALID_STATUS = ["completed", "in-progress", "archived"];

/**
 * Parsear frontmatter de un README
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      hasFrontmatter: false,
      metadata: {},
      errors: ["No se encontró frontmatter"],
    };
  }

  const [, frontmatter] = match;
  const metadata = {};
  const errors = [];

  frontmatter.split("\n").forEach((line, index) => {
    if (!line.trim()) return;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      errors.push(`Línea ${index + 1}: Formato inválido (falta ':')`);
      return;
    }

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    if (!value) {
      errors.push(`Línea ${index + 1}: Valor vacío para '${key}'`);
      return;
    }

    // Parsear valores
    if (value.includes(",")) {
      metadata[key] = value.split(",").map((v) => v.trim());
    } else if (value === "true" || value === "false") {
      metadata[key] = value === "true";
    } else {
      metadata[key] = value;
    }
  });

  return { hasFrontmatter: true, metadata, errors };
}

/**
 * Validar metadatos
 */
function validateMetadata(metadata) {
  const errors = [];
  const warnings = [];

  // Validar campos requeridos
  const requiredFields = ["category", "domain", "featured", "tags", "status"];
  requiredFields.forEach((field) => {
    if (!(field in metadata)) {
      errors.push(`Campo requerido faltante: '${field}'`);
    }
  });

  // Validar category
  if (metadata.category && !VALID_CATEGORIES.includes(metadata.category)) {
    errors.push(
      `Categoría inválida: '${
        metadata.category
      }'. Valores válidos: ${VALID_CATEGORIES.join(", ")}`
    );
  }

  // Validar domain
  if (metadata.domain && !VALID_DOMAINS.includes(metadata.domain)) {
    errors.push(
      `Dominio inválido: '${
        metadata.domain
      }'. Valores válidos: ${VALID_DOMAINS.join(", ")}`
    );
  }

  // Validar featured
  if (
    metadata.featured !== undefined &&
    typeof metadata.featured !== "boolean"
  ) {
    errors.push(
      `'featured' debe ser true o false, recibido: '${metadata.featured}'`
    );
  }

  // Validar tags
  if (metadata.tags) {
    if (!Array.isArray(metadata.tags)) {
      errors.push(`'tags' debe ser una lista separada por comas`);
    } else if (metadata.tags.length === 0) {
      warnings.push(`'tags' está vacío, considera agregar al menos 3 tags`);
    } else if (metadata.tags.length < 3) {
      warnings.push(
        `Solo ${metadata.tags.length} tags, considera agregar más (recomendado: 3-5)`
      );
    }
  }

  // Validar status
  if (metadata.status && !VALID_STATUS.includes(metadata.status)) {
    errors.push(
      `Estado inválido: '${
        metadata.status
      }'. Valores válidos: ${VALID_STATUS.join(", ")}`
    );
  }

  return { errors, warnings };
}

/**
 * Validar descripción
 */
function validateDescription(content) {
  const errors = [];
  const warnings = [];

  // Remover frontmatter
  const contentWithoutFrontmatter = content.replace(
    /^---\s*\n[\s\S]*?\n---\s*\n/,
    ""
  );

  // Buscar primer título
  const titleMatch = contentWithoutFrontmatter.match(/^#\s+(.+)$/m);
  if (!titleMatch) {
    errors.push("No se encontró título principal (# Título)");
  }

  // Buscar primera descripción
  const lines = contentWithoutFrontmatter.split("\n");
  let descriptionFound = false;
  let descriptionLength = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Saltar título y líneas vacías
    if (line.startsWith("#") || line === "") continue;

    // Primera línea de contenido es la descripción
    if (!descriptionFound) {
      descriptionFound = true;
      descriptionLength = line.length;

      if (descriptionLength < 50) {
        warnings.push(
          `Descripción muy corta (${descriptionLength} caracteres). Recomendado: 100-300`
        );
      } else if (descriptionLength > 500) {
        warnings.push(
          `Descripción muy larga (${descriptionLength} caracteres). Recomendado: 100-300`
        );
      }

      break;
    }
  }

  if (!descriptionFound) {
    errors.push("No se encontró descripción después del título");
  }

  return { errors, warnings };
}

/**
 * Función principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Error: Debes proporcionar la ruta al archivo README");
    console.log("\nUso:");
    console.log("  node scripts/validate-readme.mjs <archivo-readme>");
    console.log("\nEjemplo:");
    console.log("  node scripts/validate-readme.mjs README.md");
    process.exit(1);
  }

  const filePath = args[0];

  try {
    // Leer archivo
    const content = await fs.readFile(filePath, "utf-8");

    console.log("🔍 Validando README...\n");
    console.log("📄 Archivo:", filePath);
    console.log("📏 Tamaño:", content.length, "caracteres\n");

    // Parsear frontmatter
    const {
      hasFrontmatter,
      metadata,
      errors: parseErrors,
    } = parseFrontmatter(content);

    if (!hasFrontmatter) {
      console.log("❌ FRONTMATTER NO ENCONTRADO\n");
      parseErrors.forEach((error) => console.log(`   - ${error}`));
      console.log("\n💡 Agrega frontmatter al inicio del archivo:");
      console.log("---");
      console.log("category: Machine Learning");
      console.log("domain: Healthcare");
      console.log("featured: true");
      console.log("tags: Python, TensorFlow, Deep Learning");
      console.log("status: completed");
      console.log("---\n");
      process.exit(1);
    }

    console.log("✅ Frontmatter encontrado\n");

    // Mostrar metadatos
    console.log("📋 METADATOS ENCONTRADOS:");
    Object.entries(metadata).forEach(([key, value]) => {
      const displayValue = Array.isArray(value) ? value.join(", ") : value;
      console.log(`   ${key}: ${displayValue}`);
    });
    console.log();

    // Validar metadatos
    const { errors: metadataErrors, warnings: metadataWarnings } =
      validateMetadata(metadata);

    // Validar descripción
    const { errors: descErrors, warnings: descWarnings } =
      validateDescription(content);

    // Combinar errores y warnings
    const allErrors = [...parseErrors, ...metadataErrors, ...descErrors];
    const allWarnings = [...metadataWarnings, ...descWarnings];

    // Mostrar resultados
    if (allErrors.length > 0) {
      console.log("❌ ERRORES ENCONTRADOS:");
      allErrors.forEach((error) => console.log(`   - ${error}`));
      console.log();
    }

    if (allWarnings.length > 0) {
      console.log("⚠️  ADVERTENCIAS:");
      allWarnings.forEach((warning) => console.log(`   - ${warning}`));
      console.log();
    }

    if (allErrors.length === 0 && allWarnings.length === 0) {
      console.log("✅ ¡README VÁLIDO!");
      console.log(
        "\n🎉 El README está correctamente formateado y listo para sincronizar.\n"
      );
      process.exit(0);
    } else if (allErrors.length === 0) {
      console.log("✅ README VÁLIDO (con advertencias)");
      console.log(
        "\n💡 El README funcionará, pero considera revisar las advertencias.\n"
      );
      process.exit(0);
    } else {
      console.log("❌ README INVÁLIDO");
      console.log("\n🔧 Corrige los errores antes de sincronizar.\n");
      process.exit(1);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`❌ Error: Archivo no encontrado: ${filePath}`);
    } else {
      console.error("❌ Error al leer el archivo:", error.message);
    }
    process.exit(1);
  }
}

// Ejecutar
main();
