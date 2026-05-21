import type { IExperienceRepository } from '@domain/repositories/IExperienceRepository';
import type { Experience } from '@domain/entities/Experience';
import type { ExperienceDTO } from '@infrastructure/dto/ExperienceDTO';

export class ExperienceService {
  constructor(private repository: IExperienceRepository) { }

  async getAllExperiences(): Promise<Experience[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
  }
}
