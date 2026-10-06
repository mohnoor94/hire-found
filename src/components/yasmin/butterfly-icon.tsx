export function ButterflyIcon({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ minWidth: size, minHeight: size }}
    >
      <path
        d="M24 24C20 20 14 14 10 16C6 18 8 26 12 28C16 30 20 28 24 24Z"
        fill="#C4B5FD"
        stroke="#C4B5FD"
        strokeWidth="0.5"
      />
      <path
        d="M24 24C22 28 18 34 14 36C10 38 8 34 10 30C12 26 18 26 24 24Z"
        fill="#FDA4AF"
        stroke="#FDA4AF"
        strokeWidth="0.5"
      />
      <path
        d="M24 24C28 20 34 14 38 16C42 18 40 26 36 28C32 30 28 28 24 24Z"
        fill="#C4B5FD"
        stroke="#C4B5FD"
        strokeWidth="0.5"
      />
      <path
        d="M24 24C26 28 30 34 34 36C38 38 40 34 38 30C36 26 30 26 24 24Z"
        fill="#FDA4AF"
        stroke="#FDA4AF"
        strokeWidth="0.5"
      />
      <ellipse cx="24" cy="24" rx="1.5" ry="6" fill="#7C3AED" />
      <path
        d="M23 18C22 15 20 13 19 12"
        stroke="#7C3AED"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25 18C26 15 28 13 29 12"
        stroke="#7C3AED"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="19" cy="12" r="1" fill="#C4B5FD" />
      <circle cx="29" cy="12" r="1" fill="#C4B5FD" />
    </svg>
  );
}
