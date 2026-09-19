// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import MarketBasketDashboard from "../MarketBasketDashboard";
import { useGithubData } from "../useGithubData";
import type { AssociationRule } from "@domain/dashboards/types";

vi.mock("../useGithubData");
const mockUseGithubData = vi.mocked(useGithubData);

// Mock Recharts to avoid zero-dimension warnings in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  ZAxis: () => null,
  ScatterChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="scatter-chart">{children}</div>
  ),
  Scatter: () => null,
  Tooltip: () => null,
}));

const sampleRules: AssociationRule[] = [
  { antecedent: "Manzanas", consequent: "Leche", support: 0.15, confidence: 0.75, lift: 2.5 },
  { antecedent: "Pan", consequent: "Mantequilla", support: 0.2, confidence: 0.8, lift: 3.1 },
  { antecedent: "Café", consequent: "Azúcar", support: 0.3, confidence: 0.9, lift: 1.8 },
];

function mount(element: React.ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(element);
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

function setInputValue(input: HTMLInputElement, value: string) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )?.set;
  nativeSetter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("MarketBasketDashboard", () => {
  let activeCleanup: (() => void) | null = null;

  afterEach(() => {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    vi.clearAllMocks();
  });

  it("renderiza el skeleton de carga cuando status es loading", () => {
    mockUseGithubData.mockReturnValue({
      status: "loading",
      data: null,
      error: null,
      retry: vi.fn(),
    });

    const { container, cleanup } = mount(<MarketBasketDashboard />);
    activeCleanup = cleanup;

    expect(container.textContent).toContain("Ventas & Marketing — Market Basket");
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
  });

  it("renderiza el estado de error y permite reintentar", () => {
    const retryFn = vi.fn();
    mockUseGithubData.mockReturnValue({
      status: "error",
      data: null,
      error: "Error de conexión a GitHub",
      retry: retryFn,
    });

    const { container, cleanup } = mount(<MarketBasketDashboard />);
    activeCleanup = cleanup;

    expect(container.textContent).toContain("Error de conexión a GitHub");
    const retryButton = container.querySelector("button");
    expect(retryButton).not.toBeNull();

    act(() => {
      retryButton?.click();
    });
    expect(retryFn).toHaveBeenCalledTimes(1);
  });

  it("renderiza correctamente los KPIs, gráficos y la tabla con datos cargados", () => {
    mockUseGithubData.mockReturnValue({
      status: "ready",
      data: sampleRules,
      error: null,
      retry: vi.fn(),
    });

    const { container, cleanup } = mount(<MarketBasketDashboard />);
    activeCleanup = cleanup;

    expect(container.textContent).toContain("Ventas & Marketing — Market Basket");
    expect(container.textContent).toContain("Reglas detectadas");
    expect(container.textContent).toContain("3");
    expect(container.textContent).toContain("Lift máximo");
    expect(container.textContent).toContain("Confianza promedio");

    expect(container.textContent).toContain("Manzanas");
    expect(container.textContent).toContain("Leche");
    expect(container.textContent).toContain("Pan");
    expect(container.textContent).toContain("Mantequilla");
    expect(container.textContent).toContain("Café");
    expect(container.textContent).toContain("Azúcar");
  });

  it("filtra las reglas en la tabla al escribir en el buscador por antecedente o consecuente", () => {
    mockUseGithubData.mockReturnValue({
      status: "ready",
      data: sampleRules,
      error: null,
      retry: vi.fn(),
    });

    const { container, cleanup } = mount(<MarketBasketDashboard />);
    activeCleanup = cleanup;

    const input = container.querySelector("#rule-filter") as HTMLInputElement;
    expect(input).not.toBeNull();
    const tbody = container.querySelector("tbody");
    expect(tbody).not.toBeNull();

    // Filtrar por antecedente "Manzanas"
    act(() => {
      setInputValue(input, "manzanas");
    });

    expect(tbody?.textContent).toContain("Manzanas");
    expect(tbody?.textContent).toContain("Leche");
    expect(tbody?.textContent).not.toContain("Mantequilla");
    expect(tbody?.textContent).not.toContain("Azúcar");

    // Filtrar por consecuente "Mantequilla"
    act(() => {
      setInputValue(input, "Mantequilla");
    });

    expect(tbody?.textContent).toContain("Pan");
    expect(tbody?.textContent).toContain("Mantequilla");
    expect(tbody?.textContent).not.toContain("Manzanas");
  });
});
