/**
 * Loader: Projects
 * Importa el manifest de proyectos generado desde src/data/generated/projects.json
 * Valida contra el schema Zod en build-time.
 * Fuente de verdad: src/content/proyectos/*.md
 */

import { z } from 'astro/zod';
import projectsData from '@data/generated/projects.json';
import {
  ProjectsManifestSchema,
  ProjectTechnologySchema,
  ProjectManifestSchema,
} from '../schemas';

export type ProjectTechnology = z.infer<typeof ProjectTechnologySchema>;
export type ProjectManifest = z.infer<typeof ProjectManifestSchema>;

const result = ProjectsManifestSchema.safeParse(projectsData);

if (!result.success) {
  console.error('[getProjects] Zod validation failed:');
  for (const issue of result.error.issues) {
    console.error(`  - Path: ${issue.path.join('.')} | ${issue.message}`);
  }
  throw new Error(
    `Projects manifest validation failed with ${result.error.issues.length} error(s). Check src/data/generated/projects.json`
  );
}

const projects = result.data;

export function getProjects(): ProjectManifest[] {
  return projects;
}

export function getFeaturedProjects(): ProjectManifest[] {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): ProjectManifest | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectCategories(): string[] {
  const categories = new Set(projects.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getProjectsByCategory(category: string): ProjectManifest[] {
  return projects.filter((p) => p.category === category);
}
