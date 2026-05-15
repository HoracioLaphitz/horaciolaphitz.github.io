/**
 * Common Types
 * Shared type definitions across layers
 */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams<T> {
  field: keyof T;
  order: "asc" | "desc";
}

/**
 * GitHub API Types
 */
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: "public" | "private";
}
