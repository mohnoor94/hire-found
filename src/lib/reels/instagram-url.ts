/**
 * Instagram URL parsing and embed link helpers.
 */

const SHORTCODE_REGEX =
  /(?:instagram\.com|instagr\.am)\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i;

/**
 * Extracts the alphanumeric Instagram shortcode from a Reel or Post URL.
 */
export function extractInstagramShortcode(input: string): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  const match = trimmed.match(SHORTCODE_REGEX);
  return match && match[1] ? match[1] : null;
}

/**
 * Builds the canonical public Instagram Reel URL.
 */
export function getInstagramReelUrl(shortcode: string): string {
  if (!shortcode) return "";
  return `https://www.instagram.com/reel/${shortcode}/`;
}

/**
 * Builds a clean, responsive Instagram embed player URL.
 */
export function getInstagramEmbedUrl(shortcode: string): string {
  if (!shortcode) return "";
  return `https://www.instagram.com/reel/${shortcode}/embed/`;
}

/**
 * Validates whether a string is a recognizable Instagram Reel or Post link.
 */
export function isValidInstagramUrl(input: string): boolean {
  return extractInstagramShortcode(input) !== null;
}
