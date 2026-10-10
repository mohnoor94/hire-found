import { cn } from "@/lib/utils";

export interface FooterButterflyProps {
  className?: string;
}

/**
 * FooterButterfly: Stylized brand butterfly SVG with gentle ambient drift/bob
 * motion and interactive flutter on hover or parent group hover.
 */
export function FooterButterfly({ className }: FooterButterflyProps = {}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "inline-block size-6 shrink-0 hf-butterfly-drift overflow-visible select-none transition-transform duration-300 ease-out hover:scale-115 hover:-rotate-3 active:scale-95",
        className,
      )}
    >
      <g
        className="hf-butterfly-flutter origin-center transition-transform"
        style={{ transformOrigin: "16px 16px" }}
      >
        {/* Upper left wing (lavender) */}
        <path
          d="M16 15.5 C14 11.5 10 8.5 7 8 C4.5 7.5 3 9 3 11.5 C3 14 5 16.5 8 17 C11 17.5 14 16.5 16 15.5 Z"
          fill="#C4B5FD"
        />
        {/* Lower left wing (rose) */}
        <path
          d="M16 15.5 C14 17.5 11 20.5 8.5 22 C6 23.5 3.5 23 3.5 20.5 C3.5 18 5.5 16.5 8.5 16.5 C11 16.5 14 16 16 15.5 Z"
          fill="#FDA4AF"
        />
        {/* Upper right wing (lavender) */}
        <path
          d="M16 15.5 C18 11.5 22 8.5 25 8 C27.5 7.5 29 9 29 11.5 C29 14 27 16.5 24 17 C21 17.5 18 16.5 16 15.5 Z"
          fill="#C4B5FD"
        />
        {/* Lower right wing (rose) */}
        <path
          d="M16 15.5 C18 17.5 21 20.5 23.5 22 C26 23.5 28.5 23 28.5 20.5 C28.5 18 26.5 16.5 23.5 16.5 C21 16.5 18 16 16 15.5 Z"
          fill="#FDA4AF"
        />
        {/* Body and head */}
        <ellipse cx="16" cy="16.5" rx="1.1" ry="4.2" fill="#7C3AED" />
        <circle cx="16" cy="12.3" r="1.1" fill="#7C3AED" />
        {/* Delicate antennae */}
        <path
          d="M15.5 12.5 C14.2 10 12.5 8.5 11.5 7.7"
          stroke="#7C3AED"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <path
          d="M16.5 12.5 C17.8 10 19.5 8.5 20.5 7.7"
          stroke="#7C3AED"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="11.5" cy="7.7" r="0.75" fill="#7C3AED" />
        <circle cx="20.5" cy="7.7" r="0.75" fill="#7C3AED" />
      </g>
    </svg>
  );
}
