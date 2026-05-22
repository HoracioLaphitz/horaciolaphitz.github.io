import { z } from 'astro/zod';

export const ExperienceItemSchema = z.object({
  period: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string(),
  description: z.string(),
});

export const CertificationItemSchema = z.object({
  period: z.string().min(1),
  title: z.string().min(1),
  issuer: z.string().min(1),
  certificateUrl: z.string().nullable(),
});

export const EducationItemSchema = z.object({
  period: z.string().min(1),
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string(),
});

export const ExperienceManifestSchema = z.object({
  experiences: z.array(ExperienceItemSchema),
  certifications: z.array(CertificationItemSchema),
  education: z.array(EducationItemSchema),
});
