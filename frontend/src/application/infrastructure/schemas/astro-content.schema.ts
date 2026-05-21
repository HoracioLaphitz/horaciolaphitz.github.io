/**
 * Astro Content Collection Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from "zod";

/**
 * Schema for project data from Astro Content Collections
 */
export const ProyectoDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  pubDate: z.date(),
  author: z.string().min(1, "Author is required"),
  github: z.string().url().optional(),
  dashboard: z.string().url().optional(),
  draft: z.boolean().default(false),
});

/**
 * Schema for a complete project entry (slug + data)
 */
export const ProyectoEntrySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  data: ProyectoDataSchema,
});

/**
 * Schema for array of project entries
 */
export const ProyectoEntriesArraySchema = z.array(ProyectoEntrySchema);

/**
 * Inferred TypeScript types from schemas
 */
export type ValidatedProyectoData = z.infer<typeof ProyectoDataSchema>;
export type ValidatedProyectoEntry = z.infer<typeof ProyectoEntrySchema>;
export type ValidatedProyectoEntriesArray = z.infer<
  typeof ProyectoEntriesArraySchema
>;
