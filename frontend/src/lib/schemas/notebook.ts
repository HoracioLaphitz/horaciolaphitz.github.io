import { z } from 'astro/zod';

export const NotebookAssetSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});

export const NotebookManifestSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  has_notebook: z.boolean(),    notebook_url: z.string().nullable().optional().transform(v => v ?? undefined),
    html_url: z.string().nullable().optional().transform(v => v ?? undefined),
  assets: z.array(NotebookAssetSchema),
});

export const NotebooksManifestSchema = z.array(NotebookManifestSchema);
