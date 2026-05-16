/**
 * Use Case: Get Featured Projects
 * Business logic for retrieving featured projects
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";

export class GetFeaturedProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) { }

  async execute(): Promise<ProjectEntity[]> {
    const allProjects = await this.projectRepository.findAll();

    return allProjects
      .filter((project) => project.isFeatured())
      .sort(
        (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
      );
  }
}
