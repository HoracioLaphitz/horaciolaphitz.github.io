/**
 * Application Service: Project
 * Orchestrates use cases and provides high-level operations
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";
import { GetAllProjectsUseCase } from "@domain/use-cases/projects/get-all-projects.use-case";
import { GetFeaturedProjectsUseCase } from "@domain/use-cases/projects/get-featured-projects.use-case";
import { FilterProjectsUseCase } from "@domain/use-cases/projects/filter-projects.use-case";
import { GetProjectCategoriesUseCase } from "@domain/use-cases/projects/get-project-categories.use-case";
import { SearchQuery } from "@domain/value-objects/search-query.vo";

export class ProjectService {
  private readonly getAllProjectsUseCase: GetAllProjectsUseCase;
  private readonly getFeaturedProjectsUseCase: GetFeaturedProjectsUseCase;
  private readonly filterProjectsUseCase: FilterProjectsUseCase;
  private readonly getProjectCategoriesUseCase: GetProjectCategoriesUseCase;

  constructor(private readonly projectRepository: IProjectRepository) {
    this.getAllProjectsUseCase = new GetAllProjectsUseCase(projectRepository);
    this.getFeaturedProjectsUseCase = new GetFeaturedProjectsUseCase(
      projectRepository
    );
    this.filterProjectsUseCase = new FilterProjectsUseCase();
    this.getProjectCategoriesUseCase = new GetProjectCategoriesUseCase();
  }

  async getAllProjects(): Promise<ProjectEntity[]> {
    return this.getAllProjectsUseCase.execute();
  }

  async getFeaturedProjects(): Promise<ProjectEntity[]> {
    return this.getFeaturedProjectsUseCase.execute();
  }

  async getProjectBySlug(slug: string): Promise<ProjectEntity | null> {
    return this.projectRepository.findBySlug(slug);
  }

  filterProjects(
    projects: ProjectEntity[],
    category: string,
    searchQuery: string
  ): ProjectEntity[] {
    return this.filterProjectsUseCase.execute({
      projects,
      category,
      searchQuery: SearchQuery.create(searchQuery),
    });
  }

  getCategories(projects: ProjectEntity[]): string[] {
    return this.getProjectCategoriesUseCase.execute(projects);
  }
}
