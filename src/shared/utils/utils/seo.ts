// Types
export type ContentType = "website" | "article" | "profile";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: readonly string[];
  canonical?: string;
  image?: string;
  type?: ContentType;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

interface SiteConfig {
  readonly siteUrl: string;
  readonly siteName: string;
  readonly locale: string;
  readonly twitter: string;
  readonly linkedin: string;
  readonly github: string;
}

// Constants
const DEFAULT_KEYWORDS: readonly string[] = [
  "Data Analyst",
  "Data Analysis",
  "Python",
  "SQL",
  "Power BI",
  "Machine Learning",
  "Business Intelligence",
  "Data Science",
  "Portfolio",
  "Horacio Laphitz",
  "Tableau",
  "Predictive Analytics",
  "Statistical Analysis",
  "Data Visualization",
  "pandas",
  "numpy",
  "scikit-learn",
  "tensorflow",
  "deep learning",
  "excel",
  "statistics",
  "data engineering",
  "etl",
  "postgresql",
  "mysql",
  "analytics",
  "dashboards",
  "kpis",
  "reporting",
  "data mining",
  "big data",
  "r",
  "matplotlib",
  "seaborn",
  "jupyter",
  "git",
  "github",
  "api",
  "web scraping",
] as const;

export const defaultSEO: SEOConfig = {
  title: "Horacio Laphitz",
  description:
    "Analista de Datos especializado en Python, SQL, Power BI y Machine Learning.",
  keywords: DEFAULT_KEYWORDS,
  type: "profile",
  author: "Horacio Laphitz",
  image: "/img/horacio-profile-og.jpg",
} as const;

export const siteConfig: SiteConfig = {
  siteUrl: "https://horaciolaphitz.github.io",
  siteName: "Horacio Laphitz Portfolio",
  locale: "en_US",
  twitter: "@horaciolaphitz",
  linkedin: "horacio-laphitz",
  github: "horaciolaphitz",
} as const;

// Helper functions
const buildFullTitle = (title: string): string => {
  return title.includes("Horacio Laphitz")
    ? title
    : `${title} | Horacio Laphitz`;
};

const buildCanonicalUrl = (canonical: string | undefined): string => {
  if (!canonical) return "";
  return new URL(canonical, siteConfig.siteUrl).href;
};

const buildImageUrl = (image: string | undefined): string => {
  if (!image) return "";
  return new URL(image, siteConfig.siteUrl).href;
};

const formatKeywords = (keywords: readonly string[]): string => {
  return keywords.join(", ");
};

// Meta tag generation
export function generateMetaTags(config: SEOConfig): string {
  const mergedConfig = { ...defaultSEO, ...config };
  const {
    title,
    description,
    keywords = [],
    canonical,
    image,
    type = "website",
    author,
    publishedTime,
    modifiedTime,
  } = mergedConfig;

  const fullTitle = buildFullTitle(title);
  const canonicalUrl = buildCanonicalUrl(canonical);
  const ogImage = buildImageUrl(image);
  const keywordsStr = keywords.length > 0 ? formatKeywords(keywords) : "";

  return `
    <!-- SEO Meta Tags -->
    <title>${fullTitle}</title>
    <meta name="description" content="${description}" />
    ${keywordsStr ? `<meta name="keywords" content="${keywordsStr}" />` : ""}
    ${author ? `<meta name="author" content="${author}" />` : ""}
    ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}" />` : ""}
    
    <!-- Open Graph -->
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${description}" />
    ${
      canonicalUrl ? `<meta property="og:url" content="${canonicalUrl}" />` : ""
    }
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ""}
    <meta property="og:site_name" content="${siteConfig.siteName}" />
    <meta property="og:locale" content="${siteConfig.locale}" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:creator" content="${siteConfig.twitter}" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${description}" />
    ${ogImage ? `<meta name="twitter:image" content="${ogImage}" />` : ""}
    
    <!-- Article Meta (if applicable) -->
    ${
      publishedTime
        ? `<meta property="article:published_time" content="${publishedTime}" />`
        : ""
    }
    ${
      modifiedTime
        ? `<meta property="article:modified_time" content="${modifiedTime}" />`
        : ""
    }
    ${author ? `<meta property="article:author" content="${author}" />` : ""}
  `.trim();
}

// Structured data generation
interface StructuredDataPerson {
  "@context": string;
  "@type": string;
  name: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  sameAs: readonly string[];
  knowsAbout: readonly string[];
  hasOccupation: {
    "@type": string;
    name: string;
    occupationLocation: {
      "@type": string;
      name: string;
    };
    skills: readonly string[];
  };
  alumniOf: {
    "@type": string;
    name: string;
  };
  email: string;
}

export function generateStructuredData(
  config: Partial<SEOConfig> = {}
): string {
  const { description } = { ...defaultSEO, ...config };

  const structuredData: StructuredDataPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Horacio Laphitz",
    jobTitle: "Senior Data Analyst",
    description,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/img/horacio-profile-og.jpg`,
    sameAs: [
      `https://linkedin.com/in/${siteConfig.linkedin}`,
      `https://github.com/${siteConfig.github}`,
    ],
    knowsAbout: [
      "Data Analysis",
      "Python Programming",
      "SQL Database Management",
      "Power BI",
      "Machine Learning",
      "Business Intelligence",
      "Statistical Analysis",
      "Data Visualization",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Data Analyst",
      occupationLocation: {
        "@type": "Place",
        name: "Argentina",
      },
      skills: [
        "Python Programming",
        "SQL Database Management",
        "Power BI Dashboard Creation",
        "Data Visualization",
        "Statistical Analysis",
        "Machine Learning",
        "Business Intelligence",
      ],
    },
    alumniOf: {
      "@type": "Organization",
      name: "Universidad Nacional de Misiones",
    },
    email: "horaciolaphitz99@gmail.com",
  };

  return JSON.stringify(structuredData, null, 2);
}

// Page configurations
export const pageConfigs: Readonly<Record<string, Partial<SEOConfig>>> = {
  "/": {
    title: "Horacio Laphitz - Analista de Datos",
    description: "Portfolio de Horacio Laphitz.",
  },
  "/about": {
    title: "Sobre Mí",
    description:
      "Analista de Datos con experiencia en análisis predictivo y business intelligence.",
  },
  "/skills": {
    title: "Habilidades Técnicas",
    description:
      "Stack de análisis de datos: Python, SQL, Power BI, Machine Learning, Tableau.",
  },
  "/projects": {
    title: "Proyectos de Análisis de Datos",
    description:
      "Proyectos de análisis de datos y machine learning con código y documentación en GitHub.",
  },
  "/certifications": {
    title: "Certificaciones Profesionales",
    description:
      "Certificaciones en análisis de datos, machine learning y tecnologías relacionadas.",
  },
  "/contact": {
    title: "Contacto",
    description: "Disponible",
  },
} as const;

// Sitemap generation
interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const buildSitemapUrl = (path: string, currentDate: string): SitemapUrl => {
  const url =
    path === "/" ? siteConfig.siteUrl : `${siteConfig.siteUrl}${path}`;
  const priority = path === "/" ? "1.0" : "0.8";

  return {
    loc: url,
    lastmod: currentDate,
    changefreq: "monthly",
    priority,
  };
};

const formatSitemapUrl = (urlData: SitemapUrl): string => {
  return `
  <url>
    <loc>${urlData.loc}</loc>
    <lastmod>${urlData.lastmod}</lastmod>
    <changefreq>${urlData.changefreq}</changefreq>
    <priority>${urlData.priority}</priority>
  </url>`;
};

export function generateSitemap(): string {
  const pages = Object.keys(pageConfigs);
  const currentDate = new Date().toISOString();

  const urls = pages
    .map((path) => buildSitemapUrl(path, currentDate))
    .map(formatSitemapUrl)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Robots.txt generation
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.siteUrl}/sitemap.xml
Crawl-delay: 1
Disallow: /api/
Disallow: /_astro/
Disallow: /admin/
Disallow: *.json$
Disallow: *.xml$
`;
}
