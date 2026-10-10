"use client";

import { useEffect, useRef, useState } from "react";

export interface CelebrationButterflyProps {
  show: boolean;
  onComplete?: () => void;
}

interface ButterflyConfig {
  id: string;
  color: string;
  accentColor: string;
  size: number;
  left: string;
  bottom: string;
  animationClass: string;
}

const BUTTERFLIES: ButterflyConfig[] = [
  {
    id: "butterfly-1",
    color: "#C4B5FD",
    accentColor: "#7C3AED",
    size: 58,
    left: "28%",
    bottom: "12%",
    animationClass: "celebration-fly-1",
  },
  {
    id: "butterfly-2",
    color: "#FDA4AF",
    accentColor: "#BE185D",
    size: 52,
    left: "48%",
    bottom: "8%",
    animationClass: "celebration-fly-2",
  },
  {
    id: "butterfly-3",
    color: "#C4B5FD",
    accentColor: "#8B5CF6",
    size: 46,
    left: "64%",
    bottom: "14%",
    animationClass: "celebration-fly-3",
  },
  {
    id: "butterfly-4",
    color: "#FDA4AF",
    accentColor: "#E11D48",
    size: 54,
    left: "38%",
    bottom: "6%",
    animationClass: "celebration-fly-4",
  },
];

interface SparkleConfig {
  id: string;
  color: string;
  size: number;
  left: string;
  bottom: string;
  delay: string;
  duration: string;
}

const SPARKLES: SparkleConfig[] = [
  { id: "sparkle-1", color: "#FCD34D", size: 16, left: "26%", bottom: "28%", delay: "0.4s", duration: "0.9s" },
  { id: "sparkle-2", color: "#C4B5FD", size: 14, left: "32%", bottom: "42%", delay: "0.7s", duration: "1.0s" },
  { id: "sparkle-3", color: "#FDA4AF", size: 18, left: "46%", bottom: "34%", delay: "0.5s", duration: "1.1s" },
  { id: "sparkle-4", color: "#FCD34D", size: 12, left: "52%", bottom: "50%", delay: "0.9s", duration: "0.9s" },
  { id: "sparkle-5", color: "#C4B5FD", size: 15, left: "62%", bottom: "36%", delay: "0.6s", duration: "1.0s" },
  { id: "sparkle-6", color: "#FDA4AF", size: 14, left: "68%", bottom: "52%", delay: "1.1s", duration: "0.9s" },
  { id: "sparkle-7", color: "#FCD34D", size: 20, left: "22%", bottom: "62%", delay: "1.3s", duration: "1.0s" },
  { id: "sparkle-8", color: "#C4B5FD", size: 16, left: "44%", bottom: "68%", delay: "1.4s", duration: "0.9s" },
  { id: "sparkle-9", color: "#FDA4AF", size: 18, left: "58%", bottom: "70%", delay: "1.5s", duration: "1.0s" },
  { id: "sparkle-10", color: "#FFFFFF", size: 12, left: "36%", bottom: "56%", delay: "1.2s", duration: "0.8s" },
];

function ButterflySvg({
  color,
  accentColor,
  size,
  uniqueId,
}: {
  color: string;
  accentColor: string;
  size: number;
  uniqueId: string;
}) {
  const gradientId = `wing-grad-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <defs>
        <radialGradient
          id={gradientId}
          cx="45%"
          cy="45%"
          r="65%"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="55%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.82" />
        </radialGradient>
      </defs>

      {/* Left Wing Group */}
      <g
        className="celebration-wing-flutter-left"
        style={{ transformOrigin: "32px 32px" }}
      >
        <path
          d="M 32 28 C 24 12 10 8 5 18 C 1 26 13 35 31 31 Z"
          fill={`url(#${gradientId})`}
          stroke={accentColor}
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path
          d="M 28 26 C 22 16 14 14 10 20 C 8 24 16 30 28 28"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="none"
        />
        <path
          d="M 31 33 C 17 36 9 44 13 54 C 17 60 26 50 32 37 Z"
          fill={`url(#${gradientId})`}
          stroke={accentColor}
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path
          d="M 27 36 C 20 40 16 46 18 50 C 21 52 26 46 29 39"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="none"
        />
      </g>

      {/* Right Wing Group */}
      <g
        className="celebration-wing-flutter-right"
        style={{ transformOrigin: "32px 32px" }}
      >
        <path
          d="M 32 28 C 40 12 54 8 59 18 C 63 26 51 35 33 31 Z"
          fill={`url(#${gradientId})`}
          stroke={accentColor}
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path
          d="M 36 26 C 42 16 50 14 54 20 C 56 24 48 30 36 28"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="none"
        />
        <path
          d="M 33 33 C 47 36 55 44 51 54 C 47 60 38 50 32 37 Z"
          fill={`url(#${gradientId})`}
          stroke={accentColor}
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path
          d="M 37 36 C 44 40 48 46 46 50 C 43 52 38 46 35 39"
          stroke="#FFFFFF"
          strokeWidth="0.8"
          strokeOpacity="0.75"
          fill="none"
        />
      </g>

      {/* Butterfly Body and Antennae */}
      <g>
        <path
          d="M 31 20 C 27 14 21 12 18 13"
          stroke="#5E1639"
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="18" cy="13" r="1.2" fill="#D4A574" />

        <path
          d="M 33 20 C 37 14 43 12 46 13"
          stroke="#5E1639"
          strokeWidth="0.85"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="46" cy="13" r="1.2" fill="#D4A574" />

        <ellipse cx="32" cy="32" rx="1.8" ry="11" fill="#5E1639" />
        <circle cx="32" cy="21" r="2.2" fill="#7A1E4A" />
      </g>
    </svg>
  );
}

function SparkleSvg({
  color,
  size,
}: {
  color: string;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      <path
        d="M 12 2 Q 12 12 2 12 Q 12 12 12 22 Q 12 12 22 12 Q 12 12 12 2 Z"
        fill={color}
      />
      <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
    </svg>
  );
}

export function CelebrationButterfly({ show, onComplete }: CelebrationButterflyProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    if (prefersReducedMotion) {
      onCompleteRef.current?.();
      return;
    }

    const timer = setTimeout(() => {
      onCompleteRef.current?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [show, prefersReducedMotion]);

  if (!show || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="celebration-butterflies-root pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {/* Butterflies */}
      {BUTTERFLIES.map((butterfly) => (
        <div
          key={butterfly.id}
          className={`absolute ${butterfly.animationClass}`}
          style={{
            left: butterfly.left,
            bottom: butterfly.bottom,
          }}
        >
          <ButterflySvg
            color={butterfly.color}
            accentColor={butterfly.accentColor}
            size={butterfly.size}
            uniqueId={butterfly.id}
          />
        </div>
      ))}

      {/* Dissolving sparkles */}
      {SPARKLES.map((sparkle) => (
        <div
          key={sparkle.id}
          className="celebration-sparkle-item absolute"
          style={{
            left: sparkle.left,
            bottom: sparkle.bottom,
            animationDuration: sparkle.duration,
            animationDelay: sparkle.delay,
          }}
        >
          <SparkleSvg color={sparkle.color} size={sparkle.size} />
        </div>
      ))}
    </div>
  );
}

export default CelebrationButterfly;
