/**
 * Yasmin admin allowlist — matches yasmin/js/app.js ALLOWED_EMAILS.
 * Firestore rules drift (only moh.noor94) is fixed in Phase 6.
 */

export const ALLOWED_EMAILS = [
  "moh.noor94@gmail.com",
  "yasmin@hirefound.com",
] as const;

export const AUTO_SIGN_OUT_DELAY_MS = 3000;

/** Case-insensitive allowlist check. */
export function isEmailAllowed(
  email: string | null | undefined,
  allowedEmails: readonly string[] = ALLOWED_EMAILS,
): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase();
  return allowedEmails.some(
    (allowed) => allowed.toLowerCase() === normalizedEmail,
  );
}

export type AdminAuthStatus =
  | "loading"
  | "signed-out"
  | "denied"
  | "authenticated"
  | "unavailable";
