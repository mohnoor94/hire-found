/**
 * GitHub project Pages host at /hire-found until hirefound.com DNS is cut over.
 * When attaching the custom domain, set NEXT_PUBLIC_BASE_PATH="" and next.config basePath "".
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/hire-found";

/** Prefix a root-absolute path for public assets and raw <a href>. Next Link/router already apply basePath. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE_PATH && path.startsWith(`${BASE_PATH}/`)) return path;
  if (BASE_PATH && path === BASE_PATH) return path;
  return `${BASE_PATH}${path}`;
}
