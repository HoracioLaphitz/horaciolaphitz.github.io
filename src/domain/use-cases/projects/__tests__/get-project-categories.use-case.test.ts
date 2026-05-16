/**
 * Unit Tests: GetProjectCategoriesUseCase
 * Testing category extraction logic
 */

import { describe, it, expect } from "vitest";
import { GetProjectCategoriesUseCase } from "../get-project-categories.use-case";
import {
  ProjectEntity,
  ProjectCategory,
  ProjectStatus,
} from "@domain/entities/project.entity";

describe("GetProjectCategoriesUseCase", () => {
  const useCase = new GetProjectCategoriesUseCase();

  const createProject = (
    slug: string,
    category: ProjectCategory,
    status: ProjectStatus = ProjectStatus.Completed
  ) => {
    return new ProjectEntity(
      slug,
      `Project ${slug}`,
      "Description",
      category,
      [],
      new Date(),
      "Author",
      undefined,
      undefined,
      status,
      false
    );
  };

  describe("execute", () => {
    it("should return unique categories from publishable projects", () => {
      const projects = [
        createProject("ml-1", ProjectCategory.MachineLearning),
        createProject("ml-2", ProjectCategory.MachineLearning),
        createProject("viz-1", ProjectCategory.DataVisualization),
        createProject("analysis-1", ProjectCategory.DataAnalysis),
      ];

      const result = useCase.execute(projects);

      expect(result).toHaveLength(3);
      expect(result).toContain(ProjectCategory.MachineLearning);
      expect(result).toContain(ProjectCategory.DataVisualization);
      expect(result).toContain(ProjectCategory.DataAnalysis);
    });

    it("should exclude categories from non-publishable projects", () => {
      const projects = [
        createProject("ml-1", ProjectCategory.MachineLearning),
        createProject(
          "wip-1",
          ProjectCategory.DataVisualization,
          ProjectStatus.InProgress
        ),
      ];

      const result = useCase.execute(projects);

      expect(result).toHaveLength(1);
      expect(result).toContain(ProjectCategory.MachineLearning);
      expect(result).not.toContain(ProjectCategory.DataVisualization);
    });

    it("should return empty array for empty projects", () => {
      const result = useCase.execute([]);

      expect(result).toHaveLength(0);
    });

    it("should return empty array when all projects are non-publishable", () => {
      const projects = [
        createProject(
          "wip-1",
          ProjectCategory.MachineLearning,
          ProjectStatus.InProgress
        ),
        createProject(
          "wip-2",
          ProjectCategory.DataAnalysis,
          ProjectStatus.InProgress
        ),
      ];

      const result = useCase.execute(projects);

      expect(result).toHaveLength(0);
    });

    it("should handle single category", () => {
      const projects = [
        createProject("ml-1", ProjectCategory.MachineLearning),
        createProject("ml-2", ProjectCategory.MachineLearning),
        createProject("ml-3", ProjectCategory.MachineLearning),
      ];

      const result = useCase.execute(projects);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(ProjectCategory.MachineLearning);
    });

    it("should maintain category order based on first occurrence", () => {
      const projects = [
        createProject("viz-1", ProjectCategory.DataVisualization),
        createProject("ml-1", ProjectCategory.MachineLearning),
        createProject("analysis-1", ProjectCategory.DataAnalysis),
        createProject("viz-2", ProjectCategory.DataVisualization),
      ];

      const result = useCase.execute(projects);

      expect(result[0]).toBe(ProjectCategory.DataVisualization);
      expect(result[1]).toBe(ProjectCategory.MachineLearning);
      expect(result[2]).toBe(ProjectCategory.DataAnalysis);
    });
  });
});
