/**
 * View Model: Project
 * Transforms domain entities to presentation-ready data
 */

import type { ProjectEntity } from "@domain/entities/project.entity";
import type { ProjectDTO, ProjectCardDTO } from "@application/dto/project.dto";

export class ProjectViewModel {
  static toDTO(entity: ProjectEntity): ProjectDTO {
    return {
      slug: entity.slug,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      tags: [...entity.tags],
      publishDate: entity.publishDate.toISOString(),
      author: entity.author,
      githubUrl: entity.githubUrl,
      dashboardUrl: entity.dashboardUrl,
    };
  }

  static toCardDTO(entity: ProjectEntity): ProjectCardDTO {
    return {
      slug: entity.slug,
      title: entity.title,
      description: entity.description,
      category: entity.category,
      tags: [...entity.tags],
      github: entity.githubUrl,
      dashboard: entity.dashboardUrl,
    };
  }

  static toDTOArray(entities: ProjectEntity[]): ProjectDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  static toCardDTOArray(entities: ProjectEntity[]): ProjectCardDTO[] {
    return entities.map((entity) => this.toCardDTO(entity));
  }

  /**
   * Converts domain entities to Astro Content Collection format
   * Used for backward compatibility with existing components
   */
  static toAstroContentFormat(entities: ProjectEntity[]) {
    return entities.map((entity) => ({
      slug: entity.slug,
      data: {
        title: entity.title,
        description: entity.description,
        category: entity.category,
        tags: [...entity.tags],
        pubDate: entity.publishDate,
        author: entity.author,
        github: entity.githubUrl,
        dashboard: entity.dashboardUrl,
      },
    }));
  }
}
