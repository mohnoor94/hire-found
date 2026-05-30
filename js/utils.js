/**
 * Computes the relative path prefix from the current page to the project root.
 * Works on both custom domains (root = /) and GitHub Pages (root = /repo-name/).
 * @returns {string} The relative prefix (e.g., "./", "../")
 */
export function getBasePath() {
  const path = window.location.pathname;

  // On GitHub Pages, the repo name is the first path segment and acts as root.
  // On a custom domain, root is /.
  // We detect this by checking known page directories.
  const knownSubDirs = ['jobs', 'yasmin'];

  const segments = path.split('/').filter(Boolean);
  // Remove filename if present
  if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }

  // Find how deep we are below the project root.
  // The project root is the segment BEFORE any known subdirectory.
  // e.g. /hire-found/jobs/ → root is at /hire-found/, depth = 1
  // e.g. /jobs/ → root is at /, depth = 1
  // e.g. /hire-found/ → root is at /hire-found/, depth = 0
  let depth = 0;
  for (let i = segments.length - 1; i >= 0; i--) {
    if (knownSubDirs.includes(segments[i])) {
      depth = segments.length - i;
      break;
    }
  }

  if (depth === 0) return './';
  return '../'.repeat(depth);
}
