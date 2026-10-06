import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { SiteNav } from "./site-nav";
import { SiteFooter } from "./site-footer";
import { ActionStack } from "./action-stack";
import { BookingModalProvider, useBookingModal } from "./booking-modal";
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

// Mock fetchJobs
vi.mock("@/lib/jobs", () => ({
  fetchJobs: vi.fn().mockResolvedValue([
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
    it("renders navigation links and Get Started CTA", async () => {
      await act(async () => {
        root.render(
          <BookingModalProvider>
            <SiteNav />
          </BookingModalProvider>,
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

      // Check Get Started button
      const getStarted = container.querySelector("#nav-get-started-desktop");
      expect(getStarted).not.toBeNull();
      expect(getStarted?.textContent?.trim()).toBe("Get Started");
    });
  });

  describe("SiteFooter", () => {
    it("renders WhatsApp link, social handles, and Book a Call button", async () => {
      await act(async () => {
        root.render(
          <BookingModalProvider>
            <SiteFooter />
          </BookingModalProvider>,
        );
      });

      const footer = container.querySelector("section#contact");
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
  });

  describe("LiveVacancies", () => {
    it("renders jobs, category filters, and Career Bridge with data-switch-tab", async () => {
      await act(async () => {
        root.render(
          <BookingModalProvider>
            <LiveVacancies />
          </BookingModalProvider>,
        );
      });

      // Filter pills should be rendered when multiple categories exist
      const pills = container.querySelectorAll(".filter-pill");
      expect(pills.length).toBeGreaterThanOrEqual(2); // "All", "Hospitality", "Tech"

      // Career bridge link
      const careerBridge = container.querySelector(".career-bridge");
      expect(careerBridge).not.toBeNull();
      expect(careerBridge?.getAttribute("href")).toBe("#services");
      expect(careerBridge?.getAttribute("data-switch-tab")).toBe("candidates");

      // Job titles
      expect(container.textContent).toContain("Senior Barista");
      expect(container.textContent).toContain("Frontend Engineer");
    });
  });

  describe("ActionStack", () => {
    it("renders floating action buttons for WhatsApp and booking", async () => {
      await act(async () => {
        root.render(
          <BookingModalProvider>
            <ActionStack />
          </BookingModalProvider>,
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

  describe("BookingModalProvider", () => {
    function TestTrigger() {
      const { open } = useBookingModal();
      return (
        <button id="test-open" onClick={(e) => open(e.currentTarget)}>
          Open Modal
        </button>
      );
    }

    it("opens on trigger click, sets window.BookingModal, and closes on Escape", async () => {
      await act(async () => {
        root.render(
          <BookingModalProvider>
            <TestTrigger />
          </BookingModalProvider>,
        );
      });

      const modal = container.querySelector("#booking-modal");
      expect(modal?.classList.contains("hidden")).toBe(true);
      expect(window.BookingModal).toBeDefined();

      // Click trigger to open
      const trigger = container.querySelector("#test-open") as HTMLButtonElement;
      await act(async () => {
        trigger.click();
      });

      expect(modal?.classList.contains("hidden")).toBe(false);
      expect(modal?.getAttribute("data-state")).toBe("open");

      // Press Escape to close
      await act(async () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      });

      expect(modal?.classList.contains("hidden")).toBe(true);
      expect(modal?.getAttribute("data-state")).toBe("closed");
    });
  });
});
