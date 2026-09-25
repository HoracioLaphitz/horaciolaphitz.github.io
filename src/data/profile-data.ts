/**
 * Profile Data - CV Information
 * Source: CV - Horacio Nahuel Laphitz.pdf
 */

import {
  ProfileEntity,
  SkillCategory,
  SkillLevel,
} from "@domain/entities/profile.entity";
import { EXPERIENCE_ITEMS } from "./experience";

const PROFILE_EXPERIENCE = EXPERIENCE_ITEMS.map(({ period, role, company, location, description, sortDate }) => ({
  period, role, company, location, description, sortDate,
}));

export const PROFILE_DATA = new ProfileEntity(
  "Horacio Laphitz",
  "",
  [
    "Resuelvo problemas de equipos y redes, brindo soporte técnico de primer nivel y acompaño a usuarios. Windows, Linux, Active Directory, Microsoft 365 y gestión de tickets. Análisis de datos con Python y SQL como capacidad complementaria.",

  ],
  {
    email: "horaciolaphitz99@gmail.com",
    location: "Posadas, Misiones, Argentina",
    linkedin: "https://www.linkedin.com/in/horacio-laphitz/",
    github: "https://github.com/horaciolaphitz",
    credly: "https://www.credly.com/users/horacio-laphitz",
  },
  PROFILE_EXPERIENCE,
  [
    {
      period: "feb. 2026",
      title: "SQL con Databricks",
      issuer: "Lovelytics Latam",
      sortDate: new Date(2026, 1, 1),
    },
    {
      period: "may. 2024",
      title: "Supervised Machine Learning",
      issuer: "Stanford University - Coursera",
      certificateUrl:
        "/Certificaciones/Supervised Machine Learning_ Regression and Classification.pdf",
      sortDate: new Date(2024, 4, 1),
    },
    {
      period: "abr. 2024",
      title: "Python for Data Engineering",
      issuer: "IBM - Coursera",
      certificateUrl: "/Certificaciones/IBM-python-data-engineering.pdf",
      credlyBadgeId: "78a917fc-2fee-416b-a3c4-d14f3cd09541",
      sortDate: new Date(2024, 3, 1),
    },
    {
      period: "mar. 2024",
      title: "Certificado Profesional de Análisis de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf",
      sortDate: new Date(2024, 2, 1),
    },
    {
      period: "mar. 2024",
      title: "Fundamentos de Ciencia de Datos",
      issuer: "Google Careers - Coursera",
      certificateUrl: "/Certificaciones/Fundamentos de ciencia de datos.pdf",
      sortDate: new Date(2024, 2, 1),
    },
    {
      period: "feb. 2024",
      title: "Python for Data Science, AI & Development",
      issuer: "IBM - Coursera",
      certificateUrl:
        "/Certificaciones/IBM-DATA SCIENCE - AI - DEVELOPMENT.pdf",
      credlyBadgeId: "57d36636-8b10-4218-a641-7cd6fcf9d8fe",
      sortDate: new Date(2024, 1, 1),
    },
    {
      period: "feb. 2024",
      title: "Análisis computacional de Datos en R",
      issuer: "Google Careers - Coursera",
      certificateUrl:
        "/Certificaciones/GOOGLE-Analisis-computacional-de-datos-R.pdf",
      sortDate: new Date(2024, 1, 1),
    },
  ],
  [
    {
      period: "2023 – actualidad",
      degree: "Analista en Sistemas de Comunicación",
      institution: "Universidad Nacional de Misiones",
      institutionUrl: "https://www.fceqyn.unam.edu.ar/carreras/analista-en-sistemas-de-computacion/",
      location: "Posadas, Misiones",
      sortDate: new Date(2023, 0, 1),
    },
    {
      period: "2019 – 2020",
      degree: "Contador Público Nacional (ciclo básico)",
      institution: "Universidad de la Cuenca del Plata",
      institutionUrl: "https://www.ucp.edu.ar/carreras/contador-publico/",
      location: "Posadas, Misiones",
      sortDate: new Date(2020, 0, 1),
    },
  ],
  [
    // Soporte IT y Hardware (fuente de la verdad - bloque principal)
    {
      name: "Soporte técnico IT",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Mesa de ayuda (Help Desk)",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Diagnóstico de hardware",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Mantenimiento preventivo y correctivo",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Windows 10/11",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Windows Server",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Active Directory",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Linux",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Microsoft 365",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Microsoft Teams",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Redes TCP/IP",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "VPN",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "DNS / DHCP",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Gestión de tickets",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "SCCM",
      category: SkillCategory.Tools,
      level: SkillLevel.Beginner,
    },
    {
      name: "Acceso remoto (RDP/TeamViewer)",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Periféricos e impresoras",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Backups y recuperación",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Resolución de incidencias",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Atención al usuario",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Capacitación de usuarios",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Relevamiento de necesidades",
      category: SkillCategory.Soft,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Documentación técnica",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: "Implementación de sistemas",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Organización documental",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    // Habilidades blandas transversales
    {
      name: "Comunicación efectiva",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Escucha activa",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Empatía",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Manejo del estrés",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Gestión del tiempo",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Proactividad",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Adaptabilidad",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Trabajo en equipo",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Aprendizaje continuo",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    // GenAI & LLMs
    {
      name: "Python",
      category: SkillCategory.Programming,
      level: SkillLevel.Advanced,
    },
    {
      name: "LangChain",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "LangGraph",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "CrewAI",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Autogen/AG2",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Claude Agent SDK",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Google ADK",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "OpenAI Agents SDK",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "RAG",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "LlamaIndex",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Vector Databases",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "OpenAI API",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Prompt Engineering",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Descomposición de tareas",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Enrutamiento supervisor",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Subagentes especializados",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Human-in-the-loop",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "MCP",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "A2A",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Evaluación de agentes",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Observabilidad de agentes",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Gobernanza de agentes",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "ETL",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "EDA",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Análisis multivariante",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Análisis estadístico",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Limpieza y preparación de datos",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Advanced,
    },
    {
      name: "Estadística descriptiva",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Pruebas de hipótesis e inferencia",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Correlación",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Chi-cuadrado",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Series temporales",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Segmentación y RFM",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Reglas de asociación (Market Basket)",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Aprendizaje supervisado",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Aprendizaje no supervisado",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Regresión",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Clasificación",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Clustering",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Ingeniería de variables",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Selección de variables",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Reducción de dimensionalidad",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "PCA",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Validación y métricas",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Ajuste de hiperparámetros",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Transfer Learning",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    // Data Analysis
    {
      name: "SQL",
      category: SkillCategory.Database,
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
      name: "XGBoost",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Deep Learning",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Computer Vision",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Market Basket Analysis",
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Power BI",
      category: SkillCategory.Visualization,
      level: SkillLevel.Advanced,
    },
    {
      name: "Matplotlib",
      category: SkillCategory.Visualization,
      level: SkillLevel.Intermediate,
    },
    {
      name: "R",
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: "TensorFlow",
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    // Databases
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
      name: "BigQuery",
      category: SkillCategory.Database,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Databricks",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "SQLite",
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    // Dev Tools
    { name: "Git", category: SkillCategory.Tools, level: SkillLevel.Advanced },
    {
      name: "Docker",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Streamlit",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Web Scraping",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Testing",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Excel avanzado",
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    // Habilidades interpersonales
    {
      name: "Resolución de problemas",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Pensamiento analítico",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Comunicación",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: "Trabajo en equipo",
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    // Tango Gestión (ERP)
    {
      name: "Parametrización contable",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Gestión de datos maestros",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Gestión de stock",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Procesos de ventas",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Tesorería",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: "Gestión de compras",
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
  ],
);
