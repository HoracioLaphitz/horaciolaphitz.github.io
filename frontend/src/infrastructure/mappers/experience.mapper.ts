import { Experience } from '@domain/entities/Experience';
import type { ExperienceDTO } from '../dto/experience.dto';

function toDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function mapExperience(dto: ExperienceDTO): Experience {
  return new Experience(
    dto.id,
    dto.company,
    dto.role,
    toDate(dto.start_date) ?? new Date(),
    toDate(dto.end_date),
    dto.description,
    dto.achievements || [],
    toDate(dto.created_at) ?? new Date(),
    toDate(dto.updated_at) ?? new Date()
  );
}

export function mapExperienceArray(dtos: ExperienceDTO[]): Experience[] {
  return dtos.map(mapExperience);
}
