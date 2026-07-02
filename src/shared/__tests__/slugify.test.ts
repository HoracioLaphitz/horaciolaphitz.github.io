import { describe, it, expect } from "vitest";
import { slugify } from "../slugify";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Pandas Profiling")).toBe("pandas-profiling");
  });

  it("strips accents and em dashes", () => {
    expect(slugify("Red Neuronal — Predicción de Terremotos")).toBe(
      "red-neuronal-prediccion-de-terremotos"
    );
  });

  it("collapses repeated separators and trims edges", () => {
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });

  it("handles underscores same as spaces", () => {
    expect(slugify("Red_Clasificacion_Optimizado")).toBe(
      "red-clasificacion-optimizado"
    );
  });
});
