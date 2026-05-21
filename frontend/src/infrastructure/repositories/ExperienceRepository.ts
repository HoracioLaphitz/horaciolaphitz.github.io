import type { IExperienceRepository } from '@domain/repositories/IExperienceRepository';
import type { Experience } from '@domain/entities/Experience';
import { apiClient } from '../api/ApiClient';
import { ExperienceMapper } from '../mappers/ExperienceMapper';
import type { ExperienceDTO } from '../dto/ExperienceDTO';

export class ExperienceRepository implements IExperienceRepository {
  async findAll(): Promise<Experience[]> {
    const dtos = await apiClient.get<ExperienceDTO[]>('/api/v1/experience');
    return ExperienceMapper.toDomainArray(dtos);
  }
}
