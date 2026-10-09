import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Trust } from "./sections/Trust";
import { LiveVacancies } from "./live-vacancies";
import { CalDialogProvider } from "./cal-dialog";
import { ServicesTabProvider } from "./services-tab";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/jobs", async () => {
  const actual = await vi.importActual<typeof import("@/lib/jobs")>(
    "@/lib/jobs",
  );
  return {
    ...actual,
    fetchJobs: vi.fn().mockResolvedValue([
      {
        id: "job-1",
        title: "Senior Barista",
        slug: "senior-barista",
        category: "hospitality",
        location: "Amman, Jordan",
        employmentType: "full-time",
        shortDescription: "Lead barista for boutique cafe.",
        createdAt: new Date("2026-03-01"),
        updatedAt: null,
        expiresAt: null,
        isActive: true,
      },
    ]),
  };
});

describe("Homepage", () => {
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

  it("leads with HireFound and the two fold actions, without a WhatsApp chat", async () => {
    await act(async () => {
      root.render(
        <CalDialogProvider>
          <Hero />
        </CalDialogProvider>,
      );
    });

    expect(container.querySelector("h1")?.textContent).toBe("HireFound");
    expect(container.textContent).toContain("I'm Hiring Executive Talent");
    expect(container.querySelector("#hero-explore")?.getAttribute("href")).toBe(
      "#vacancies",
    );
    expect(container.querySelector("#hero-chat")).toBeNull();
    expect(container.querySelector("#typing-text")).toBeNull();
    expect(
      container.querySelector('img[src*="yasmin-blasi"]'),
    ).not.toBeNull();
    expect(container.querySelector(".hf-hero-photo")).not.toBeNull();
    expect(container.querySelector(".rounded-2xl")).toBeNull();

    const hiring = container.querySelector("#hero-hiring") as HTMLButtonElement;
    await act(async () => {
      hiring.click();
    });
    expect(document.getElementById("booking-modal")?.getAttribute("data-state")).toBe(
      "open",
    );
  });

  it("switches employer and candidate services with Radix tabs", async () => {
    await act(async () => {
      root.render(
        <CalDialogProvider>
          <ServicesTabProvider>
            <Services />
          </ServicesTabProvider>
        </CalDialogProvider>,
      );
    });

    expect(container.textContent).toContain("Executive Search & Headhunting");
    expect(container.textContent).not.toContain("Career Matchmaking");

    const candidates = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "For Candidates",
    );
    await act(async () => {
      candidates?.dispatchEvent(
        new MouseEvent("mousedown", { bubbles: true, button: 0 }),
      );
    });

    expect(container.textContent).toContain("Career Matchmaking");
    expect(container.textContent).not.toContain("Executive Search & Headhunting");
  });

  it("opens candidate services from the vacancies bridge", async () => {
    await act(async () => {
      root.render(
        <CalDialogProvider>
          <ServicesTabProvider>
            <LiveVacancies />
            <Services />
          </ServicesTabProvider>
        </CalDialogProvider>,
      );
    });

    const bridge = container.querySelector(".career-bridge") as HTMLAnchorElement;
    expect(bridge).not.toBeNull();
    await act(async () => {
      bridge.click();
    });
    expect(container.textContent).toContain("Career Matchmaking");
  });

  it("keeps the modernized trust section hidden until sign-off", async () => {
    await act(async () => {
      root.render(<Trust />);
    });

    const trust = container.querySelector("#trust");
    expect(trust?.hasAttribute("hidden")).toBe(true);
    expect(trust?.textContent).toContain("TEDx Zarqa University");
    expect(trust?.textContent).toContain("Sarah A.");
  });
});
