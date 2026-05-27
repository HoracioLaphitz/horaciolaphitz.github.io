import type { IProjectRepository } from '@domain/repositories/IProjectRepository';
import type { Project } from '@domain/entities/Project';
import { api } from '../api/client';
import type { ProjectListDTO } from '../dto/project.dto';
import { mapProjectList, mapProjectListArray } from '../mappers/project.mapper';

export class ProjectApiRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    const data = await api.get<ProjectListDTO[]>('/projects');
    return mapProjectListArray(data);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    try {
      const data = await api.get<ProjectListDTO>(`/projects/${slug}`);
      return mapProjectList(data);
    } catch {
      return null;
    }
  }

  async findFeatured(): Promise<Project[]> {
    const data = await api.get<ProjectListDTO[]>('/projects/featured');
    return mapProjectListArray(data);
  }

  async findByCategory(category: string): Promise<Project[]> {
    const data = await api.get<ProjectListDTO[]>('/projects', { category });
    return mapProjectListArray(data);
  }
}
