"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchJobs, type Job } from "@/lib/jobs";
import { useBookingModal } from "@/components/site/booking-modal";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  hospitality: { bg: "bg-primary/10", text: "text-primary" },
  tech: { bg: "bg-blue-50", text: "text-blue-700" },
  fnb: { bg: "bg-amber-50", text: "text-amber-700" },
  aviation: { bg: "bg-indigo-50", text: "text-indigo-700" },
  other: { bg: "bg-gray-100", text: "text-gray-600" },
};

function truncateText(text: string | undefined, maxLength: number) {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength - 1) + "…";
}

function getRelativeTime(timestamp: Date | null) {
  if (!timestamp) return "";
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  if (diffSeconds < 60) return "just now";
  if (diffMinutes === 1) return "1 minute ago";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return "1 year ago";
  return `${diffYears} years ago`;
}

export function LiveVacancies() {
  const { open } = useBookingModal();
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchJobs({ limit: 4 });
        if (!cancelled) {
          setJobs(list);
          setError(false);
        }
      } catch {
        if (!cancelled) {
          setJobs([]);
          setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    "all",
    ...new Set((jobs || []).map((j) => j.category).filter(Boolean)),
  ];
  const filtered =
    category === "all"
      ? jobs || []
      : (jobs || []).filter((j) => j.category === category);

  return (
    <section
      id="vacancies"
      className="relative overflow-hidden bg-gradient-to-b from-warm to-warm-dark/40 px-6 py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="floating absolute top-10 right-20 size-40 rounded-full bg-secondary/[0.04] blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="reveal mb-10 text-center">
          <h2 className="font-accent mb-4 text-3xl font-bold text-primary md:text-4xl lg:text-5xl">
            Find Your Match
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted">
            Open roles I&apos;m hiring for right now. Something catch your eye?
            Let&apos;s talk.
          </p>
        </div>

        {jobs && jobs.length > 0 && categories.length > 2 && (
          <div
            className="mb-8 flex flex-wrap justify-center gap-2"
            role="group"
            aria-label="Filter jobs by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div id="vacancy-grid">
          {jobs === null && (
            <div className="grid gap-6 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="premium-card shadow-card h-48 animate-pulse bg-white/60 p-7"
                />
              ))}
            </div>
          )}

          {jobs && !error && filtered.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((job, index) => {
                const colors =
                  CATEGORY_COLORS[job.category] || CATEGORY_COLORS.other!;
                const categoryLabel = job.category
                  ? job.category.charAt(0).toUpperCase() +
                    job.category.slice(1)
                  : "Other";
                return (
                  <Link
                    key={job.id}
                    href={`/jobs/?id=${job.slug}`}
                    className="premium-card shadow-card reveal block min-h-[44px] min-w-[44px] cursor-pointer p-7"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                    aria-label={`View details for ${job.title}`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
                      >
                        {categoryLabel}
                      </span>
                    </div>
                    <h3 className="mb-1 text-lg font-bold">{job.title}</h3>
                    {job.titleAr?.trim() ? (
                      <p
                        className="mb-2 text-sm font-semibold text-secondary"
                        dir="rtl"
                        lang="ar"
                      >
                        {job.titleAr}
                      </p>
                    ) : null}
                    <p className="mb-3 text-sm leading-relaxed text-muted">
                      {truncateText(job.shortDescription, 120)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span>📍 {job.location || ""}</span>
                      <span>•</span>
                      <span>{getRelativeTime(job.createdAt)}</span>
                      <span>•</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {job.employmentType || ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {jobs && !error && filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="mb-6 text-muted">
                No open roles matching that filter right now.
              </p>
            </div>
          )}

          {error && (
            <div className="py-10 text-center">
              <p className="mb-6 text-muted">
                Couldn&apos;t load roles right now. Reach out directly —
                I&apos;m one message away.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://wa.me/962793001043?text=Hi%20Yasmin!%20I%20found%20you%20through%20your%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-whatsapp magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={(e) => open(e.currentTarget)}
                  className="magnetic shadow-warm inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-light"
                >
                  Book a Call
                </button>
              </div>
            </div>
          )}
        </div>

        {jobs && jobs.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/jobs/"
              className="magnetic shadow-warm inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-light"
            >
              View All Open Roles →
            </Link>
          </div>
        )}

        <div className="reveal mx-auto mt-16 max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06] p-8 text-center md:p-10">
            <div className="relative z-10">
              <h3 className="font-accent mb-2 text-xl font-bold text-primary md:text-2xl">
                Looking for more than a job listing?
              </h3>
              <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-muted">
                Get your CV rewritten, nail your next interview, or let me
                personally match you with your dream role.
              </p>
              <a
                href="#services"
                className="career-bridge magnetic inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white"
              >
                Explore Career Services →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
