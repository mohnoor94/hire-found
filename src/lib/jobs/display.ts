/**
 * Display helpers shared by public job list/detail UIs.
 * Behavior matches js/jobs.js.
 */

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  hospitality: { bg: "bg-primary/10", text: "text-primary" },
  tech: { bg: "bg-blue-50", text: "text-blue-700" },
  fnb: { bg: "bg-amber-50", text: "text-amber-700" },
  aviation: { bg: "bg-indigo-50", text: "text-indigo-700" },
  other: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function containsArabic(text: string | undefined | null): boolean {
  if (!text) return false;
  return /[\u0600-\u06FF]/.test(text);
}

export function truncateText(
  text: string | undefined | null,
  maxLength: number,
): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength - 1) + "…";
}

export function getRelativeTime(
  timestamp: Date | null | undefined,
): string {
  if (!timestamp) return "";

  const now = new Date();
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
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

export function getCategories(
  jobs: Array<{ category?: string }> | null | undefined,
): string[] {
  if (!jobs || !Array.isArray(jobs)) return [];
  return [...new Set(jobs.map((job) => job.category).filter(Boolean))] as string[];
}

export function filterByCategory<T extends { category?: string }>(
  jobs: T[] | null | undefined,
  category: string,
): T[] {
  if (!jobs || !Array.isArray(jobs)) return [];
  if (!category || category.toLowerCase() === "all") return jobs;
  return jobs.filter((job) => job.category === category);
}

export function categoryLabel(category: string | undefined): string {
  if (!category) return "Other";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function categoryColors(category: string | undefined) {
  return CATEGORY_COLORS[category || ""] || CATEGORY_COLORS.other!;
}

function applyInlineFormatting(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>");
}

/**
 * Formats text/HTML for job descriptions.
 * Pre-formatted HTML from Firestore passes through; plain text gets paragraphs/lists.
 */
export function formatRichText(text: string | undefined | null): string {
  if (!text) return "";

  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }

  const blocks = text.split(/\n\n+/);
  let html = "";

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n");
    const isList = lines.every(
      (line) => /^\s*[-•*]\s/.test(line) || line.trim() === "",
    );

    if (isList) {
      html += '<ul class="list-disc list-inside space-y-1">';
      for (const line of lines) {
        const content = line.replace(/^\s*[-•*]\s*/, "").trim();
        if (content) {
          html += `<li>${applyInlineFormatting(content)}</li>`;
        }
      }
      html += "</ul>";
    } else {
      html += `<p>${applyInlineFormatting(trimmed.replace(/\n/g, "<br>"))}</p>`;
    }
  }

  return html;
}
