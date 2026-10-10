import type { IllustrationProps } from "../types";

export function PhoneDirectLineIllustration({
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
      className={`phone-direct-line-illustration ${className}`}
      {...props}
    >
      {/* Floor cast shadow */}
      <ellipse cx="80" cy="126" rx="54" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Notepad base beneath phone */}
      <rect
        x="38"
        y="78"
        width="84"
        height="40"
        rx="3"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="1.75"
      />
      <line
        x1="46"
        y1="88"
        x2="78"
        y2="88"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <line
        x1="46"
        y1="96"
        x2="90"
        y2="96"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />
      <line
        x1="46"
        y1="104"
        x2="70"
        y2="104"
        stroke="#D4A574"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* Desk Telephone Cradle Base */}
      <path
        d="M62 78 L98 78 L104 104 L56 104 Z"
        fill="#F3EBE3"
        stroke="#7A1E4A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {/* Rotary dial / keypad ring in gold */}
      <circle
        cx="80"
        cy="92"
        r="7"
        fill="#FCF9F5"
        stroke="#D4A574"
        strokeWidth="1.5"
      />
      <circle cx="80" cy="92" r="2.5" fill="#7A1E4A" />

      {/* Telephone Handset Receiver resting on cradle */}
      <g>
        {/* Left earpiece cup */}
        <ellipse
          cx="52"
          cy="66"
          rx="10"
          ry="6"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Right mouthpiece cup */}
        <ellipse
          cx="108"
          cy="66"
          rx="10"
          ry="6"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        {/* Handset central bar */}
        <path
          d="M56 66 C68 56 92 56 104 66"
          fill="none"
          stroke="#7A1E4A"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* Curly golden cord */}
      <path
        d="M52 72 Q46 80 50 86 Q44 94 48 100 Q42 108 48 116"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Butterfly resting on the handset receiver handle */}
      <g className="hf-ill-bob" transform="translate(80, 44) translate(-6, -7)">
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
