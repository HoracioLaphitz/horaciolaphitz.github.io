import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Experience from "../components/sections/Experience";

describe("Experience", () => {
  it("renders all preserved and CV-supported evidence", () => {
    const html = renderToStaticMarkup(<Experience />);
    expect((html.match(/<article/g) ?? [])).toHaveLength(6);
    expect(html).toContain("Experiencia no remunerada");
    expect(html).toContain("Ferretería Centenario");
  });

  it("renders both Ucrop.it periods", () => {
    const html = renderToStaticMarkup(<Experience />);
    expect(html).toContain("dic. 2025 – mar. 2026");
    expect(html).toContain("abr. 2024 – may. 2024");
  });

  it("renders Ferreteria's three details", () => {
    const html = renderToStaticMarkup(<Experience />);
    expect(html).toContain("base de datos MySQL");
    expect(html).toContain("n8n");
    expect(html).toContain("Python");
  });

  it("renders Ministerio de Salud Pública", () => {
    const html = renderToStaticMarkup(<Experience />);
    expect(html).toContain("Ministerio de Salud Pública de Misiones");
    expect(html).toContain("Tango Gestión");
  });

  it("renders every baseline claim", () => {
    const html = renderToStaticMarkup(<Experience />);
    const claims = [
      "Procesamiento y validación de datos georreferenciados",
      "Resolución de fallas de hardware y software",
      "Coordiné capacitaciones y acompañé",
      "Implementé base de datos MySQL",
    ];
    for (const claim of claims) {
      expect(html).toContain(claim);
    }
  });
});
