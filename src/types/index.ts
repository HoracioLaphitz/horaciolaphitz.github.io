// Tipos para GitHub API
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size?: number;
  open_issues_count?: number;
  archived?: boolean;
  disabled?: boolean;
  visibility?: string;
  fork: boolean;
  readme?: string | null;
  languages?: string[];
}

// Tipos para dashboard
export interface Dashboard {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  downloadLink?: string;
  image?: string;
  technologies: string[];
  category: string;
}

// Tipos para proyectos
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  links: {
    demo?: string;
    github?: string;
    live?: string;
  };
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectCategory =
  | "data-analysis"
  | "machine-learning"
  | "web-development"
  | "dashboard"
  | "automation"
  | "other";

export type ProjectStatus =
  | "completed"
  | "in-progress"
  | "planned"
  | "archived";

// Tipos para habilidades
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
}

export type SkillCategory =
  | "programming"
  | "data-analysis"
  | "visualization"
  | "database"
  | "tools"
  | "soft-skills";

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

// Tipos para certificaciones
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  skills: string[];
}

// Tipos para metadatos SEO
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  type?: "website" | "article" | "profile";
  canonical?: string;
}

// Tipos para componentes UI
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "skill" | "project" | "metric";
  hover?: boolean;
  onClick?: () => void;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
}

// Tipos para filtros
export interface FilterState {
  category: ProjectCategory | "all";
  technology: string | "all";
  status: ProjectStatus | "all";
  search: string;
}

// Tipos para estadísticas
export interface ProjectStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  totalStars: number;
  totalForks: number;
  languagesUsed: string[];
  mostUsedLanguage: string;
}

// Tipos para tema
export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// Tipos para contacto
export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin: string;
  github: string;
  website?: string;
}

// Tipos para formulario de contacto
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Tipos para respuestas de API
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para hooks
export interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface UseScrollAnimationReturn {
  elementRef: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
}

export interface UseGitHubReposReturn {
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated?: Date;
}

// Tipos para automatizaciones N8N
export interface N8NAutomation {
  id: string;
  title: string;
  description: string;
  type:
    | "job-search"
    | "data-analysis"
    | "notification"
    | "scraping"
    | "email"
    | "other";
  status: "active" | "paused" | "error" | "inactive";
  frequency: string;
  technologies: string[];
  metrics: {
    executions: number;
    successRate: number;
    timeSaved?: number;
    lastExecution?: string;
  };
  workflow: {
    nodes: N8NNode[];
    connections: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface N8NNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface AutomationMetrics {
  totalAutomations: number;
  activeAutomations: number;
  totalExecutions: number;
  avgSuccessRate: number;
  totalTimeSaved: number;
}
