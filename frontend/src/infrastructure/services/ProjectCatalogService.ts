import { GitHubService, type GitHubProject } from './GitHubService';
import { scanProjectsRecursively, type ProjectEntry } from '@infrastructure/utils/projectScanner';

export interface CatalogProject {
  slug: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  status: string;
  technologies: { name: string }[];
  githubUrl?: string;
  demoUrl?: string;
  pdfUrl?: string;
  isLocal: boolean;
}

export class ProjectCatalogService {
  static async getAll(username: string): Promise<CatalogProject[]> {
    const [githubProjects, localEntries] = await Promise.all([
      GitHubService.getProjects(username),
      scanProjectsRecursively().catch((err) => {
        console.warn('Failed to scan local projects:', err);
        return [] as ProjectEntry[];
      }),
    ]);

    const localProjects = localEntries.map(toCatalogProject);
    const githubSlugs = new Set(localProjects.map((p) => p.slug));
    const uniqueGithub = githubProjects.filter((p) => !githubSlugs.has(p.slug));

    return [...localProjects, ...uniqueGithub];
  }
}

function toCatalogProject(entry: ProjectEntry): CatalogProject {
  const category = deriveCategory(entry.folderPath);

  return {
    slug: entry.id,
    title: entry.title,
    description: entry.summary || entry.description,
    category,
    featured: false,
    status: 'completed',
    technologies: entry.tags.map((t) => ({ name: t })),
    githubUrl: entry.repoUrl,
    demoUrl: entry.demoUrl,
    pdfUrl: entry.pdfUrl,
    isLocal: true,
  };
}

function deriveCategory(folderPath: string): string {
  const parts = folderPath.replace(/\\/g, '/').split('/');
  if (parts.length > 1) {
    return parts[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return 'General';
}
