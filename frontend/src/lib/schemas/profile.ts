import { z } from 'astro/zod';

export const ContactInfoSchema = z.object({
  email: z.string(),
  location: z.string(),
  linkedin: z.string(),
  github: z.string(),
  credly: z.string(),
});

export const ProfileManifestSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  descriptions: z.array(z.string()),
  descriptions_about: z.array(z.string()).optional(),
  contact: ContactInfoSchema,
  skills: z.array(z.string()),
});
