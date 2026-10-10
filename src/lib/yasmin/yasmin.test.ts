import { describe, expect, it } from "vitest";
import {
  ALLOWED_EMAILS,
  isEmailAllowed,
} from "@/lib/yasmin/auth";
import {
  DAILY_AFFIRMATIONS,
  extractFirstName,
  formatAtelierDate,
  getCelebrationToast,
  getContextualGreetings,
  getGreeting,
  pickAffirmation,
  pickGreeting,
  splitTrailingEmoji,
  truncateUserIdentifier,
} from "@/lib/yasmin/greeting";
import {
  formatCategoryLabel,
  formatEmploymentType,
} from "@/lib/yasmin/labels";
import { normalizeEditorHtml } from "@/lib/yasmin/editor-html";

describe("admin allowlist", () => {
  it("includes both planned admin emails", () => {
    expect(ALLOWED_EMAILS).toContain("moh.noor94@gmail.com");
    expect(ALLOWED_EMAILS).toContain("yasmin@hirefound.com");
  });

  it("matches emails case-insensitively", () => {
    expect(isEmailAllowed("Moh.Noor94@Gmail.com")).toBe(true);
    expect(isEmailAllowed("YASMIN@HIREFOUND.COM")).toBe(true);
    expect(isEmailAllowed("stranger@example.com")).toBe(false);
    expect(isEmailAllowed(null)).toBe(false);
    expect(isEmailAllowed("")).toBe(false);
  });
});

describe("greeting helpers", () => {
  it("extracts first name with Yasmin fallback", () => {
    expect(extractFirstName("Yasmin Blasi")).toBe("Yasmin");
    expect(extractFirstName("")).toBe("Yasmin");
    expect(extractFirstName(null)).toBe("Yasmin");
  });

  it("returns time-of-day greetings", () => {
    expect(getGreeting(8)).toBe("Good morning");
    expect(getGreeting(14)).toBe("Good afternoon");
    expect(getGreeting(20)).toBe("Good evening");
    expect(getGreeting(2)).toBe("Good evening");
  });

  it("splits trailing emoji from subtitles", () => {
    const { text, emoji } = splitTrailingEmoji("Time to make magic happen ✨");
    expect(text).toBe("Time to make magic happen");
    expect(emoji.trim()).toContain("✨");
  });

  it("truncates long user identifiers", () => {
    expect(
      truncateUserIdentifier({
        displayName: "A very long display name that exceeds thirty",
      }),
    ).toMatch(/…$/);
    expect(
      truncateUserIdentifier({ email: "short@example.com" }),
    ).toBe("short@example.com");
  });

  it("picks a greeting with controlled randomness", () => {
    const result = pickGreeting("Noor", () => 0);
    expect(result.greeting).toContain("Noor");
    expect(result.subtitle.length).toBeGreaterThan(0);
  });

  it("picks a daily affirmation spark without em-dashes", () => {
    const aff = pickAffirmation(() => 0);
    expect(aff.length).toBeGreaterThan(10);
    for (const affirmation of DAILY_AFFIRMATIONS) {
      expect(affirmation).not.toContain("—");
      expect(affirmation).not.toContain("&mdash;");
    }
  });

  it("returns celebration toasts for create and activate without em-dashes", () => {
    const createToast = getCelebrationToast("create", () => 0);
    const activateToast = getCelebrationToast("activate", () => 0);
    expect(createToast).toBeTruthy();
    expect(activateToast).toBeTruthy();
    expect(createToast).not.toContain("—");
    expect(activateToast).not.toContain("—");
  });

  it("generates contextual greetings across day and hour", () => {
    const morningSunday = new Date("2026-10-11T09:00:00");
    const templates = getContextualGreetings(morningSunday);
    expect(templates.length).toBeGreaterThan(0);
    const greetingText = templates[0]!("Yasmin");
    expect(greetingText).toContain("Yasmin");
    expect(greetingText).not.toContain("—");
  });

  it("formats atelier date cleanly without em-dashes", () => {
    const testDate = new Date("2026-10-10T12:00:00");
    const formatted = formatAtelierDate(testDate);
    expect(formatted).toContain("October");
    expect(formatted).not.toContain("—");
  });
});

describe("admin labels", () => {
  it("formats known categories", () => {
    expect(formatCategoryLabel("fnb")).toBe("F&B");
    expect(formatCategoryLabel("customer-service")).toBe("Customer Service");
  });

  it("formats employment types", () => {
    expect(formatEmploymentType("full-time")).toBe("Full Time");
  });
});

describe("tiptap html normalize", () => {
  it("collapses empty editor shells", () => {
    expect(normalizeEditorHtml("<p></p>")).toBe("");
    expect(normalizeEditorHtml("<p><br></p>")).toBe("");
    expect(normalizeEditorHtml("<p>Hello</p>")).toBe("<p>Hello</p>");
  });

  it("preserves existing Quill-style HTML content", () => {
    const quillHtml =
      "<h2>Role</h2><p>Join our <strong>team</strong></p><ul><li>One</li></ul>";
    expect(normalizeEditorHtml(quillHtml)).toBe(quillHtml);
  });
});
