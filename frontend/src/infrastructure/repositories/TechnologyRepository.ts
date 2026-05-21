import type { ITechnologyRepository } from '@domain/repositories/ITechnologyRepository';
import type { Technology } from '@domain/entities/Technology';
import { apiClient } from '../api/ApiClient';
import { TechnologyMapper } from '../mappers/TechnologyMapper';
import type { TechnologyDTO } from '../dto/TechnologyDTO';

export class TechnologyRepository implements ITechnologyRepository {
  async findAll(): Promise<Technology[]> {
    const dtos = await apiClient.get<TechnologyDTO[]>('/api/v1/technologies');
    return TechnologyMapper.toDomainArray(dtos);
  }

  async findBySlug(slug: string): Promise<Technology | null> {
    try {
      const dto = await apiClient.get<TechnologyDTO>(`/api/v1/technologies/${slug}`);
      return TechnologyMapper.toDomain(dto);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
}
