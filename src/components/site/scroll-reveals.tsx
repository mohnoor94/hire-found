"use client";

import { useEffect } from "react";

/** Scroll-reveal for .reveal / .reveal-child / .fade-up / .text-reveal */
export function ScrollReveals() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document
        .querySelectorAll(".reveal, .reveal-child, .fade-up, .text-reveal")
        .forEach((el) => {
          el.classList.add("revealed", "visible");
        });
      return;
    }

    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document.querySelectorAll(".reveal, .reveal-child").forEach((el) => {
      revealObs.observe(el);
    });

    // Hero entrance
    requestAnimationFrame(() => {
      document.querySelectorAll(".fade-up, .text-reveal").forEach((el, i) => {
        window.setTimeout(() => el.classList.add("visible"), 80 + i * 90);
      });
      document.getElementById("hero-chat")?.classList.add("visible");
    });

    return () => revealObs.disconnect();
  }, []);

  return null;
}
