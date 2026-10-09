import { withBasePath } from "@/lib/base-path";

const linkClass =
  "inline-flex min-h-11 touch-manipulation items-center text-sm font-medium text-muted underline-offset-4 select-none hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-warm-dark";

const links = [
  { href: withBasePath("/"), label: "Homepage" },
  { href: withBasePath("/jobs/"), label: "Jobs" },
  { href: "https://tally.so/forms/create", label: "Tally" },
  { href: "https://app.cal.com", label: "Cal.com" },
];

export function QuickLinks() {
  return (
    <nav
      id="quick-links"
      aria-label="Quick Actions"
      className="mt-12 border-t border-secondary/70 pt-6"
    >
      <p className="text-xs font-semibold tracking-wide text-muted">Tools</p>
      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {link.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
