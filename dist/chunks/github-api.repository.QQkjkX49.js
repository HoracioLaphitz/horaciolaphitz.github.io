import { z } from 'zod';

var ProjectCategory = /* @__PURE__ */ ((ProjectCategory2) => {
  ProjectCategory2["MachineLearning"] = "Machine Learning";
  ProjectCategory2["DataAnalysis"] = "Análisis de datos";
  ProjectCategory2["BusinessIntelligence"] = "Business Intelligence";
  ProjectCategory2["DataVisualization"] = "Data Visualization";
  return ProjectCategory2;
})(ProjectCategory || {});
var ProjectStatus = /* @__PURE__ */ ((ProjectStatus2) => {
  ProjectStatus2["Completed"] = "completed";
  ProjectStatus2["InProgress"] = "in-progress";
  ProjectStatus2["Archived"] = "archived";
  return ProjectStatus2;
})(ProjectStatus || {});
class ProjectEntity {
  constructor(slug, title, description, category, tags, publishDate, author, githubUrl, dashboardUrl, status = "completed" /* Completed */, featured = false, impact) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.category = category;
    this.tags = tags;
    this.publishDate = publishDate;
    this.author = author;
    this.githubUrl = githubUrl;
    this.dashboardUrl = dashboardUrl;
    this.status = status;
    this.featured = featured;
    this.impact = impact;
  }
  isPublishable() {
    return this.status === "completed" /* Completed */ && this.description.trim().length > 0 && this.title.trim().length > 0 && !this.hasWIPIndicators();
  }
  /**
   * Un proyecto es "Featured" si:
   * 1. Es publicable
   * 2. Tiene métricas de impacto definidas
   * 3. Tiene dashboard o GitHub URL
   */
  isFeatured() {
    return this.featured && this.isPublishable() && this.hasImpactMetrics() && this.hasExternalLinks();
  }
  /**
   * Verifica si el proyecto tiene métricas de impacto medibles
   */
  hasImpactMetrics() {
    if (!this.impact) return false;
    return Boolean(
      this.impact.efficiencyGain || this.impact.costSavings || this.impact.timeReduction || this.impact.revenueIncrease || this.impact.customMetrics && Object.keys(this.impact.customMetrics).length > 0
    );
  }
  /**
   * Obtiene la métrica de impacto principal para mostrar
   */
  getPrimaryImpactMetric() {
    if (!this.impact) return null;
    if (this.impact.efficiencyGain) {
      return {
        label: "Mejora en Eficiencia",
        value: `+${this.impact.efficiencyGain}%`
      };
    }
    if (this.impact.costSavings) {
      return {
        label: "Ahorro de Costos",
        value: this.impact.costSavings
      };
    }
    if (this.impact.timeReduction) {
      return {
        label: "Reducción de Tiempo",
        value: this.impact.timeReduction
      };
    }
    if (this.impact.revenueIncrease) {
      return {
        label: "Incremento en Revenue",
        value: this.impact.revenueIncrease
      };
    }
    return null;
  }
  matchesSearch(query) {
    if (!query.trim()) return true;
    const searchableText = [
      this.title,
      this.description,
      this.category,
      ...this.tags
    ].join(" ").toLowerCase();
    return searchableText.includes(query.toLowerCase().trim());
  }
  matchesCategory(category) {
    if (category === "all") return true;
    return this.category === category;
  }
  hasExternalLinks() {
    return Boolean(this.githubUrl || this.dashboardUrl);
  }
  hasWIPIndicators() {
    const wipPatterns = [
      /work in progress/i,
      /wip/i,
      /initial commit/i,
      /under construction/i,
      /coming soon/i,
      /to be updated/i
    ];
    const textToCheck = `${this.title} ${this.description}`;
    return wipPatterns.some((pattern) => pattern.test(textToCheck));
  }
  equals(other) {
    return this.slug === other.slug;
  }
}

class GitHubMapper {
  static toDomain(repo) {
    return new ProjectEntity(
      this.slugify(repo.name),
      this.formatTitle(repo.name),
      repo.description || "No description available",
      this.inferCategory(repo),
      Object.freeze(repo.topics || []),
      new Date(repo.created_at),
      "Horacio Laphitz",
      repo.html_url,
      repo.homepage || void 0,
      this.inferStatus(repo),
      this.isFeatured(repo)
    );
  }
  static toDomainArray(repos) {
    return repos.filter((repo) => this.isPublishable(repo)).map((repo) => this.toDomain(repo));
  }
  static slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  static formatTitle(name) {
    return name.split(/[-_]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  static inferCategory(repo) {
    const topics = repo.topics || [];
    const language = repo.language?.toLowerCase() || "";
    const name = repo.name.toLowerCase();
    if (topics.some(
      (t) => t.includes("ml") || t.includes("machine-learning")
    ) || name.includes("ml") || name.includes("neural")) {
      return ProjectCategory.MachineLearning;
    }
    if (topics.some((t) => t.includes("dashboard") || t.includes("bi")) || name.includes("dashboard")) {
      return ProjectCategory.BusinessIntelligence;
    }
    if (topics.some((t) => t.includes("viz") || t.includes("chart")) || name.includes("visualization")) {
      return ProjectCategory.DataVisualization;
    }
    if (language === "python" || language === "r") {
      return ProjectCategory.DataAnalysis;
    }
    return ProjectCategory.DataAnalysis;
  }
  static inferStatus(repo) {
    if (repo.archived) {
      return ProjectStatus.Archived;
    }
    const daysSinceUpdate = this.daysSince(new Date(repo.pushed_at));
    if (daysSinceUpdate > 180) {
      return ProjectStatus.Archived;
    }
    if (daysSinceUpdate < 30) {
      return ProjectStatus.InProgress;
    }
    return ProjectStatus.Completed;
  }
  static isFeatured(repo) {
    return repo.stargazers_count >= 5 || (repo.topics?.length || 0) >= 3;
  }
  static isPublishable(repo) {
    if (repo.fork) return false;
    if (repo.archived || repo.disabled) return false;
    if (!repo.description && repo.stargazers_count === 0) return false;
    if (repo.visibility === "private") return false;
    return true;
  }
  static daysSince(date) {
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1e3 * 60 * 60 * 24));
  }
}

const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable().or(z.literal("")),
  language: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  stargazers_count: z.number().int().nonnegative(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  pushed_at: z.string().datetime(),
  fork: z.boolean(),
  archived: z.boolean(),
  disabled: z.boolean().optional(),
  visibility: z.enum(["public", "private"]).optional()
});
const GitHubReposArraySchema = z.array(GitHubRepoSchema);

class Logger {
  isDevelopment = false;
  formatMessage(entry) {
    return `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  }
  log(level, message, data) {
    const entry = {
      level,
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      data
    };
    if (!this.isDevelopment && level === "debug") {
      return;
    }
    const formattedMessage = this.formatMessage(entry);
    switch (level) {
      case "error":
        console.error(formattedMessage, data);
        break;
      case "warn":
        console.warn(formattedMessage, data);
        break;
      case "debug":
        console.debug(formattedMessage, data);
        break;
      default:
        console.log(formattedMessage, data);
    }
  }
  info(message, data) {
    this.log("info", message, data);
  }
  warn(message, data) {
    this.log("warn", message, data);
  }
  error(message, data) {
    this.log("error", message, data);
  }
  debug(message, data) {
    this.log("debug", message, data);
  }
}
const logger = new Logger();

class DomainError extends Error {
  constructor(message, code, context) {
    super(message);
    this.code = code;
    this.context = context;
    this.name = "DomainError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  /**
   * Convert error to JSON for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack
    };
  }
}
class RepositoryError extends DomainError {
  constructor(message, context) {
    super(message, "REPOSITORY_ERROR", context);
    this.name = "RepositoryError";
  }
}
class ValidationError extends DomainError {
  constructor(message, context) {
    super(message, "VALIDATION_ERROR", context);
    this.name = "ValidationError";
  }
}
class ExternalAPIError extends DomainError {
  constructor(service, message, context) {
    super(`${service} API error: ${message}`, "EXTERNAL_API_ERROR", {
      service,
      ...context
    });
    this.name = "ExternalAPIError";
  }
}

class GitHubApiRepository {
  baseUrl = "https://api.github.com";
  username;
  cache = null;
  cacheTimestamp = 0;
  cacheDuration = 1e3 * 60 * 60;
  // 1 hour
  constructor(username) {
    this.username = username;
  }
  async findAll() {
    if (this.isCacheValid() && this.cache) {
      logger.debug("Using cached GitHub repositories", {
        username: this.username,
        count: this.cache.length
      });
      return this.cache;
    }
    try {
      const repos = await this.fetchRepositories();
      this.cache = GitHubMapper.toDomainArray(repos);
      this.cacheTimestamp = Date.now();
      logger.info("GitHub repositories fetched successfully", {
        username: this.username,
        count: repos.length
      });
      return this.cache;
    } catch (error) {
      logger.error("Failed to fetch GitHub repositories", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error",
        hasCache: this.cache !== null
      });
      if (this.cache) {
        logger.warn("Returning stale cache due to fetch error", {
          username: this.username,
          cacheAge: Date.now() - this.cacheTimestamp
        });
        return this.cache;
      }
      return [];
    }
  }
  async findBySlug(slug) {
    try {
      const all = await this.findAll();
      const project = all.find((project2) => project2.slug === slug);
      if (!project) {
        logger.debug("Project not found by slug", {
          slug,
          username: this.username
        });
      }
      return project || null;
    } catch (error) {
      logger.error("Error finding project by slug", {
        slug,
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw new RepositoryError("Failed to find project by slug", { slug });
    }
  }
  async findFeatured() {
    try {
      const all = await this.findAll();
      const featured = all.filter((project) => project.isFeatured());
      logger.debug("Featured projects retrieved", {
        count: featured.length,
        username: this.username
      });
      return featured;
    } catch (error) {
      logger.error("Error finding featured projects", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw new RepositoryError("Failed to find featured projects");
    }
  }
  async findByCategory(category) {
    try {
      const all = await this.findAll();
      const filtered = all.filter(
        (project) => project.matchesCategory(category)
      );
      logger.debug("Projects filtered by category", {
        category,
        count: filtered.length,
        username: this.username
      });
      return filtered;
    } catch (error) {
      logger.error("Error finding projects by category", {
        category,
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw new RepositoryError("Failed to find projects by category", {
        category
      });
    }
  }
  /**
   * Fetches a repository's README content as raw markdown
   */
  async getRepoReadme(repoName) {
    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.username}/${repoName}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.raw",
            "User-Agent": "Portfolio-HoracioLaphitz"
          }
        }
      );
      if (response.status === 404) {
        logger.debug("No README found for repository", {
          username: this.username,
          repo: repoName
        });
        return null;
      }
      if (!response.ok) {
        logger.warn("Failed to fetch README", {
          username: this.username,
          repo: repoName,
          status: response.status
        });
        return null;
      }
      return await response.text();
    } catch (error) {
      logger.error("Error fetching README", {
        username: this.username,
        repo: repoName,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      return null;
    }
  }
  async fetchRepositories() {
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
            statusText: response.statusText
          }
        );
      }
      const data = await response.json();
      const result = GitHubReposArraySchema.safeParse(data);
      if (!result.success) {
        logger.error("GitHub API returned invalid data", {
          username: this.username,
          errors: result.error.errors,
          sampleData: data.slice(0, 2)
          // Log first 2 items for debugging
        });
        throw new ValidationError("Invalid data from GitHub API", {
          username: this.username,
          errors: result.error.errors
        });
      }
      return result.data;
    } catch (error) {
      if (error instanceof ExternalAPIError || error instanceof ValidationError) {
        throw error;
      }
      logger.error("Unexpected error fetching GitHub repositories", {
        username: this.username,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw new RepositoryError(
        "Unexpected error fetching GitHub repositories",
        {
          username: this.username,
          originalError: error instanceof Error ? error.message : String(error)
        }
      );
    }
  }
  isCacheValid() {
    return this.cache !== null && Date.now() - this.cacheTimestamp < this.cacheDuration;
  }
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = 0;
  }
}

export { GitHubApiRepository as G, ProjectCategory as P, logger as l };
