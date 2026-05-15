/**
 * Use Case: Filter Projects
 * Business logic for filtering projects by category and search query
 */

import type { ProjectEntity } from "@domain/entities/project.entity";
import type { SearchQuery } from "@domain/value-objects/search-query.vo";

export interface FilterProjectsInput {
  projects: ProjectEntity[];
  category: string;
  searchQuery: SearchQuery;
}

export class FilterProjectsUseCase {
  execute(input: FilterProjectsInput): ProjectEntity[] {
    let filtered = [...input.projects];

    // Filter by category
    if (input.category !== "all") {
      filtered = filtered.filter((project) =>
        project.matchesCategory(input.category)
      );
    }

    // Filter by search query
    if (!input.searchQuery.isEmpty()) {
      filtered = filtered.filter((project) =>
        project.matchesSearch(input.searchQuery.getValue())
      );
    }

    // Only publishable projects
    filtered = filtered.filter((project) => project.isPublishable());

    return filtered;
  }
}
