import type { IllustrationProps } from "../types";

export function SealDirectPartnership({
  className = "",
  width = 80,
  height = 80,
  ...props
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`seal-direct-partnership ${className}`}
      {...props}
    >
      {/* Outer botanical laurel wreath */}
      <g stroke="#D4A574" strokeWidth="1.25" fill="none" strokeLinecap="round">
        {/* Left arc */}
        <path d="M22 60 C14 50 14 30 22 20" />
        <path d="M19 24 C16 23 15 20 18 19 C20 20 20 23 19 24 Z" fill="#FCF9F5" />
        <path d="M15 34 C12 33 11 30 14 29 C16 30 16 33 15 34 Z" fill="#FCF9F5" />
        <path d="M15 46 C12 47 11 50 14 51 C16 50 16 47 15 46 Z" fill="#FCF9F5" />
        <path d="M19 56 C16 57 15 60 18 61 C20 60 20 57 19 56 Z" fill="#FCF9F5" />

        {/* Right arc */}
        <path d="M58 60 C66 50 66 30 58 20" />
        <path d="M61 24 C64 23 65 20 62 19 C60 20 60 23 61 24 Z" fill="#FCF9F5" />
        <path d="M65 34 C68 33 69 30 66 29 C64 30 64 33 65 34 Z" fill="#FCF9F5" />
        <path d="M65 46 C68 47 69 50 66 51 C64 50 64 47 65 46 Z" fill="#FCF9F5" />
        <path d="M61 56 C64 57 65 60 62 61 C60 60 60 57 61 56 Z" fill="#FCF9F5" />
      </g>

      {/* Hanging wax seal ribbons */}
      <polygon
        points="34,54 30,74 37,68 40,74 38,54"
        fill="#7A1E4A"
        opacity="0.9"
      />
      <polygon
        points="42,54 40,74 45,68 50,74 46,54"
        fill="#7A1E4A"
        opacity="0.75"
      />

      {/* Wax seal round body */}
      <circle
        cx="40"
        cy="40"
        r="22"
        fill="#7A1E4A"
        stroke="#D4A574"
        strokeWidth="1.75"
      />
      <circle
        cx="40"
        cy="40"
        r="18"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1"
        strokeDasharray="2 2"
      />

      {/* Executive Partnership Crest inside seal */}
      {/* Handshake / Monogram ligature in gold */}
      <path
        d="M32 40 L37 45 L48 34"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Star accent */}
      <circle cx="40" cy="28" r="1.5" fill="#D4A574" />
    </svg>
  );
}
