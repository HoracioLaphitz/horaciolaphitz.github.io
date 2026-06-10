import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect, useMemo } from 'react';
import { D as DocumentIcon, P as PresentationChartLineIcon, a as BriefcaseIcon, C as ChartBarIcon, R as RobotIcon, S as SearchIcon, F as FolderIcon } from './PageLayout.BKcrRO6v.js';

const ProjectCard = ({ title, description, slug, category, tags, github, dashboard }) => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryIcons = {
    "Machine Learning": /* @__PURE__ */ jsx(RobotIcon, { className: "w-6 h-6" }),
    "Análisis de datos": /* @__PURE__ */ jsx(ChartBarIcon, { className: "w-6 h-6" }),
    "Business Intelligence": /* @__PURE__ */ jsx(BriefcaseIcon, { className: "w-6 h-6" }),
    "Data Visualization": /* @__PURE__ */ jsx(PresentationChartLineIcon, { className: "w-6 h-6" })
  };
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: "group relative bg-skin-secondary border border-skin-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-primary/50",
      style: { boxShadow: isHovered ? "var(--md-elevation-3)" : "var(--md-elevation-1)" },
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary group-hover:scale-110 transition-transform duration-200", children: categoryIcons[category] || /* @__PURE__ */ jsx(DocumentIcon, { className: "w-5 h-5" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-skin-muted uppercase tracking-wide", children: category })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-skin-text mb-3 group-hover:text-brand-primary transition-colors duration-200 line-clamp-2", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-skin-muted mb-4 leading-relaxed line-clamp-3 flex-grow", children: description }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [
            tags.slice(0, 3).map((tag, idx) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "text-xs px-3 py-1.5 bg-skin-primary text-accent-primary border-2 border-accent-primary/30 rounded-full font-medium hover:border-accent-primary hover:shadow-sm transition-all duration-200",
                children: tag
              },
              idx
            )),
            tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "text-xs px-3 py-1.5 bg-skin-primary text-accent-primary border-2 border-accent-primary/30 rounded-full font-medium", children: [
              "+",
              tags.length - 3
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-auto pt-4 border-t border-skin-border/50", children: [
            github && /* @__PURE__ */ jsxs(
              "a",
              {
                href: github,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-text hover:text-brand-primary bg-skin-primary hover:bg-brand-primary/10 rounded-lg transition-all duration-200",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) }),
                  "Código"
                ]
              }
            ),
            dashboard && /* @__PURE__ */ jsxs(
              "a",
              {
                href: dashboard,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-text hover:text-brand-primary bg-skin-primary hover:bg-brand-primary/10 rounded-lg transition-all duration-200",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }) }),
                  "Dashboard"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: `/proyectos/${slug}`,
                className: "flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-skin-primary bg-brand-primary hover:bg-brand-hover rounded-lg transition-all duration-200 ml-auto",
                children: [
                  "Ver más",
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-brand-primary/5" }) })
      ]
    }
  );
};

const ProjectFilters = ({
  selectedCategory,
  categories,
  onCategoryChange,
  totalPosts,
  filteredCount
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-3 mb-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onCategoryChange("all"),
          className: `px-6 py-2 font-medium rounded-lg transition-all duration-200 ${selectedCategory === "all" ? "bg-brand-primary text-white" : "bg-skin-primary border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"}`,
          children: "Mostrar todo"
        }
      ),
      categories.map((cat) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => onCategoryChange(cat),
          className: `px-6 py-2 font-medium rounded-lg transition-all duration-200 ${selectedCategory === cat ? "bg-brand-primary text-white" : "bg-skin-primary border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"}`,
          children: cat
        },
        cat
      ))
    ] }),
    filteredCount !== totalPosts && /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-skin-muted", children: [
      "Mostrando ",
      filteredCount,
      " de ",
      totalPosts,
      " proyectos"
    ] })
  ] });
};

const ProjectCategories = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
    }
  }, []);
  const projectCategories = useMemo(() => {
    const categories = /* @__PURE__ */ new Set();
    posts.forEach((project) => {
      categories.add(project.category);
    });
    return Array.from(categories).sort();
  }, [posts]);
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const searchableText = [p.title, p.description, p.category, ...p.tags].join(" ").toLowerCase();
        return searchableText.includes(query);
      });
    }
    return filtered;
  }, [posts, selectedCategory, searchQuery]);
  const getAnimationClass = (index) => `transition-all duration-700 delay-${index * 100} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`;
  return /* @__PURE__ */ jsx(
    "section",
    {
      id: "proyectos",
      className: "min-h-screen bg-skin-secondary py-16 lg:py-24",
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsx(
          "header",
          {
            className: `mb-12 lg:mb-16 text-center ${getAnimationClass(0)}`,
            children: /* @__PURE__ */ jsx("h2", { className: "text-4xl sm:text-5xl lg:text-6xl font-bold text-skin-text mb-6", children: "Proyectos" })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: getAnimationClass(1), children: /* @__PURE__ */ jsx(
          ProjectFilters,
          {
            categories: projectCategories,
            selectedCategory,
            onCategoryChange: setSelectedCategory,
            searchQuery,
            onSearchChange: setSearchQuery,
            totalPosts: posts.length,
            filteredCount: filteredPosts.length
          }
        ) }),
        filteredPosts.length > 0 && /* @__PURE__ */ jsx("div", { className: `mb-12 ${getAnimationClass(2)}`, children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: filteredPosts.map((project) => /* @__PURE__ */ jsx(
          ProjectCard,
          {
            title: project.title,
            description: project.description,
            slug: project.slug,
            category: project.category,
            tags: project.tags,
            github: project.githubUrl,
            dashboard: project.dashboardUrl
          },
          project.slug
        )) }) }),
        filteredPosts.length === 0 && /* @__PURE__ */ jsxs("div", { className: `text-center py-16 ${getAnimationClass(2)}`, children: [
          /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4 flex justify-center", children: searchQuery ? /* @__PURE__ */ jsx(SearchIcon, { className: "w-16 h-16 text-skin-muted" }) : /* @__PURE__ */ jsx(FolderIcon, { className: "w-16 h-16 text-skin-muted" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-skin-text mb-2", children: searchQuery ? `No se encontraron resultados para "${searchQuery}"` : "No se encontraron resultados con estos filtros" }),
          /* @__PURE__ */ jsx("p", { className: "text-skin-muted mb-6", children: "Probá con otros términos de búsqueda o ajustá los filtros" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-center flex-wrap", children: [
            searchQuery && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSearchQuery(""),
                className: "px-6 py-3 bg-skin-secondary border border-skin-border hover:border-skin-accent text-skin-text font-semibold rounded-lg transition-all duration-300",
                children: "Limpiar búsqueda"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                },
                className: "px-6 py-3 bg-brand-primary hover:bg-brand-hover text-skin-primary font-semibold rounded-lg transition-all duration-300",
                children: "Mostrar todo"
              }
            )
          ] })
        ] })
      ] })
    }
  );
};

export { ProjectCategories as P };
