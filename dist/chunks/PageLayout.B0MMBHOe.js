import { m as createAstro, n as createComponent, w as renderTemplate, s as renderComponent, v as renderSlot, t as renderHead, l as addAttribute, r as maybeRenderHead } from './astro/server.CgJg2L5V.js';
import { jsx, jsxs } from 'react/jsx-runtime';
/* empty css                          */
import { useState, useEffect } from 'react';

const SearchIcon = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: [
      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
      /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
    ]
  }
);
const MailIcon = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: [
      /* @__PURE__ */ jsx("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
      /* @__PURE__ */ jsx("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
    ]
  }
);
const LinkedinIcon = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: [
      /* @__PURE__ */ jsx("path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
      /* @__PURE__ */ jsx("rect", { x: "2", y: "9", width: "4", height: "12" }),
      /* @__PURE__ */ jsx("circle", { cx: "4", cy: "4", r: "2" })
    ]
  }
);
const GithubIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: /* @__PURE__ */ jsx("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" })
  }
);
const SendIcon = (props) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
    children: [
      /* @__PURE__ */ jsx("line", { x1: "22", y1: "2", x2: "11", y2: "13" }),
      /* @__PURE__ */ jsx("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
    ]
  }
);
const ChartBarIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      }
    )
  }
);
const CheckCircleIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    )
  }
);
const XCircleIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "2",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    )
  }
);
const FolderIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      }
    )
  }
);
const DocumentIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      }
    )
  }
);
const BookOpenIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      }
    )
  }
);
const RobotIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      }
    )
  }
);
const BriefcaseIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
      }
    )
  }
);
const PresentationChartLineIcon = (props) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor",
    ...props,
    children: /* @__PURE__ */ jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
      }
    )
  }
);

const Footer = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "bg-skin-secondary border-t border-skin-border", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-6 py-12 max-w-7xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-skin-text mb-1", children: "Horacio Laphitz" }),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/cv-horacio-laphitz.pdf",
          download: true,
          className: "inline-flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors duration-200",
          children: [
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-4 h-4",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  }
                )
              }
            ),
            "Descargar CV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://www.linkedin.com/in/horacio-laphitz/",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110",
          "aria-label": "LinkedIn",
          children: /* @__PURE__ */ jsx(LinkedinIcon, { width: "24", height: "24" })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://github.com/horaciolaphitz",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110",
          "aria-label": "GitHub",
          children: /* @__PURE__ */ jsx(GithubIcon, { width: "24", height: "24" })
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "mailto:horaciolaphitz99@gmail.com",
          className: "text-skin-muted hover:text-skin-accent transition-all duration-200 hover:scale-110",
          "aria-label": "Email",
          children: /* @__PURE__ */ jsx(MailIcon, { width: "24", height: "24" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-6 border-t border-skin-border/50 w-full", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-skin-muted text-center", children: [
      "© ",
      currentYear
    ] }) })
  ] }) }) });
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://horaciolaphitz.github.io");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Horacio Laphitz",
    image = "/img/horacio-profile-og.jpg",
    type = "website",
    keywords = [
      "Horacio Laphitz",
      "Data Analyst Argentina",
      "Business Intelligence Specialist",
      "Python Data Analysis",
      "SQL Expert",
      "Power BI Developer",
      "Machine Learning",
      "AgTech Analytics",
      "Geospatial Analysis",
      "Predictive Analytics",
      "ETL Pipelines",
      "Data Visualization",
      "Tableau",
      "Statistical Analysis",
      "PACE Methodology",
      "Market Basket Analysis",
      "Data Mining",
      "KPI Dashboards",
      "Business Intelligence",
      "Data Science Portfolio",
      "Pandas NumPy Scikit-learn",
      "PostgreSQL MySQL",
      "DAX Power Query",
      "Executive Reporting",
      "Data-Driven Decisions"
    ],
    canonical
  } = Astro2.props;
  const siteUrl = "https://horaciolaphitz.github.io";
  const fullTitle = title === "Home" ? "Horacio Laphitz - Data Analyst | Business Intelligence | Python & SQL" : `${title} | Horacio Laphitz`;
  const ogImage = new URL(image, siteUrl).href;
  const canonicalUrl = canonical ? new URL(canonical, siteUrl).href : new URL(Astro2.url.pathname, siteUrl).href;
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow"><meta name="bingbot" content="index, follow"><link rel="canonical"', '><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:site_name" content="Horacio Laphitz Portfolio"><meta property="og:locale" content="es_AR"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', `><meta property="twitter:creator" content="@horaciolaphitz"><link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%231a202c'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Arial, sans-serif' font-size='50' font-weight='bold' fill='white'%3EHL%3C/text%3E%3C/svg%3E"><meta http-equiv="X-Content-Type-Options" content="nosniff"><meta http-equiv="X-Frame-Options" content="DENY"><meta http-equiv="X-XSS-Protection" content="1; mode=block"><meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://api.github.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=SF+Pro+Display:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link rel="dns-prefetch" href="//github.com"><link rel="dns-prefetch" href="//linkedin.com"><script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Horacio Laphitz",
        "jobTitle": "Data Analyst & Business Intelligence Specialist",
        "description": "Data Analyst especializado en convertir datos complejos en decisiones estrat\xE9gicas. Reduje costos operativos 30% mediante an\xE1lisis predictivo en AgTech. Experto en Python, SQL, Power BI y Machine Learning con metodolog\xEDa PACE.",
        "url": "https://horaciolaphitz.github.io",
        "image": "https://horaciolaphitz.github.io/img/horacio-profile-og.jpg",
        "email": "horaciolaphitz99@gmail.com",
        "sameAs": [
          "https://linkedin.com/in/horacio-laphitz",
          "https://github.com/horaciolaphitz",
          "https://www.credly.com/users/horacio-laphitz"
        ],
        "knowsAbout": [
          "Data Analysis",
          "Python Programming",
          "SQL Database Management",
          "Power BI",
          "Tableau",
          "Machine Learning",
          "Statistical Analysis",
          "Predictive Analytics",
          "Data Visualization",
          "Excel Advanced",
          "R Programming",
          "PACE Methodology",
          "Data Science",
          "Big Data",
          "Data Mining"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Google Data Analytics Professional Certificate",
            "credentialCategory": "certificate",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Google"
            }
          },
          {
            "@type": "EducationalOccupationalCredential",
            "name": "IBM Data Science Professional Certificate",
            "credentialCategory": "certificate",
            "recognizedBy": {
              "@type": "Organization",
              "name": "IBM"
            }
          },
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Supervised Machine Learning",
            "credentialCategory": "certificate",
            "recognizedBy": {
              "@type": "Organization",
              "name": "Stanford University"
            }
          }
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Senior Data Analyst",
          "occupationLocation": {
            "@type": "Place",
            "name": "Argentina",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "AR"
            }
          },
          "skills": [
            "Python Programming (Pandas, NumPy, Scikit-learn)",
            "SQL Database Management (PostgreSQL, MySQL)",
            "Power BI Dashboard Development",
            "Tableau Data Visualization",
            "Machine Learning Model Development",
            "Statistical Analysis & Hypothesis Testing",
            "ETL Pipeline Development",
            "Data Cleaning & Preprocessing",
            "Predictive Analytics",
            "Business Intelligence Strategy",
            "KPI Definition & Tracking",
            "Data Storytelling",
            "Google Analytics",
            "Excel Advanced (VBA, Power Query)",
            "R Programming (ggplot2, dplyr)",
            "Git Version Control",
            "Agile Methodologies",
            "PACE Methodology"
          ],
          "responsibilities": "Transform complex datasets into actionable business insights, develop predictive models, create executive dashboards, automate data pipelines, and communicate findings to stakeholders."
        },
        "alumniOf": [
          {
            "@type": "EducationalOrganization",
            "name": "Google Career Certificates"
          },
          {
            "@type": "EducationalOrganization",
            "name": "IBM"
          },
          {
            "@type": "EducationalOrganization",
            "name": "Stanford University"
          }
        ],
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance Data Analytics Consultant"
        },
        "seeks": {
          "@type": "JobPosting",
          "title": "Data Analyst, Business Intelligence Analyst, Data Scientist",
          "employmentType": ["FULL_TIME", "CONTRACTOR", "FREELANCE"],
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "AR"
            }
          }
        }
      }
    <\/script><link rel="manifest" href="/manifest.json"><link rel="sitemap" href="/sitemap.xml"><meta name="generator"`, '><script type="module" src="https://embedding.tableauusercontent.com/tableau.embedding.3.latest.min.js"><\/script>', '</head> <body class="relative"> ', " ", " </body></html>"])), fullTitle, addAttribute(description, "content"), addAttribute(canonicalUrl, "href"), addAttribute(type, "content"), addAttribute(canonicalUrl, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(canonicalUrl, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), addAttribute(Astro2.generator, "content"), renderHead(), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", Footer, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Horacio/Desktop/Porfolio/src/presentation/components/layout/Footer.tsx", "client:component-export": "default" }));
}, "C:/Users/Horacio/Desktop/Porfolio/src/presentation/layouts/Layout.astro", void 0);

const Logo = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };
  return /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center ${className}`, children: /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 dark:from-neutral-300 dark:to-neutral-100 flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md`, children: /* @__PURE__ */ jsx("span", { className: "text-white dark:text-neutral-900 font-bold text-sm", children: "HL" }) }) });
};

const useTheme = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };
  return { theme, toggleTheme };
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: toggleTheme,
      className: "relative p-2.5 rounded-xl bg-skin-secondary border border-skin-border text-skin-text hover:text-skin-accent hover:border-skin-accent hover:bg-skin-accent/5 transition-all duration-300 group overflow-hidden shadow-sm",
      "aria-label": `Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`,
      title: `Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-skin-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
        /* @__PURE__ */ jsx("div", { className: "relative", children: theme === "light" ? (
          // Icono de luna con estrellas para modo oscuro
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" }) })
        ) : (
          // Icono de sol con rayos para modo claro
          /* @__PURE__ */ jsx("svg", { className: "w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" }) })
        ) })
      ]
    }
  );
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: "Inicio", path: "#inicio" },
    { name: "Proyectos", path: "#proyectos" },
    { name: "Servicios", path: "#services" },
    { name: "Experiencia", path: "#timeline" },
    { name: "Contacto", path: "#contacto" }
  ];
  const handleNavClick = (e, path) => {
    if (path.startsWith("#")) {
      e.preventDefault();
      if (window.location.pathname === "/") {
        const element = document.querySelector(path);
        if (element) {
          const offset = 56;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      } else {
        window.location.href = `/${path}`;
      }
      setIsMenuOpen(false);
    } else if (!path.startsWith("http")) {
      setIsMenuOpen(false);
    }
  };
  return /* @__PURE__ */ jsx("nav", { className: "fixed top-0 left-0 right-0 z-50 bg-skin-primary/95 backdrop-blur-xl border-b border-skin-border", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 max-w-7xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "flex items-center gap-2 text-skin-text hover:opacity-70 transition-opacity duration-200",
          children: /* @__PURE__ */ jsx(Logo, { size: "sm" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-1", children: [
        navItems.map((item) => /* @__PURE__ */ jsx(
          "a",
          {
            href: item.path,
            onClick: (e) => handleNavClick(e, item.path),
            className: "px-4 py-2 text-sm font-medium text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg",
            children: item.name
          },
          item.path
        )),
        /* @__PURE__ */ jsx("div", { className: "ml-3 pl-3 border-l border-skin-border", children: /* @__PURE__ */ jsx(ThemeToggle, {}) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ThemeToggle, {}),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsMenuOpen(!isMenuOpen),
            className: "p-2 text-skin-muted hover:text-skin-text transition-colors duration-200 rounded-lg",
            "aria-label": "Toggle menu",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: isMenuOpen ? /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M6 18L18 6M6 6l12 12"
                  }
                ) : /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M4 6h16M4 12h16M4 18h16"
                  }
                )
              }
            )
          }
        )
      ] })
    ] }),
    isMenuOpen && /* @__PURE__ */ jsx("div", { className: "md:hidden py-4 border-t border-skin-border", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: navItems.map((item) => /* @__PURE__ */ jsx(
      "a",
      {
        href: item.path,
        onClick: (e) => handleNavClick(e, item.path),
        className: "px-4 py-2.5 text-sm font-medium text-skin-muted hover:text-skin-text hover:bg-skin-secondary transition-all duration-200 rounded-lg",
        children: item.name
      },
      item.path
    )) }) })
  ] }) });
};

const $$Astro = createAstro("https://horaciolaphitz.github.io");
const $$PageLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PageLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title, "description": description }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Horacio/Desktop/Porfolio/src/presentation/components/layout/Navigation.tsx", "client:component-export": "default" })} ${maybeRenderHead()}<main class="pt-14 min-h-screen bg-skin-primary"> ${renderSlot($$result2, $$slots["default"])} </main> ` })}`;
}, "C:/Users/Horacio/Desktop/Porfolio/src/presentation/layouts/PageLayout.astro", void 0);

export { $$PageLayout as $, BookOpenIcon as B, ChartBarIcon as C, DocumentIcon as D, FolderIcon as F, GithubIcon as G, LinkedinIcon as L, MailIcon as M, PresentationChartLineIcon as P, RobotIcon as R, SearchIcon as S, XCircleIcon as X, BriefcaseIcon as a, CheckCircleIcon as b, SendIcon as c };
