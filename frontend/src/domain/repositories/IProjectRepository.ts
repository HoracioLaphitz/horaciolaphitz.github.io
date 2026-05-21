import type { Project } from '../entities/Project';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findFeatured(): Promise<Project[]>;
  findByCategory(category: string): Promise<Project[]>;
}
