/**
 * Repository Implementation: GitHub API
 * Fetches projects from GitHub repositories
 */

import type { IProjectRepository } from "@domain/repositories/project.repository.interface";
import type { ProjectEntity } from "@domain/entities/project.entity";
import { GitHubMapper } from "@infrastructure/mappers/github.mapper";
import { GitHubReposArraySchema } from "@infrastructure/schemas/github.schema";
import { logger } from "@shared/utils/logger";
import {
  ExternalAPIError,
  RepositoryError,
  ValidationError,
} from "@shared/errors/domain.error";

export class GitHubApiRepository implements IProjectRepository {
  private readonly baseUrl = "https://api.github.com";
  private readonly username: string;
  private cache: ProjectEntity[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly cacheDuration = 1000 * 60 * 60; // 1 hour

  constructor(username: string) {
    this.username = username;
  }

  async findAll(): Promise<ProjectEntity[]> {
    if (this.isCacheValid() && this.cache) {
      logger.debug("Using cached GitHub repositories", {
        username: this.username,
        count: this.cache.length,
      });
      return this.cache;
    }

    try {
      const repos = await this.fetchRepositories();
      this.cache = GitHubMapper.toDomainArray(repos);
      this.cacheTimestamp = Date.now();

      logger.info("GitHub repositories fetched successfully", {
        username: this.username,
        count: repos.length,
      });

      return this.cache;
    } catch (error) {
      logger.error("Failed to fetch GitHub repositories", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
        hasCache: this.cache !== null,
      });

      // Return cached data if available, otherwise empty array
      if (this.cache) {
        logger.warn("Returning stale cache due to fetch error", {
          username: this.username,
          cacheAge: Date.now() - this.cacheTimestamp,
        });
        return this.cache;
      }

      return [];
    }
  }

  async findBySlug(slug: string): Promise<ProjectEntity | null> {
    try {
      const all = await this.findAll();
      const project = all.find((project) => project.slug === slug);

      if (!project) {
        logger.debug("Project not found by slug", {
          slug,
          username: this.username,
        });
      }

      return project || null;
    } catch (error) {
      logger.error("Error finding project by slug", {
        slug,
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new RepositoryError("Failed to find project by slug", { slug });
    }
  }

  async findFeatured(): Promise<ProjectEntity[]> {
    try {
      const all = await this.findAll();
      const featured = all.filter((project) => project.isFeatured());

      logger.debug("Featured projects retrieved", {
        count: featured.length,
        username: this.username,
      });

      return featured;
    } catch (error) {
      logger.error("Error finding featured projects", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new RepositoryError("Failed to find featured projects");
    }
  }

  async findByCategory(category: string): Promise<ProjectEntity[]> {
    try {
      const all = await this.findAll();
      const filtered = all.filter((project) =>
        project.matchesCategory(category)
      );

      logger.debug("Projects filtered by category", {
        category,
        count: filtered.length,
        username: this.username,
      });

      return filtered;
    } catch (error) {
      logger.error("Error finding projects by category", {
        category,
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw new RepositoryError("Failed to find projects by category", {
        category,
      });
    }
  }

  private async fetchRepositories() {
    try {
      const response = await fetch(
        `${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=100`
      );

      if (!response.ok) {
        throw new ExternalAPIError(
          "GitHub",
          `HTTP ${response.status}: ${response.statusText}`,
          {
            username: this.username,
            status: response.status,
            statusText: response.statusText,
          }
        );
      }

      const data = await response.json();

      // Validate data with Zod
      const result = GitHubReposArraySchema.safeParse(data);

      if (!result.success) {
        logger.error("GitHub API returned invalid data", {
          username: this.username,
          errors: result.error.issues,
          sampleData: data.slice(0, 2), // Log first 2 items for debugging
        });
        throw new ValidationError("Invalid data from GitHub API", {
          username: this.username,
          errors: result.error.issues,
        });
      }

      return result.data;
    } catch (error) {
      if (
        error instanceof ExternalAPIError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      logger.error("Unexpected error fetching GitHub repositories", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw new RepositoryError(
        "Unexpected error fetching GitHub repositories",
        {
          username: this.username,
          originalError: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cache !== null &&
      Date.now() - this.cacheTimestamp < this.cacheDuration
    );
  }

  clearCache(): void {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}
