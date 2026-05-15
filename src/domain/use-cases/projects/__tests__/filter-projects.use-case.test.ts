/**
 * Unit Tests: FilterProjectsUseCase
 * Testing project filtering logic
 */

import { describe, it, expect } from "vitest";
import { FilterProjectsUseCase } from "../filter-projects.use-case";
import { SearchQuery } from "@domain/value-objects/search-query.vo";
import {
  ProjectEntity,
  ProjectCategory,
  ProjectStatus,
} from "@domain/entities/project.entity";

describe("FilterProjectsUseCase", () => {
  const useCase = new FilterProjectsUseCase();

  const createProject = (
    slug: string,
    title: string,
    category: ProjectCategory,
    tags: string[],
    status: ProjectStatus = ProjectStatus.Completed
  ) => {
    return new ProjectEntity(
      slug,
      title,
      `Description for ${title}`,
      category,
      tags,
      new Date("2024-01-01"),
      "Test Author",
      undefined,
      undefined,
      status,
      false
    );
  };

  const projects = [
    createProject(
      "ml-project",
      "Machine Learning Project",
      ProjectCategory.MachineLearning,
      ["python", "ml", "tensorflow"]
    ),
    createProject(
      "data-viz",
      "Data Visualization Dashboard",
      ProjectCategory.DataVisualization,
      ["python", "plotly", "dash"]
    ),
    createProject(
      "data-analysis",
      "Sales Data Analysis",
      ProjectCategory.DataAnalysis,
      ["python", "pandas", "numpy"]
    ),
    createProject(
      "wip-project",
      "WIP: Incomplete Project",
      ProjectCategory.MachineLearning,
      ["python"],
      ProjectStatus.InProgress
    ),
  ];

  describe("filter by category", () => {
    it("should return all publishable projects when category is 'all'", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(3); // WIP project excluded
      expect(result.every((p) => p.isPublishable())).toBe(true);
    });

    it("should filter by Machine Learning category", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.MachineLearning,
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("ml-project");
    });

    it("should filter by Data Visualization category", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.DataVisualization,
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("data-viz");
    });

    it("should filter by Data Analysis category", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.DataAnalysis,
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("data-analysis");
    });
  });

  describe("filter by search query", () => {
    it("should filter by title", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.create("visualization"),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("data-viz");
    });

    it("should filter by description", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.create("dashboard"),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("data-viz");
    });

    it("should filter by tags", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.create("tensorflow"),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("ml-project");
    });

    it("should be case insensitive", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.create("PYTHON"),
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((p) => p.matchesSearch("python"))).toBe(true);
    });

    it("should return all projects for empty query", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(3); // WIP excluded
    });

    it("should return empty array for non-matching query", () => {
      const result = useCase.execute({
        projects,
        category: "all",
        searchQuery: SearchQuery.create("nonexistent"),
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("combined filters", () => {
    it("should combine category and search filters", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.MachineLearning,
        searchQuery: SearchQuery.create("python"),
      });

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe("ml-project");
    });

    it("should return empty when filters don't match", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.MachineLearning,
        searchQuery: SearchQuery.create("plotly"),
      });

      expect(result).toHaveLength(0);
    });

    it("should exclude non-publishable projects even if they match filters", () => {
      const result = useCase.execute({
        projects,
        category: ProjectCategory.MachineLearning,
        searchQuery: SearchQuery.create("WIP"),
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("edge cases", () => {
    it("should handle empty projects array", () => {
      const result = useCase.execute({
        projects: [],
        category: "all",
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(0);
    });

    it("should handle all non-publishable projects", () => {
      const wipProjects = [
        createProject(
          "wip-1",
          "WIP Project 1",
          ProjectCategory.MachineLearning,
          [],
          ProjectStatus.InProgress
        ),
        createProject(
          "wip-2",
          "WIP Project 2",
          ProjectCategory.DataAnalysis,
          [],
          ProjectStatus.InProgress
        ),
      ];

      const result = useCase.execute({
        projects: wipProjects,
        category: "all",
        searchQuery: SearchQuery.empty(),
      });

      expect(result).toHaveLength(0);
    });
  });
});
