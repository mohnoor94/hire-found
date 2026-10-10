import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { JobsPageClient } from "./jobs-page-client";
import { JobDetail } from "./job-detail";
import { BookingModalProvider } from "@/components/site/cal-dialog";
import type { Job } from "@/lib/jobs";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let mockSearchParams = new URLSearchParams();

const { sampleJobs, fetchJobsMock } = vi.hoisted(() => {
  const jobs: Job[] = [
    {
      id: "job-1",
      title: "Senior Barista",
      titleAr: "باريستا أول",
      slug: "senior-barista",
      category: "hospitality",
      location: "Amman, Jordan",
      employmentType: "full-time",
      shortDescription: "Lead barista for boutique cafe.",
      fullDescription: "<p>Make great coffee.</p>",
      fullDescriptionAr: "<p>اصنع قهوة رائعة.</p>",
      createdAt: new Date("2026-03-01"),
      updatedAt: null,
      expiresAt: null,
      isActive: true,
    },
    {
      id: "job-2",
      title: "Frontend Engineer",
      slug: "frontend-engineer",
      category: "tech",
      location: "Remote",
      employmentType: "full-time",
      shortDescription: "React and Next.js developer.",
      tallyFormId: "abc123",
      contactWhatsApp: "962700000000",
      contactEmail: "jobs@hirefound.com",
      createdAt: new Date("2026-03-02"),
      updatedAt: null,
      expiresAt: null,
      isActive: true,
    },
  ];
  return {
    sampleJobs: jobs,
    fetchJobsMock: vi.fn().mockResolvedValue(jobs),
  };
});

vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

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
    fetchJobs: fetchJobsMock,
  };
});

function renderWithProviders(ui: React.ReactElement) {
  return <BookingModalProvider>{ui}</BookingModalProvider>;
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("Phase 4 Jobs page", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    fetchJobsMock.mockReset();
    fetchJobsMock.mockResolvedValue(sampleJobs);
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

  it("renders listing with category filters and cards", async () => {
    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    expect(container.textContent).toContain("Find Your Match");
    expect(container.textContent).toContain("Senior Barista");
    expect(container.textContent).toContain("Frontend Engineer");
    expect(container.querySelector('[aria-label="Show all jobs"]')).toBeTruthy();
    expect(
      container.querySelector('[aria-label="Filter by hospitality"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('a[href="/jobs/?id=senior-barista"]'),
    ).toBeTruthy();
    expect(container.textContent).toContain("Senior Barista");
    expect(container.textContent).toContain("باريستا أول");
  });

  it("lets the job title own the detail heading", async () => {
    mockSearchParams = new URLSearchParams("id=senior-barista");

    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    expect(container.querySelector("h1")?.textContent).toBe("Senior Barista");
    expect(container.querySelector("#job-search")).toBeNull();
    expect(container.textContent).toContain("About This Role");
    expect(fetchJobsMock).toHaveBeenCalledTimes(1);
  });

  it("filters cards by category", async () => {
    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    const techPill = container.querySelector(
      '[aria-label="Filter by tech"]',
    ) as HTMLButtonElement;
    await act(async () => {
      techPill.click();
    });

    expect(container.textContent).toContain("Frontend Engineer");
    expect(container.textContent).not.toContain("Senior Barista");
  });

  it("shows empty listing state", async () => {
    fetchJobsMock.mockResolvedValueOnce([]);

    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    expect(container.textContent).toContain("Quiet on the board");
  });

  it("shows error state and retries", async () => {
    fetchJobsMock
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(sampleJobs);

    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    expect(container.textContent).toContain("The board is taking a breath");

    const retry = container.querySelector(
      '[aria-label="Check again for open roles"]',
    ) as HTMLButtonElement;
    await act(async () => {
      retry.click();
    });
    await flushEffects();

    expect(container.textContent).toContain("Senior Barista");
    expect(fetchJobsMock).toHaveBeenCalledTimes(2);
  });

  it("shows not-found for unknown slug", async () => {
    mockSearchParams = new URLSearchParams("id=missing-role");

    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    expect(container.textContent).toContain("Job Not Found");
    expect(container.querySelector("h1")?.textContent).toBe("Job Not Found");
    expect(container.querySelector("#job-search")).toBeNull();
  });

  it("renders Arabic description and fallback apply CTAs without employer booking", async () => {
    await act(async () => {
      root.render(
        renderWithProviders(<JobDetail job={sampleJobs[0]!} />),
      );
    });
    await flushEffects();

    expect(container.querySelector('[lang="ar"][dir="rtl"]')).toBeTruthy();
    expect(container.textContent).toContain("Interested? Get in Touch");
    expect(
      container.querySelector('[aria-label="Contact via WhatsApp"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[aria-label="Book a call with Yasmin"]'),
    ).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
    expect(
      container.querySelector('[data-back-link="true"]')?.getAttribute("href"),
    ).toBe("/jobs/");
    expect(document.title).toBe("Senior Barista | HireFound");
  });

  it("embeds Tally when tallyFormId is set without employer booking", async () => {
    await act(async () => {
      root.render(
        renderWithProviders(<JobDetail job={sampleJobs[1]!} />),
      );
    });
    await flushEffects();

    expect(container.textContent).toContain("Apply Now");
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain("tally.so/embed/abc123");
    expect(iframe?.getAttribute("src")).not.toContain("tally.so/embed/undefined");
    expect(
      container
        .querySelector('a[href="https://tally.so/r/abc123"]')
        ?.textContent,
    ).toContain("Open application form in a new tab");
    expect(container.textContent).toContain("Have Questions?");
    expect(
      container.querySelector('[aria-label="Book a call with Yasmin"]'),
    ).toBeNull();
    expect(
      container.querySelector('[aria-label="Contact via WhatsApp"]'),
    ).toBeTruthy();
    expect(container.querySelector('[aria-label="Send an email"]')).toBeTruthy();
  });

  it("copies the share URL to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    await act(async () => {
      root.render(
        renderWithProviders(<JobDetail job={sampleJobs[0]!} />),
      );
    });
    await flushEffects();

    const share = container.querySelector(
      '[aria-label="Share this job - copy URL to clipboard"]',
    ) as HTMLButtonElement;
    await act(async () => {
      share.click();
    });
    await flushEffects();

    expect(writeText).toHaveBeenCalled();
    expect(container.textContent).toContain("Link copied");
  });

  it("searches English, Arabic, and location", async () => {
    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await flushEffects();

    const input = container.querySelector("#job-search") as HTMLInputElement;
    expect(input).toBeTruthy();

    await act(async () => {
      setNativeValue(input, "باريستا");
    });
    expect(container.textContent).toContain("Senior Barista");
    expect(container.textContent).not.toContain("Frontend Engineer");

    await act(async () => {
      setNativeValue(input, "Remote");
    });
    expect(container.textContent).toContain("Frontend Engineer");
    expect(container.textContent).not.toContain("Senior Barista");

    await act(async () => {
      setNativeValue(input, "no-such-role");
    });
    expect(container.textContent).toContain("No roles match that search.");
  });
});

function setNativeValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
