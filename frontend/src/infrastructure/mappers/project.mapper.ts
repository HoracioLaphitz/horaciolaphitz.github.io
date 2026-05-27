import { Project, ProjectStatus } from '@domain/entities/Project';
import type { ProjectAsset } from '@domain/entities/Project';
import type { Technology } from '@domain/entities/Project';
import type { ProjectListDTO, ProjectDetailDTO } from '../dto/project.dto';

function toDate(dateStr: string): Date {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function toStatus(status: string): ProjectStatus {
  switch (status) {
    case 'in-progress':
      return ProjectStatus.InProgress;
    case 'planned':
      return ProjectStatus.Planned;
    default:
      return ProjectStatus.Completed;
  }
}

export function mapProjectList(dto: ProjectListDTO): Project {
  return new Project(
    dto.id,
    dto.slug,
    dto.title,
    dto.description,
    dto.category,
    toStatus(dto.status),
    dto.featured,
    (dto.assets || []) as ProjectAsset[],
    (dto.technologies || []).map(
      (t): Technology => ({ name: t.name, slug: t.slug, iconUrl: t.icon_url })
    ),
    toDate(dto.created_at),
    toDate(dto.updated_at),
    dto.github_url,
    dto.demo_url
  );
}

export function mapProjectDetail(dto: ProjectDetailDTO): Project {
  return mapProjectList(dto);
}

export function mapProjectListArray(dtos: ProjectListDTO[]): Project[] {
  return dtos.map(mapProjectList);
}
