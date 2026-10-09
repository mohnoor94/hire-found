/** Admin dashboard label formatters - from yasmin/js/dashboard.js. */

const CATEGORY_LABELS: Record<string, string> = {
  hospitality: "Hospitality",
  tech: "Tech",
  fnb: "F&B",
  aviation: "Aviation",
  retail: "Retail",
  healthcare: "Healthcare",
  education: "Education",
  finance: "Finance",
  marketing: "Marketing",
  engineering: "Engineering",
  design: "Design",
  "customer-service": "Customer Service",
  logistics: "Logistics",
  "real-estate": "Real Estate",
  media: "Media",
  other: "Other",
};

export function formatCategoryLabel(category: string | undefined | null): string {
  if (!category) return "Other";
  return (
    CATEGORY_LABELS[category] ||
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

export function formatEmploymentType(type: string | undefined | null): string {
  return (type || "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatOptionLabel(value: string): string {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const ADMIN_CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  hospitality: {
    bg: "bg-butterfly-lavender/10",
    text: "text-butterfly-lavender-dark",
  },
  tech: { bg: "bg-blue-50", text: "text-blue-700" },
  fnb: { bg: "bg-amber-50", text: "text-amber-700" },
  aviation: { bg: "bg-indigo-50", text: "text-indigo-700" },
  other: { bg: "bg-gray-100", text: "text-gray-600" },
};

export function adminCategoryColors(category: string | undefined) {
  return (
    ADMIN_CATEGORY_COLORS[category || ""] || ADMIN_CATEGORY_COLORS.other!
  );
}
