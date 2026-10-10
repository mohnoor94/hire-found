"use client";

import { useEffect, useRef } from "react";

export function AmbientBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = backdropRef.current;
    if (!el) return;

    // A11y & Device checks: skip on reduced motion or coarse touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia?.("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        el.style.setProperty("--page-mx", `${x.toFixed(2)}%`);
        el.style.setProperty("--page-my", `${y.toFixed(2)}%`);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-60 transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* Primary cursor follower glow */}
      <div
        className="absolute inset-0 blur-3xl will-change-transform motion-safe:transition-[background-position] motion-safe:duration-300"
        style={{
          background:
            "radial-gradient(680px circle at var(--page-mx, 50%) var(--page-my, 40%), color-mix(in oklch, var(--primary) 9%, transparent), transparent 60%), radial-gradient(520px circle at calc(100% - var(--page-mx, 50%)) calc(100% - var(--page-my, 40%)), color-mix(in oklch, var(--secondary) 11%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
