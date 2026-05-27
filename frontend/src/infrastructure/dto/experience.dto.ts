export interface ExperienceDTO {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  achievements: string[];
  location?: string;
  type?: string;
  created_at: string;
  updated_at: string;
}
