"use client";

import { useState } from "react";
import { pickAffirmation } from "@/lib/yasmin/greeting";

export interface YasminOracleNoteProps {
  className?: string;
  initialAffirmation?: string;
}

export function YasminOracleNote({
  className = "",
  initialAffirmation,
}: YasminOracleNoteProps) {
  const [affirmation] = useState<string>(
    () => initialAffirmation ?? pickAffirmation(),
  );

  return (
    <div
      className={`relative mt-4 border-l-2 border-[#D4A574] bg-linear-to-r from-[#D4A574]/15 via-[#D4A574]/5 to-transparent py-3 pr-4 pl-3.5 rounded-r-2xl shadow-[0_2px_12px_rgba(212,165,116,0.06)] transition-all sm:pl-4 sm:pr-5 ${className}`}
      data-testid="yasmin-oracle-note"
    >
      <div className="flex items-center gap-2 pb-1.5">
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

      <p
        className="font-serif text-sm leading-relaxed text-[#2D2926] sm:text-base"
        dir="auto"
      >
        {affirmation}
      </p>
    </div>
  );
}

export default YasminOracleNote;
