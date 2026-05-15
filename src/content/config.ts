import { defineCollection, z } from "astro:content";

/**
 * Schema para métricas de impacto de proyectos
 * Nueva Identidad: Data & Strategy - Enfoque en resultados medibles
 */
const impactSchema = z
  .object({
    efficiencyGain: z.number().optional(),
    costSavings: z.string().optional(),
    timeReduction: z.string().optional(),
    revenueIncrease: z.string().optional(),
    customMetrics: z.record(z.union([z.string(), z.number()])).optional(),
  })
  .optional();

const proyectosCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("Horacio Laphitz"),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    github: z.string().optional(),
    dashboard: z.string().optional(),
    featured: z.boolean().default(false),
    impact: impactSchema,
    resources: z
      .object({
        notebooks: z
          .array(
            z.object({
              name: z.string(),
              path: z.string(),
              description: z.string().optional(),
            })
          )
          .optional(),
        pdfs: z
          .array(
            z.object({
              name: z.string(),
              path: z.string(),
              description: z.string().optional(),
            })
          )
          .optional(),
        datasets: z
          .array(
            z.object({
              name: z.string(),
              path: z.string(),
              description: z.string().optional(),
            })
          )
          .optional(),
      })
      .optional(),
  }),
});

export const collections = {
  proyectos: proyectosCollection,
};
