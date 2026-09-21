// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { useGithubData, type GithubDataState } from "../useGithubData";
import { setCached, getCached } from "@infrastructure/github/cache";

interface HarnessProps<T> {
  cacheKey: string;
  load: () => Promise<T>;
  onStateChange: (state: GithubDataState<T>) => void;
}

function TestHarness<T>({ cacheKey, load, onStateChange }: HarnessProps<T>) {
  const state = useGithubData(cacheKey, load);
  onStateChange(state);
  return null;
}

function mountHarness<T>(
  cacheKey: string,
  load: () => Promise<T>,
  onStateChange: (state: GithubDataState<T>) => void
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <TestHarness cacheKey={cacheKey} load={load} onStateChange={onStateChange} />
    );
  });
  return {
    container,
    root,
    cleanup: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

describe("useGithubData", () => {
  let activeCleanup: (() => void) | null = null;

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("retorna datos en cache si existen en sessionStorage sin llamar a load", () => {
    const cacheKey = "test:cache-hit";
    const cachedValue = { items: [1, 2, 3] };
    setCached(cacheKey, cachedValue);

    const loadFn = vi.fn().mockResolvedValue({ items: [9, 9, 9] });
    let currentState: any = null;

    const { cleanup } = mountHarness(cacheKey, loadFn, (state) => {
      currentState = state;
    });
    activeCleanup = cleanup;

    expect(currentState).not.toBeNull();
    expect(currentState?.status).toBe("ready");
    expect(currentState?.data).toEqual(cachedValue);
    expect(currentState?.error).toBeNull();
    expect(loadFn).not.toHaveBeenCalled();
  });

  it("llama a load cuando no hay cache y guarda la respuesta en cache al resolverse", async () => {
    const cacheKey = "test:cache-miss";
    const freshData = { name: "Dashboard Dataset" };

    let resolvePromise!: (val: typeof freshData) => void;
    const loadPromise = new Promise<typeof freshData>((resolve) => {
      resolvePromise = resolve;
    });
    const loadFn = vi.fn().mockReturnValue(loadPromise);

    let currentState: any = null;

    const { cleanup } = mountHarness(cacheKey, loadFn, (state) => {
      currentState = state;
    });
    activeCleanup = cleanup;

    // Inicialmente en loading
    expect(currentState?.status).toBe("loading");
    expect(currentState?.data).toBeNull();
    expect(loadFn).toHaveBeenCalledTimes(1);

    // Resolver promesa
    await act(async () => {
      resolvePromise(freshData);
      await loadPromise;
    });

    expect(currentState?.status).toBe("ready");
    expect(currentState?.data).toEqual(freshData);
    expect(currentState?.error).toBeNull();
    expect(getCached(cacheKey)).toEqual(freshData);
  });

  it("transiciona a estado error cuando load falla con un Error u otro tipo", async () => {
    const cacheKey = "test:cache-error";

    let rejectPromise!: (err: unknown) => void;
    const loadPromise = new Promise<never>((_, reject) => {
      rejectPromise = reject;
    });
    const loadFn = vi.fn().mockReturnValue(loadPromise);

    let currentState: any = null;

    const { cleanup } = mountHarness(cacheKey, loadFn, (state) => {
      currentState = state;
    });
    activeCleanup = cleanup;

    expect(currentState?.status).toBe("loading");

    await act(async () => {
      rejectPromise(new Error("Error de red 500"));
      try {
        await loadPromise;
      } catch {}
    });

    expect(currentState?.status).toBe("error");
    expect(currentState?.data).toBeNull();
    expect(currentState?.error).toBe("Error de red 500");
  });

  it("reintenta la carga de datos al invocar la función retry", async () => {
    const cacheKey = "test:cache-retry";
    let attempts = 0;

    const loadFn = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts === 1) {
        return Promise.reject(new Error("Fallo temporal"));
      }
      return Promise.resolve("Datos recuperados");
    });

    let currentState: any = null;

    const { cleanup } = mountHarness(cacheKey, loadFn, (state) => {
      currentState = state;
    });
    activeCleanup = cleanup;

    // Esperar primer intento (fallido)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(currentState?.status).toBe("error");
    expect(currentState?.error).toBe("Fallo temporal");
    expect(loadFn).toHaveBeenCalledTimes(1);

    // Ejecutar retry
    await act(async () => {
      currentState?.retry();
      await new Promise((r) => setTimeout(r, 10));
    });

    expect(loadFn).toHaveBeenCalledTimes(2);
    expect(currentState?.status).toBe("ready");
    expect(currentState?.data).toBe("Datos recuperados");
  });

  it("cancela la actualización de estado si el componente se desdesmonta antes de resolver", async () => {
    const cacheKey = "test:cache-cancel";

    let resolvePromise!: (val: string) => void;
    const loadPromise = new Promise<string>((resolve) => {
      resolvePromise = resolve;
    });
    const loadFn = vi.fn().mockReturnValue(loadPromise);

    let currentState: any = null;

    const { cleanup } = mountHarness(cacheKey, loadFn, (state) => {
      currentState = state;
    });

    expect(currentState?.status).toBe("loading");

    // Desmontar el componente
    cleanup();

    // Resolver la promesa tras desdesmontar
    await act(async () => {
      resolvePromise("Datos desestimados");
      await loadPromise;
    });

    // El estado sigue siendo el último registrado antes de desdesmontar
    expect(currentState?.status).toBe("loading");
  });
});
