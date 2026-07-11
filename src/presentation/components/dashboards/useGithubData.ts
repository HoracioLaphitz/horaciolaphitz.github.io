import { useCallback, useEffect, useState } from "react";
import { getCached, setCached } from "@infrastructure/github/cache";

export interface GithubDataState<T> {
    status: "loading" | "error" | "ready";
    data: T | null;
    error: string | null;
    retry: () => void;
}

export function useGithubData<T>(
    cacheKey: string,
    load: () => Promise<T>
): GithubDataState<T> {
    const [attempt, setAttempt] = useState(0);
    const [state, setState] = useState<Omit<GithubDataState<T>, "retry">>({
        status: "loading",
        data: null,
        error: null,
    });

    useEffect(() => {
        let cancelled = false;
        const cached = getCached<T>(cacheKey);
        if (cached !== null) {
            setState({ status: "ready", data: cached, error: null });
            return;
        }
        setState({ status: "loading", data: null, error: null });
        load()
            .then((data) => {
                if (cancelled) return;
                setCached(cacheKey, data);
                setState({ status: "ready", data, error: null });
            })
            .catch((error: unknown) => {
                if (cancelled) return;
                const message =
                    error instanceof Error ? error.message : String(error);
                setState({ status: "error", data: null, error: message });
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cacheKey, attempt]);

    const retry = useCallback(() => setAttempt((a) => a + 1), []);

    return { ...state, retry };
}
