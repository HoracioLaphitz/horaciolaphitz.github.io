/**
 * Repository Interface: IProjectRepository
 * Abstraction for data access (Dependency Inversion Principle)
 */

import type { ProjectEntity } from "@domain/entities/project.entity";

export interface IProjectRepository {
  findAll(): Promise<ProjectEntity[]>;
  findBySlug(slug: string): Promise<ProjectEntity | null>;
  findFeatured(): Promise<ProjectEntity[]>;
  findByCategory(category: string): Promise<ProjectEntity[]>;
}
