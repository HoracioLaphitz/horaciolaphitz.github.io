import { GitHubReposArraySchema } from '@application/infrastructure/schemas/github.schema';

export interface GitHubProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  status: string;
  technologies: { name: string }[];
  githubUrl: string;
  demoUrl?: string;
}

export class GitHubService {
  private static cache: GitHubProject[] | null = null;
  private static cacheTimestamp = 0;
  private static readonly CACHE_DURATION = 1000 * 60 * 30;

  static async getProjects(username: string): Promise<GitHubProject[]> {
    if (this.cache && Date.now() - this.cacheTimestamp < this.CACHE_DURATION) {
      return this.cache;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=public`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using cache if available`);
      if (this.cache) return this.cache;
      return [];
    }

    const data = await response.json();
    const result = GitHubReposArraySchema.safeParse(data);

    if (!result.success) {
      console.error('Invalid GitHub API response', result.error.issues);
      if (this.cache) return this.cache;
      return [];
    }

    this.cache = result.data
      .filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
      .map((repo) => ({
        slug: repo.name,
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        description: repo.description || '',
        category: repo.language || 'General',
        featured: repo.stargazers_count > 0 || repo.topics.includes('featured'),
        status: 'completed' as const,
        technologies: [...new Set([...(repo.topics || []), ...(repo.language ? [repo.language] : [])])].map(
          (tech) => ({ name: tech })
        ),
        githubUrl: repo.html_url,
        demoUrl: repo.homepage || undefined,
      }));

    this.cacheTimestamp = Date.now();
    return this.cache;
  }
}
