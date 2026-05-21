import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

export interface ProjectEntry {
    id: string;
    title: string;
    description: string;
    tags: string[];
    repoUrl?: string;
    demoUrl?: string;
    pdfUrl?: string;
    size?: string;
    summary?: string;
    thumbnail?: string;
    folderPath: string;
}

interface ProjectMetadata {
    description?: string;
    repository?: string | { url: string };
    homepage?: string;
    keywords?: string[];
}

const PROJECTS_ROOT = join(process.cwd(), '../public', 'Proyectos');
const SUPPORTED_PDF_EXTS = ['.pdf'];
const SUPPORTED_MD_FILES = ['README.md', 'readme.md', 'index.md', 'index.mdx'];

export async function scanProjectsRecursively(
    dir: string = PROJECTS_ROOT,
    relativePath: string = ''
): Promise<ProjectEntry[]> {
    const projects: ProjectEntry[] = [];

    try {
        const entries = await readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

            const fullPath = join(dir, entry.name);
            const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                // Try to extract project metadata from this directory
                const projectData = await extractProjectMetadata(fullPath, entry.name);
                if (projectData) {
                    projects.push(projectData);
                }

                // Recursively scan subdirectories
                const subProjects = await scanProjectsRecursively(fullPath, relPath);
                projects.push(...subProjects);
            }
        }
    } catch (error) {
        console.warn(`Error scanning projects in ${dir}:`, error);
    }

    return projects;
}

async function extractProjectMetadata(
    dirPath: string,
    folderName: string
): Promise<ProjectEntry | null> {
    try {
        // Check if directory contains project indicators
        const files = await readdir(dirPath);
        const hasPackageJson = files.includes('package.json');
        const hasProjectConfig =
            files.includes('project.json') || files.includes('project.yaml');
        const hasReadme = files.some((f: string) =>
            SUPPORTED_MD_FILES.includes(f)
        );
        const hasNotebook = files.some((f: string) => f.endsWith('.ipynb'));
        const pdfFile = files.find((f: string) => SUPPORTED_PDF_EXTS.includes(f.toLowerCase()));

        // Consider it a project if it has any of these markers
        const isProject =
            hasPackageJson ||
            hasProjectConfig ||
            hasReadme ||
            hasNotebook ||
            pdfFile;

        if (!isProject && !pdfFile) return null;

        // Extract metadata
        let metadata: ProjectMetadata = {};
        let description = '';
        let tags: string[] = [];

        // Try package.json first
        if (hasPackageJson) {
            const pkgContent = await readFile(
                join(dirPath, 'package.json'),
                'utf-8'
            );
            const pkg = JSON.parse(pkgContent);
            metadata = {
                description: pkg.description,
                repository: pkg.repository,
                homepage: pkg.homepage,
                keywords: pkg.keywords,
            };
            description = pkg.description || '';
            tags = pkg.keywords || [];
        }

        // Try project.json/yaml
        if (hasProjectConfig) {
            const projectFile = files.includes('project.json')
                ? 'project.json'
                : 'project.yaml';
            const projectContent = await readFile(
                join(dirPath, projectFile),
                'utf-8'
            );
            const projectData =
                projectFile === 'project.json'
                    ? JSON.parse(projectContent)
                    : parseYaml(projectContent);
            if (projectData.description)
                description = projectData.description;
            if (projectData.tags) tags = [...tags, ...projectData.tags];
            if (projectData.repository)
                metadata.repository = projectData.repository;
            if (projectData.keywords)
                tags = [...tags, ...projectData.keywords];
        }

        // Try README
        if (!description && hasReadme) {
            const readmeFile = files.find((f: string) =>
                SUPPORTED_MD_FILES.includes(f)
            );
            if (readmeFile) {
                const readmeContent = await readFile(
                    join(dirPath, readmeFile),
                    'utf-8'
                );
                description = extractReadmeDescription(readmeContent);
            }
        }

        // Handle PDF projects
        let pdfUrl: string | undefined;
        let pdfSize: string | undefined;
        if (pdfFile) {
            const pdfPath = join(dirPath, pdfFile);
            const stats = await stat(pdfPath);
            pdfUrl = `/Proyectos/${folderName}/${pdfFile}`;
            pdfSize = formatFileSize(stats.size);
        }

        // Build project entry
        const project: ProjectEntry = {
            id: sanitizeId(folderName),
            title: formatFolderName(folderName),
            description: description || `Proyecto: ${formatFolderName(folderName)}`,
            tags: Array.from(new Set(tags)),
            repoUrl: extractRepoUrl(metadata.repository),
            demoUrl: metadata.homepage,
            pdfUrl,
            size: pdfSize,
            summary: description
                ? extractSummary(description, 200)
                : undefined,
            folderPath: folderName,
        };

        return project;
    } catch (error) {
        console.warn(
            `Error extracting metadata from ${folderName}:`,
            error
        );
        return null;
    }
}

function parseYaml(content: string): Record<string, unknown> {
    // Simple YAML parser for basic key-value pairs
    const result: Record<string, unknown> = {};
    const lines = content.split('\n');

    for (const line of lines) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            result[key.trim()] = value.replace(/^['"]|['"]$/g, '');
        }
    }

    return result;
}

function extractRepoUrl(
    repository: string | { url: string } | undefined
): string | undefined {
    if (!repository) return undefined;
    if (typeof repository === 'string') return repository;
    if (typeof repository === 'object' && 'url' in repository)
        return repository.url;
    return undefined;
}

function extractReadmeDescription(content: string): string {
    // Extract first non-heading line as description
    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (
            trimmed &&
            !trimmed.startsWith('#') &&
            !trimmed.startsWith('-') &&
            !trimmed.startsWith('*')
        ) {
            return trimmed.slice(0, 250);
        }
    }
    return '';
}

function extractSummary(text: string, maxChars: number): string {
    if (text.length <= maxChars) return text;

    // Simple extractive summarization: select sentences by frequency heuristic
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return text.slice(0, maxChars);

    let summary = '';
    for (const sentence of sentences) {
        if ((summary + sentence).length <= maxChars) {
            summary += sentence;
        } else {
            break;
        }
    }

    return summary.trim() || text.slice(0, maxChars);
}

function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function sanitizeId(folderName: string): string {
    return folderName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

function formatFolderName(folderName: string): string {
    // Convert "My-Folder_Name" to "My Folder Name"
    return folderName
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .trim();
}
