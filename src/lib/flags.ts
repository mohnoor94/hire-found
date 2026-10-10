/**
 * Feature flags for dark-shipping components.
 *
 * Keep the Trust section hidden in production unless explicitly enabled.
 * Enable locally by setting NEXT_PUBLIC_ENABLE_TRUST_BENTO=1
 */
function parseBooleanFlag(value: string | undefined): boolean {
  if (!value) return false;
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export const TRUST_BENTO_ENABLED = parseBooleanFlag(
  process.env.NEXT_PUBLIC_ENABLE_TRUST_BENTO,
);

