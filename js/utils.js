/**
 * Computes the relative path prefix from the current page to the project root.
 * Handles both custom domains (root = /) and GitHub Pages (root = /repo-name/).
 * @returns {string} The relative prefix (e.g., "", "../", "../../")
 */
export function getBasePath() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  // If last segment has a dot (file), remove it
  if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }

  // Detect GitHub Pages: if hostname is *.github.io, first segment is the repo name (root)
  const isGitHubPages = window.location.hostname.endsWith('.github.io');
  const rootDepth = isGitHubPages && segments.length > 0 ? 1 : 0;

  const depth = segments.length - rootDepth;
  if (depth <= 0) return '';
  return '../'.repeat(depth);
}
