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
}

export const EXPERIENCE_ITEMS: readonly ExperienceItem[] = [
  {
    id: "ucropit-2025-data-entry-specialist",
    kind: "professional",
    period: "dic. 2025 – mar. 2026",
    role: "Data Entry Specialist",
    company: "Ucrop.it",
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
    role: "Soporte técnico",
    company: "PcService Posadas",
    location: "Posadas",
    description:
      "Resolución de incidencias técnicas en infraestructura corporativa y servidores",
    details: [
      {
        text: "Diagnostiqué fallas de hardware y software en servidores y estaciones de trabajo para clientes corporativos",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Automaticé tareas repetitivas de instalación y configuración, reduciendo tiempos de respuesta en soporte",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
      {
        text: "Brindé soporte a usuarios finales y documenté soluciones para escalar conocimiento al equipo",
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
    role: "Coordinador de capacitación",
    company: "Hospital Escuela Dr. Ramón Madariaga",
    location: "Posadas",
    description:
      "Lideré equipo de implementación del sistema RIS de imagenología",
    details: [
      {
        text: "Coordiné el equipo de relevamiento de requerimientos y capacitación para el sistema R.I.S.mi de gestión de imágenes médicas",
        sources: ["cv-2026-08-27"],
        scope: "engagement",
      },
      {
        text: "Documenté el progreso de las capacitaciones y elaboré reportes de avance para la dirección",
        sources: ["cv-2026-08-27"],
        scope: "company-shared",
      },
    ],
    sortDate: new Date(2019, 11, 1),
  },
] as const;
