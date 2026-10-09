"use client";

import { useEffect, useState } from "react";
import { useBookingModal } from "@/components/site/booking-modal";

/** Services employer/candidate tabs + booking triggers (vanilla parity). */
export function ServicesEffects() {
  const { open } = useBookingModal();
  const [tab, setTab] = useState<"employers" | "candidates">("employers");

  useEffect(() => {
    const employers = document.getElementById("employers");
    const candidates = document.getElementById("candidates");
    if (!employers || !candidates) return;

    const activePanel = tab === "employers" ? employers : candidates;
    const inactivePanel = tab === "employers" ? candidates : employers;

    // Fade out inactive
    inactivePanel.style.opacity = "0";
    inactivePanel.style.transform = "translateY(12px)";

    const timer = window.setTimeout(() => {
      inactivePanel.classList.add("hidden");
      inactivePanel.style.opacity = "";
      inactivePanel.style.transform = "";

      activePanel.querySelectorAll(".reveal-child").forEach((c) => {
        c.classList.remove("revealed");
      });
      activePanel.classList.remove("hidden");
      activePanel.style.opacity = "0";
      activePanel.style.transform = "translateY(12px)";

      requestAnimationFrame(() => {
        activePanel.style.opacity = "1";
        activePanel.style.transform = "translateY(0)";
        activePanel.querySelectorAll(".reveal-child").forEach((c, i) => {
          window.setTimeout(() => c.classList.add("revealed"), i * 100);
        });
      });
    }, 200);

    document.querySelectorAll("[data-tab]").forEach((btn) => {
      const el = btn as HTMLElement;
      const active = el.dataset.tab === tab;
      el.classList.toggle("active", active);
      el.setAttribute("aria-selected", active ? "true" : "false");
    });

    return () => window.clearTimeout(timer);
  }, [tab]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const tabBtn = target?.closest<HTMLElement>("[data-tab]");
      if (tabBtn?.dataset.tab === "employers" || tabBtn?.dataset.tab === "candidates") {
        setTab(tabBtn.dataset.tab);
        return;
      }
      const switcher = target?.closest<HTMLElement>("[data-switch-tab]");
      if (
        switcher?.dataset.switchTab === "employers" ||
        switcher?.dataset.switchTab === "candidates"
      ) {
        setTab(switcher.dataset.switchTab);
        return;
      }
      const booking = target?.closest<HTMLElement>(".booking-trigger");
      if (booking) {
        e.preventDefault();
        open(booking);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  return null;
}
