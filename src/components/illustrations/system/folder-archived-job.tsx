import type { IllustrationProps } from "../types";

export function FolderArchivedJobIllustration({
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
      className={`folder-archived-job-illustration ${className}`}
      {...props}
    >
      {/* Floor cast shadow */}
      <ellipse cx="80" cy="126" rx="54" ry="6" fill="#D4A574" opacity="0.28" />

      {/* Manila/Linen Dossier Folder */}
      <g>
        {/* Back folder tab */}
        <path
          d="M34 52 L54 52 L60 58 L126 58 L126 114 L34 114 Z"
          fill="#F3EBE3"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Interior documents poking out slightly */}
        <rect
          x="42"
          y="44"
          width="76"
          height="64"
          rx="2"
          fill="#FCF9F5"
          stroke="#D4A574"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />

        {/* Front folder flap */}
        <path
          d="M32 64 L128 64 L124 116 L36 116 Z"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        {/* Archival Gold Ribbon Band */}
        <rect
          x="33"
          y="84"
          width="93"
          height="8"
          fill="#D4A574"
          opacity="0.8"
        />

        {/* Wax seal over ribbon */}
        <circle
          cx="80"
          cy="88"
          r="10"
          fill="#7A1E4A"
          stroke="#D4A574"
          strokeWidth="1.25"
        />
        <circle
          cx="80"
          cy="88"
          r="7"
          fill="#7A1E4A"
          stroke="#D4A574"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />
        {/* Checkmark inside wax seal indicating filled / archived */}
        <path
          d="M77 88 L79 90 L84 85"
          fill="none"
          stroke="#FCF9F5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Label plaque on folder */}
        <rect
          x="48"
          y="98"
          width="40"
          height="10"
          rx="2"
          fill="#FCF9F5"
          stroke="#7A1E4A"
          strokeWidth="1"
        />
        <line
          x1="54"
          y1="103"
          x2="82"
          y2="103"
          stroke="#D4A574"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </g>

      {/* Butterfly resting on top corner of folder */}
      <g className="hf-ill-bob" transform="translate(108, 38)">
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
