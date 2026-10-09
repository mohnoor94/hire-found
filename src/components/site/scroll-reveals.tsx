"use client";

import { useEffect } from "react";

/** Scroll-reveal for .reveal / .reveal-child; step connectors on #steps-grid. */
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
    const observed = new WeakSet<Element>();

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

    const observeReveal = (el: Element) => {
      if (observed.has(el) || el.closest(".reveal-stagger")) return;
      observed.add(el);
      revealObs.observe(el);
    };

    const observeStaggerGroup = (group: Element) => {
      if (observed.has(group)) return;
      observed.add(group);
      const children = group.querySelectorAll(".reveal-child");
      const groupObs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            children.forEach((child, i) => {
              window.setTimeout(
                () => child.classList.add("revealed"),
                i * 120,
              );
            });
            groupObs.unobserve(entry.target);
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
      );
      groupObs.observe(group);
      observers.push(groupObs);
    };

    const scan = () => {
      document.querySelectorAll(".reveal").forEach(observeReveal);
      document.querySelectorAll(".reveal-stagger").forEach(observeStaggerGroup);
    };

    scan();

    let scheduled = false;
    const mo = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Step connectors and circle pulsing on #steps-grid
    const stepsGrid = document.getElementById("steps-grid");
    if (stepsGrid) {
      const stepObs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            document.querySelectorAll(".step-connector").forEach((line, i) => {
              window.setTimeout(
                () => line.classList.add("animate"),
                400 + i * 300,
              );
            });
            document.querySelectorAll("[data-step-circle]").forEach((c, i) => {
              window.setTimeout(
                () => c.classList.add("step-pulse"),
                800 + i * 200,
              );
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
      mo.disconnect();
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return null;
}
