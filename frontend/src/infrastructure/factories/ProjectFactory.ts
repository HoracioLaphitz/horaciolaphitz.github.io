import { ProjectService } from '@application/services/ProjectService';
import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';

export class ProjectFactory {
  private static projectService: ProjectService | null = null;

  static getProjectService(): ProjectService {
    if (!this.projectService) {
      const repository = new ProjectRepository();
      this.projectService = new ProjectService(repository);
    }
    return this.projectService;
  }
}
