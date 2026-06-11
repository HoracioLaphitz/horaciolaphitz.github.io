/**
 * Profile Data - CV Information
 * Source: CV - Horacio Nahuel Laphitz.pdf
 */

import {
  ProfileEntity,
  SkillCategory,
  SkillLevel,
} from "@domain/entities/profile.entity";

export const PROFILE_DATA = new ProfileEntity(
  "Horacio Laphitz",
  "Analista de Datos",
  [
    "Analista de Datos orientado a la resolución de problemas, con experiencia en sistemas de gestión, administración y soporte al usuario.",
    "Además, parametrizo procesos en Tango Gestión (procesos generales, artículos, cuentas de tesorería, clientes, proveedores, artículos, administrador general) con enfoque en el estricto cumplimiento normativo.",
  ],
  {
    email: "horaciolaphitz99@gmail.com",
    location: "Posadas, Misiones, Argentina",
    linkedin: "https://www.linkedin.com/in/horacio-laphitz/",
    github: "https://github.com/horaciolaphitz",
    credly: "https://www.credly.com/users/horacio-laphitz",
  },
  [
    {
      period: "Dic 2025 – Mar 2026",
      role: "Data Entry Specialist",
      company: "Ucrop.it",
      location: "Remoto",
      description: "Procesamiento y validación de datos georreferenciados",
      sortDate: new Date(2025, 11, 1),
    },
    {
      period: "Ene 2021 – Nov 2025",
      role: "Técnico en Sistemas",
      company: "PcService Posadas",
      location: "Posadas",
      description:
        "Mantenimiento de hardware y servidores, optimización de sistemas",
      sortDate: new Date(2025, 10, 1),
    },
    {
      period: "Abr 2024 – May 2024",
      role: "Data Entry",
      company: "Ucrop.it",
      location: "Remoto",
      description: "Entrada precisa y eficiente de datos georreferenciados",
      sortDate: new Date(2024, 4, 1),
    },
    {
      period: "Jul 2019 – Dic 2019",
      role: "Capacitador Técnico en Sistemas",
      company: "Hospital Escuela Dr. Ramón Madariaga",
      location: "Posadas",
      description:
        "Coordinación de capacitación e implementación de sistema R.I.S.mi",
      sortDate: new Date(2019, 11, 1),
    },
    {
      period: "Mar 2019 – Jun 2019",
      role: "Asistente Administrativo Contable",
      company: "Ministerio de Salud Pública de Misiones",
      location: "Posadas",
      description: "Gestión de compras, licitaciones y ERP",
      sortDate: new Date(2019, 5, 1),
    },
  ],
  [
    {
      period: "Febrero 2026",
      title: "SQL con Databricks",
      issuer: "Lovelytics Latam",
      sortDate: new Date(2026, 1, 1),
    },
    {
      period: "Mar 2025",
      title: "Business & Operations Management Excellence",
      issuer: "MTF Institute - Udemy",
      certificateUrl:
        "/Certificaciones/CertificateinBusiness&OperationsManagementExcellence.pdf",
      sortDate: new Date(2025, 2, 1),
    },
    {
      period: "Mar 2025",
      title: "Sales & Service Data Analysis & Analytics Expert",
      issuer: "MTF Institute - Udemy",
      certificateUrl:
        "/Certificaciones/Sales & Service Data Analysis & Analytics Expert.pdf",
      sortDate: new Date(2025, 2, 1),
    },
    {
      period: "Mar 2025",
      title: "Microsoft Office Mastery",
      issuer: "Sayman Creative Institute - Udemy",
      certificateUrl:
        "/Certificaciones/Microsoft Office Mastery Learn Word Excel and PowerPoint.pdf",
      sortDate: new Date(2025, 2, 1),
    },
    {
      period: "Mar 2025",
      title: "Professional Diploma in Corporate Management",
      issuer: "MTF Institute - Udemy",
      certificateUrl:
        "/Certificaciones/Prefesional diploma in corporate managemet.pdf",
      sortDate: new Date(2025, 2, 1),
    },
    {
      period: "May 2024",
      title: "Supervised Machine Learning",
      issuer: "Stanford University - Coursera",
      certificateUrl:
        "/Certificaciones/Supervised Machine Learning_ Regression and Classification.pdf",
      sortDate: new Date(2024, 4, 1),
    },
    {
      period: "Abr 2024",
      title: "Python for Data Engineering",
      issuer: "IBM - Coursera",
      certificateUrl: "/Certificaciones/IBM-python-data-engineering.pdf",
      credlyBadgeId: "78a917fc-2fee-416b-a3c4-d14f3cd09541",
      sortDate: new Date(2024, 3, 1),
    },
    {
      period: "Mar 2024",
      title: "Certificado Profesional de Análisis de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf",
      sortDate: new Date(2024, 2, 1),
    },
    {
      period: "Mar 2024",
      title: "Fundamentos de Ciencia de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/Fundamentos de ciencia de datos.pdf",
      sortDate: new Date(2024, 2, 1),
    },
    {
      period: "Feb 2024",
      title: "Python for Data Science, AI & Development",
      issuer: "IBM - Coursera",
      certificateUrl:
        "/Certificaciones/IBM-DATA SCIENCE - AI - DEVELOPMENT.pdf",
      credlyBadgeId: "57d36636-8b10-4218-a641-7cd6fcf9d8fe",
      sortDate: new Date(2024, 1, 1),
    },
    {
      period: "Feb 2024",
      title: "Análisis computacional de Datos en R",
      issuer: "Google Careers - Coursera",
      certificateUrl:
        "/Certificaciones/GOOGLE-Analisis-computacional-de-datos-R.pdf",
      sortDate: new Date(2024, 1, 1),
    },
    {
      period: "Feb 2024",
      title: "Curso Final de Análisis Computacional de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl:
        "/Certificaciones/Curso final de análisis computacional de datos completa un caso practico.pdf",
      sortDate: new Date(2024, 1, 1),
    },
    {
      period: "Ene 2024",
      title: "Go Beyond the Numbers: Translate Data into Insights",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/GoBeyondtheNumbersTranslateData.pdf",
      sortDate: new Date(2024, 0, 1),
    },
    {
      period: "Ene 2024",
      title: "Get Started with Python",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf",
      sortDate: new Date(2024, 0, 1),
    },
    {
      period: "Ene 2024",
      title: "Tu Primera Experiencia como Analista de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl:
        "/Certificaciones/certificate-of-completion-for-tu-primera-experiencia-como-analista-de-datos.pdf",
      sortDate: new Date(2024, 0, 1),
    },
    {
      period: "Dic 2023",
      title: "Python Expertise",
      issuer: "Nicolas Schurmann - Udemy",
      certificateUrl: "/Certificaciones/Python-Developer-Udemy.pdf",
      sortDate: new Date(2023, 11, 1),
    },
    {
      period: "Nov 2023",
      title: "Introducción a Machine Learning",
      issuer: "Domestika",
      sortDate: new Date(2023, 10, 1),
    },
    {
      period: "Jul 2023",
      title: "Bases de Datos desde Cero",
      issuer: "Silicon Misiones",
      certificateUrl:
        "/Certificaciones/SILICON MISIONES- Certificado Digital Bases de Datos.pdf",
      sortDate: new Date(2023, 6, 1),
    },
    {
      period: "Mar 2023",
      title: "Data Analytics Nivel Growth",
      issuer: "Silicon Misiones",
      certificateUrl:
        "/Certificaciones/SILICON MISIONES-Certificado de Data & Analytics.pdf",
      sortDate: new Date(2023, 2, 1),
    },
    {
      period: "Dic 2022",
      title: "Introducción a la Programación",
      issuer: "Silicon Misiones",
      certificateUrl:
        "/Certificaciones/SILICON MISIONES- Certificado Laphitz Horacio Intro a la programacion.pdf",
      sortDate: new Date(2022, 11, 1),
    },
  ],
  [
    {
      period: "2018 – 2020",
      degree: "Técnico Superior en Análisis de Sistemas",
      institution: "Instituto Superior Antonio Ruiz de Montoya",
      location: "Posadas, Misiones",
      sortDate: new Date(2020, 11, 1),
    },
  ],
  [
    {
      name: "Python",
      category: SkillCategory.Programming,
      level: SkillLevel.Advanced,
    },
    {
      name: "SQL",
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: "R",
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: "JavaScript",
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: "TypeScript",
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Power BI",
      category: SkillCategory.Visualization,
      level: SkillLevel.Advanced,
    },
    {
      name: "Tableau",
      category: SkillCategory.Visualization,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Excel Avanzado",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Pandas",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Advanced,
    },
    {
      name: "NumPy",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Advanced,
    },
    {
      name: "Scikit-learn",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "TensorFlow",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "PostgreSQL",
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: "MySQL",
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: "MongoDB",
      category: SkillCategory.Database,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Databricks",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    { name: "Git", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    {
      name: "Docker",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Resolución de Problemas",
      category: SkillCategory.Soft,
      level: SkillLevel.Expert,
    },
    {
      name: "Trabajo en Equipo",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Comunicación",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Pensamiento Analítico",
      category: SkillCategory.Soft,
      level: SkillLevel.Expert,
    },
    {
      name: "Tango Gestión",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Parametrización Contable",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Gestión de Datos Maestros",
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: "Procesos de Ventas",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Gestión de Stock",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Tesorería",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Gestión de Compras",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
  ]
);
