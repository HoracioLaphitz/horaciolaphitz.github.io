import {
  ALLOWED_MATURITY_STATUSES,
  ENTERPRISE_AI_EVIDENCE,
  type MaturityStatus,
} from "./enterprise-ai-evidence.v1";

export const PUBLIC_POSITIONING = {
  version: "v1.2",
  identity: {
    name: "Horacio Laphitz",
    role: "Soporte IT · Hardware · Analista de Datos",
    headline:
      "Resuelvo problemas de equipos y sistemas, acompaño a usuarios y preparo datos para mejorar el trabajo operativo. Combino soporte técnico con Python, SQL y Power BI.",
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
