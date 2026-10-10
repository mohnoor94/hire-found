"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { pickAffirmation } from "@/lib/yasmin/greeting";

export interface YasminOracleNoteProps {
  className?: string;
  initialAffirmation?: string;
}

export function YasminOracleNote({
  className = "",
  initialAffirmation,
}: YasminOracleNoteProps) {
  const [affirmation, setAffirmation] = useState<string>(
    () => initialAffirmation ?? pickAffirmation(),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      let next = pickAffirmation();
      if (next === affirmation) {
        next = pickAffirmation();
      }
      setAffirmation(next);
      setIsRefreshing(false);
    }, 150);
  };

  return (
    <div
      className={`relative mt-5 overflow-hidden rounded-2xl border border-[#D4A574]/30 bg-linear-to-r from-white/90 via-[#FCF9F5]/90 to-white/80 p-4 sm:p-5 shadow-[0_2px_14px_rgba(212,165,116,0.06)] backdrop-blur-xs transition-all ${className}`}
      data-testid="yasmin-oracle-note"
    >
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#D4A574]/15">
        <div className="flex items-center gap-2">
          <span className="text-xs" aria-hidden="true">
            💌
          </span>
          <span className="font-accent text-xs font-semibold uppercase tracking-wider text-[#7A1E4A]">
            A Note for Yasmin
          </span>
          <span className="text-xs text-[#D4A574]">·</span>
          <span className="text-[11px] font-medium text-[#5E534C]/80">
            Daily Spark
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium text-[#7A1E4A] hover:bg-[#7A1E4A]/10 active:scale-95 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#7A1E4A]"
          aria-label="Refresh daily spark"
          title="Refresh inspiration"
        >
          <Sparkles
            className={`size-3 text-[#D4A574] transition-transform duration-300 ${
              isRefreshing ? "rotate-180 scale-110" : "group-hover:rotate-12"
            }`}
            aria-hidden="true"
          />
          <span>Refresh</span>
        </button>
      </div>

      <p
        className={`mt-2.5 font-serif text-sm leading-relaxed text-[#2D2926] sm:text-base transition-opacity duration-150 ${
          isRefreshing ? "opacity-30" : "opacity-100"
        }`}
        dir="auto"
      >
        {affirmation}
      </p>
    </div>
  );
}

export default YasminOracleNote;
