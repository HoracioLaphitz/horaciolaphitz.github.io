import { useState, useEffect } from 'react';
import type { ProjectEntry } from '@infrastructure/utils/projectScanner';

interface UseProjectsOptions {
    locale?: string;
}

export function useProjects(options: UseProjectsOptions = {}): {
    projects: ProjectEntry[];
    loading: boolean;
    error: Error | null;
} {
    const [projects, setProjects] = useState<ProjectEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/projects');

                if (!response.ok) {
                    throw new Error(`Failed to fetch projects: ${response.statusText}`);
                }

                const data: ProjectEntry[] = await response.json();
                setProjects(data);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error('Unknown error occurred')
                );
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return { projects, loading, error };
}
