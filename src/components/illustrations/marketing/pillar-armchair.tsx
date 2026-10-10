import type { IllustrationProps } from "../types";

export function PillarArmchair({
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
      className={`pillar-armchair ${className}`}
      {...props}
    >
      {/* Floor base shadow */}
      <ellipse cx="32" cy="56" rx="24" ry="3.5" fill="#D4A574" opacity="0.28" />

      {/* Generic dashed chair (left backdrop - the seat-filler) */}
      <rect
        x="12"
        y="34"
        width="14"
        height="14"
        rx="2"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <line
        x1="12"
        y1="24"
        x2="12"
        y2="34"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <line
        x1="16"
        y1="48"
        x2="16"
        y2="54"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* Bespoke tailored armchair (right foreground - the true match) */}
      <g>
        {/* Backrest */}
        <path
          d="M28 42 V24 Q28 18 42 18 Q56 18 56 24 V42"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Tufted gold detail line */}
        <path
          d="M34 36 V26 Q34 22 42 22 Q50 22 50 26 V36"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.2"
          opacity="0.8"
        />
        {/* Cushion seat */}
        <rect
          x="25"
          y="42"
          width="34"
          height="9"
          rx="4"
          fill="#F3EBE3"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Turned wooden chair legs */}
        <line
          x1="29"
          y1="51"
          x2="27"
          y2="56"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <line
          x1="55"
          y1="51"
          x2="57"
          y2="56"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </g>

      {/* Butterfly resting atop the tailored backrest */}
      <g transform="translate(42, 16) translate(-6, -7)">
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
