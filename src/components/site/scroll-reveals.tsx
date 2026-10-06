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

    const observers: IntersectionObserver[] = [];

    // Single .reveal elements (excluding those inside staggered groups)
    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observers.push(revealObs);

    document.querySelectorAll(".reveal").forEach((el) => {
      if (!el.closest(".reveal-stagger")) {
        revealObs.observe(el);
      }
    });

    // Staggered reveals (.reveal-stagger parent containing .reveal-child)
    document.querySelectorAll(".reveal-stagger").forEach((group) => {
      const children = group.querySelectorAll(".reveal-child");
      const groupObs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            children.forEach((child, i) => {
              window.setTimeout(() => child.classList.add("revealed"), i * 120);
            });
            groupObs.unobserve(entry.target);
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
      );
      groupObs.observe(group);
      observers.push(groupObs);
    });

    // Step connectors and circle pulsing on #steps-grid
    const stepsGrid = document.getElementById("steps-grid");
    if (stepsGrid) {
      const stepObs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            document.querySelectorAll(".step-connector").forEach((line, i) => {
              window.setTimeout(() => line.classList.add("animate"), 400 + i * 300);
            });
            document.querySelectorAll("[data-step-circle]").forEach((c, i) => {
              window.setTimeout(() => c.classList.add("step-pulse"), 800 + i * 200);
            });
            stepObs.unobserve(entry.target);
          }
        },
        { threshold: 0.2 },
      );
      stepObs.observe(stepsGrid);
      observers.push(stepObs);
    }

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return null;
}
