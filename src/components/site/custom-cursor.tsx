"use client";

import { useEffect, useRef } from "react";

/** Desktop custom cursor — matches vanilla index.html behavior. */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || !ref.current) return;

    const cursor = ref.current;
    cursor.classList.add("active");

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("input, textarea, [contenteditable]")) {
        cursor.style.opacity = "0";
        return;
      }
      if (
        t.closest(
          "a, button, [role='button'], [role='link'], .magnetic, .premium-card, .filter-pill",
        )
      ) {
        cursor.classList.add("hovering");
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest("input, textarea, [contenteditable]")) {
        cursor.style.opacity = "";
      }
      if (
        t.closest(
          "a, button, [role='button'], [role='link'], .magnetic, .premium-card, .filter-pill",
        )
      ) {
        cursor.classList.remove("hovering");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return <div id="custom-cursor" ref={ref} className="custom-cursor" />;
}
