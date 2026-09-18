import { describe, expect, it } from "vitest";
import { EXPERIENCE_ITEMS } from "../experience";
import { PROFILE_DATA } from "../profile-data";

describe("employment evidence", () => {
  it("preserves entries and includes one unpaid project", () => {
    expect(EXPERIENCE_ITEMS.length).toBeGreaterThanOrEqual(4);
    expect(EXPERIENCE_ITEMS.filter(({ company }) => company === "Ucrop.it"))
      .toHaveLength(2);
    expect(EXPERIENCE_ITEMS.find(({ id }) => id === "ferreteria-centenario-2020"))
      .toMatchObject({ kind: "unpaid-project", period: "ene. 2020 – dic. 2020" });
  });

  it("keeps the profile projection synchronized", () => {
    expect(PROFILE_DATA.experience.map(({ company, period }) => ({ company, period })))
      .toEqual(EXPERIENCE_ITEMS.map(({ company, period }) => ({ company, period })));
  });

  it("orders engagements newest first", () => {
    const times = EXPERIENCE_ITEMS.map(({ sortDate }) => sortDate.getTime());
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });
});

describe("preserved evidence", () => {
  const BASELINE_CLAIMS = [
    { source: "experience", period: "dic. 2025 – mar. 2026", role: "Data Entry Specialist", company: "Ucrop.it", location: "Remoto", description: "Procesamiento y validación de datos georreferenciados" },
    { source: "experience", period: "ene. 2021 – nov. 2025", role: "Soporte técnico", company: "PcService Posadas", location: "Posadas", description: "Resolución de incidencias técnicas" },
    { source: "experience", period: "abr. 2024 – may. 2024", role: "Data Entry", company: "Ucrop.it", location: "Remoto", description: "Procesamiento y validación" },
    { source: "experience", period: "ene. 2020 – dic. 2020", role: "Soporte informático ad honorem", company: "Ferretería Centenario", location: "Posadas", description: "Implementé base de datos MySQL" },
    { source: "experience", period: "jul. 2019 – dic. 2019", role: "Coordinador de capacitación", company: "Hospital Escuela Dr. Ramón Madariaga", location: "Posadas", description: "Lideré equipo de implementación" },
  ] as const;

  for (const claim of BASELINE_CLAIMS) {
    it(`preserves ${claim.company} (${claim.period}) from ${claim.source}`, () => {
      const item = EXPERIENCE_ITEMS.find(
        ({ company, period }) => company === claim.company && period === claim.period,
      );
      expect(item).toBeDefined();
      const preservedText = JSON.stringify(item);
      expect(preservedText).toContain(claim.description.split(" ")[0]);
    });
  }
});
