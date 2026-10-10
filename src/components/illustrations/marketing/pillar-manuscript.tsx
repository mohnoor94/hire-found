import type { IllustrationProps } from "../types";

export function PillarManuscript({
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
      className={`pillar-manuscript ${className}`}
      {...props}
    >
      {/* Floor base shadow */}
      <ellipse cx="32" cy="56" rx="22" ry="3.5" fill="#D4A574" opacity="0.28" />

      {/* Manuscript page container */}
      <rect
        x="14"
        y="12"
        width="36"
        height="44"
        rx="3"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />

      {/* Under-sheet gold corner fold */}
      <path
        d="M42 12 L50 20 L42 20 Z"
        fill="#F3EBE3"
        stroke="#D4A574"
        strokeWidth="1.25"
      />

      {/* Gold illuminated capital initial box */}
      <rect
        x="18"
        y="18"
        width="10"
        height="10"
        rx="2"
        fill="#F3EBE3"
        stroke="#D4A574"
        strokeWidth="1.2"
      />
      <text
        x="23"
        y="26"
        textAnchor="middle"
        fontSize="8"
        fontFamily="serif"
        fill="#7A1E4A"
        fontWeight="bold"
      >
        Y
      </text>

      {/* Handwritten cursive lines */}
      <line
        x1="31"
        y1="21"
        x2="44"
        y2="21"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
      <line
        x1="31"
        y1="25"
        x2="42"
        y2="25"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="34"
        x2="44"
        y2="34"
        stroke="#7A1E4A"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <line
        x1="18"
        y1="40"
        x2="40"
        y2="40"
        stroke="#7A1E4A"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <line
        x1="18"
        y1="46"
        x2="34"
        y2="46"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2.5 2.5"
        strokeLinecap="round"
      />

      {/* Ribbon bookmark extending from top */}
      <path
        d="M26 10 V14"
        stroke="#D4A574"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
