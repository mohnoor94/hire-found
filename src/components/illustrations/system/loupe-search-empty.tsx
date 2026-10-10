import type { IllustrationProps } from "../types";

export function LoupeSearchEmptyIllustration({
  className = "",
  width = "160",
  height = "140",
  ...props
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 140"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`loupe-search-empty-illustration ${className}`}
      {...props}
    >
      {/* Floor shadow */}
      <ellipse cx="80" cy="126" rx="54" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Stack of Index Cards on desk */}
      {/* Bottom index card */}
      <rect
        x="36"
        y="62"
        width="82"
        height="50"
        rx="3"
        transform="rotate(-4 77 87)"
        fill="#F3EBE3"
        stroke="#D4A574"
        strokeWidth="1.25"
      />
      {/* Top index card */}
      <rect
        x="38"
        y="60"
        width="84"
        height="52"
        rx="3"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />
      {/* Index card header line */}
      <line
        x1="46"
        y1="72"
        x2="114"
        y2="72"
        stroke="#7A1E4A"
        strokeWidth="1.25"
      />
      {/* Blank ruled search lines (dashed waiting for match) */}
      <line
        x1="46"
        y1="82"
        x2="90"
        y2="82"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <line
        x1="46"
        y1="92"
        x2="104"
        y2="92"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <line
        x1="46"
        y1="102"
        x2="80"
        y2="102"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />

      {/* Editorial Magnifying Glass angled across cards */}
      <g transform="rotate(18 82 72)">
        {/* Glass lens rim */}
        <circle
          cx="72"
          cy="60"
          r="26"
          fill="#FCF9F5"
          fillOpacity="0.8"
          stroke="#7A1E4A"
          strokeWidth="2.2"
        />
        {/* Lens inner reflection ring */}
        <circle
          cx="72"
          cy="60"
          r="22"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
        {/* Brass handle */}
        <path
          d="M90 78 L114 102"
          stroke="#7A1E4A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Gold ferrule collar on handle */}
        <line
          x1="89"
          y1="77"
          x2="94"
          y2="82"
          stroke="#D4A574"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>

      {/* Butterfly hovering above the lens */}
      <g className="hf-ill-bob" transform="translate(94, 30)">
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
