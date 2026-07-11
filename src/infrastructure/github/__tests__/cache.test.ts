import { getCached, setCached, type StorageLike } from "../cache";

function fakeStorage(): StorageLike {
    const map = new Map<string, string>();
    return {
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => void map.set(key, value),
        removeItem: (key) => void map.delete(key),
    };
}

describe("cache", () => {
    it("returns null on miss", () => {
        expect(getCached("missing", fakeStorage(), 0)).toBeNull();
    });

    it("returns the cached value within TTL", () => {
        const storage = fakeStorage();
        setCached("key", { a: 1 }, storage, 0);
        expect(getCached("key", storage, 899_999)).toEqual({ a: 1 });
    });

    it("expires entries after 15 minutes", () => {
        const storage = fakeStorage();
        setCached("key", { a: 1 }, storage, 0);
        expect(getCached("key", storage, 900_001)).toBeNull();
    });

    it("returns null when storage is unavailable", () => {
        expect(getCached("key", null, 0)).toBeNull();
    });

    it("returns null on corrupt entries instead of throwing", () => {
        const storage = fakeStorage();
        storage.setItem("key", "not-json{");
        expect(getCached("key", storage, 0)).toBeNull();
    });
});
