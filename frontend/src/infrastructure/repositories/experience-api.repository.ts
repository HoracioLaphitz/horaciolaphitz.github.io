import type { IExperienceRepository } from '@domain/repositories/IExperienceRepository';
import type { Experience } from '@domain/entities/Experience';
import { api } from '../api/client';
import type { ExperienceDTO } from '../dto/experience.dto';
import { mapExperienceArray } from '../mappers/experience.mapper';

export class ExperienceApiRepository implements IExperienceRepository {
  async findAll(): Promise<Experience[]> {
    const data = await api.get<ExperienceDTO[]>('/experience');
    return mapExperienceArray(data);
  }
}
