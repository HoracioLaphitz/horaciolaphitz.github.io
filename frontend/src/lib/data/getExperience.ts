/**
 * Loader: Experience
 * Importa el manifest de experiencia desde src/data/generated/experience.json
 * Valida contra schema Zod en build-time.
 * Fuente de verdad: src/data/profile-data.ts
 */

import { z } from 'astro/zod';
import experienceData from '@data/generated/experience.json';
import {
  ExperienceManifestSchema,
  ExperienceItemSchema,
  CertificationItemSchema,
  EducationItemSchema,
} from '../schemas';

export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type CertificationItem = z.infer<typeof CertificationItemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type ExperienceManifest = z.infer<typeof ExperienceManifestSchema>;

const result = ExperienceManifestSchema.safeParse(experienceData);

if (!result.success) {
  console.error('[getExperience] Zod validation failed:');
  for (const issue of result.error.issues) {
    console.error(`  - Path: ${issue.path.join('.')} | ${issue.message}`);
  }
  throw new Error(
    `Experience manifest validation failed with ${result.error.issues.length} error(s). Check src/data/generated/experience.json`
  );
}

const experience = result.data;

export function getExperiences(): ExperienceItem[] {
  return experience.experiences;
}

export function getCertifications(): CertificationItem[] {
  return experience.certifications;
}

export function getEducation(): EducationItem[] {
  return experience.education;
}
