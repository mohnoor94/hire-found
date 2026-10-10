import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { GreetingCard } from "./greeting-card";
import { YasminOracleNote } from "./yasmin-oracle-note";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("GreetingCard & YasminOracleNote", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders personal greeting card with fallback avatar and serene oracle note", async () => {
    const user = {
      uid: "u-yasmin",
      displayName: "Yasmin Blasi",
      email: "yasmin@hirefound.com",
      photoURL: null,
    };

    await act(async () => {
      root.render(<GreetingCard user={user as any} />);
    });

    expect(container.textContent).toContain("Yasmin");
    expect(container.textContent).toContain("A Note for Yasmin");
    expect(container.textContent).toContain("Daily Spark");

    // Ensure buttons and executive footer are absent as requested
    expect(container.textContent).not.toContain("Spark ✨");
    expect(container.textContent).not.toContain("Draw another");
    expect(container.textContent).not.toContain(
      "Crafted with love · HireFound Executive Practice",
    );

    // Check no em dashes are rendered
    expect(container.textContent).not.toContain("—");
    expect(container.textContent).not.toContain("&mdash;");
  });

  it("renders user photo when photoURL is provided", async () => {
    const user = {
      uid: "u-yasmin",
      displayName: "Yasmin Blasi",
      email: "yasmin@hirefound.com",
      photoURL: "https://example.com/yasmin.jpg",
    };

    await act(async () => {
      root.render(<GreetingCard user={user as any} />);
    });

    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.getAttribute("src")).toBe("https://example.com/yasmin.jpg");
  });

  it("renders custom initial affirmation in YasminOracleNote cleanly", async () => {
    await act(async () => {
      root.render(
        <YasminOracleNote initialAffirmation="Initial affirmation for Yasmin 🌸" />,
      );
    });

    expect(container.textContent).toContain("Initial affirmation for Yasmin 🌸");
    expect(container.textContent).toContain("A Note for Yasmin");
    expect(container.textContent).not.toContain("Draw another");
    expect(container.textContent).not.toContain(
      "Crafted with love · HireFound Executive Practice",
    );
  });

  it("renders active jobs count in editorial masthead pulse badge", async () => {
    const user = {
      uid: "u-yasmin",
      displayName: "Yasmin Blasi",
      email: "yasmin@hirefound.com",
      photoURL: null,
    };

    await act(async () => {
      root.render(<GreetingCard user={user as any} activeJobsCount={3} />);
    });

    expect(container.textContent).toContain("3 roles active · In flow");
    expect(container.textContent).toContain("Personal Atelier");
    expect(container.textContent).not.toContain("—");
  });

  it("allows refreshing affirmation via refresh button in YasminOracleNote", async () => {
    vi.useFakeTimers();
    await act(async () => {
      root.render(
        <YasminOracleNote initialAffirmation="Initial affirmation for Yasmin 🌸" />,
      );
    });

    const refreshBtn = container.querySelector(
      '[aria-label="Refresh daily spark"]',
    ) as HTMLButtonElement | null;
    expect(refreshBtn).toBeTruthy();

    await act(async () => {
      refreshBtn?.click();
    });

    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    expect(container.textContent).toContain("A Note for Yasmin");
    expect(container.textContent).not.toContain("—");
    vi.useRealTimers();
  });
});
