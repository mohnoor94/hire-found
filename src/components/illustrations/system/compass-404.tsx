import type { IllustrationProps } from "../types";

export function Compass404Illustration({
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
      className={`compass-404-illustration ${className}`}
      {...props}
    >
      {/* Floor cast shadow */}
      <ellipse cx="80" cy="126" rx="54" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Folded linen map base */}
      <polygon
        points="32,118 78,114 126,118 132,78 84,74 28,78"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Map fold lines */}
      <line
        x1="78"
        y1="74"
        x2="78"
        y2="114"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {/* Map contour topography dashed lines */}
      <path
        d="M40 92 Q56 86 68 96"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      <path
        d="M92 90 Q106 100 120 94"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.7"
      />

      {/* Brass pocket compass body */}
      <circle
        cx="80"
        cy="76"
        r="32"
        fill="#F3EBE3"
        stroke="#7A1E4A"
        strokeWidth="2"
      />
      {/* Inner dial ring */}
      <circle
        cx="80"
        cy="76"
        r="26"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.5"
      />

      {/* Dial tick marks */}
      <g stroke="#D4A574" strokeWidth="1.25" strokeLinecap="round">
        <line x1="80" y1="52" x2="80" y2="56" />
        <line x1="80" y1="96" x2="80" y2="100" />
        <line x1="56" y1="76" x2="60" y2="76" />
        <line x1="100" y1="76" x2="104" y2="76" />
      </g>

      {/* Top compass hinge loop */}
      <path
        d="M74 44 C74 38 86 38 86 44"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="80" cy="44" r="2.5" fill="#D4A574" />

      {/* Compass Needle (gently swaying) */}
      <g className="hf-ill-sway" style={{ transformOrigin: "80px 76px" }}>
        {/* North pointer (burgundy) */}
        <polygon points="80,55 76,76 80,72 84,76" fill="#7A1E4A" />
        {/* South pointer (gold) */}
        <polygon points="80,97 76,76 80,72 84,76" fill="#D4A574" />
        {/* Center pivot cap */}
        <circle cx="80" cy="74" r="3" fill="#FCF9F5" stroke="#7A1E4A" strokeWidth="1.5" />
      </g>

      {/* Butterfly fluttering near compass edge */}
      <g className="hf-ill-bob" transform="translate(108, 42)">
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
