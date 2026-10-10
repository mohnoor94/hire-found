export function VacanciesEmptyIllustration() {
  return (
    <svg
      className="vacancies-empty-illustration"
      viewBox="0 0 160 140"
      width="140"
      height="122"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ambient background warmth halo */}
      <circle cx="80" cy="74" r="48" fill="#D4A574" opacity="0.08" />

      {/* Floor shadow */}
      <ellipse cx="80" cy="128" rx="48" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Chair base / wheels */}
      <g fill="none" stroke="#7A1E4A" strokeWidth="2" strokeLinecap="round">
        <line x1="80" y1="108" x2="80" y2="96" />
        <line x1="80" y1="108" x2="58" y2="118" />
        <line x1="80" y1="108" x2="102" y2="118" />
        <line x1="80" y1="108" x2="68" y2="122" />
        <line x1="80" y1="108" x2="92" y2="122" />
      </g>
      <circle cx="58" cy="118" r="3" fill="#D4A574" />
      <circle cx="102" cy="118" r="3" fill="#D4A574" />
      <circle cx="68" cy="122" r="3" fill="#D4A574" />
      <circle cx="92" cy="122" r="3" fill="#D4A574" />

      {/* Seat */}
      <rect
        x="48"
        y="78"
        width="64"
        height="18"
        rx="8"
        fill="#F3EBE3"
        stroke="#7A1E4A"
        strokeWidth="2"
      />
      {/* Seat gold tailoring stitch */}
      <line
        x1="56"
        y1="87"
        x2="104"
        y2="87"
        stroke="#D4A574"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.8"
      />

      {/* Backrest */}
      <path
        d="M54 78 V52 Q54 40 80 40 Q106 40 106 52 V78"
        fill="#FCF9F5"
        stroke="#7A1E4A"
        strokeWidth="2"
      />
      <path
        d="M62 70 V56 Q62 50 80 50 Q98 50 98 56 V70"
        fill="none"
        stroke="#D4A574"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Armrests */}
      <path
        d="M48 84 H38 Q34 84 34 88 V94"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M112 84 H122 Q126 84 126 88 V94"
        fill="none"
        stroke="#7A1E4A"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Blank nameplate (sways) */}
      <g className="vacancies-empty-nameplate">
        <rect
          x="58"
          y="18"
          width="44"
          height="18"
          rx="3"
          fill="#FFFCF8"
          stroke="#7A1E4A"
          strokeWidth="1.75"
        />
        <line
          x1="66"
          y1="27"
          x2="94"
          y2="27"
          stroke="#D4A574"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeLinecap="round"
        />
        {/* String to chair */}
        <line
          x1="80"
          y1="36"
          x2="80"
          y2="40"
          stroke="#7A1E4A"
          strokeWidth="1.25"
        />
      </g>

      {/* Butterfly perched on backrest (bobs) */}
      <g className="vacancies-empty-butterfly" transform="translate(98 28)">
        <path
          d="M8 10 C6 6 2 3 -1 2.5 C-3.5 2 -5 3.5 -5 6 C-5 8.5 -3 11 0 11.5 C3 12 6 11 8 10 Z"
          fill="#C4B5FD"
        />
        <path
          d="M8 10 C6 12 3 15 0.5 16.5 C-2 18 -4.5 17.5 -4.5 15 C-4.5 12.5 -2.5 11 0.5 11 C3 11 6 10.5 8 10 Z"
          fill="#FDA4AF"
        />
        <path
          d="M8 10 C10 6 14 3 17 2.5 C19.5 2 21 3.5 21 6 C21 8.5 19 11 16 11.5 C13 12 10 11 8 10 Z"
          fill="#C4B5FD"
        />
        <path
          d="M8 10 C10 12 13 15 15.5 16.5 C18 18 20.5 17.5 20.5 15 C20.5 12.5 18.5 11 15.5 11 C13 11 10 10.5 8 10 Z"
          fill="#FDA4AF"
        />
        <ellipse cx="8" cy="11" rx="0.9" ry="4" fill="#7C3AED" />
        <path
          d="M7.5 7 C6.2 4.5 4.5 3 3.5 2.2"
          stroke="#7C3AED"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M8.5 7 C9.8 4.5 11.5 3 12.5 2.2"
          stroke="#7C3AED"
          strokeWidth="0.7"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="3.5" cy="2.2" r="0.7" fill="#7C3AED" />
        <circle cx="12.5" cy="2.2" r="0.7" fill="#7C3AED" />
      </g>
    </svg>
  );
}
