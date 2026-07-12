const TTL_MS = 15 * 60 * 1000;

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

interface CacheEntry<T> {
    ts: number;
    value: T;
}

function defaultStorage(): StorageLike | null {
    try {
        return typeof sessionStorage === "undefined" ? null : sessionStorage;
    } catch {
        // Storage access can throw in privacy modes.
        return null;
    }
}

export function getCached<T>(
    key: string,
    storage: StorageLike | null = defaultStorage(),
    now: number = Date.now()
): T | null {
    if (!storage) return null;
    try {
        const raw = storage.getItem(key);
        if (!raw) return null;
        const entry = JSON.parse(raw) as CacheEntry<T>;
        if (now - entry.ts > TTL_MS) {
            storage.removeItem(key);
            return null;
        }
        return entry.value;
    } catch {
        return null;
    }
}

export function setCached<T>(
    key: string,
    value: T,
    storage: StorageLike | null = defaultStorage(),
    now: number = Date.now()
): void {
    if (!storage) return;
    try {
        const entry: CacheEntry<T> = { ts: now, value };
        storage.setItem(key, JSON.stringify(entry));
    } catch {
        // Quota exceeded — skip caching, data still renders.
    }
}
