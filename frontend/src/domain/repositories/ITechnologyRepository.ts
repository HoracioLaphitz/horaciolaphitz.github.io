import type { Technology } from '../entities/Technology';

export interface ITechnologyRepository {
  findAll(): Promise<Technology[]>;
  findBySlug(slug: string): Promise<Technology | null>;
}
