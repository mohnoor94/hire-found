import type { IllustrationProps } from "../types";

export function SealTrainingSpeaking({
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
      className={`seal-training-speaking ${className}`}
      {...props}
    >
      {/* Outer seal circle ring */}
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

      {/* Speaker lectern / podium */}
      <path
        d="M23 46 L27 28 L37 28 L41 46 Z"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lectern slant top */}
      <line
        x1="22"
        y1="28"
        x2="42"
        y2="28"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Micro-notes on lectern */}
      <path
        d="M28 25 L36 25"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Microphone on goose-neck */}
      <path
        d="M38 27 Q41 22 39 18"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <rect
        x="37.5"
        y="15.5"
        width="3"
        height="4"
        rx="1.5"
        fill="#7A1E4A"
        stroke="#D4A574"
        strokeWidth="0.75"
      />

      {/* Radiating sound / inspiration arcs (Speaking / Training energy) */}
      <path
        d="M24 20 Q20 22 19 25"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeDasharray="1.5 1.5"
      />
      <path
        d="M26 16 Q18 20 16 26"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="32" cy="38" r="1.5" fill="#D4A574" />
    </svg>
  );
}
