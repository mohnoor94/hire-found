import { withBasePath } from "@/lib/base-path";
import {
  Calendar,
  ExternalLink,
  FileText,
  Globe,
  Users,
} from "lucide-react";

interface QuickLinkItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const links: QuickLinkItem[] = [
  {
    href: withBasePath("/"),
    label: "Live Site",
    icon: Globe,
  },
  {
    href: withBasePath("/jobs/"),
    label: "Vacancies",
    icon: Users,
  },
  {
    href: "https://app.cal.com",
    label: "Cal.com",
    icon: Calendar,
  },
  {
    href: "https://tally.so/forms/create",
    label: "Tally Forms",
    icon: FileText,
  },
];

export function QuickLinks() {
  return (
    <nav
      id="quick-links"
      aria-label="Quick Actions"
      className="mt-5"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A1E4A]">
          Quick Access
        </span>
        <span className="text-xs text-[#D4A574]">·</span>
        <span className="text-[11px] text-[#5E534C]/70">
          Daily links
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-[#D4A574]/25 bg-white/80 px-3.5 py-2.5 shadow-2xs backdrop-blur-xs transition-all duration-150 ease-out hover:border-[#D4A574]/60 hover:bg-white hover:shadow-xs active:scale-[0.97]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#F3EBE3] text-[#7A1E4A] transition-colors group-hover:bg-[#7A1E4A] group-hover:text-white"
                  aria-hidden="true"
                >
                  <Icon className="size-3.5" />
                </div>
                <span className="truncate text-xs font-semibold text-[#2D2926] transition-colors group-hover:text-[#7A1E4A]">
                  {item.label}
                </span>
              </div>

              <ExternalLink
                className="size-3 shrink-0 text-[#5E534C]/40 transition-all duration-150 group-hover:text-[#7A1E4A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

export default QuickLinks;
