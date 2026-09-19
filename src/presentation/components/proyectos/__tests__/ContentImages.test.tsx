// @vitest-environment jsdom

import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";
import { ContentImages } from "../ContentImages";

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

describe("ContentImages", () => {
  let contentBody: HTMLDivElement;
  let activeCleanup: (() => void) | null = null;

  beforeEach(() => {
    contentBody = document.createElement("div");
    contentBody.setAttribute("data-content-body", "true");
    document.body.appendChild(contentBody);
  });

  afterEach(() => {
    if (activeCleanup) {
      activeCleanup();
      activeCleanup = null;
    }
    if (contentBody.parentNode) {
      contentBody.parentNode.removeChild(contentBody);
    }
    // Clean up any remaining overlay elements in document.body
    const overlays = Array.from(document.body.children).filter(
      (el) => el !== contentBody && el.tagName === "DIV" && (el as HTMLElement).style.position === "fixed"
    );
    overlays.forEach((overlay) => overlay.remove());
  });

  it("configura data-zoomable y cursor pointer en las imágenes dentro de data-content-body", () => {
    const img = document.createElement("img");
    img.src = "https://example.com/imagen.jpg";
    img.alt = "Imagen de prueba";
    contentBody.appendChild(img);

    const { cleanup } = mount(<ContentImages />);
    activeCleanup = cleanup;

    expect(img.dataset.zoomable).toBe("true");
    expect(img.style.cursor).toBe("pointer");
  });

  it("abre el lightbox al hacer click en una imagen", () => {
    const img = document.createElement("img");
    img.src = "https://example.com/grafico.png";
    img.alt = "Gráfico de ventas";
    contentBody.appendChild(img);

    const { cleanup } = mount(<ContentImages />);
    activeCleanup = cleanup;

    act(() => {
      img.click();
    });

    const overlay = document.body.lastElementChild as HTMLDivElement;
    expect(overlay).not.toBeNull();
    expect(overlay.style.position).toBe("fixed");

    const lightboxImg = overlay.querySelector("img");
    expect(lightboxImg).not.toBeNull();
    expect(lightboxImg?.src).toContain("https://example.com/grafico.png");
    expect(lightboxImg?.alt).toBe("Gráfico de ventas");
  });

  it("cierra el lightbox y realiza cleanup al hacer click en el overlay", () => {
    const img = document.createElement("img");
    img.src = "https://example.com/diagrama.png";
    img.alt = "Diagrama";
    contentBody.appendChild(img);

    const { cleanup } = mount(<ContentImages />);
    activeCleanup = cleanup;

    act(() => {
      img.click();
    });

    let overlay = Array.from(document.body.children).find(
      (el) => (el as HTMLElement).style.position === "fixed"
    ) as HTMLDivElement;
    expect(overlay).toBeDefined();

    act(() => {
      overlay.click();
    });

    overlay = Array.from(document.body.children).find(
      (el) => (el as HTMLElement).style.position === "fixed"
    ) as HTMLDivElement;
    expect(overlay).toBeUndefined();
  });

  it("cierra el lightbox y realiza cleanup al presionar la tecla Escape", () => {
    const img = document.createElement("img");
    img.src = "https://example.com/foto.jpg";
    img.alt = "Foto";
    contentBody.appendChild(img);

    const { cleanup } = mount(<ContentImages />);
    activeCleanup = cleanup;

    act(() => {
      img.click();
    });

    let overlay = Array.from(document.body.children).find(
      (el) => (el as HTMLElement).style.position === "fixed"
    ) as HTMLDivElement;
    expect(overlay).toBeDefined();

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    overlay = Array.from(document.body.children).find(
      (el) => (el as HTMLElement).style.position === "fixed"
    ) as HTMLDivElement;
    expect(overlay).toBeUndefined();
  });

  it("no procesa nuevamente las imágenes que ya tienen data-zoomable='true'", () => {
    const img = document.createElement("img");
    img.src = "https://example.com/ya-zoomable.jpg";
    img.dataset.zoomable = "true";
    contentBody.appendChild(img);

    const { cleanup } = mount(<ContentImages />);
    activeCleanup = cleanup;

    expect(img.style.cursor).not.toBe("pointer");
  });

  it("se ejecuta sin errores si no existe un contenedor data-content-body", () => {
    contentBody.remove();

    expect(() => {
      const { cleanup } = mount(<ContentImages />);
      cleanup();
    }).not.toThrow();
  });
});
