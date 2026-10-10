import type { IllustrationProps } from "../types";

export function BoardPauseIllustration({
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
      className={`board-pause-illustration ${className}`}
      {...props}
    >
      {/* Ambient background warmth halo */}
      <circle cx="80" cy="72" r="48" fill="#D4A574" opacity="0.08" />

      {/* Floor cast shadow */}
      <ellipse cx="80" cy="126" rx="52" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Desk bell base & card stand */}
      <rect
        x="42"
        y="84"
        width="76"
        height="36"
        rx="6"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />

      {/* Gold stitch detail */}
      <line
        x1="50"
        y1="94"
        x2="110"
        y2="94"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />

      {/* Reception service bell dome */}
      <path
        d="M58 84 C58 60, 102 60, 102 84 Z"
        fill="#F3EBE3"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />

      {/* Bell top pin & crown */}
      <line
        x1="80"
        y1="52"
        x2="80"
        y2="66"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="80"
        cy="50"
        r="3.5"
        fill="#D4A574"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />

      {/* Signal reconnection waves */}
      <path
        d="M62 44 Q80 34 98 44"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.85"
      />
      <path
        d="M52 36 Q80 22 108 36"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="2 4"
        opacity="0.75"
      />
    </svg>
  );
}
