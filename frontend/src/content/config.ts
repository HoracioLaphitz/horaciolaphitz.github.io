import { z, defineCollection } from 'astro:content';

const proyectosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    featured: z.boolean().optional().default(false),
    status: z.enum(['completed', 'in-progress', 'planned']).optional().default('completed'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    githubUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    technologies: z.array(z.string()).optional().default([]),
  }),
});

export const collections = {
  proyectos: proyectosCollection,
};
