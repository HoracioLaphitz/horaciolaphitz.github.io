/**
 * Astro Content Collection Types
 * Type definitions for Astro content collections
 *
 * NOTE: This file should ONLY be imported in server-side code (.astro files, API routes)
 * For client-side components, use ProyectoData interface instead
 */

/**
 * Data structure for project content
 * Safe to use in both server and client components
 */
export interface ProyectoData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  pubDate: Date;
  author: string;
  github?: string;
  dashboard?: string;
  draft?: boolean;
}

/**
 * Server-side only types
 * DO NOT import these in client components (.tsx files with 'use client' or React hooks)
 */
export interface ProyectoEntryServer {
  slug: string;
  data: ProyectoData;
}
