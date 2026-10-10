import type { IllustrationProps } from "../types";

export function VignetteConsultationDesk({
  className = "",
  width = "180",
  height = "140",
  ...props
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 180 140"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={`vignette-consultation-desk ${className}`}
      {...props}
    >
      {/* Floor shadow */}
      <ellipse cx="90" cy="128" rx="64" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Open notebook base (parchment pages) */}
      <g>
        {/* Under-page shadow / depth */}
        <path
          d="M34 116 L88 116 L88 74 L38 72 Z"
          fill="#E8DEC8"
          opacity="0.5"
        />
        <path
          d="M88 116 L142 116 L138 72 L88 74 Z"
          fill="#E8DEC8"
          opacity="0.5"
        />

        {/* Left page */}
        <path
          d="M36 114 C56 112 72 114 88 116 L88 72 C72 70 56 68 36 70 Z"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        {/* Right page */}
        <path
          d="M88 116 C104 114 120 112 140 114 L140 70 C120 68 104 70 88 72 Z"
          fill="#F3EBE3"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        {/* Spine center crease */}
        <line
          x1="88"
          y1="71"
          x2="88"
          y2="117"
          stroke="#D4A574"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Left page ruled lines */}
        <line
          x1="46"
          y1="82"
          x2="78"
          y2="83"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="46"
          y1="92"
          x2="76"
          y2="93"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="46"
          y1="102"
          x2="72"
          y2="103"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Right page ruled lines */}
        <line
          x1="98"
          y1="83"
          x2="130"
          y2="82"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="98"
          y1="93"
          x2="126"
          y2="92"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="98"
          y1="103"
          x2="120"
          y2="102"
          stroke="#D4A574"
          strokeWidth="1.2"
          strokeDasharray="2.5 2.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      {/* Fountain pen resting across bottom right */}
      <g transform="rotate(-28 142 110)">
        {/* Pen barrel */}
        <rect
          x="116"
          y="108"
          width="42"
          height="6"
          rx="3"
          fill="#7A1E4A"
          stroke="#7A1E4A"
          strokeWidth="1.25"
        />
        {/* Gold center band */}
        <rect x="136" y="107.5" width="4" height="7" rx="1" fill="#D4A574" />
        {/* Pen nib */}
        <polygon
          points="116,108 108,111 116,114"
          fill="#D4A574"
          stroke="#7A1E4A"
          strokeWidth="1"
        />
      </g>

      {/* Porcelain espresso cup & saucer */}
      <g transform="translate(18, 14)">
        {/* Saucer */}
        <ellipse
          cx="38"
          cy="92"
          rx="18"
          ry="4.5"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Cup body */}
        <path
          d="M26 80 C26 90 32 92 38 92 C44 92 50 90 50 80 Z"
          fill="#F3EBE3"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Cup rim */}
        <ellipse
          cx="38"
          cy="80"
          rx="12"
          ry="3"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.5"
        />
        {/* Coffee surface */}
        <ellipse cx="38" cy="80.5" rx="9" ry="2" fill="#7A1E4A" opacity="0.85" />
        {/* Handle */}
        <path
          d="M50 82 C55 82 56 88 50 89"
          fill="none"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Rising steam curls */}
        <path
          className="hf-ill-steam"
          d="M34 74 Q32 66 36 60 T34 48"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          className="hf-ill-steam"
          style={{ animationDelay: "0.9s" }}
          d="M42 74 Q44 65 40 58 T42 46"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </g>

      {/* Butterfly perched on top edge of notebook */}
      <g className="hf-ill-bob" transform="translate(122, 50)">
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
