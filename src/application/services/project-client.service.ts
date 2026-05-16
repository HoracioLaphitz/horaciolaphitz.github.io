/**
 * Project Client Service
 * Service for client-side operations that don't require data fetching
 *
 * This service works with data already loaded from the server
 * and provides filtering, sorting, and categorization logic
 */

import type { ProjectEntity } from "@domain/entities/project.entity";
import { FilterProjectsUseCase } from "@domain/use-cases/projects/filter-projects.use-case";
import { GetProjectCategoriesUseCase } from "@domain/use-cases/projects/get-project-categories.use-case";
import { SearchQuery } from "@domain/value-objects/search-query.vo";

export class ProjectClientService {
  private readonly filterProjectsUseCase: FilterProjectsUseCase;
  private readonly getProjectCategoriesUseCase: GetProjectCategoriesUseCase;

  constructor() {
    this.filterProjectsUseCase = new FilterProjectsUseCase();
    this.getProjectCategoriesUseCase = new GetProjectCategoriesUseCase();
  }

  /**
   * Filter projects by category and search query
   * @param projects - Array of project entities
   * @param category - Category to filter by, or "all" for no filter
   * @param searchQuery - Search query string
   * @returns Filtered array of projects
   */
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

  /**
   * Get all unique categories from projects
   * @param projects - Array of project entities
   * @returns Array of category names
   */
  getCategories(projects: ProjectEntity[]): string[] {
    return this.getProjectCategoriesUseCase.execute(projects);
  }

  /**
   * Get featured projects
   * @param projects - Array of project entities
   * @returns Array of featured projects
   */
  getFeaturedProjects(projects: ProjectEntity[]): ProjectEntity[] {
    return projects.filter((project) => project.isFeatured());
  }

  /**
   * Sort projects by date (newest first)
   * @param projects - Array of project entities
   * @returns Sorted array of projects
   */
  sortByDate(projects: ProjectEntity[]): ProjectEntity[] {
    return [...projects].sort(
      (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
    );
  }
}
