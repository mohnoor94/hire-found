/**
 * Computes the relative path prefix from the current page to the project root.
 * - "/" or "/index.html" → "" (empty string)
 * - "/jobs/index.html" or "/jobs/" → "../"
 * - "/a/b/index.html" → "../../"
 * @returns {string} The relative prefix (e.g., "", "../", "../../")
 */
export function getBasePath() {
  const path = window.location.pathname;
  // Normalize: remove trailing filename, count directory segments
  const segments = path.split('/').filter(Boolean);
  // If last segment has a dot (file), remove it
  if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }
  if (segments.length === 0) return '';
  return '../'.repeat(segments.length);
}
