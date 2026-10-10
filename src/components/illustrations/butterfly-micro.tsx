import type { IllustrationProps } from "./types";

export function ButterflyMicro({
  className = "",
  width = 24,
  height = 20,
  ...props
}: IllustrationProps) {
  return (
    <svg
      viewBox="-6 1 28 20"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {/* Upper left wing (lavender) */}
      <path
        d="M8 10 C6 6 2 3 -1 2.5 C-3.5 2 -5 3.5 -5 6 C-5 8.5 -3 11 0 11.5 C3 12 6 11 8 10 Z"
        fill="#C4B5FD"
      />
      {/* Lower left wing (rose) */}
      <path
        d="M8 10 C6 12 3 15 0.5 16.5 C-2 18 -4.5 17.5 -4.5 15 C-4.5 12.5 -2.5 11 0.5 11 C3 11 6 10.5 8 10 Z"
        fill="#FDA4AF"
      />
      {/* Upper right wing (lavender) */}
      <path
        d="M8 10 C10 6 14 3 17 2.5 C19.5 2 21 3.5 21 6 C21 8.5 19 11 16 11.5 C13 12 10 11 8 10 Z"
        fill="#C4B5FD"
      />
      {/* Lower right wing (rose) */}
      <path
        d="M8 10 C10 12 13 15 15.5 16.5 C18 18 20.5 17.5 20.5 15 C20.5 12.5 18.5 11 15.5 11 C13 11 10 10.5 8 10 Z"
        fill="#FDA4AF"
      />
      {/* Body */}
      <ellipse cx="8" cy="11" rx="1" ry="4" fill="#7C3AED" />
      {/* Antennae */}
      <path
        d="M7.5 7 C6.2 4.5 4.5 3 3.5 2.2"
        stroke="#7C3AED"
        strokeWidth="0.75"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M8.5 7 C9.8 4.5 11.5 3 12.5 2.2"
        stroke="#7C3AED"
        strokeWidth="0.75"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="3.5" cy="2.2" r="0.75" fill="#7C3AED" />
      <circle cx="12.5" cy="2.2" r="0.75" fill="#7C3AED" />
    </svg>
  );
}
