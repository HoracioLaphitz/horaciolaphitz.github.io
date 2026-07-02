/**
 * Hook: useProjects
 * React hook for accessing project data through Clean Architecture
 */

import { useState, useEffect } from "react";
import type { ProjectEntity } from "../../domain/entities/project.entity";
import { ProjectFacade } from "../../main/factories/project.facade";

export interface UseProjectsReturn {
    projects: ProjectEntity[];
    loading: boolean;
    error: string | null;
}

export function useProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<ProjectEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchProjects() {
            try {
                setLoading(true);
                const data = await ProjectFacade.getAllProjects();

                if (mounted) {
                    setProjects(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error loading projects");
                    setProjects([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        return () => {
            mounted = false;
        };
    }, []);

    return { projects, loading, error };
}

export function useFeaturedProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<ProjectEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchProjects() {
            try {
                setLoading(true);
                const data = await ProjectFacade.getFeaturedProjects();

                if (mounted) {
                    setProjects(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError(err instanceof Error ? err.message : "Error loading featured projects");
                    setProjects([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchProjects();

        return () => {
            mounted = false;
        };
    }, []);

    return { projects, loading, error };
}
