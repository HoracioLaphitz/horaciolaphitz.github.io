import { Project, ProjectStatus, type ProjectAsset } from '@domain/entities/Project';
import type { ProjectDTO } from '../dto/ProjectDTO';
import type { CollectionEntry } from 'astro:content';

export class ProjectMapper {
  static toDomain(dto: ProjectDTO): Project {
    return new Project(
      dto.id,
      dto.slug,
      dto.title,
      dto.description,
      dto.category,
      dto.status as ProjectStatus,
      dto.featured,
      (dto.assets as unknown as ProjectAsset[]),
      dto.technologies?.map((tech) => ({
        name: tech.name,
        slug: tech.slug,
        iconUrl: tech.icon_url,
      })) || [],
      new Date(dto.created_at),
      new Date(dto.updated_at),
      dto.github_url,
      dto.demo_url
    );
  }

  static toDomainArray(dtos: ProjectDTO[]): Project[] {
    return dtos.map((dto) => this.toDomain(dto));
  }

  static fromAstroCollection(entry: CollectionEntry<'proyectos'>): Project {
    const data = entry.data;
    return new Project(
      entry.id,
      entry.slug,
      data.title,
      data.description,
      data.category,
      (data.status as ProjectStatus) || ProjectStatus.Completed,
      data.featured || false,
      [], // assets
      data.technologies?.map((tech: string) => ({
        name: tech,
        slug: tech.toLowerCase().replace(/\s+/g, '-'),
      })) || [],
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date(),
      data.githubUrl,
      data.demoUrl
    );
  }

  static fromAstroCollectionArray(entries: CollectionEntry<'proyectos'>[]): Project[] {
    return entries.map((entry) => this.fromAstroCollection(entry));
  }
}
