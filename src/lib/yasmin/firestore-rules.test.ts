import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ALLOWED_EMAILS } from "./auth";

describe("Firestore rules allowlist sync", () => {
  it("includes every UI allowlisted email", () => {
    const rulesPath = resolve(process.cwd(), "firestore.rules");
    const rules = readFileSync(rulesPath, "utf8");
    for (const email of ALLOWED_EMAILS) {
      expect(rules).toContain(`'${email}'`);
    }
  });
});
