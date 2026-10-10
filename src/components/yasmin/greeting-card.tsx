"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { extractFirstName, pickGreeting } from "@/lib/yasmin/greeting";
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

export function GreetingCard({ user }: GreetingCardProps) {
  const [content] = useState(() => pickGreeting(user.displayName));

  const firstName = extractFirstName(user.displayName);
  const subtitleText = content.subtitleText ?? content.subtitle;
  const subtitleEmoji = content.subtitleEmoji ?? "";

  return (
    <div className="greeting-card-atelier relative w-full min-w-0 flex-1 overflow-hidden rounded-3xl border border-[#D4A574]/30 bg-linear-to-br from-[#FFFCF8] via-[#FCF9F5] to-[#F3EBE3]/60 p-5 shadow-[0_4px_24px_rgba(122,30,74,0.04)] sm:p-7">
      {/* Decorative ambient orbs */}
      <div
        className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-[#FDA4AF]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-[#FCD34D]/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Top row: Avatar, Greeting & Subtitle */}
      <div className="relative z-10 flex min-w-0 items-start gap-4 sm:gap-5">
        {user.photoURL ? (
          <div className="relative shrink-0 pt-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.photoURL}
              alt={`${firstName}'s avatar`}
              width={56}
              height={56}
              className="size-14 rounded-full object-cover ring-2 ring-[#D4A574]/60 shadow-[0_0_16px_rgba(212,165,116,0.35)] sm:size-16"
            />
          </div>
        ) : (
          <div
            className="butterfly-pulse relative flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#FCF9F5] via-[#F3EBE3] to-[#C4B5FD]/30 ring-2 ring-[#D4A574]/60 shadow-[0_0_16px_rgba(252,211,77,0.25)] sm:size-16"
            aria-hidden="true"
          >
            <GracefulButterflyIcon className="size-8 sm:size-9" />
          </div>
        )}

        {/* Dynamic greeting line + subtitle quote */}
        <div className="min-w-0 flex-1">
          <h1 className="font-accent text-2xl font-normal tracking-tight text-[#7A1E4A] sm:text-3xl lg:text-4xl">
            {content.greeting}
          </h1>

          <p className="mt-1.5 font-serif text-sm italic text-[#5E534C] sm:text-base">
            <span className="text-[#7A1E4A]/70">“</span>
            <span className="bg-linear-to-r from-[#5E534C] via-[#7A1E4A] to-[#D4A574] bg-clip-text font-medium text-transparent">
              {subtitleText}
            </span>
            {subtitleEmoji ? <span> {subtitleEmoji}</span> : null}
            <span className="text-[#7A1E4A]/70">”</span>
          </p>
        </div>
      </div>

      {/* Inline Note for Yasmin with warm words */}
      <YasminOracleNote />
    </div>
  );
}

export default GreetingCard;
