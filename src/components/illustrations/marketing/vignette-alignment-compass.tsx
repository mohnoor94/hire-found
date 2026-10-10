import type { IllustrationProps } from "../types";

export function VignetteAlignmentCompass({
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
      className={`vignette-alignment-compass ${className}`}
      {...props}
    >
      {/* Floor shadow */}
      <ellipse cx="80" cy="128" rx="54" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Candidate Dossier Card (Left backdrop) */}
      <rect
        x="30"
        y="32"
        width="44"
        height="56"
        rx="4"
        transform="rotate(-8 52 60)"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Company Culture Card (Right backdrop) */}
      <rect
        x="86"
        y="32"
        width="44"
        height="56"
        rx="4"
        transform="rotate(8 108 60)"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Interlocking Rings */}
      {/* Left Ring (Burgundy / Culture Fit) */}
      <circle
        cx="64"
        cy="72"
        r="32"
        fill="#F3EBE3"
        fillOpacity="0.4"
        stroke="#7A1E4A"
        strokeWidth="2"
      />

      {/* Right Ring (Warm Sand Gold / Candidate DNA) */}
      <circle
        cx="96"
        cy="72"
        r="32"
        fill="#F3EBE3"
        fillOpacity="0.4"
        stroke="#D4A574"
        strokeWidth="2"
      />

      {/* Intersection Lens (Warm Linen highlight) */}
      <path
        d="M80 44 C88 52 92 62 92 72 C92 82 88 92 80 100 C72 92 68 82 68 72 C68 62 72 52 80 44 Z"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />

      {/* Compass / Alignment Axis Crosshairs */}
      <g stroke="#D4A574" strokeWidth="1.25" strokeLinecap="round" opacity="0.75">
        <line x1="80" y1="50" x2="80" y2="94" />
        <line x1="58" y1="72" x2="102" y2="72" />
      </g>

      {/* Compass cardinal dots */}
      <circle cx="80" cy="48" r="2" fill="#D4A574" />
      <circle cx="80" cy="96" r="2" fill="#D4A574" />
      <circle cx="56" cy="72" r="2" fill="#7A1E4A" />
      <circle cx="104" cy="72" r="2" fill="#7A1E4A" />

      {/* Central Match Butterfly perched at the focal point */}
      <g className="hf-ill-bob" transform="translate(80, 64) translate(-6, -7)">
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
        {/* Antennae */}
        <path
          d="M5.5 5 C4.5 3 3 2 2.2 1.5"
          stroke="#7C3AED"
          strokeWidth="0.65"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M6.5 5 C7.5 3 9 2 9.8 1.5"
          stroke="#7C3AED"
          strokeWidth="0.65"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
