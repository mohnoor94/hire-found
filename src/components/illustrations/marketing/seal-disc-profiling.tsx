import type { IllustrationProps } from "../types";

export function SealDiscProfiling({
  className = "",
  width = 64,
  height = 64,
  ...props
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`seal-disc-profiling ${className}`}
      {...props}
    >
      {/* Outer seal circle */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <circle
        cx="32"
        cy="32"
        r="27"
        fill="#F3EBE3"
        fillOpacity="0.4"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />

      {/* 4 DISC Quadrants (Diamond layout) */}
      {/* Quadrant D (Top) */}
      <path
        d="M32 14 L42 24 L32 28 L22 24 Z"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.25"
      />
      {/* Quadrant I (Right) */}
      <path
        d="M44 26 L50 32 L44 38 L36 32 Z"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.25"
      />
      {/* Quadrant S (Bottom) */}
      <path
        d="M32 36 L42 40 L32 50 L22 40 Z"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.25"
      />
      {/* Quadrant C (Left) */}
      <path
        d="M20 26 L28 32 L20 38 L14 32 Z"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.25"
      />

      {/* Central Micro-Butterfly at the axis */}
      <g transform="translate(32, 32) translate(-6, -7)">
        {/* Left wings */}
        <path
          d="M6 7 C4 4 1 2 -1 1.5 C-3 1 -4 2.5 -4 4.5 C-4 6.5 -2 8 0 8.5 C2 9 4.5 8 6 7 Z"
          fill="#C4B5FD"
        />
        <path
          d="M6 7 C4.5 8.5 2 11 0 12 C-2 13 -3.5 12.5 -3.5 10.5 C-3.5 8.5 -2 7.5 0 7.5 C2 7.5 4.5 7.2 6 7 Z"
          fill="#FDA4AF"
        />
        {/* Right wings */}
        <path
          d="M6 7 C8 4 11 2 13 1.5 C15 1 16 2.5 16 4.5 C16 6.5 14 8 12 8.5 C10 9 7.5 8 6 7 Z"
          fill="#C4B5FD"
        />
        <path
          d="M6 7 C7.5 8.5 10 11 12 12 C14 13 15.5 12.5 15.5 10.5 C15.5 8.5 14 7.5 12 7.5 C10 7.5 7.5 7.2 6 7 Z"
          fill="#FDA4AF"
        />
        {/* Body */}
        <ellipse cx="6" cy="8" rx="0.8" ry="3.2" fill="#7C3AED" />
      </g>
    </svg>
  );
}
