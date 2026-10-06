import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { JobsPageClient } from "./jobs-page-client";
import { JobDetail } from "./job-detail";
import { BookingModalProvider } from "@/components/site/booking-modal";
import type { Job } from "@/lib/jobs";

const mockPush = vi.fn();
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
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearchParams,
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

describe("Phase 4 Jobs page", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    mockPush.mockReset();
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

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Find Your Match");
    expect(container.textContent).toContain("Senior Barista");
    expect(container.textContent).toContain("Frontend Engineer");
    expect(container.querySelector('[aria-label="Show all jobs"]')).toBeTruthy();
    expect(
      container.querySelector('[aria-label="Filter by hospitality"]'),
    ).toBeTruthy();
  });

  it("filters cards by category", async () => {
    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await act(async () => {
      await Promise.resolve();
    });

    const techPill = container.querySelector(
      '[aria-label="Filter by tech"]',
    ) as HTMLButtonElement;
    await act(async () => {
      techPill.click();
    });

    expect(container.textContent).toContain("Frontend Engineer");
    expect(container.textContent).not.toContain("Senior Barista");
  });

  it("navigates to detail via pushState-style router push", async () => {
    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await act(async () => {
      await Promise.resolve();
    });

    const card = container.querySelector(
      '[aria-label="View details for Senior Barista"]',
    ) as HTMLElement;
    await act(async () => {
      card.click();
    });

    expect(mockPush).toHaveBeenCalledWith("/jobs/?id=senior-barista");
  });

  it("shows not-found for unknown slug", async () => {
    mockSearchParams = new URLSearchParams("id=missing-role");

    await act(async () => {
      root.render(renderWithProviders(<JobsPageClient />));
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain("Job Not Found");
  });

  it("renders Arabic description and fallback apply CTAs", async () => {
    await act(async () => {
      root.render(
        renderWithProviders(
          <JobDetail job={sampleJobs[0]!} onBack={() => undefined} />,
        ),
      );
    });

    expect(container.querySelector('[lang="ar"][dir="rtl"]')).toBeTruthy();
    expect(container.textContent).toContain("Interested? Get in Touch");
    expect(
      container.querySelector('[aria-label="Contact via WhatsApp"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[aria-label="Book a call with Yasmin"]'),
    ).toBeTruthy();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("embeds Tally when tallyFormId is set", async () => {
    await act(async () => {
      root.render(
        renderWithProviders(
          <JobDetail job={sampleJobs[1]!} onBack={() => undefined} />,
        ),
      );
    });

    expect(container.textContent).toContain("Apply Now");
    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("src")).toContain("tally.so/embed/abc123");
    expect(container.textContent).toContain("Have Questions?");
    expect(
      container.querySelector('[aria-label="Book a call with Yasmin"]'),
    ).toBeNull();
  });
});
