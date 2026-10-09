import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ALLOWED_EMAILS } from "./auth";

/** Emails listed inside firestore.rules `isAdmin()` - both directions vs UI. */
function emailsInIsAdmin(rules: string): string[] {
  const block = rules.match(
    /function isAdmin\(\)[\s\S]*?request\.auth\.token\.email in \[([\s\S]*?)\]/,
  );
  if (!block) return [];
  return [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

describe("Firestore rules allowlist sync", () => {
  it("matches ALLOWED_EMAILS set-equality with isAdmin() list", () => {
    const rulesPath = resolve(process.cwd(), "firestore.rules");
    const rules = readFileSync(rulesPath, "utf8");
    const fromRules = emailsInIsAdmin(rules).sort();
    const fromUi = [...ALLOWED_EMAILS].sort();
    expect(fromRules).toEqual(fromUi);
  });

  it("requires email_verified in isAdmin()", () => {
    const rulesPath = resolve(process.cwd(), "firestore.rules");
    const rules = readFileSync(rulesPath, "utf8");
    const isAdmin = rules.match(/function isAdmin\(\)[\s\S]*?\n      \}/)?.[0] ?? "";
    expect(isAdmin).toMatch(/request\.auth\.token\.email_verified\s*==\s*true/);
  });
});
