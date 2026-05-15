/**
 * Use Case: Get All Projects
 * Business logic for retrieving all publishable projects
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";

export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) { }

  async execute(): Promise<ProjectEntity[]> {
    const allProjects = await this.projectRepository.findAll();

    return allProjects
      .filter((project) => project.isPublishable())
      .sort(
        (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
      );
  }
}
