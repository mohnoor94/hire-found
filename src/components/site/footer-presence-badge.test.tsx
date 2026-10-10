import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FooterPresenceBadge } from "./footer-presence-badge";
import { withBasePath } from "@/lib/base-path";

describe("FooterPresenceBadge", () => {
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
    vi.clearAllMocks();
  });

  it("renders cameo portrait with withBasePath, proper classes, and alt text", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge />);
    });

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe(withBasePath("/assets/yasmin-blasi.png"));
    expect(img?.getAttribute("alt")).toBe("Yasmin Blasi");
    expect(img?.className).toContain("rounded-full");
    expect(img?.className).toContain("border-secondary/40");
    expect(img?.className).toContain("object-[center_12%]");
  });

  it("renders live availability indicator with emerald-400 dot and ping animation", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge />);
    });

    const pingDot = container.querySelector(".animate-ping.bg-emerald-400");
    expect(pingDot).not.toBeNull();

    const solidDot = container.querySelector(".rounded-full.bg-emerald-400:not(.animate-ping)");
    expect(solidDot).not.toBeNull();
  });

  it("renders refined micro-copy with WhatsApp icon and Chat on WhatsApp", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge />);
    });

    expect(container.textContent).toContain("Yasmin Blasi");
    expect(container.textContent).toContain("Chat on WhatsApp");
    expect(container.querySelector("svg.text-linen")).not.toBeNull();
  });

  it("renders as an accessible link to WhatsApp by default", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge />);
    });

    const anchor = container.querySelector("a");
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute("target")).toBe("_blank");
    expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(anchor?.getAttribute("href")).toContain("wa.me");
    expect(anchor?.getAttribute("aria-label")).toContain("Chat with Yasmin Blasi on WhatsApp");
  });

  it("renders as a status container div when href is null", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge href={null} />);
    });

    const anchor = container.querySelector("a");
    expect(anchor).toBeNull();
    const statusDiv = container.querySelector('[role="status"]');
    expect(statusDiv).not.toBeNull();
    expect(statusDiv?.getAttribute("aria-label")).toContain("Chat with Yasmin Blasi on WhatsApp");
  });

  it("merges custom className properly", async () => {
    await act(async () => {
      root.render(<FooterPresenceBadge className="custom-test-badge" />);
    });

    const badge = container.querySelector(".custom-test-badge");
    expect(badge).not.toBeNull();
    expect(badge?.className).toContain("rounded-full");
    expect(badge?.className).toContain("bg-linen/5");
  });
});
