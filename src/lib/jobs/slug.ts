/**
 * Slug generation and dedupe - from yasmin/js/editor.js.
 */

const SLUG_MAX_LENGTH = 80;
const SLUG_SUFFIX_LENGTH = 6;
const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** URL-safe slug from a title (max 80 chars). */
export function generateSlug(title: string): string {
  if (!title || typeof title !== "string") return "";

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX_LENGTH);
}

/** Short random id so two openings with the same title do not share a slug. */
export function randomSlugSuffix(length = SLUG_SUFFIX_LENGTH): string {
  const size = Math.max(1, Math.min(length, SLUG_MAX_LENGTH));
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => SLUG_ALPHABET[byte % SLUG_ALPHABET.length]).join(
    "",
  );
}

/**
 * Title slug plus a random suffix. Pass a stable suffix while the title is
 * being typed so the id does not change on every keystroke.
 */
export function slugFromTitle(
  title: string,
  suffix: string = randomSlugSuffix(),
): string {
  const id =
    suffix
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, SLUG_SUFFIX_LENGTH) || randomSlugSuffix();
  const base = generateSlug(title);
  if (!base) return id;
  const maxBase = SLUG_MAX_LENGTH - 1 - id.length;
  const trimmed = base.slice(0, maxBase).replace(/-+$/, "");
  return trimmed ? `${trimmed}-${id}` : id;
}

/** Append -N until the slug is unique among existingSlugs. */
export function deduplicateSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}
