import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FooterButterfly } from "./footer-butterfly";

describe("FooterButterfly", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders a decorative, accessible vector SVG with viewBox 0 0 32 32", async () => {
    await act(async () => {
      root.render(<FooterButterfly />);
    });

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 32 32");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
  });

  it("includes ambient motion class and inner hover flutter group", async () => {
    await act(async () => {
      root.render(<FooterButterfly />);
    });

    const svg = container.querySelector("svg");
    expect(svg?.className.baseVal).toContain("hf-butterfly-drift");

    const flutterGroup = container.querySelector("g.hf-butterfly-flutter");
    expect(flutterGroup).not.toBeNull();
  });

  it("applies brand palette colors across wings, body, and antennae", async () => {
    await act(async () => {
      root.render(<FooterButterfly />);
    });

    // Lavender upper wings (#C4B5FD)
    const lavenderWings = container.querySelectorAll('path[fill="#C4B5FD"]');
    expect(lavenderWings.length).toBe(2);

    // Rose lower wings (#FDA4AF)
    const roseWings = container.querySelectorAll('path[fill="#FDA4AF"]');
    expect(roseWings.length).toBe(2);

    // Violet body/head (#7C3AED)
    const violetEllipse = container.querySelector('ellipse[fill="#7C3AED"]');
    expect(violetEllipse).not.toBeNull();

    // Violet antennae (#7C3AED)
    const violetAntennae = container.querySelectorAll('path[stroke="#7C3AED"]');
    expect(violetAntennae.length).toBe(2);
  });

  it("accepts and merges custom className", async () => {
    await act(async () => {
      root.render(<FooterButterfly className="custom-test-class size-8" />);
    });

    const svg = container.querySelector("svg");
    expect(svg?.className.baseVal).toContain("custom-test-class");
    expect(svg?.className.baseVal).toContain("size-8");
  });
});
