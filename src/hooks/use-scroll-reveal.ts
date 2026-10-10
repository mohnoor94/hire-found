"use client";

import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  /**
   * Child selector to query within the container.
   * If omitted, applies visibility to the container ref itself.
   */
  selector?: string;
  threshold?: number;
  rootMargin?: string;
  /**
   * Stagger delay between items in milliseconds. Default is 45ms.
   */
  staggerMs?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const containerRef = useRef<T | null>(null);
  const {
    selector = ".reveal-on-scroll",
    threshold = 0.08,
    rootMargin = "0px 0px -10% 0px",
    staggerMs = 50,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets: HTMLElement[] = selector
      ? Array.from(container.querySelectorAll<HTMLElement>(selector))
      : [container];

    if (targets.length === 0) return;

    // A11y & SSR fallback: if reduced motion is requested or IO is missing, reveal immediately
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach((target) => {
        target.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const index = targets.indexOf(target);
            const delay = index >= 0 ? Math.min(index * staggerMs, 400) : 0;

            if (delay > 0) {
              target.style.transitionDelay = `${delay}ms`;
            }

            requestAnimationFrame(() => {
              target.classList.add("is-visible");
            });

            observer.unobserve(target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, [selector, threshold, rootMargin, staggerMs]);

  return containerRef;
}
