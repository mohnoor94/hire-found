import type { IllustrationProps } from "../types";

export function PillarDoorway({
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
      className={`pillar-doorway ${className}`}
      {...props}
    >
      {/* Floor base shadow & light puddle */}
      <ellipse cx="32" cy="56" rx="22" ry="4" fill="#D4A574" opacity="0.32" />

      {/* Arched doorway frame */}
      <path
        d="M18 56 V24 Q18 12 32 12 Q46 12 46 24 V56"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Door jamb inner highlight */}
      <path
        d="M22 56 V26 Q22 16 32 16 Q42 16 42 26 V56"
        fill="#F3EBE3"
        fillOpacity="0.4"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* Door panel swung open inwards */}
      <path
        d="M22 26 L36 22 L36 54 L22 56 Z"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.5"
      />
      {/* Brass doorknob */}
      <circle cx="34" cy="38" r="1.5" fill="#D4A574" />

      {/* Golden key resting on the threshold */}
      <g transform="translate(36, 48)">
        {/* Key bow */}
        <circle
          cx="4"
          cy="4"
          r="3"
          fill="none"
          stroke="#D4A574"
          strokeWidth="1.25"
        />
        {/* Key blade */}
        <line
          x1="7"
          y1="4"
          x2="15"
          y2="4"
          stroke="#D4A574"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        {/* Key wards */}
        <line
          x1="13"
          y1="4"
          x2="13"
          y2="6.5"
          stroke="#D4A574"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <line
          x1="15"
          y1="4"
          x2="15"
          y2="6"
          stroke="#D4A574"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
