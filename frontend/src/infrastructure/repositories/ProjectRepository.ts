import type { IProjectRepository } from '@domain/repositories/IProjectRepository';
import type { Project } from '@domain/entities/Project';
import { apiClient } from '../api/ApiClient';
import { ProjectMapper } from '../mappers/ProjectMapper';
import type { ProjectDTO } from '../dto/ProjectDTO';

export class ProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    const dtos = await apiClient.get<ProjectDTO[]>('/api/v1/projects');
    return ProjectMapper.toDomainArray(dtos);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    try {
      const dto = await apiClient.get<ProjectDTO>(`/api/v1/projects/${slug}`);
      return ProjectMapper.toDomain(dto);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async findFeatured(): Promise<Project[]> {
    const dtos = await apiClient.get<ProjectDTO[]>('/api/v1/projects/featured');
    return ProjectMapper.toDomainArray(dtos);
  }

  async findByCategory(category: string): Promise<Project[]> {
    const dtos = await apiClient.get<ProjectDTO[]>(`/api/v1/projects?category=${category}`);
    return ProjectMapper.toDomainArray(dtos);
  }
}
