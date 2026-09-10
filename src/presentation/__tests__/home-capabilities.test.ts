import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const heroSource = readFileSync(
  resolve(process.cwd(), "src/presentation/components/sections/Hero.tsx"),
  "utf8",
);

const aboutSource = readFileSync(
  resolve(process.cwd(), "src/presentation/components/sections/About.tsx"),
  "utf8",
);

const featuredSectionSource = readFileSync(
  resolve(process.cwd(), "src/presentation/components/sections/FeaturedProjects.astro"),
  "utf8",
);

const featuredCardSource = readFileSync(
  resolve(process.cwd(), "src/presentation/components/proyectos/FeaturedProject.astro"),
  "utf8",
);

const featuredCopy = [
  "ai-sales-assistant.md",
  "nb-capitalizacion-bancos-etl.md",
  "dashboards-ventas-marketing-powerbi.md",
  "sano-y-fresco-market-basket.md",
]
  .map((name) =>
    readFileSync(resolve(process.cwd(), "src/content/proyectos", name), "utf8"),
  )
  .join("\n");

describe("home capability presentation", () => {
  it("Hero renders Enterprise AI evidence in a collapsible details element", () => {
    expect(heroSource).toContain("ENTERPRISE_AI_EVIDENCE");
    expect(heroSource).toContain("capability.claimId");
    expect(heroSource).toContain("capability.scope");
    expect(heroSource).toContain("<details");
    expect(heroSource).toContain("Pruebas y estudios con IA");
  });

  it("retains project discovery and avoids unsupported enterprise case-study language", () => {
    expect(heroSource).toContain('href="#proyectos"');
    expect(featuredSectionSource).toContain('id="proyectos"');
    expect(heroSource).not.toMatch(/client|production|deployed|security assurance/i);
  });

  it("states the data and process-automation positioning", () => {
    expect(heroSource).toContain(
      "Analista de datos orientado a la automatización de procesos",
    );
  });

  it("qualifies private agent infrastructure as an area in development", () => {
    expect(aboutSource).toContain(
      "Flujos con agentes",
    );
    expect(aboutSource).toContain(
      "Desarrollo pruebas propias con RAG y agentes",
    );
    expect(aboutSource).toContain('status: "En desarrollo"');
    expect(aboutSource).not.toContain('status: "Aplicado"');
    expect(aboutSource).toContain("R.I.S.mi");
    expect(aboutSource).toMatch(/requerimientos técnicos/i);
    expect(aboutSource).toMatch(/soporte corporativo/i);
    expect(aboutSource).not.toContain(
      "Agentes y Subagentes autónomos en infraestructura privada",
    );
    expect(aboutSource).not.toContain(
      "Los datos son tuyos, y tenes control total sobre ellos.",
    );
  });

  it("shows an explicit evidence boundary for every featured project", () => {
    expect(featuredCardSource).toContain("showcase.limit");
    expect(featuredCardSource).toContain("Alcance");
    expect(featuredCopy.match(/^\s+limit:/gm)).toHaveLength(4);
  });

  it("keeps homepage Olist copy free of the omitted volume and seller counts", () => {
    const olistShowcase = readFileSync(
      resolve(process.cwd(), "src/content/proyectos/ai-sales-assistant.md"),
      "utf8",
    ).split("draft: false", 1)[0];

    expect(olistShowcase).not.toMatch(/100\.000 órdenes|2\.433 vendedores/i);
  });

  it("keeps interactive certifications on home without a duplicate route", () => {
    const home = readFileSync(resolve(process.cwd(), "src/pages/index.astro"), "utf8");

    expect(home).toContain("<Certifications client:visible />");
    expect(existsSync(resolve(process.cwd(), "src/pages/certificaciones.astro"))).toBe(false);
  });
});
