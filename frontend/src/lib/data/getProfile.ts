/**
 * Loader: Profile
 * Importa el manifest de perfil desde src/data/generated/profile.json
 * Valida contra schema Zod en build-time.
 * Fuente de verdad: src/data/profile-data.ts
 */

import { z } from 'astro/zod';
import profileData from '@data/generated/profile.json';
import {
  ProfileManifestSchema,
  ContactInfoSchema,
} from '../schemas';

export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type ProfileManifest = z.infer<typeof ProfileManifestSchema>;

const result = ProfileManifestSchema.safeParse(profileData);

if (!result.success) {
  console.error('[getProfile] Zod validation failed:');
  for (const issue of result.error.issues) {
    console.error(`  - Path: ${issue.path.join('.')} | ${issue.message}`);
  }
  throw new Error(
    `Profile manifest validation failed with ${result.error.issues.length} error(s). Check src/data/generated/profile.json`
  );
}

const profile = result.data;

export function getProfile(): ProfileManifest {
  return profile;
}

export function getProfileName(): string {
  return profile.name;
}

export function getProfileRole(): string {
  return profile.role;
}

export function getContactInfo(): ContactInfo {
  return profile.contact;
}

export function getSkills(): string[] {
  return profile.skills;
}
