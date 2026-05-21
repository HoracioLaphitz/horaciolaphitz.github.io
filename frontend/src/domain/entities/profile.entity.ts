export enum SkillCategory {
  Programming = 'Programming',
  Database = 'Database',
  DataVisualization = 'DataVisualization',
  DataAnalysis = 'DataAnalysis',
  Tools = 'Tools',
  Soft = 'Soft',
  Cloud = 'Cloud',
  Other = 'Other',
}

export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}

export interface Skill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  sortDate: Date;
}

export interface Certification {
  period: string;
  title: string;
  issuer: string;
  certificateUrl?: string;
  credlyBadgeId?: string;
  sortDate: Date;
}

export interface Education {
  period: string;
  degree: string;
  institution: string;
  location: string;
  sortDate: Date;
}

export interface ContactInfo {
  email?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  credly?: string;
}

export class ProfileEntity {
  constructor(
    public readonly name: string,
    public readonly role: string,
    public readonly descriptions: string[],
    public readonly contact: ContactInfo,
    public readonly experiences: Experience[],
    public readonly certifications: Certification[],
    public readonly education: Education[],
    public readonly skills: Skill[]
  ) {}

  getSortedExperiences(): Experience[] {
    return [...this.experiences].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }

  getSortedCertifications(): Certification[] {
    return [...this.certifications].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }

  getSortedEducation(): Education[] {
    return [...this.education].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }

  getSkillsByCategory(category: SkillCategory): Skill[] {
    return this.skills.filter((skill) => skill.category === category);
  }

  getSkillsByLevel(level: SkillLevel): Skill[] {
    return this.skills.filter((skill) => skill.level === level);
  }
}
