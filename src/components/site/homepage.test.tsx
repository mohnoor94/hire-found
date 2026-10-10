import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Trust } from "./sections/Trust";
import { HowItWorks } from "./sections/HowItWorks";
import { AmbientBackdrop } from "./ambient-backdrop";
import { CalDialogProvider } from "./cal-dialog";

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

  it("leads with HireFound employer focus and dual CTAs, without audience toggle or candidate coaching", async () => {
    await act(async () => {
      root.render(
        <CalDialogProvider>
          <Hero />
        </CalDialogProvider>,
      );
    });

    expect(container.querySelector("h1")?.textContent).toBe("HireFound");
    expect(container.textContent).toContain("I'm Hiring Executive Talent");
    expect(container.textContent).toContain(
      "Executive search and culture-first hiring across Jordan and the Gulf.",
    );
    expect(container.querySelector("#hero-explore")?.getAttribute("href")).toBe(
      "#vacancies",
    );
    expect(container.querySelector("#hero-chat")).toBeNull();
    expect(container.querySelector("#typing-text")).toBeNull();
    expect(container.querySelector("#hero-talk")).toBeNull();
    expect(container.textContent).not.toContain(
      "Career matchmaking and coaching",
    );
    expect(container.querySelector("button[aria-pressed]")).toBeNull();
    expect(
      container.querySelector('img[src*="yasmin-blasi"]'),
    ).not.toBeNull();
    expect(container.querySelector(".hf-hero-portrait")).not.toBeNull();
    expect(container.querySelector(".rounded-2xl")).toBeNull();

    const hiring = container.querySelector("#hero-hiring") as HTMLButtonElement;
    await act(async () => {
      hiring.click();
    });
    expect(document.getElementById("booking-modal")?.getAttribute("data-state")).toBe(
      "open",
    );
  });

  it("renders employer hiring services and consultation CTAs without candidate services", async () => {
    await act(async () => {
      root.render(
        <CalDialogProvider>
          <Services />
        </CalDialogProvider>,
      );
    });

    expect(container.textContent).toContain("Executive Search & Headhunting");
    expect(container.textContent).toContain("Recruitment & Job Matching");
    expect(container.textContent).toContain("DISC Assessments");
    expect(container.querySelector("#services-book-employer")).not.toBeNull();
    expect(container.querySelector("#services-whatsapp-employer")).not.toBeNull();

    // Verify candidate services are absent
    expect(container.textContent).not.toContain("Career Matchmaking");
    expect(container.textContent).not.toContain("CV Optimization");
    expect(container.textContent).not.toContain("Interview Preparation");

    // Verify job seeker guidance
    expect(container.textContent).toContain("Looking for open roles?");
    expect(container.textContent).toContain("Open Roles board");
    expect(container.textContent).not.toContain("free of charge");
    expect(container.textContent).not.toContain("paid resume editing");

    // Clicking Book Consultation opens booking modal
    const bookBtn = container.querySelector(
      "#services-book-employer",
    ) as HTMLButtonElement;
    await act(async () => {
      bookBtn.click();
    });
    expect(
      document.getElementById("booking-modal")?.getAttribute("data-state"),
    ).toBe("open");
  });

  it("keeps the modernized trust section gated off by default", async () => {
    await act(async () => {
      root.render(<Trust />);
    });

    const trust = container.querySelector("#trust");
    // By default the feature flag is disabled, so the section should not render.
    expect(trust).toBeNull();
  });

  it("renders the founder editorial portrait, credentials, and facts in About", async () => {
    await act(async () => {
      root.render(<About />);
    });

    const about = container.querySelector("section#about");
    expect(about).not.toBeNull();
    expect(about?.textContent).toContain("Meet the Founder");
    expect(about?.textContent).toContain("I'm not your usual recruiter.");
    expect(about?.textContent).toContain("And that's exactly the point.");
    expect(about?.textContent).toContain("Yasmin Blasi");
    expect(about?.textContent).toContain("Founder & Executive Matchmaker");
    expect(about?.textContent).toContain("10+ years of experience");
    expect(about?.textContent).toContain("Matchmaking, Not Seat-Filling");
    expect(about?.textContent).toContain("Your Story, Not Just Keywords");
    expect(about?.textContent).toContain("From First Call to First Day");

    const img = about?.querySelector('img[src*="yasmin-blasi"]');
    expect(img).not.toBeNull();
  });

  it("renders AmbientBackdrop with radial ambient lighting", async () => {
    await act(async () => {
      root.render(<AmbientBackdrop />);
    });

    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).not.toBeNull();
  });

  it("renders HowItWorks with process cards and section dividers", async () => {
    await act(async () => {
      root.render(<HowItWorks />);
    });

    const howItWorks = container.querySelector("section#how-it-works");
    expect(howItWorks).not.toBeNull();
    expect(howItWorks?.textContent).toContain("The Matchmaking Process");
    expect(howItWorks?.textContent).toContain("How It Works");
    expect(howItWorks?.textContent).toContain("Step 01");
    expect(howItWorks?.textContent).toContain("Step 02");
    expect(howItWorks?.textContent).toContain("Step 03");
    expect(container.querySelector(".section-divider")).not.toBeNull();
    expect(container.querySelectorAll(".reveal-on-scroll").length).toBeGreaterThan(0);
  });
});

