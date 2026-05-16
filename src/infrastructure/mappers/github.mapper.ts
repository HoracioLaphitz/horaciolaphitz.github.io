/**
 * Mapper: GitHub
 * Transforms GitHub API data to domain entities
 */

import {
  ProjectEntity,
  ProjectCategory,
  ProjectStatus,
} from "@domain/entities/project.entity";
import type { GitHubRepo } from "@shared/types/common.types";

export class GitHubMapper {
  static toDomain(repo: GitHubRepo): ProjectEntity {
    return new ProjectEntity(
      this.slugify(repo.name),
      this.formatTitle(repo.name),
      repo.description || "No description available",
      this.inferCategory(repo),
      Object.freeze(repo.topics || []),
      new Date(repo.created_at),
      "Horacio Laphitz",
      repo.html_url,
      repo.homepage || undefined,
      this.inferStatus(repo),
      this.isFeatured(repo)
    );
  }

  static toDomainArray(repos: GitHubRepo[]): ProjectEntity[] {
    return repos
      .filter((repo) => this.isPublishable(repo))
      .map((repo) => this.toDomain(repo));
  }

  private static slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  private static formatTitle(name: string): string {
    return name
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private static inferCategory(repo: GitHubRepo): ProjectCategory {
    const topics = repo.topics || [];
    const language = repo.language?.toLowerCase() || "";
    const name = repo.name.toLowerCase();

    if (
      topics.some(
        (t: string) => t.includes("ml") || t.includes("machine-learning")
      ) ||
      name.includes("ml") ||
      name.includes("neural")
    ) {
      return ProjectCategory.MachineLearning;
    }

    if (
      topics.some((t: string) => t.includes("dashboard") || t.includes("bi")) ||
      name.includes("dashboard")
    ) {
      return ProjectCategory.BusinessIntelligence;
    }

    if (
      topics.some((t: string) => t.includes("viz") || t.includes("chart")) ||
      name.includes("visualization")
    ) {
      return ProjectCategory.DataVisualization;
    }

    if (language === "python" || language === "r") {
      return ProjectCategory.DataAnalysis;
    }

    return ProjectCategory.DataAnalysis;
  }

  private static inferStatus(repo: GitHubRepo): ProjectStatus {
    if (repo.archived) {
      return ProjectStatus.Archived;
    }

    const pushedDate = repo.pushed_at
      ? new Date(repo.pushed_at)
      : new Date(repo.updated_at);
    const daysSinceUpdate = this.daysSince(pushedDate);

    if (daysSinceUpdate > 180) {
      return ProjectStatus.Archived;
    }

    if (daysSinceUpdate < 30) {
      return ProjectStatus.InProgress;
    }

    return ProjectStatus.Completed;
  }

  private static isFeatured(repo: GitHubRepo): boolean {
    return repo.stargazers_count >= 5 || (repo.topics?.length || 0) >= 3;
  }

  private static isPublishable(repo: GitHubRepo): boolean {
    // Exclude forks
    if (repo.fork) return false;

    // Exclude archived or disabled
    if (repo.archived || repo.disabled) return false;

    // Exclude repos with no description and no stars
    if (!repo.description && repo.stargazers_count === 0) return false;

    // Exclude private repos
    if (repo.visibility === "private") return false;

    return true;
  }

  private static daysSince(date: Date): number {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }
}
