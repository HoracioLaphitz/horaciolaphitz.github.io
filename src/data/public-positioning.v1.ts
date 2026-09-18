import {
  ALLOWED_MATURITY_STATUSES,
  ENTERPRISE_AI_EVIDENCE,
  type MaturityStatus,
} from "./enterprise-ai-evidence.v1";

export const PUBLIC_POSITIONING = {
  version: "v1.1",
  identity: {
    name: "Horacio Laphitz",
    role: "Data Analyst · Automation · Applied AI",
    headline:
      "Transformo datos y procesos manuales en análisis, automatizaciones y herramientas de decisión usando Python, SQL, Power BI e IA aplicada.",
  },
  contact: {
    email: "horaciolaphitz99@gmail.com",
    linkedin: "https://www.linkedin.com/in/horacio-laphitz/",
    github: "https://github.com/horaciolaphitz",
    credly: "https://www.credly.com/users/horacio-laphitz",
  },
  siteUrl: "https://horaciolaphitz.vercel.app",
  availability: {
    openToWork: true,
    location: "Posadas, Misiones, Argentina",
    remote: true,
    hybrid: true,
    relocate: false,
    note: "Disponible para posiciones remotas o híbridas.",
  },
  positioning: {
    focus: "Análisis de datos, automatización de procesos e IA aplicada con Python, SQL y Power BI. Exploración activa de RAG y agentes para automatizar flujos de trabajo.",
    qualification: "Actualmente profundizando conocimientos en",
  },
  maturityStatuses: ALLOWED_MATURITY_STATUSES,
  capabilities: ENTERPRISE_AI_EVIDENCE.map(({ claimId, sources, status }) => ({
    claimId,
    sources,
    status,
  })),
} as const satisfies {
  version: string;
  identity: { name: string; role: string; headline: string };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    credly: string;
  };
  siteUrl: string;
  availability: {
    openToWork: boolean;
    location: string;
    remote: boolean;
    hybrid: boolean;
    relocate: boolean;
    note: string;
  };
  positioning: { focus: string; qualification: MaturityStatus };
  maturityStatuses: readonly MaturityStatus[];
  capabilities: readonly {
    claimId: string;
    sources: readonly string[];
    status?: MaturityStatus;
  }[];
};
