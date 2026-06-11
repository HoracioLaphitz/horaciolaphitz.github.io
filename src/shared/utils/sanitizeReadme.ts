/**
 * README Text Sanitization
 * Corrige errores ortográficos comunes en READMEs de proyectos
 * para que el contenido se vea profesional aunque venga mal escrito de GitHub.
 *
 * Se aplica ANTES del renderizado con marked.parse().
 * Preserva bloques de código y código inline.
 */

interface ReplacementRule {
  test: (text: string) => boolean;
  apply: (text: string) => string;
  description: string;
}

const REPLACEMENT_RULES: ReplacementRule[] = [
  // --- Errores específicos de términos técnicos ---
  {
    description: "pyton → Python (case-insensitive)",
    test: /pyton/i.test.bind(/pyton/i),
    apply: (t: string) => t.replace(/pyton/gi, "Python"),
  },
  {
    description: "webscrapping → web scraping",
    test: /webscrapping/i.test.bind(/webscrapping/i),
    apply: (t: string) => t.replace(/webscrapping/gi, "web scraping"),
  },
  {
    description: "Webscrapping → Web Scraping (inicial mayúscula)",
    test: /Webscrapping/.test.bind(/Webscrapping/),
    apply: (t: string) => t.replace(/Webscrapping/g, "Web Scraping"),
  },

  // --- Errores de acentuación en español ---
  {
    description: 'analisis → análisis ("Analisis" → "Análisis")',
    test: (t: string) => /\b[Aa]nalisis\b/.test(t),
    apply: (t: string) =>
      t.replace(/\bAnalisis\b/g, "Análisis").replace(/\banalisis\b/g, "análisis"),
  },
  {
    description: 'tecnica → técnica ("Tecnica" → "Técnica")',
    test: (t: string) => /\b[Tt]ecnica\b/.test(t),
    apply: (t: string) =>
      t.replace(/\bTecnica\b/g, "Técnica").replace(/\btecnica\b/g, "técnica"),
  },
  {
    description: 'automatico → automático ("Automatico" → "Automático")',
    test: (t: string) => /\b[Aa]utomatico\b/.test(t),
    apply: (t: string) =>
      t
        .replace(/\bAutomatico\b/g, "Automático")
        .replace(/\bautomatico\b/g, "automático"),
  },
  {
    description:
      'exploratorio → exploratorio ("Exploratorio" → "Exploratorio" con tilde)',
    test: (t: string) => /\b[Ee]xploratorio\b/.test(t),
    apply: (t: string) =>
      t
        .replace(/\bExploratorio\b/g, "Exploratorio")
        .replace(/\bexploratorio\b/g, "exploratorio"),
  },

  // --- Errores compuestos conocidos ---
  {
    description: '"Analisis exploratorio" → "Análisis exploratorio"',
    test: /Analisis\s+exploratorio/i.test.bind(/Analisis\s+exploratorio/i),
    apply: (t: string) =>
      t.replace(/Analisis exploratorio/gi, "Análisis exploratorio"),
  },
];

/**
 * Aplica todas las reglas de reemplazo a un texto dado.
 * Preserva bloques de código (```...```) y código inline (`...`)
 * para no modificar código fuente.
 */
export function sanitizeReadmeText(raw: string): string {
  if (!raw) return raw;

  // Preservar bloques de código y código inline durante el sanitizado
  const placeholders: string[] = [];
  let processed = raw;

  // Extraer bloques de código (```...```)
  processed = processed.replace(/```[\s\S]*?```/g, (match) => {
    const index = placeholders.length;
    placeholders.push(match);
    return `\x00CODEBLOCK${index}\x00`;
  });

  // Extraer código inline (`...`)
  processed = processed.replace(/`[^`\n]+`/g, (match) => {
    const index = placeholders.length;
    placeholders.push(match);
    return `\x00CODEBLOCK${index}\x00`;
  });

  // Aplicar reglas de reemplazo
  for (const rule of REPLACEMENT_RULES) {
    if (rule.test(processed)) {
      processed = rule.apply(processed);
    }
  }

  // Restaurar bloques preservados
  processed = processed.replace(/\x00CODEBLOCK(\d+)\x00/g, (_, indexStr) => {
    const index = parseInt(indexStr, 10);
    return placeholders[index] || "";
  });

  return processed;
}
