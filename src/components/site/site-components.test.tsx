import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { ActionStack } from "./action-stack";
import { CalDialogProvider, useBookingModal } from "./cal-dialog";
import { LiveVacancies } from "./live-vacancies";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next/link to render a simple anchor
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

const { fetchJobsMock } = vi.hoisted(() => ({
  fetchJobsMock: vi.fn().mockResolvedValue([
    {
      id: "job-1",
      title: "Senior Barista",
      titleAr: "باريستا أول",
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
    {
      id: "job-2",
      title: "Frontend Engineer",
      slug: "frontend-engineer",
      category: "tech",
      location: "Remote",
      employmentType: "full-time",
      shortDescription: "React and Next.js developer.",
      createdAt: new Date("2026-03-02"),
      updatedAt: null,
      expiresAt: null,
      isActive: true,
    },
  ]),
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

describe("Phase 3 Site Components Parity", () => {
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

  describe("SiteNav", () => {
    it("renders navigation links and Book a Call CTA", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <SiteNav />
          </CalDialogProvider>,
        );
      });

      const nav = container.querySelector("nav#navbar");
      expect(nav).not.toBeNull();

      // Check nav links
      const links = Array.from(container.querySelectorAll("a")).map((a) => ({
        text: a.textContent?.trim(),
        href: a.getAttribute("href"),
      }));

      expect(links.some((l) => l.href === "#about")).toBe(true);
      expect(links.some((l) => l.href === "#vacancies")).toBe(true);
      expect(links.some((l) => l.href === "#services")).toBe(true);
      expect(links.some((l) => l.href === "#how-it-works")).toBe(true);

      const sectionHrefs = links
        .map((l) => l.href)
        .filter((href) => href && href.startsWith("#") && href !== "#hero");
      expect(sectionHrefs).toEqual([
        "#about",
        "#vacancies",
        "#services",
        "#how-it-works",
      ]);

      const bookCall = container.querySelector("#nav-book-a-call-desktop");
      expect(bookCall).not.toBeNull();
      expect(bookCall?.textContent?.trim()).toBe("Book a Call");

      const menu = container.querySelector(
        'button[aria-controls="mobile-nav"]',
      ) as HTMLButtonElement;
      expect(menu).not.toBeNull();
      await act(async () => {
        menu.click();
      });
      const drawer = document.getElementById("mobile-nav");
      expect(drawer?.textContent).toContain("Services");
      expect(drawer?.textContent).toContain("Book a Call");
    });

    it("renders the refreshed capsule and editorial mobile actions", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <SiteNav />
          </CalDialogProvider>,
        );
      });

      const nav = container.querySelector("nav#navbar");
      expect(nav?.className).toContain("rounded-[1.75rem]");
      expect(
        container.querySelector('[aria-label="Sections"]'),
      ).not.toBeNull();

      const menu = container.querySelector(
        'button[aria-controls="mobile-nav"]',
      ) as HTMLButtonElement;
      expect(menu.textContent?.trim()).toBe("");
      expect(menu.getAttribute("aria-label")).toBe("Open menu");
      await act(async () => {
        menu.click();
      });

      const drawer = document.getElementById("mobile-nav");
      expect(drawer?.querySelectorAll(".nav-mobile-card").length).toBe(4);
      expect(drawer?.textContent).toContain("From first call to first day");

      const mobileBook = document.getElementById("nav-book-a-call-mobile");
      expect(mobileBook?.textContent?.trim()).toBe("Book a Call");

      const whatsApp = document.getElementById("nav-whatsapp-mobile");
      expect(whatsApp?.getAttribute("href")).toContain("wa.me/962793001043");
      expect(whatsApp?.getAttribute("target")).toBe("_blank");
    });

    it("opens the booking modal from the desktop CTA", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <SiteNav />
          </CalDialogProvider>,
        );
      });

      const bookCall = container.querySelector(
        "#nav-book-a-call-desktop",
      ) as HTMLButtonElement;
      await act(async () => {
        bookCall.click();
      });

      expect(document.getElementById("booking-modal")).not.toBeNull();
    });
  });

  describe("SiteFooter", () => {
    it("renders WhatsApp link, social handles, and Book a Call button", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <SiteFooter />
          </CalDialogProvider>,
        );
      });

      const footer = container.querySelector("footer#contact");
      expect(footer).not.toBeNull();

      // WhatsApp link
      const whatsAppLink = container.querySelector('a[href*="wa.me/962793001043"]');
      expect(whatsAppLink).not.toBeNull();
      expect(whatsAppLink?.getAttribute("target")).toBe("_blank");

      // Book a Call button
      const bookCallBtn = container.querySelector("#footer-book-a-call");
      expect(bookCallBtn).not.toBeNull();

      // Social links
      expect(container.querySelector('a[href*="linkedin.com"]')).not.toBeNull();
      expect(container.querySelector('a[href*="instagram.com"]')).not.toBeNull();
      expect(container.querySelector('a[href*="mailto:yasmin@hirefound.com"]')).not.toBeNull();
    });

    it("renders employer consultation helper and job seeker link in footer", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <SiteFooter />
          </CalDialogProvider>,
        );
      });

      const footer = container.querySelector("footer#contact");
      expect(footer?.textContent).toContain(
        "Employers: Book a discovery call, or message me directly on WhatsApp.",
      );
      expect(footer?.textContent).toContain("Yasmin Blasi");
      expect(footer?.textContent).toContain("Chat on WhatsApp");
      expect(footer?.querySelector(".hf-butterfly-drift")).not.toBeNull();
      expect(footer?.querySelector(".hf-heart-beat")).not.toBeNull();
      expect(footer?.querySelector(".hf-heart-beat")?.getAttribute("class")).toContain("text-linen/75");
      expect(footer?.textContent).toContain("Looking for open positions?");
      expect(footer?.querySelector('a[href="/jobs/"]')).not.toBeNull();
    });
  });

  describe("LiveVacancies", () => {
    it("renders jobs and category filters", async () => {
      await act(async () => {
        root.render(<LiveVacancies />);
      });

      // Filter pills should be rendered when multiple categories exist
      const pills = container.querySelectorAll(".filter-pill");
      expect(pills.length).toBeGreaterThanOrEqual(2); // "All", "Hospitality", "Tech"

      // Job titles
      expect(container.textContent).toContain("Senior Barista");
      expect(container.textContent).toContain("Frontend Engineer");
    });

    it("does not offer speculative WhatsApp CV outreach when no jobs match or board is empty", async () => {
      fetchJobsMock.mockResolvedValueOnce([]);
      await act(async () => {
        root.render(<LiveVacancies />);
      });

      expect(container.textContent).toContain("Quiet on the board");
      expect(container.textContent).not.toContain("Submit CV");
      const emptyGrid = container.querySelector("#vacancy-grid");
      expect(emptyGrid?.querySelector('a[href*="wa.me"]')).toBeNull();
    });

    it("renders board pause state when jobs fetch fails and allows reloading", async () => {
      fetchJobsMock
        .mockRejectedValueOnce(new Error("network error"))
        .mockResolvedValueOnce([
          {
            id: "barista-1",
            title: "Senior Barista",
            slug: "senior-barista",
            category: "hospitality",
            location: "Amman, Jordan",
            employmentType: "full-time",
            isActive: true,
          },
        ]);

      await act(async () => {
        root.render(<LiveVacancies />);
      });

      expect(container.textContent).toContain("The board is taking a breath");
      expect(container.textContent).toContain(
        "We are having trouble connecting to live roles right now",
      );

      const checkAgainBtn = container.querySelector(
        'button[aria-label="Check again for open roles"]',
      ) as HTMLButtonElement;
      expect(checkAgainBtn).not.toBeNull();

      await act(async () => {
        checkAgainBtn.click();
      });

      expect(container.textContent).toContain("Senior Barista");
    });
  });

  describe("ActionStack", () => {
    it("renders floating action buttons for WhatsApp and booking", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <ActionStack />
          </CalDialogProvider>,
        );
      });

      const stack = container.querySelector("#action-stack");
      expect(stack).not.toBeNull();

      const fabBook = container.querySelector("#fab-book");
      const fabWa = container.querySelector("#fab-whatsapp");
      expect(fabBook).not.toBeNull();
      expect(fabWa).not.toBeNull();
      expect(fabWa?.getAttribute("href")).toContain("wa.me/962793001043");
    });
  });

  describe("CalDialog", () => {
    function TestTrigger() {
      const { open } = useBookingModal();
      return (
        <button id="test-open" onClick={(e) => open(e.currentTarget)}>
          Open Modal
        </button>
      );
    }

    it("opens a Cal.com embed and closes on Escape without polling", async () => {
      const interval = vi.spyOn(window, "setInterval");
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <TestTrigger />
          </CalDialogProvider>,
        );
      });

      expect(document.getElementById("booking-modal")).toBeNull();
      expect(window.BookingModal).toBeDefined();

      const trigger = container.querySelector("#test-open") as HTMLButtonElement;
      await act(async () => {
        trigger.click();
      });

      const modal = document.getElementById("booking-modal");
      expect(modal?.getAttribute("data-state")).toBe("open");
      const iframe = modal?.querySelector("iframe");
      const src = iframe?.getAttribute("src") ?? "";
      expect(src).toContain("https://cal.com/yasminblasi");
      expect(src).toContain("embed=true");
      expect(src).toContain("brandColor=7A1E4A");
      expect(interval).not.toHaveBeenCalled();

      await act(async () => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
      });

      expect(document.getElementById("booking-modal")).toBeNull();
      expect(document.activeElement).toBe(trigger);
      interval.mockRestore();
    });

    it("displays executive consultation title and does not show job seeker banner", async () => {
      await act(async () => {
        root.render(
          <CalDialogProvider>
            <TestTrigger />
          </CalDialogProvider>,
        );
      });

      const trigger = container.querySelector("#test-open") as HTMLButtonElement;
      await act(async () => {
        trigger.click();
      });

      const modal = document.getElementById("booking-modal");
      expect(modal?.textContent).toContain("Book an Executive Consultation");
      expect(modal?.textContent).toContain("For founders, CEOs & hiring leaders");
      expect(modal?.textContent).not.toContain("Job seeker?");
      expect(modal?.textContent).not.toContain("browse our open roles");
    });
  });
});
