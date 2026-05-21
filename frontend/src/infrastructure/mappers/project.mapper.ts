import type { CollectionEntry } from "astro:content";
import type { Project } from "@domain/entities/project.entity";

export class ProjectMapper {
    static toDomain(raw: CollectionEntry<"proyectos">): Project {
        return {
            slug: raw.slug,
            title: raw.data.title,
            description: raw.data.description,
            long_description: raw.data.description, // Use description as long_description for content collection
            category: raw.data.category,
            featured: raw.data.featured || false,
            status: raw.data.status || "completed",
            highlights: [], // Extract from description if needed
            technologies: raw.data.technologies || [],
            assets: [],
        };
    }

    static toDomainArray(raw: CollectionEntry<"proyectos">[]): Project[] {
        return raw.map((item) => this.toDomain(item));
    }
}
