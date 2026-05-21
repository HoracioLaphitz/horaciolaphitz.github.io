import type { Experience } from '../entities/Experience';

export interface IExperienceRepository {
  findAll(): Promise<Experience[]>;
}
