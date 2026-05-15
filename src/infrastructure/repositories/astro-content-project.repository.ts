/**
 * Repository Implementation: Astro Content
 * Concrete implementation for Astro content collections
 *
 * ⚠️ This file uses astro:content and should ONLY be imported in server-side code
 */

import { getCollection, getEntry } from "astro:content";
import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";
import { ProjectMapper } from "@infrastructure/mappers/project.mapper";
import type { ProyectoEntry } from "../types/astro-content-server.types";

export class AstroContentProjectRepository implements IProjectRepository {
  async findAll(): Promise<ProjectEntity[]> {
    const entries = (await getCollection("proyectos")) as ProyectoEntry[];
    return ProjectMapper.toDomainArray(entries);
  }

  async findBySlug(slug: string): Promise<ProjectEntity | null> {
    try {
      const entry = (await getEntry("proyectos", slug)) as
        | ProyectoEntry
        | undefined;
      if (!entry) return null;
      return ProjectMapper.toDomain(entry);
    } catch {
      return null;
    }
  }

  async findFeatured(): Promise<ProjectEntity[]> {
    const all = await this.findAll();
    return all.filter((project) => project.isFeatured());
  }

  async findByCategory(category: string): Promise<ProjectEntity[]> {
    const all = await this.findAll();
    return all.filter((project) => project.matchesCategory(category));
  }
}
