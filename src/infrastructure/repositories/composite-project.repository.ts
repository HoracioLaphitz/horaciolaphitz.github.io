/**
 * Repository Implementation: Composite
 * Combines multiple data sources (Astro Content + GitHub API)
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";

export class CompositeProjectRepository implements IProjectRepository {
    constructor(
        private readonly primaryRepository: IProjectRepository,
        private readonly secondaryRepository?: IProjectRepository
    ) { }

    async findAll(): Promise<ProjectEntity[]> {
        const [primary, secondary] = await Promise.all([
            this.primaryRepository.findAll(),
            this.secondaryRepository?.findAll() || Promise.resolve([]),
        ]);

        return this.mergeAndDeduplicate(primary, secondary);
    }

    async findBySlug(slug: string): Promise<ProjectEntity | null> {
        // Try primary first
        const primary = await this.primaryRepository.findBySlug(slug);
        if (primary) return primary;

        // Fallback to secondary
        if (this.secondaryRepository) {
            return this.secondaryRepository.findBySlug(slug);
        }

        return null;
    }

    async findFeatured(): Promise<ProjectEntity[]> {
        const all = await this.findAll();
        return all.filter((project) => project.isFeatured());
    }

    async findByCategory(category: string): Promise<ProjectEntity[]> {
        const all = await this.findAll();
        return all.filter((project) => project.matchesCategory(category));
    }

    private mergeAndDeduplicate(
        primary: ProjectEntity[],
        secondary: ProjectEntity[]
    ): ProjectEntity[] {
        const slugSet = new Set(primary.map((p) => p.slug));
        const uniqueSecondary = secondary.filter((p) => !slugSet.has(p.slug));

        return [...primary, ...uniqueSecondary].sort(
            (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
        );
    }
}
