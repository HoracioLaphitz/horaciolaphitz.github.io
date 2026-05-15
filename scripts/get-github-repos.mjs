import fs from "fs";

const GITHUB_USERNAME = "horaciolaphitz";
const MAX_README_LENGTH = 1000; // Limitar el tamaño del README para mejor rendimiento
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
const OUTPUT_PATH = "src/data/github-repos-simple.json";

// Validación de entrada para prevenir inyección
const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  // Remover caracteres potencialmente peligrosos
  return str.replace(/[<>\"']/g, "").trim();
};

const validateGitHubToken = (token) => {
  if (!token) return false;
  // Validar formato básico de token de GitHub (ghp_, gho_, etc.)
  return /^(ghp_|gho_|ghu_|ghs_|ghr_)[a-zA-Z0-9]{36,}$/.test(token);
};

const cleanMarkdown = (content) => {
  if (!content) return "";

  return (
    content
      // Remover imágenes y badges
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, "")
      // Limpiar headers excesivos
      .replace(/^#{4,6}\s+/gm, "")
      // Limpiar código excesivo
      .replace(/```[\s\S]*?```/g, "[Código disponible en el repositorio]")
      // Limpiar links complejos
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Limpiar saltos de línea excesivos
      .replace(/\n{3,}/g, "\n\n")
      // Truncar si es muy largo
      .substring(0, MAX_README_LENGTH)
      .trim()
  );
};

const getLanguageStats = async (repoName, headers = {}) => {
  try {
    const sanitizedRepoName = sanitizeString(repoName);
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${sanitizedRepoName}/languages`,
      {
        headers,
        signal: AbortSignal.timeout(5000), // Timeout de 5 segundos
      }
    );
    if (response.ok) {
      const languages = await response.json();
      // Validar que la respuesta sea un objeto
      if (typeof languages === "object" && languages !== null) {
        return Object.keys(languages);
      }
    }
  } catch (error) {
    console.warn(`Could not fetch languages for ${repoName}:`, error.message);
  }
  return [];
};

const isCacheValid = () => {
  try {
    if (!fs.existsSync(OUTPUT_PATH)) {
      return false;
    }

    const stats = fs.statSync(OUTPUT_PATH);
    const now = new Date().getTime();
    const fileTime = new Date(stats.mtime).getTime();

    return now - fileTime < CACHE_DURATION;
  } catch (error) {
    return false;
  }
};

const ensureDirectoryExists = (filePath) => {
  const dir = filePath.substring(0, filePath.lastIndexOf("/"));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const fetchRepos = async () => {
  const forceRefresh = process.argv.includes("--force");

  // Verificar si el cache es válido (a menos que se fuerce la actualización)
  if (!forceRefresh && isCacheValid()) {
    console.log("✅ Using cached GitHub data (less than 24 hours old)");
    console.log("💡 To force refresh, run: pnpm run update-repos");
    return;
  }

  if (forceRefresh) {
    console.log("🔄 Force refresh requested, fetching fresh data...");
  }

  console.log("🚀 Fetching GitHub repositories...");

  try {
    // Configurar headers con token si está disponible
    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-App",
    };

    if (process.env.GITHUB_TOKEN) {
      const token = process.env.GITHUB_TOKEN.trim();
      if (validateGitHubToken(token)) {
        headers.Authorization = `token ${token}`;
        console.log("✅ Using GitHub token for authentication");
      } else {
        console.warn(
          "⚠️  Invalid GitHub token format. Using unauthenticated requests."
        );
      }
    } else {
      console.log(
        "⚠️  No GitHub token found. Using unauthenticated requests (60/hour limit)"
      );
    }

    // Obtener repositorios con parámetros optimizados y timeout
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers,
        signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from GitHub: ${response.status} ${response.statusText}`
      );
    }

    const repos = await response.json();

    // Validar que la respuesta sea un array
    if (!Array.isArray(repos)) {
      throw new Error("Invalid response format from GitHub API");
    }

    console.log(`📦 Found ${repos.length} repositories`);

    // Procesar repositorios en paralelo con límite de concurrencia
    const CONCURRENT_LIMIT = 10; // Aumentado de 5 a 10 para mejor paralelismo
    const processedRepos = [];

    for (let i = 0; i < repos.length; i += CONCURRENT_LIMIT) {
      const chunk = repos.slice(i, i + CONCURRENT_LIMIT);
      const chunkResults = await Promise.all(
        chunk.map(async (repo, chunkIndex) => {
          const index = i + chunkIndex;
          console.log(
            `📄 Processing ${index + 1}/${repos.length}: ${repo.name}`
          );

          let readmeContent = "";
          let languages = [];

          try {
            const sanitizedRepoName = sanitizeString(repo.name);

            // Obtener README y lenguajes en paralelo
            const [readmeResponse, languagesData] = await Promise.all([
              fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${sanitizedRepoName}/readme`,
                { headers, signal: AbortSignal.timeout(5000) }
              ).catch(() => null),
              getLanguageStats(sanitizedRepoName, headers),
            ]);

            if (readmeResponse?.ok) {
              const readmeData = await readmeResponse.json();
              if (
                readmeData.content &&
                typeof readmeData.content === "string"
              ) {
                const rawContent = Buffer.from(
                  readmeData.content,
                  "base64"
                ).toString("utf-8");
                readmeContent = cleanMarkdown(rawContent);
              }
            }

            languages = languagesData;
          } catch (error) {
            console.warn(
              `⚠️  Could not fetch additional data for ${repo.name}:`,
              error.message
            );
          }

          // Sanitizar y validar todos los campos antes de retornar
          return {
            id: Number(repo.id) || 0,
            name: sanitizeString(repo.name),
            description: sanitizeString(repo.description || ""),
            html_url: sanitizeString(repo.html_url),
            stargazers_count: Number(repo.stargazers_count) || 0,
            forks_count: Number(repo.forks_count) || 0,
            language: sanitizeString(repo.language || ""),
            fork: Boolean(repo.fork),
            pushed_at: sanitizeString(repo.pushed_at),
            created_at: sanitizeString(repo.created_at),
            updated_at: sanitizeString(repo.updated_at),
            topics: Array.isArray(repo.topics)
              ? repo.topics.map((t) => sanitizeString(t))
              : [],
            readme: sanitizeString(readmeContent || repo.description || ""),
            languages: Array.isArray(languages)
              ? languages.map((l) => sanitizeString(l))
              : [],
          };
        })
      );

      processedRepos.push(...chunkResults);

      // Pequeña pausa entre chunks para evitar rate limiting (reducida)
      if (i + CONCURRENT_LIMIT < repos.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Filtrar y ordenar repositorios
    const filteredRepos = processedRepos
      .filter(
        (repo) =>
          !repo.fork && // Excluir forks
          repo.name && // Excluir repos sin nombre
          repo.name.toLowerCase() !== "horaciolaphitz" && // Excluir repo del perfil
          repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() // Excluir repo del perfil (por si acaso)
      )
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)); // Ordenar por fecha de actualización

    // Asegurar que el directorio existe
    ensureDirectoryExists(OUTPUT_PATH);

    // Guardar datos con metadata
    const dataWithMetadata = {
      lastUpdated: new Date().toISOString(),
      totalRepos: filteredRepos.length,
      repositories: filteredRepos,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(dataWithMetadata, null, 2));

    console.log(
      `✅ Successfully processed ${filteredRepos.length} repositories`
    );
    console.log(`💾 Data saved to ${OUTPUT_PATH}`);
    console.log(
      `📊 Total size: ${(fs.statSync(OUTPUT_PATH).size / 1024).toFixed(2)} KB`
    );
  } catch (error) {
    console.error("❌ Error fetching or saving repositories:", error);
    process.exit(1);
  }
};

// Ejecutar con manejo de errores
fetchRepos().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
