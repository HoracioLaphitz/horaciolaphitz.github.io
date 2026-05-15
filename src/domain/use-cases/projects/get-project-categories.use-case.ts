/**
 * Use Case: Get Project Categories
 * Business logic for extracting unique categories from projects
 */

import type { ProjectEntity } from "@domain/entities/project.entity";

export class GetProjectCategoriesUseCase {
  execute(projects: ProjectEntity[]): string[] {
    const categories = new Set<string>();

    projects.forEach((project) => {
      if (project.isPublishable()) {
        categories.add(project.category);
      }
    });

    return Array.from(categories).sort();
  }
}
