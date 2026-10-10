"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";

type ThemeChoice = "system" | "light" | "dark";
const STORAGE_KEY = "hf-theme";

function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const systemDark =
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  if (choice === "dark" || (choice === "system" && systemDark)) {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(() => {
    if (typeof window === "undefined") return "system";
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeChoice) || "system";
    return saved;
  });

  useEffect(() => {
    applyTheme(choice);
    if (choice === "system") {
      const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
      const onChange = () => applyTheme("system");
      mq?.addEventListener?.("change", onChange);
      return () => mq?.removeEventListener?.("change", onChange);
    }
    return;
  }, [choice]);

  const cycle = () => {
    const next: ThemeChoice =
      choice === "system" ? "light" : choice === "light" ? "dark" : "system";
    setChoice(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  const label =
    choice === "system" ? "Theme: system" : `Theme: ${choice}`;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={cycle}
      className="inline-flex size-11 touch-manipulation items-center justify-center rounded-full border border-primary/15 bg-white/70 text-primary transition-colors duration-200 hover:bg-white active:scale-[0.98] active:bg-primary/10"
    >
      {choice === "system" ? (
        <MonitorIcon className="size-5" aria-hidden="true" />
      ) : choice === "light" ? (
        <SunIcon className="size-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}

