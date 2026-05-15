/**
 * Dependency Injection Container
 * Central place for creating and managing dependencies
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import { AstroContentProjectRepository } from "@infrastructure/repositories/astro-content-project.repository";
import { GitHubApiRepository } from "@infrastructure/repositories/github-api.repository";
import { CompositeProjectRepository } from "@infrastructure/repositories/composite-project.repository";
import { ProjectService } from "@application/services/project.service";

class DIContainer {
    private static instance: DIContainer;
    private projectRepository: IProjectRepository | null = null;
    private projectService: ProjectService | null = null;

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    getProjectRepository(): IProjectRepository {
        if (!this.projectRepository) {
            const astroRepo = new AstroContentProjectRepository();

            // Check if we should include GitHub repos
            const includeGitHub = import.meta.env.PUBLIC_INCLUDE_GITHUB === "true";

            if (includeGitHub) {
                const githubUsername = import.meta.env.PUBLIC_GITHUB_USERNAME || "horacio-laphitz";
                const githubRepo = new GitHubApiRepository(githubUsername);
                this.projectRepository = new CompositeProjectRepository(astroRepo, githubRepo);
            } else {
                this.projectRepository = astroRepo;
            }
        }
        return this.projectRepository;
    }

    getProjectService(): ProjectService {
        if (!this.projectService) {
            this.projectService = new ProjectService(this.getProjectRepository());
        }
        return this.projectService;
    }

    // For testing: allow injecting mock repositories
    setProjectRepository(repository: IProjectRepository): void {
        this.projectRepository = repository;
        this.projectService = null; // Reset service to use new repository
    }

    reset(): void {
        this.projectRepository = null;
        this.projectService = null;
    }
}

export const container = DIContainer.getInstance();
