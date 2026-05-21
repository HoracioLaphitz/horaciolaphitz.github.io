import { Technology } from '@domain/entities/Technology';
import type { TechnologyDTO } from '../dto/TechnologyDTO';

export class TechnologyMapper {
  static toDomain(dto: TechnologyDTO): Technology {
    return new Technology(
      dto.id,
      dto.name,
      dto.slug,
      dto.icon_url,
      dto.category,
      new Date(dto.created_at),
      dto.project_count
    );
  }

  static toDomainArray(dtos: TechnologyDTO[]): Technology[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}
