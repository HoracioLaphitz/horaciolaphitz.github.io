export interface ProfileDTO {
  name: string;
  role: string;
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    credly: string;
  };
}
