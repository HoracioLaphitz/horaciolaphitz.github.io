/**
 * Unit Tests: ProjectEntity
 * Testing business logic without external dependencies
 */

import {
    ProjectEntity,
    ProjectCategory,
    ProjectStatus,
    type ProjectImpact,
} from "../project.entity";

interface ProjectOverrides {
    slug?: string;
    status?: ProjectStatus;
    featured?: boolean;
    githubUrl?: string;
    dashboardUrl?: string;
    impact?: ProjectImpact;
}

describe("ProjectEntity", () => {
    const createTestProject = (overrides: ProjectOverrides = {}) => {
        return new ProjectEntity(
            overrides.slug ?? "test-project",
            "Test Project",
            "A test project description",
            ProjectCategory.MachineLearning,
            ["python", "ml"],
            new Date("2024-01-01"),
            "Test Author",
            "githubUrl" in overrides
                ? overrides.githubUrl
                : "https://github.com/test/project",
            overrides.dashboardUrl,
            overrides.status ?? ProjectStatus.Completed,
            overrides.featured ?? false,
            overrides.impact
        );
    };

    describe("isPublishable", () => {
        it("should return true for completed project with description", () => {
            const project = createTestProject();
            expect(project.isPublishable()).toBe(true);
        });

        it("should return false for in-progress project", () => {
            const project = createTestProject({
                status: ProjectStatus.InProgress,
            });
            expect(project.isPublishable()).toBe(false);
        });

        it("should return false for project with empty description", () => {
            const project = new ProjectEntity(
                "test",
                "Test",
                "   ",
                ProjectCategory.DataAnalysis,
                [],
                new Date(),
                "Author",
                undefined,
                undefined,
                ProjectStatus.Completed,
                false
            );
            expect(project.isPublishable()).toBe(false);
        });

        it("should return false for project with WIP indicators", () => {
            const project = new ProjectEntity(
                "test",
                "Work in Progress Project",
                "Description",
                ProjectCategory.DataAnalysis,
                [],
                new Date(),
                "Author",
                undefined,
                undefined,
                ProjectStatus.Completed,
                false
            );
            expect(project.isPublishable()).toBe(false);
        });
    });

    describe("isFeatured", () => {
        it("should return true for featured and publishable project", () => {
            const project = createTestProject({
                featured: true,
                impact: { efficiencyGain: 25 },
            });
            expect(project.isFeatured()).toBe(true);
        });

        it("should return false for featured project without impact metrics", () => {
            const project = createTestProject({ featured: true });
            expect(project.isFeatured()).toBe(false);
        });

        it("should return false for featured but not publishable project", () => {
            const project = createTestProject({
                featured: true,
                status: ProjectStatus.InProgress,
            });
            expect(project.isFeatured()).toBe(false);
        });
    });

    describe("matchesSearch", () => {
        const project = createTestProject();

        it("should match by title", () => {
            expect(project.matchesSearch("Test Project")).toBe(true);
        });

        it("should match by description", () => {
            expect(project.matchesSearch("test project")).toBe(true);
        });

        it("should match by category", () => {
            expect(project.matchesSearch("Machine Learning")).toBe(true);
        });

        it("should match by tags", () => {
            expect(project.matchesSearch("python")).toBe(true);
        });

        it("should be case insensitive", () => {
            expect(project.matchesSearch("PYTHON")).toBe(true);
        });

        it("should return true for empty query", () => {
            expect(project.matchesSearch("")).toBe(true);
        });

        it("should return false for non-matching query", () => {
            expect(project.matchesSearch("javascript")).toBe(false);
        });
    });

    describe("matchesCategory", () => {
        const project = createTestProject();

        it("should match exact category", () => {
            expect(project.matchesCategory(ProjectCategory.MachineLearning)).toBe(
                true
            );
        });

        it("should not match different category", () => {
            expect(project.matchesCategory(ProjectCategory.DataAnalysis)).toBe(false);
        });

        it("should match 'all' category", () => {
            expect(project.matchesCategory("all")).toBe(true);
        });
    });

    describe("hasExternalLinks", () => {
        it("should return true when github URL exists", () => {
            const project = createTestProject();
            expect(project.hasExternalLinks()).toBe(true);
        });

        it("should return true when dashboard URL exists", () => {
            const project = createTestProject({
                githubUrl: undefined,
                dashboardUrl: "https://dashboard.com",
            });
            expect(project.hasExternalLinks()).toBe(true);
        });

        it("should return false when no links exist", () => {
            const project = createTestProject({
                githubUrl: undefined,
                dashboardUrl: undefined,
            });
            expect(project.hasExternalLinks()).toBe(false);
        });
    });

    describe("equals", () => {
        it("should return true for same slug", () => {
            const project1 = createTestProject();
            const project2 = createTestProject();
            expect(project1.equals(project2)).toBe(true);
        });

        it("should return false for different slug", () => {
            const project1 = createTestProject();
            const project2 = createTestProject({ slug: "different-slug" });
            expect(project2.equals(project1)).toBe(false);
        });
    });
});
