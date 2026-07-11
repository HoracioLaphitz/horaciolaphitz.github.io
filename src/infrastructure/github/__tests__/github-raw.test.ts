import { fetchGithubRaw } from "../github-raw";

describe("fetchGithubRaw", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("builds the raw.githubusercontent.com URL and returns body text", async () => {
        const mock = vi.fn(async () => new Response("a;b\n1;2", { status: 200 }));
        vi.stubGlobal("fetch", mock);

        const text = await fetchGithubRaw("owner/repo", "main", "reglas.csv");

        expect(text).toBe("a;b\n1;2");
        expect(mock).toHaveBeenCalledWith(
            "https://raw.githubusercontent.com/owner/repo/main/reglas.csv",
            expect.objectContaining({ signal: expect.any(AbortSignal) })
        );
    });

    it("throws on non-OK responses", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("nope", { status: 404 }))
        );
        await expect(
            fetchGithubRaw("owner/repo", "main", "missing.csv")
        ).rejects.toThrow("HTTP 404");
    });
});
