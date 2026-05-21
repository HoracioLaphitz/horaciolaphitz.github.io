export interface TechnologyDTO {
  name: string;
  slug: string;
  icon_url?: string;
}

export interface ProjectDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  assets: Array<Record<string, unknown>>;
  created_at: string;
  updated_at: string;
  technologies?: TechnologyDTO[];
  github_url?: string;
  demo_url?: string;
}
