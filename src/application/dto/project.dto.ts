/**
 * Data Transfer Objects: Project
 * Interface between presentation and application layers
 */

export interface ProjectDTO {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishDate: string;
  author: string;
  githubUrl?: string;
  dashboardUrl?: string;
}

export interface ProjectCardDTO {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github?: string;
  dashboard?: string;
}

export interface ProjectFilterDTO {
  category: string;
  searchQuery: string;
}
