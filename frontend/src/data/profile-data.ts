/**
 * Profile Data - CV Information
 * Source: CV - Horacio Nahuel Laphitz.pdf
 */

import { ProfileEntity, SkillCategory, SkillLevel } from '@domain/entities/profile.entity';

export const profileEntity = new ProfileEntity(
  'Horacio Laphitz',
  'Analista de Datos',
  [
    '',
  ],
  {
    email: 'horaciolaphitz99@gmail.com',
    location: 'Posadas, Misiones, Argentina',
    linkedin: 'https://www.linkedin.com/in/horacio-laphitz/',
    github: 'https://github.com/horaciolaphitz',
    credly: 'https://www.credly.com/users/horacio-laphitz',
  },
  [
    {
      period: 'Dic 2025 – Mar 2026',
      role: 'Procesamiento de datos georreferenciados',
      company: 'Ucrop.it',
      location: 'Remoto',
      description:
        'Procesamiento de datos georreferenciados, validación geoespacial, detección de inconsistencias mediante algoritmos de machine learning, desarrollo de agentes de IA y automatización de tareas.',
      sortDate: new Date(2025, 11, 1),
    },
    {
      period: 'Abr 2024 – May 2024',
      role: 'Procesamiento de datos georreferenciados',
      company: 'Ucrop.it',
      location: 'Remoto',
      description:
        'Procesamiento y validación de datos georreferenciados, con foco en la precisión del dato y automatización de tareas.',
      sortDate: new Date(2024, 4, 1),
    },
    {
      period: 'Ene 2021 – Nov 2025',
      role: 'Técnico en Sistemas',
      company: 'PcService Posadas',
      location: 'Posadas',
      description:
        'Mantenimiento de hardware y servidores, instalación de sistemas operativos, configuración y optimización de sistemas, y atención al cliente.',
      sortDate: new Date(2025, 10, 1),
    },
    {
      period: 'Jul 2019 – Dic 2019',
      role: 'Capacitador Técnico en Sistemas',
      company: 'Hospital Escuela Dr. Ramón Madariaga',
      location: 'Posadas',
      description:
        'Coordinación de equipo de capacitación, implementación del sistema R.I.S.mi, relevamiento de requerimientos técnicos y seguimiento del desempeño del personal.',
      sortDate: new Date(2019, 11, 1),
    },
    {
      period: 'Mar 2019 – Jun 2019',
      role: 'Asistente Administrativo Contable',
      company: 'Ministerio de Salud Pública de Misiones',
      location: 'Posadas',
      description:
        'Gestión de compras de insumos, administración de proveedores, gestión de licitaciones, uso de Tango Gestión y ERP interno, y atención a usuarios.',
      sortDate: new Date(2019, 5, 1),
    },
    {
      period: 'Ene 2020 – Dic 2020',
      role: 'Desarrollo de base de datos y automatización',
      company: 'Ferretería Centenario Posadas',
      location: 'Posadas',
      description:
        'Desarrollo de base de datos en MySQL, automatización de procesos y desarrollo de pipelines de datos con Python.',
      sortDate: new Date(2020, 11, 1),
    },
  ],
  [
    {
      period: '2026',
      title: 'SQL on Databricks',
      issuer: 'Lovelytics LATAM',
      sortDate: new Date(2026, 0, 1),
    },
    {
      period: '2025',
      title: 'Sales & Service Data Analytics Expertise',
      issuer: 'MTF Institute (Coursera)',
      certificateUrl: '/Certificaciones/Sales & Service Data Analysis & Analytics Expert.pdf',
      sortDate: new Date(2025, 0, 1),
    },
    {
      period: '2024 - 2025',
      title: 'Python for Data Science and AI',
      issuer: 'IBM',
      certificateUrl: '/Certificaciones/IBM-DATA SCIENCE - AI - DEVELOPMENT.pdf',
      sortDate: new Date(2025, 0, 1),
    },
    {
      period: '2024',
      title: 'Supervised Machine Learning: Regression and Classification',
      issuer: 'Stanford (Coursera)',
      certificateUrl: '/Certificaciones/Supervised Machine Learning_ Regression and Classification.pdf',
      sortDate: new Date(2024, 0, 1),
    },
    {
      period: '2024',
      title: 'Data Analytics Professional Certificate',
      issuer: 'Google (Coursera)',
      certificateUrl: '/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf',
      sortDate: new Date(2024, 0, 1),
    },
    {
      period: '2023',
      title: 'Ultimate Python Expertise',
      issuer: 'Udemy',
      sortDate: new Date(2023, 0, 1),
    },
    {
      period: '2023',
      title: 'Database Fundamentals',
      issuer: 'Silicon Misiones',
      certificateUrl: '/Certificaciones/SILICON MISIONES- Certificado Digital Bases de Datos.pdf',
      sortDate: new Date(2023, 0, 1),
    },
  ],
  [
    {
      period: '2023 - Sin finalizar',
      degree: 'Analista en Sistemas de Comunicación',
      institution: 'Universidad Nacional de Misiones',
      location: 'Posadas, Misiones',
      sortDate: new Date(2023, 0, 1),
    },
    {
      period: '2019 - 2020 - Sin finalizar',
      degree: 'Contador Público Nacional',
      institution: 'Universidad de la Cuenca del Plata',
      location: 'Posadas',
      sortDate: new Date(2020, 0, 1),
    },
  ],
  [
    {
      name: 'Python',
      category: SkillCategory.Programming,
      level: SkillLevel.Advanced,
    },
    {
      name: 'SQL',
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: 'R',
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'JavaScript',
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'TypeScript',
      category: SkillCategory.Programming,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Power BI',
      category: SkillCategory.DataVisualization,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Looker Studio',
      category: SkillCategory.DataVisualization,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Tableau',
      category: SkillCategory.DataVisualization,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Excel Avanzado',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Pandas',
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Advanced,
    },
    {
      name: 'NumPy',
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Scikit-learn',
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'TensorFlow',
      category: SkillCategory.DataAnalysis,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'PostgreSQL',
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: 'MySQL',
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: 'MongoDB',
      category: SkillCategory.Database,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Databricks',
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Bash',
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Windows',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Linux',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Word',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'PowerPoint',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Git',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Docker',
      category: SkillCategory.Tools,
      level: SkillLevel.Intermediate,
    },
    {
      name: 'Resolución de Problemas',
      category: SkillCategory.Soft,
      level: SkillLevel.Expert,
    },
    {
      name: 'Trabajo en Equipo',
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Comunicación',
      category: SkillCategory.Soft,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Pensamiento Analítico',
      category: SkillCategory.Soft,
      level: SkillLevel.Expert,
    },
    {
      name: 'Tango Gestión',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Parametrización Contable',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Gestión de Datos Maestros',
      category: SkillCategory.Database,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Procesos de Ventas',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Gestión de Stock',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Tesorería',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
    {
      name: 'Gestión de Compras',
      category: SkillCategory.Tools,
      level: SkillLevel.Advanced,
    },
  ]
);

export const PROFILE_DATA = {
  ...profileEntity,
  location: 'Posadas, Misiones, Argentina',
  descriptions_about: [
    'Orientación a posiciones de Analista de Datos Jr., Analista Funcional y áreas administrativas. Formación en análisis de datos, programación y gestión de información.',
    'Experiencia en procesamiento de datos, soporte técnico y tareas administrativas, con foco en Python, SQL, Power BI, Looker Studio, machine learning y gestión de información.',
    'Disponibilidad Full-Time.',
  ],
  skills: [
    'Python',
    'SQL',
    'R',
    'JavaScript',
    'TypeScript',
    'Power BI',
    'Looker Studio',
    'Tableau',
    'Excel Avanzado',
    'Pandas',
    'NumPy',
    'Scikit-learn',
    'TensorFlow',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Databricks',
    'Bash',
    'Windows',
    'Linux',
    'Word',
    'PowerPoint',
    'Git',
    'Docker',
    'Tango Gestión',
  ],
};
