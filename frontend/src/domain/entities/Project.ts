export enum ProjectStatus {
  Completed = 'completed',
  InProgress = 'in-progress',
  Planned = 'planned',
}

export interface Technology {
  name: string;
  slug: string;
  iconUrl?: string;
}

export interface ProjectAsset {
  type: 'image' | 'video' | 'link';
  url: string;
  title?: string;
}

export class Project {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: string,
    public readonly status: ProjectStatus,
    public readonly featured: boolean,
    public readonly assets: ProjectAsset[],
    public readonly technologies: Technology[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly github_url?: string,
    public readonly demo_url?: string
  ) {}

  isCompleted(): boolean {
    return this.status === ProjectStatus.Completed;
  }

  isPublishable(): boolean {
    return this.status === ProjectStatus.Completed && this.title.trim().length > 0;
  }

  isFeatured(): boolean {
    return this.featured && this.isPublishable();
  }

  hasAssets(): boolean {
    return this.assets.length > 0;
  }

  getTechnologyNames(): string[] {
    return this.technologies.map((tech) => tech.name);
  }

  matchesSearch(query: string): boolean {
    if (!query.trim()) return true;

    const searchTerm = query.toLowerCase();
    return (
      this.title.toLowerCase().includes(searchTerm) ||
      this.description.toLowerCase().includes(searchTerm) ||
      this.technologies.some((tech) => tech.name.toLowerCase().includes(searchTerm))
    );
  }

  matchesCategory(category: string): boolean {
    if (category === 'all') return true;
    return this.category === category;
  }
}
