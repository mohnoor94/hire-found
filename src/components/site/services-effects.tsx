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
    if (employers && candidates) {
      employers.style.display = tab === "employers" ? "" : "none";
      candidates.style.display = tab === "candidates" ? "" : "none";
    }

    document.querySelectorAll("[data-tab]").forEach((btn) => {
      const el = btn as HTMLElement;
      const active = el.dataset.tab === tab;
      el.classList.toggle("active", active);
      el.setAttribute("aria-selected", active ? "true" : "false");
    });
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
