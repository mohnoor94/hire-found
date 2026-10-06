"use client";

import { useEffect } from "react";

/**
 * Desktop magnetic buttons + 3D premium-card tilt.
 * Rebinds when new .magnetic / .premium-card nodes appear (e.g. vacancy cards).
 */
export function MicroInteractions() {
  useEffect(() => {
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!fine) return;

    const cleanups = new Map<Element, () => void>();

    const bindMagnetic = (btn: HTMLElement) => {
      if (cleanups.has(btn)) return;
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.15;
        const y = (e.clientY - r.top - r.height / 2) * 0.15;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      };
      const onLeave = () => {
        btn.style.transform = "";
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.set(btn, () => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
        btn.style.transform = "";
      });
    };

    const bindTilt = (card: HTMLElement) => {
      if (cleanups.has(card)) return;
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px) scale(1.01)`;
      };
      const onLeave = () => {
        card.style.transform = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.set(card, () => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        card.style.transform = "";
      });
    };

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>(".magnetic")
        .forEach(bindMagnetic);
      document
        .querySelectorAll<HTMLElement>(".premium-card")
        .forEach(bindTilt);
    };

    scan();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        scan();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
      cleanups.clear();
    };
  }, []);

  return null;
}
