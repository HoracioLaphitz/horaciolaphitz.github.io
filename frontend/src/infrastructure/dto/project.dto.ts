export interface ProjectTechnologyDTO {
  name: string;
  slug: string;
  icon_url?: string;
}

export interface ProjectAssetDTO {
  type: string;
  url: string;
  title?: string;
}

export interface ProjectListDTO {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  assets: ProjectAssetDTO[];
  created_at: string;
  updated_at: string;
  technologies: ProjectTechnologyDTO[];
  github_url?: string;
  demo_url?: string;
}

export interface ProjectDetailDTO extends ProjectListDTO {
  long_description?: string;
  highlights: string[];
  pdf_url?: string;
  pdf_size?: string;
  thumbnail_url?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
