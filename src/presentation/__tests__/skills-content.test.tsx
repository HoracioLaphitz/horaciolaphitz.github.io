import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PROFILE_DATA } from "@data/profile-data";
import Skills, {
  SKILL_TIERS,
  getVisibleSkillTiers,
} from "@presentation/components/sections/Skills";

const coreSkills = [
  "Python",
  "SQL",
  "Power BI",
  "Excel avanzado",
  "Pandas",
  "PostgreSQL",
  "MySQL",
  "Git",
];

const dataAutomationSkills = [
  "ETL",
  "Limpieza y preparación de datos",
  "Análisis estadístico",
  "Scikit-learn",
  "Streamlit",
  "Web Scraping",
  "SQLite",
  "Databricks",
  "BigQuery",
  "XGBoost",
  "Docker",
  "Testing",
];

const appliedAiSkills = [
  "RAG",
  "LangChain",
  "LangGraph",
  "OpenAI API",
  "Prompt Engineering",
];

describe("skills presentation", () => {
  it("keeps the display configuration backed by profile data and free of duplicates", () => {
    const configuredNames = SKILL_TIERS.flatMap(({ names }) => names);
    const profileNames = new Set(PROFILE_DATA.skills.map(({ name }) => name));

    expect(configuredNames.filter((name) => !profileNames.has(name))).toEqual([]);
    expect(configuredNames).toHaveLength(new Set(configuredNames).size);
  });

  it("exposes the three-tier system with correct skills", () => {
    const tiers = getVisibleSkillTiers(PROFILE_DATA.skills);
    const core = tiers.find(({ label }) => label === "Core");
    const dataAutomation = tiers.find(({ label }) => label === "Datos y automatización");
    const appliedAi = tiers.find(({ label }) => label === "IA aplicada (en estudio)");

    // Sort both arrays for comparison since order may differ
    const sortByName = (a: string, b: string) => a.localeCompare(b);
    expect(core?.skills.map(({ name }) => name).sort(sortByName)).toEqual([...coreSkills].sort(sortByName));
    expect(dataAutomation?.skills.map(({ name }) => name).sort(sortByName)).toEqual([...dataAutomationSkills].sort(sortByName));
    expect(appliedAi?.skills.map(({ name }) => name).sort(sortByName)).toEqual([...appliedAiSkills].sort(sortByName));
  });

  it("renders only non-empty groups in an intrinsically aligned grid", () => {
    const tiers = getVisibleSkillTiers(PROFILE_DATA.skills);
    const html = renderToStaticMarkup(<Skills />);

    expect(tiers.every(({ skills }) => skills.length > 0)).toBe(true);
    expect(html).toContain("items-start");
    expect(html).toContain("Core");
    expect(html).toContain("Datos y automatización");
    expect(html).toContain("IA aplicada (en estudio)");
  });
});
