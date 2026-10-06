"use client";

import { useState } from "react";
import type { User } from "firebase/auth";
import { pickGreeting } from "@/lib/yasmin/greeting";

export function GreetingCard({ user }: { user: User }) {
  // Pick once per mount; parent remounts via key={user.uid} if the user changes.
  const [content] = useState(() => pickGreeting(user.displayName));

  return (
    <div className="mb-8">
      <div className="greeting-card relative overflow-hidden rounded-3xl border border-white/40 p-6 shadow-lg sm:p-8">
        <div className="greeting-gradient absolute inset-0 opacity-90" />
        <div
          className="greeting-particles pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <span className="particle particle-1">✨</span>
          <span className="particle particle-2">🦋</span>
          <span className="particle particle-3">💜</span>
          <span className="particle particle-4">🌸</span>
          <span className="particle particle-5">✨</span>
          <span className="particle particle-6">💫</span>
        </div>
        <div className="greeting-orb-1 absolute -top-10 -right-10 h-40 w-40 rounded-full bg-butterfly-lavender/20 blur-3xl" />
        <div className="greeting-orb-2 absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-butterfly-rose/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-5 sm:gap-6">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.photoURL}
              alt=""
              className="greeting-avatar h-14 w-14 flex-shrink-0 rounded-full object-cover shadow-lg ring-3 ring-white/60 ring-offset-2 ring-offset-transparent"
              style={{ width: 56, height: 56 }}
            />
          ) : (
            <div className="greeting-avatar flex-shrink-0">
              <svg
                width="56"
                height="56"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="24" cy="24" r="24" fill="#C4B5FD" fillOpacity="0.2" />
                <path
                  d="M24 14c-3-5-10-6-12-2s1 9 6 12c-5 3-8 8-6 12s9 3 12-2c3 5 10 6 12 2s-1-9-6-12c5-3 8-8 6-12s-9-3-12 2z"
                  fill="#C4B5FD"
                  stroke="#A78BFA"
                  strokeWidth="1"
                />
                <ellipse cx="24" cy="24" rx="1.5" ry="6" fill="#A78BFA" />
              </svg>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="greeting-text font-accent text-2xl font-bold text-text-main sm:text-3xl lg:text-4xl">
              {content.greeting}
            </h1>
            <p
              className="greeting-subtitle mt-3 text-lg font-bold tracking-wide sm:text-xl lg:text-2xl"
              style={{ fontFamily: "var(--font-caveat), cursive" }}
            >
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#E879A8] to-[#F59E0B] bg-clip-text text-transparent">
                {content.subtitleText}
              </span>
              {content.subtitleEmoji ? (
                <span className="inline-block"> {content.subtitleEmoji}</span>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
