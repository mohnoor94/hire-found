/** Linen → contact band. Fill must match SiteFooter (`bg-primary-dark`). */
export function WaveWarmToDark() {
  return (
    <div className="-mb-px bg-warm text-primary-dark" aria-hidden="true">
      <svg
        className="block h-16 w-full md:h-20"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C360,10 720,70 1080,25 C1260,10 1380,35 1440,20 L1440,80 L0,80 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
