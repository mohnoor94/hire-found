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

      {/* Central alignment pivot dot */}
      <circle cx="80" cy="72" r="3.5" fill="#7A1E4A" stroke="#FCF9F5" strokeWidth="1.5" />
    </svg>
  );
}
