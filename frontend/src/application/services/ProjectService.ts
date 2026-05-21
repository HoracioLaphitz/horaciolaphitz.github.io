import type { IProjectRepository } from '@domain/repositories/IProjectRepository';
import type { Project } from '@domain/entities/Project';

export class ProjectService {
  constructor(private repository: IProjectRepository) {}

  async getAllProjects(): Promise<Project[]> {
    return this.repository.findAll();
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return this.repository.findBySlug(slug);
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.repository.findFeatured();
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    if (category === 'all') {
      return this.getAllProjects();
    }
    return this.repository.findByCategory(category);
  }

  filterProjects(projects: Project[], searchQuery: string, category: string): Project[] {
    return projects.filter((project) => {
      const matchesSearch = project.matchesSearch(searchQuery);
      const matchesCategory = project.matchesCategory(category);
      return matchesSearch && matchesCategory && project.isPublishable();
    });
  }
}
