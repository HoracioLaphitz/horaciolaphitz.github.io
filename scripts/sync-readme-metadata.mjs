#!/usr/bin/env node

/**
 * Script para sincronizar metadatos de proyectos con READMEs de GitHub
 *
 * Este script:
 * 1. Lee la configuración de proyectos desde src/data/projects.ts
 * 2. Para cada proyecto, obtiene el README actual de GitHub
 * 3. Agrega o actualiza el frontmatter con los metadatos correctos
 * 4. Genera un archivo con los READMEs actualizados para revisión
 *
 * Uso:
 *   node scripts/sync-readme-metadata.mjs
 */

import { Octokit } from "@octokit/rest";
import fs from "fs/promises";
import path from "path";

const GITHUB_USERNAME = "HoracioLaphitz";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Opcional, pero recomendado para evitar rate limits

// Configuración de proyectos (copiada de src/data/projects.ts)
const projectConfigs = [
  {
    githubRepo: "cancer_issue",
    category: "Machine Learning",
    domain: "Healthcare",
    featured: true,
    tags: [
      "Python",
      "TensorFlow",
      "Deep Learning",
      "Computer Vision",
      "Healthcare Analytics",
    ],
    status: "completed",
  },
  {
    githubRepo: "MarketBasketAnalytics",
    category: "Exploratory Data Analysis",
    domain: "Retail",
    featured: true,
    tags: [
      "Python",
      "Association Rules",
      "Retail Analytics",
      "Data Mining",
      "Business Intelligence",
    ],
    status: "completed",
  },
  {
    githubRepo: "EDA_IBM",
    category: "Exploratory Data Analysis",
    domain: "HR Analytics",
    featured: true,
    tags: [
      "Python",
      "Pandas",
      "Data Visualization",
      "HR Analytics",
      "Statistical Analysis",
    ],
    status: "completed",
  },
];

// Inicializar Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/**
 * Obtener README de un repositorio
 */
async function getReadme(repoName) {
  try {
    const { data } = await octokit.repos.getReadme({
      owner: GITHUB_USERNAME,
      repo: repoName,
    });

    // Decodificar contenido base64
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return content;
  } catch (error) {
    console.error(`❌ Error obteniendo README de ${repoName}:`, error.message);
    return null;
  }
}

/**
 * Agregar o actualizar frontmatter en README
 */
function updateReadmeWithFrontmatter(readmeContent, metadata) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const hasFrontmatter = frontmatterRegex.test(readmeContent);

  // Crear nuevo frontmatter
  const frontmatter = `---
category: ${metadata.category}
domain: ${metadata.domain}
featured: ${metadata.featured}
tags: ${metadata.tags.join(", ")}
status: ${metadata.status}
---

`;

  if (hasFrontmatter) {
    // Reemplazar frontmatter existente
    return readmeContent.replace(frontmatterRegex, frontmatter);
  } else {
    // Agregar frontmatter al inicio
    return frontmatter + readmeContent;
  }
}

/**
 * Procesar todos los proyectos
 */
async function syncAllProjects() {
  console.log("🚀 Iniciando sincronización de metadatos...\n");

  const results = [];

  for (const project of projectConfigs) {
    console.log(`📦 Procesando: ${project.githubRepo}`);

    const readme = await getReadme(project.githubRepo);

    if (!readme) {
      console.log(`⚠️  No se pudo obtener README, saltando...\n`);
      continue;
    }

    const updatedReadme = updateReadmeWithFrontmatter(readme, {
      category: project.category,
      domain: project.domain,
      featured: project.featured,
      tags: project.tags,
      status: project.status,
    });

    results.push({
      repo: project.githubRepo,
      original: readme,
      updated: updatedReadme,
      changed: readme !== updatedReadme,
    });

    console.log(`✅ Procesado correctamente\n`);
  }

  return results;
}

/**
 * Guardar resultados en archivos
 */
async function saveResults(results) {
  const outputDir = path.join(process.cwd(), "scripts", "readme-updates");

  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directorio ya existe
  }

  for (const result of results) {
    if (result.changed) {
      const filename = path.join(outputDir, `${result.repo}_README.md`);
      await fs.writeFile(filename, result.updated, "utf-8");
      console.log(`💾 Guardado: ${filename}`);
    }
  }

  // Crear archivo de resumen
  const summary = results.map((r) => ({
    repo: r.repo,
    changed: r.changed,
    url: `https://github.com/${GITHUB_USERNAME}/${r.repo}`,
  }));

  const summaryPath = path.join(outputDir, "summary.json");
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf-8");
  console.log(`\n📊 Resumen guardado: ${summaryPath}`);
}

/**
 * Función principal
 */
async function main() {
  try {
    const results = await syncAllProjects();

    console.log("\n" + "=".repeat(60));
    console.log("📈 RESUMEN DE SINCRONIZACIÓN");
    console.log("=".repeat(60));

    const changedCount = results.filter((r) => r.changed).length;
    const unchangedCount = results.length - changedCount;

    console.log(`\n✅ Proyectos procesados: ${results.length}`);
    console.log(`📝 READMEs actualizados: ${changedCount}`);
    console.log(`✔️  READMEs sin cambios: ${unchangedCount}`);

    if (changedCount > 0) {
      await saveResults(results);

      console.log("\n" + "=".repeat(60));
      console.log("📋 PRÓXIMOS PASOS");
      console.log("=".repeat(60));
      console.log(
        "\n1. Revisa los archivos generados en scripts/readme-updates/"
      );
      console.log("2. Para cada README actualizado:");
      console.log("   - Abre el repositorio en GitHub");
      console.log("   - Edita el README.md");
      console.log("   - Copia el contenido del archivo generado");
      console.log("   - Guarda los cambios (commit)");
      console.log("\n3. Espera 5 minutos para que el cache se actualice");
      console.log("4. Refresca tu portfolio para ver los cambios\n");
    } else {
      console.log("\n✨ Todos los READMEs ya tienen el formato correcto!\n");
    }
  } catch (error) {
    console.error("\n❌ Error durante la sincronización:", error);
    process.exit(1);
  }
}

// Ejecutar
main();
