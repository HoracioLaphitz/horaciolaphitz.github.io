import {
    scanProjectsRecursively,
    type ProjectEntry,
} from '@infrastructure/utils/projectScanner';

export class ProjectsInjectorService {
    private static cache: ProjectEntry[] | null = null;

    async getAllProjects(
        orderBy: 'name' | 'date' = 'name'
    ): Promise<ProjectEntry[]> {
        // Use cache to avoid re-scanning on every request
        if (ProjectsInjectorService.cache === null) {
            ProjectsInjectorService.cache =
                await scanProjectsRecursively();
        }

        const projects = [...ProjectsInjectorService.cache];

        // Sort projects
        if (orderBy === 'name') {
            projects.sort((a, b) => a.title.localeCompare(b.title));
        } else if (orderBy === 'date') {
            projects.sort((a, b) => b.folderPath.localeCompare(a.folderPath));
        }

        return projects;
    }

    clearCache(): void {
        ProjectsInjectorService.cache = null;
    }
}
