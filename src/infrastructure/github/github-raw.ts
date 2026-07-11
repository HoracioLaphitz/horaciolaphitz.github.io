const RAW_BASE = "https://raw.githubusercontent.com";

export async function fetchGithubRaw(
    repo: string,
    branch: string,
    path: string,
    timeoutMs = 10_000
): Promise<string> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(`${RAW_BASE}/${repo}/${branch}/${path}`, {
            signal: controller.signal,
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} fetching ${repo}/${path}`);
        }
        return await response.text();
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new Error(`Timeout fetching ${repo}/${path}`);
        }
        throw error;
    } finally {
        clearTimeout(timer);
    }
}
