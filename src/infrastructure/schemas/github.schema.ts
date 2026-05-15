/**
 * GitHub API Response Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from "zod";

/**
 * Schema for a single GitHub repository response
 */
export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable().or(z.literal("")),
  language: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  stargazers_count: z.number().int().nonnegative(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  pushed_at: z.string().datetime().nullable(),
  fork: z.boolean(),
  archived: z.boolean(),
  disabled: z.boolean().optional(),
  visibility: z.enum(["public", "private"]).optional(),
});

/**
 * Schema for array of GitHub repositories
 */
export const GitHubReposArraySchema = z.array(GitHubRepoSchema);

/**
 * Inferred TypeScript types from schemas
 */
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;
export type GitHubReposArray = z.infer<typeof GitHubReposArraySchema>;
