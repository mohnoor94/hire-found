/**
 * Slug generation and dedupe - from yasmin/js/editor.js.
 */

/** URL-safe slug from a title (max 80 chars). */
export function generateSlug(title: string): string {
  if (!title || typeof title !== "string") return "";

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Append -N until the slug is unique among existingSlugs. */
export function deduplicateSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let suffix = 2;
  while (existingSlugs.includes(`${baseSlug}-${suffix}`)) {
    suffix++;
  }
  return `${baseSlug}-${suffix}`;
}
