import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const userFacingSources = [
  "src/presentation/components/proyectos/ProjectCard.tsx",
  "src/presentation/components/proyectos/FeaturedProject.astro",
  "src/presentation/components/proyectos/ResourceDownload.tsx",
  "src/presentation/components/sections/CertificateModal.tsx",
];

describe("copy wrapping regression", () => {
  it("does not truncate user-facing project or resource copy", () => {
    const forbiddenTruncation = /\b(?:line-clamp-\d+|truncate|text-ellipsis|whitespace-nowrap)\b/;

    for (const source of userFacingSources) {
      expect(readFileSync(resolve(process.cwd(), source), "utf8"), source).not.toMatch(
        forbiddenTruncation,
      );
    }
  });
});
