export type ExperienceKind = "professional" | "unpaid-project";
export type ExperienceSource = "portfolio" | "cv-2026-08-27";

export interface ExperienceDetail {
  readonly text: string;
  readonly sources: readonly ExperienceSource[];
  readonly scope: "engagement" | "company-shared";
}

export interface ExperienceItem {
  readonly id: string;
  readonly kind: ExperienceKind;
  readonly period: string;
  readonly role: string;
  readonly company: string;
  readonly location: string;
  readonly description: string;
  readonly details: readonly ExperienceDetail[];
  readonly sortDate: Date;
  readonly companyUrl?: string;
  readonly companyLinkedin?: string;
}

export const EXPERIENCE_ITEMS: readonly ExperienceItem[] = [
  {
    id: "ucropit-2025-data-entry-specialist",
    kind: "professional",
    period: "dic. 2025 – mar. 2026",
    role: "Data Entry Specialist",
    company: "Ucrop.it",
    companyUrl: "https://ucrop.it",
    companyLinkedin: "https://ar.linkedin.com/company/ucropit",
    location: "Remoto",
    description:
      "Procesamiento y validación de datos georreferenciados para agricultura de precisión",
    details: [
      {
        text: "Procesé datos georreferenciados con Python y Excel, estandarizando formatos y detectando inconsistencias en lotes de miles de registros",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Identifiqué patrones espaciales anómalos cruzando datos de campo con registros históricos",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Documenté procesos y criterios de validación para reducir retrabajo en futuros lotes de datos",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2025, 11, 1),
  },
  {
    id: "pcservice-2021-help-desk",
    kind: "professional",
    period: "ene. 2021 – nov. 2025",
    role: "Técnico de Soporte IT y Hardware",
    company: "PcService Posadas",
    companyLinkedin: "https://www.instagram.com/pcservice_posadas/",
    location: "Posadas",
    description:
      "Resolución de fallas de hardware y software en PC, servidores y estaciones de trabajo",
    details: [
      {
        text: "Diagnostiqué y resolví fallas de hardware y software en PC, servidores y estaciones de trabajo",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Realicé mantenimiento preventivo y correctivo, instalación y configuración de Windows y Linux, controladores, programas y periféricos",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Evalué problemas de arranque, rendimiento, temperatura, memoria, almacenamiento y compatibilidad de componentes",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Asesoré a clientes sobre reparación, actualización y reemplazo de componentes, explicando las alternativas técnicas",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
      {
        text: "Brindé soporte a usuarios y documenté soluciones; también automaticé tareas repetitivas de instalación y configuración",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2025, 10, 1),
  },
  {
    id: "ucropit-2024-data-entry",
    kind: "professional",
    period: "abr. 2024 – may. 2024",
    role: "Data Entry",
    company: "Ucrop.it",
    companyUrl: "https://ucrop.it",
    companyLinkedin: "https://ar.linkedin.com/company/ucropit",
    location: "Remoto",
    description: "Procesamiento y validación de datos georreferenciados",
    details: [
      {
        text: "Procesamiento y validación de datos georreferenciados para agricultura de precisión",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Detección de inconsistencias en datos de campo frente a observaciones históricas",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2024, 4, 1),
  },
  {
    id: "ferreteria-centenario-2020",
    kind: "unpaid-project",
    period: "ene. 2020 – dic. 2020",
    role: "Soporte informático ad honorem",
    company: "Ferretería Centenario",
    companyLinkedin: "https://www.cylex.com.ar/posadas/ferreteria-centenario-11540656.html",
    location: "Posadas",
    description:
      "Implementé base de datos MySQL y automaticé flujos con n8n y Python",
    details: [
      {
        text: "Diseñé y desplegué una base de datos MySQL para gestionar stock, ventas y proveedores",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Creé flujos de automatización con n8n para tareas administrativas como registro de ventas y alertas de reposición",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Construí scripts en Python para transformar datos de planillas manuales a la base de datos",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
    ],
    sortDate: new Date(2020, 11, 1),
  },
  {
    id: "hospital-madariaga-2019-trainer",
    kind: "professional",
    period: "jul. 2019 – dic. 2019",
    role: "Capacitador técnico y soporte en implementación de sistemas",
    company: "Hospital Escuela Dr. Ramón Madariaga",
    companyUrl: "https://parquesaludmisiones.org.ar/",
    location: "Posadas",
    description:
      "Coordiné capacitaciones y acompañé la implementación del sistema R.I.S.mi de imagenología",
    details: [
      {
        text: "Coordiné capacitaciones y acompañé la implementación del sistema R.I.S.mi",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Relevé necesidades de usuarios y requerimientos técnicos para facilitar la adopción del sistema",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Resolví consultas, realicé seguimiento de incidencias y elaboré reportes de avance",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
      {
        text: "Expliqué procedimientos a usuarios con distintos niveles de conocimiento tecnológico",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2019, 11, 1),
  },
  {
    id: "ministerio-salud-publica-2019",
    kind: "professional",
    period: "mar. 2019 – jun. 2019",
    role: "Asistente Administrativo Contable",
    company: "Ministerio de Salud Pública de Misiones",
    companyUrl: "https://salud.misiones.gob.ar",
    companyLinkedin: "https://ar.linkedin.com/company/ministerio-de-salud-publica-de-la-provincia-de-misiones",
    location: "Posadas",
    description:
      "Gestión de compras, proveedores y documentación en el área de Cuentas Especiales y Arancelamiento",
    details: [
      {
        text: "Gestioné compras de insumos, proveedores y documentación de procesos de licitación",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Cargué, controlé y organicé información administrativa mediante Tango Gestión y sistemas ERP internos",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
      {
        text: "Colaboré con el equipo contable en la elaboración de informes y la administración del área",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2019, 5, 1),
  },
] as const;
