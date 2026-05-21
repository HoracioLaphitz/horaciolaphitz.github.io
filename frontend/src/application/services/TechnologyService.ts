import type { ITechnologyRepository } from '@domain/repositories/ITechnologyRepository';
import type { Technology } from '@domain/entities/Technology';

export class TechnologyService {
  constructor(private repository: ITechnologyRepository) {}

  async getAllTechnologies(): Promise<Technology[]> {
    return this.repository.findAll();
  }

  async getTechnologyBySlug(slug: string): Promise<Technology | null> {
    return this.repository.findBySlug(slug);
  }

  getTechnologiesByCategory(technologies: Technology[]): Map<string, Technology[]> {
    const grouped = new Map<string, Technology[]>();

    technologies.forEach((tech) => {
      const category = tech.category || 'Other';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(tech);
    });

    return grouped;
  }
}
