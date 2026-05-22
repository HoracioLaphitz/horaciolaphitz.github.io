import { z } from 'astro/zod';

export const ProjectTechnologySchema = z.object({
  name: z.string().min(1),
});

export const ProjectManifestSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  category: z.string().min(1),
  featured: z.boolean(),
  status: z.string(),
  technologies: z.array(ProjectTechnologySchema),
  githubUrl: z.string().url().nullable(),
  demoUrl: z.string().url().nullable(),
});

export const ProjectsManifestSchema = z.array(ProjectManifestSchema);
