export interface TechnologyDTO {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  category: string | null;
  created_at: string;
  project_count: number;
}
