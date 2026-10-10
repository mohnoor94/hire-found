import type { IllustrationProps } from "../types";

export function SealRecruitmentMatch({
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
      className={`seal-recruitment-match ${className}`}
      {...props}
    >
      {/* Outer seal circle */}
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

      {/* Candidate A Card (Left) */}
      <rect
        x="15"
        y="18"
        width="16"
        height="22"
        rx="2.5"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />
      {/* Profile silhouette in Card A */}
      <circle cx="23" cy="24" r="3" fill="#D4A574" />
      <path
        d="M18 34 C18 31 20 30 23 30 C26 30 28 31 28 34"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Company / Candidate B Card (Right) */}
      <rect
        x="33"
        y="24"
        width="16"
        height="22"
        rx="2.5"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />
      {/* Profile silhouette in Card B */}
      <circle cx="41" cy="30" r="3" fill="#7A1E4A" />
      <path
        d="M36 40 C36 37 38 36 41 36 C44 36 46 37 46 40"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="1.25"
        strokeLinecap="round"
      />

      {/* Woven connection thread connecting the two */}
      <path
        d="M26 28 C30 22 34 36 38 32"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
      {/* Small golden knot */}
      <circle cx="32" cy="29" r="2" fill="#D4A574" />
    </svg>
  );
}
