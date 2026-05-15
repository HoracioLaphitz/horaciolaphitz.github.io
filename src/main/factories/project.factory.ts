/**
 * Factory: Project
 * Simplifies creation of project-related instances
 */

import { container } from "@main/di/container";
import type { ProjectService } from "@application/services/project.service";

export class ProjectFactory {
  static getService(): ProjectService {
    return container.getProjectService();
  }

  static async getAllProjects() {
    const service = this.getService();
    return service.getAllProjects();
  }

  static async getFeaturedProjects() {
    const service = this.getService();
    return service.getFeaturedProjects();
  }

  static async getProjectBySlug(slug: string) {
    const service = this.getService();
    return service.getProjectBySlug(slug);
  }
}
