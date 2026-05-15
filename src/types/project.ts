/**
 * Type definitions for projects and case studies
 */

export enum ProjectCategory {
  PredictiveAnalytics = "Predictive Analytics",
  BusinessIntelligence = "Business Intelligence",
  DataVisualization = "Data Visualization",
  MachineLearning = "Machine Learning",
  DataEngineering = "Data Engineering",
  ExploratoryAnalysis = "Exploratory Data Analysis",
}

export enum BusinessDomain {
  Healthcare = "Healthcare",
  Retail = "Retail",
  Finance = "Finance",
  Manufacturing = "Manufacturing",
  Gaming = "Gaming",
  HR = "HR Analytics",
  Marketing = "Marketing Analytics",
  Government = "Government & Public Policy",
  Agriculture = "Agriculture & AgTech",
  Technology = "Technology & SaaS",
  General = "General",
}

export enum ProjectStatus {
  Completed = "completed",
  InProgress = "in-progress",
  Archived = "archived",
}

export interface Tool {
  name: string;
  purpose: string;
  icon?: string;
}

export interface ProjectMetrics {
  businessImpact: string;
  dataVolume: string;
  accuracy?: string;
  timeframe: string;
}

export interface Metric {
  label: string;
  value: string;
  description: string;
}

export interface DataSource {
  name: string;
  type: string;
  volume: string;
  format: string[];
  url?: string;
}

export interface MethodologyPhase {
  name: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface Methodology {
  name: string;
  phases: MethodologyPhase[];
}

export interface ProcessPhase {
  phase: string;
  activities: string[];
  tools: string[];
  outputs: string[];
}

export interface Visualization {
  type: string;
  title: string;
  description: string;
  imageUrl: string;
  insights: string[];
}

export interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
}

export interface Challenge {
  problem: string;
  solution: string;
}

export interface TechnicalDetails {
  architecture: string;
  codeHighlights: CodeSnippet[];
  challenges: Challenge[];
  githubUrl: string;
}

export interface Impact {
  metric: string;
  baseline: string;
  result: string;
  improvement: string;
  description: string;
}

// CaseStudy interface removed - using blog posts for storytelling instead

export interface Project {
  // Identification
  id: string;
  slug: string;

  // Basic Information
  title: string;
  shortDescription: string;
  longDescription: string;

  // Categorization
  category: ProjectCategory;
  tags: string[];
  domain: BusinessDomain;

  // Status
  status: ProjectStatus;
  featured: boolean;
  publishDate: Date;
  lastUpdated: Date;

  // Links
  githubUrl?: string;
  liveUrl?: string;

  // Visuals
  thumbnail: string;
  images: string[];

  // Metrics
  metrics: ProjectMetrics;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Validation functions
export function validateProject(project: Project): ValidationResult {
  const errors: string[] = [];

  // Verify project has title
  if (!project.title || project.title.trim() === "") {
    errors.push("Project title is required");
  }

  // Verify project has description
  if (!project.shortDescription || project.shortDescription.trim() === "") {
    errors.push("Project description is required");
  }

  // Verify project is marked as complete
  if (project.status !== ProjectStatus.Completed) {
    errors.push("Project must be marked as completed to be published");
  }

  // Additional validation: featured projects must be completed
  if (project.status !== ProjectStatus.Completed && project.featured) {
    errors.push("Only completed projects can be featured");
  }

  // Validate GitHub URL if provided
  if (project.githubUrl && !isValidUrl(project.githubUrl)) {
    errors.push("Invalid GitHub URL");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function filterPublishableProjects(projects: Project[]): Project[] {
  return projects.filter((project) => {
    // Only completed projects
    if (project.status !== ProjectStatus.Completed) return false;

    // Must have description
    if (!project.shortDescription || project.shortDescription.trim() === "") {
      return false;
    }

    // Validate that it's not a "toy" project without renaming
    const toyProjectPatterns = [
      /^project\d+$/i,
      /^test/i,
      /^example/i,
      /^demo$/i,
    ];

    if (toyProjectPatterns.some((pattern) => pattern.test(project.title))) {
      return false;
    }

    // Exclude projects with work-in-progress indicators in title or description
    const wipPatterns = [
      /work in progress/i,
      /wip/i,
      /initial commit/i,
      /under construction/i,
      /coming soon/i,
      /to be updated/i,
    ];

    const textToCheck = `${project.title} ${project.shortDescription} ${project.longDescription}`;
    if (wipPatterns.some((pattern) => pattern.test(textToCheck))) {
      return false;
    }

    return true;
  });
}

/**
 * Filter publishable projects from GitHub repositories
 * This function is specifically for filtering GitHub repo data before converting to Project type
 */
export function filterPublishableGitHubRepos(
  repos: Array<{
    name: string;
    description: string | null;
    stargazers_count: number;
  }>
): Array<{
  name: string;
  description: string | null;
  stargazers_count: number;
}> {
  return repos.filter((repo) => {
    // Exclude repos with 0 stars AND no description
    if (repo.stargazers_count === 0 && !repo.description) {
      return false;
    }

    // Exclude repos with generic/empty descriptions
    if (repo.description) {
      const genericDescriptions = [
        /^initial commit$/i,
        /^work in progress$/i,
        /^wip$/i,
        /^test$/i,
        /^example$/i,
        /^demo$/i,
        /^my project$/i,
        /^new project$/i,
      ];

      if (
        genericDescriptions.some((pattern) => pattern.test(repo.description!))
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getProjectThumbnail(project: Project): string {
  if (project.thumbnail) {
    return project.thumbnail;
  }

  // Fallback based on category
  const categoryThumbnails: Record<ProjectCategory, string> = {
    [ProjectCategory.PredictiveAnalytics]: "/img/thumbnails/predictive.jpg",
    [ProjectCategory.BusinessIntelligence]: "/img/thumbnails/bi.jpg",
    [ProjectCategory.DataVisualization]: "/img/thumbnails/viz.jpg",
    [ProjectCategory.MachineLearning]: "/img/thumbnails/ml.jpg",
    [ProjectCategory.DataEngineering]: "/img/thumbnails/engineering.jpg",
    [ProjectCategory.ExploratoryAnalysis]: "/img/thumbnails/eda.jpg",
  };

  return categoryThumbnails[project.category] || "/img/thumbnails/default.jpg";
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
