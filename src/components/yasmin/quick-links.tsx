const ExternalIcon = () => (
  <svg
    className="h-3 w-3 flex-shrink-0 opacity-50"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const internalClass =
  "quick-link-card inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl border border-butterfly-lavender/30 bg-white px-4 py-3 text-sm font-medium text-text-main shadow-card transition-all duration-300 hover:border-butterfly-lavender hover:bg-butterfly-lavender/10 hover:text-[#7C3AED]";

const externalClass =
  "quick-link-card inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl border border-butterfly-gold/30 bg-white px-4 py-3 text-sm font-medium text-text-main shadow-card transition-all duration-300 hover:border-butterfly-gold hover:bg-butterfly-gold/10 hover:text-amber-700";

export function QuickLinks() {
  return (
    <div id="quick-links" className="mb-8" aria-label="Quick Actions">
      <h2 className="font-accent mb-3 text-xl font-bold text-text-main">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className={internalClass}>
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          View Homepage
        </a>
        <a href="/jobs/" target="_blank" rel="noopener noreferrer" className={internalClass}>
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          View Jobs
        </a>
        <a
          href="https://tally.so/forms/create"
          target="_blank"
          rel="noopener noreferrer"
          className={externalClass}
        >
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Create Tally Form
          <ExternalIcon />
        </a>
        <a
          href="https://app.cal.com"
          target="_blank"
          rel="noopener noreferrer"
          className={externalClass}
        >
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Open Cal.com
          <ExternalIcon />
        </a>
      </div>
    </div>
  );
}
