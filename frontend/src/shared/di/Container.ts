import { ProjectRepository } from '@infrastructure/repositories/ProjectRepository';
import { TechnologyRepository } from '@infrastructure/repositories/TechnologyRepository';
import { ExperienceRepository } from '@infrastructure/repositories/ExperienceRepository';
import { ProjectService } from '@application/services/ProjectService';
import { TechnologyService } from '@application/services/TechnologyService';
import { ExperienceService } from '@application/services/ExperienceService';

class Container {
  private static instance: Container;

  private projectRepository = new ProjectRepository();
  private technologyRepository = new TechnologyRepository();
  private experienceRepository = new ExperienceRepository();

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  getProjectService(): ProjectService {
    return new ProjectService(this.projectRepository);
  }

  getTechnologyService(): TechnologyService {
    return new TechnologyService(this.technologyRepository);
  }

  getExperienceService(): ExperienceService {
    return new ExperienceService(this.experienceRepository);
  }
}

export const container = Container.getInstance();
