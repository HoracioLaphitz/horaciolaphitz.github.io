import { z } from 'astro/zod';

export const ProjectTechnologySchema = z.object({
  name: z.string().min(1),
});

export const ProjectAssetSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
});

export const ProjectManifestSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  type: z.enum(['app', 'analysis']).default('app'),
  featured: z.boolean(),
  status: z.string(),
  technologies: z.array(ProjectTechnologySchema),
  githubUrl: z.string().url().nullable(),
  demoUrl: z.string().url().nullable(),
  notebookUrl: z.string().nullable().optional(),
  htmlUrl: z.string().nullable().optional(),
  assets: z.array(ProjectAssetSchema).optional(),
});

export const ProjectsManifestSchema = z.array(ProjectManifestSchema);
