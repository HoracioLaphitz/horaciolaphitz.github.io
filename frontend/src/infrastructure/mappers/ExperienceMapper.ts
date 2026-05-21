import { Experience } from '@domain/entities/Experience';
import type { ExperienceDTO } from '../dto/ExperienceDTO';

export class ExperienceMapper {
  static toDomain(dto: ExperienceDTO): Experience {
    return new Experience(
      dto.id,
      dto.company,
      dto.role,
      new Date(dto.start_date),
      dto.end_date ? new Date(dto.end_date) : null,
      dto.description,
      dto.achievements,
      new Date(dto.created_at),
      new Date(dto.updated_at)
    );
  }

  static toDomainArray(dtos: ExperienceDTO[]): Experience[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}
