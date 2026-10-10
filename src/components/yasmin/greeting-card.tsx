"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { withBasePath } from "@/lib/base-path";
import {
  extractFirstName,
  formatAtelierDate,
  pickGreeting,
} from "@/lib/yasmin/greeting";
import { YasminOracleNote } from "./yasmin-oracle-note";

export interface GreetingCardProps {
  user:
    | User
    | {
        uid?: string;
        displayName?: string | null;
        email?: string | null;
        photoURL?: string | null;
      };
  activeJobsCount?: number;
  totalJobsCount?: number;
}

function GracefulButterflyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="greeting-butterfly-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
      <path
        d="M 16 14 C 12 6 4 5 2 11 C 0 16 7 21 15 17 Z"
        fill="url(#greeting-butterfly-grad)"
        stroke="#D4A574"
        strokeWidth="0.5"
      />
      <path
        d="M 16 14 C 20 6 28 5 30 11 C 32 16 25 21 17 17 Z"
        fill="url(#greeting-butterfly-grad)"
        stroke="#D4A574"
        strokeWidth="0.5"
      />
      <path
        d="M 15 17 C 8 19 4 24 6 28 C 8 30 13 26 16 19 Z"
        fill="url(#greeting-butterfly-grad)"
        stroke="#D4A574"
        strokeWidth="0.5"
        fillOpacity="0.85"
      />
      <path
        d="M 17 17 C 24 19 28 24 26 28 C 24 30 19 26 16 19 Z"
        fill="url(#greeting-butterfly-grad)"
        stroke="#D4A574"
        strokeWidth="0.5"
        fillOpacity="0.85"
      />
      <ellipse cx="16" cy="18" rx="1.2" ry="5.5" fill="#7A1E4A" />
      <path
        d="M 15.5 13 C 14 10 12 9 10 10"
        stroke="#7A1E4A"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M 16.5 13 C 18 10 20 9 22 10"
        stroke="#7A1E4A"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GreetingCard({
  user,
  activeJobsCount,
}: GreetingCardProps) {
  const [content] = useState(() => pickGreeting(user.displayName));

  const firstName = extractFirstName(user.displayName);
  const subtitleText = content.subtitleText ?? content.subtitle;
  const subtitleEmoji = content.subtitleEmoji ?? "";
  const avatarSrc = user.photoURL || withBasePath("/assets/yasmin-blasi.png");
  const todayLabel = formatAtelierDate();

  return (
    <section
      aria-label="Atelier Masthead"
      className="greeting-card-atelier relative w-full min-w-0 flex-1 overflow-hidden rounded-3xl border border-[#D4A574]/20 bg-linear-to-b from-white/80 via-[#FCF9F5]/60 to-transparent p-5 backdrop-blur-xs sm:p-7 lg:p-8 shadow-[0_4px_30px_rgba(212,165,116,0.06)]"
    >
      {/* Radiant ambient atmospheric washes */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-linear-to-br from-[#FDA4AF]/15 via-[#FCD34D]/10 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 size-72 rounded-full bg-linear-to-tr from-[#C4B5FD]/10 via-[#D4A574]/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      {/* Editorial Brow Bar: Date, Location & Calming Pulse */}
      <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#D4A574]/15 pb-3.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#D4A574]/80 shadow-[0_0_8px_rgba(212,165,116,0.8)]" />
          <span className="font-accent text-xs font-semibold uppercase tracking-wider text-[#7A1E4A]">
            Personal Atelier
          </span>
          <span className="text-xs text-[#D4A574]">·</span>
          <span className="text-xs font-serif italic text-[#5E534C]">
            {todayLabel}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4A574]/25 bg-white/70 px-3 py-1 text-[11px] font-medium text-[#7A1E4A] shadow-2xs backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {typeof activeJobsCount === "number"
              ? `${activeJobsCount} ${activeJobsCount === 1 ? "role" : "roles"} active · In flow`
              : "Sanctuary in flow"}
          </span>
        </div>
      </div>

      {/* Main Composition: Avatar, Greeting & Subtitle */}
      <div className="relative z-10 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative shrink-0 self-start sm:self-center">
          <div className="relative size-16 sm:size-20 overflow-hidden rounded-full ring-2 ring-[#D4A574]/50 ring-offset-2 ring-offset-[#FCF9F5] shadow-[0_4px_20px_rgba(212,165,116,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt={`${firstName}'s portrait`}
              width={80}
              height={80}
              className="size-full object-cover"
            />
          </div>
          <div
            className="butterfly-pulse pointer-events-none absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white ring-1 ring-[#D4A574]/40 shadow-xs"
            aria-hidden="true"
          >
            <GracefulButterflyIcon className="size-3.5" />
          </div>
        </div>

        {/* Dynamic greeting line + subtitle quote */}
        <div className="min-w-0 flex-1">
          <h1 className="font-accent text-3xl font-normal tracking-tight text-[#7A1E4A] sm:text-4xl lg:text-5xl">
            {content.greeting}
          </h1>

          <p className="mt-2 font-serif text-base italic text-[#5E534C] sm:text-lg leading-relaxed">
            <span className="text-[#7A1E4A]/70">“</span>
            <span className="bg-linear-to-r from-[#5E534C] via-[#7A1E4A] to-[#D4A574] bg-clip-text font-medium text-transparent">
              {subtitleText}
            </span>
            {subtitleEmoji ? <span> {subtitleEmoji}</span> : null}
            <span className="text-[#7A1E4A]/70">”</span>
          </p>

          <p className="mt-1.5 text-xs font-medium tracking-wide text-[#5E534C]/70">
            Yasmin Blasi · Founder & Executive Curator · HireFound
          </p>
        </div>
      </div>

      {/* Inline Note for Yasmin with warm, restorative words */}
      <YasminOracleNote />
    </section>
  );
}

export default GreetingCard;
