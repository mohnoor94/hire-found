import type { IllustrationProps } from "../types";

export function VignetteFlourishingLaurel({
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
      className={`vignette-flourishing-laurel ${className}`}
      {...props}
    >
      {/* Floor shadow */}
      <ellipse cx="80" cy="128" rx="46" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Sunburst background rays */}
      <g stroke="#D4A574" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
        <line x1="80" y1="56" x2="80" y2="34" />
        <line x1="96" y1="62" x2="114" y2="48" />
        <line x1="64" y1="62" x2="46" y2="48" />
        <line x1="104" y1="78" x2="124" y2="72" />
        <line x1="56" y1="78" x2="36" y2="72" />
      </g>

      {/* Terracotta / Ceramic Vase */}
      <g>
        {/* Vase base & body */}
        <path
          d="M66 122 L94 122 C96 114 98 104 96 96 C94 92 88 90 88 88 L72 88 C72 90 66 92 64 96 C62 104 64 114 66 122 Z"
          fill="#F3EBE3"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        {/* Vase rim */}
        <rect
          x="70"
          y="85"
          width="20"
          height="4"
          rx="2"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.5"
        />
        {/* Gold decorative band */}
        <path
          d="M66 104 Q80 106 94 104"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* Sprouting laurel plant */}
      <g stroke="#7A1E4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Central stem */}
        <path d="M80 85 V44" fill="none" />

        {/* Lower Left Leaf */}
        <path
          d="M80 76 C70 74 62 78 58 84 C66 86 74 82 80 76 Z"
          fill="#FCF9F5"
        />
        <path
          d="M80 76 C70 78 62 82 58 84"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Lower Right Leaf */}
        <path
          d="M80 72 C90 70 98 74 102 80 C94 82 86 78 80 72 Z"
          fill="#FCF9F5"
        />
        <path
          d="M80 72 C90 74 98 78 102 80"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Mid Left Leaf */}
        <path
          d="M80 62 C68 58 62 60 56 66 C64 68 74 66 80 62 Z"
          fill="#FCF9F5"
        />
        <path
          d="M80 62 C68 62 62 64 56 66"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Mid Right Leaf */}
        <path
          d="M80 58 C92 54 98 56 104 62 C96 64 88 62 80 58 Z"
          fill="#FCF9F5"
        />
        <path
          d="M80 58 C92 58 98 60 104 62"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Top Sprouting Leaves */}
        <path
          d="M80 46 C74 40 74 34 76 30 C80 34 82 40 80 46 Z"
          fill="#FCF9F5"
        />
        <path
          d="M80 46 C86 40 86 34 84 30 C80 34 78 40 80 46 Z"
          fill="#FCF9F5"
        />
      </g>
    </svg>
  );
}
