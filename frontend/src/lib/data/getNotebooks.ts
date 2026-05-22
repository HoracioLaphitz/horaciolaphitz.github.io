/**
 * Loader: Notebooks
 * Importa el manifest de notebooks desde src/data/generated/notebooks.json
 * Valida contra schema Zod y maneja conversión null → undefined.
 * Fuente de verdad: public/Proyectos/ y public/notebooks-html/
 */

import { z } from 'astro/zod';
import notebooksData from '@data/generated/notebooks.json';
import {
  NotebooksManifestSchema,
  NotebookManifestSchema,
  NotebookAssetSchema,
} from '../schemas';

export type NotebookAsset = z.infer<typeof NotebookAssetSchema>;
export type NotebookManifest = z.infer<typeof NotebookManifestSchema>;

const result = NotebooksManifestSchema.safeParse(notebooksData);

if (!result.success) {
  console.error('[getNotebooks] Zod validation failed:');
  for (const issue of result.error.issues) {
    console.error(`  - Path: ${issue.path.join('.')} | ${issue.message}`);
  }
  throw new Error(
    `Notebooks manifest validation failed with ${result.error.issues.length} error(s). Check src/data/generated/notebooks.json`
  );
}

const notebooks = result.data;

export function getNotebooks(): NotebookManifest[] {
  return notebooks;
}

export function getNotebookBySlug(slug: string): NotebookManifest | undefined {
  return notebooks.find((n) => n.slug === slug);
}

export function getNotebooksWithHtml(): NotebookManifest[] {
  return notebooks.filter((n) => n.html_url);
}
