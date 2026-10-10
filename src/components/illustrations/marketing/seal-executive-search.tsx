import type { IllustrationProps } from "../types";

export function SealExecutiveSearch({
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
      className={`seal-executive-search ${className}`}
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

      {/* Monocle lens / Focus frame */}
      <circle
        cx="30"
        cy="28"
        r="14"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />
      {/* Monocle handle */}
      <path
        d="M40 38 L48 48"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="49" cy="49" r="1.5" fill="#D4A574" />

      {/* Executive chair silhouette inside lens */}
      {/* Chair backrest */}
      <path
        d="M24 28 V22 Q24 19 30 19 Q36 19 36 22 V28"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Chair seat */}
      <rect
        x="22"
        y="28"
        width="16"
        height="5"
        rx="2"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />
      {/* Chair stem */}
      <line
        x1="30"
        y1="33"
        x2="30"
        y2="37"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Constellation gold stars */}
      <path
        d="M17 18 L18 20 L20 21 L18 22 L17 24 L16 22 L14 21 L16 20 Z"
        fill="#D4A574"
      />
      <circle cx="44" cy="20" r="1.5" fill="#D4A574" />
      <circle cx="16" cy="38" r="1.2" fill="#D4A574" />
    </svg>
  );
}
