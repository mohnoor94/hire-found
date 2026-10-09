import { describe, expect, it } from "vitest";
import {
  containsArabic,
  truncateText,
  getRelativeTime,
  getCategories,
  filterByCategory,
  formatRichText,
  categoryLabel,
} from "./display";

describe("containsArabic", () => {
  it("returns false for empty/null", () => {
    expect(containsArabic("")).toBe(false);
    expect(containsArabic(null)).toBe(false);
    expect(containsArabic(undefined)).toBe(false);
  });

  it("detects Arabic characters", () => {
    expect(containsArabic("مرحبا")).toBe(true);
    expect(containsArabic("Hello مرحبا")).toBe(true);
    expect(containsArabic("Hello")).toBe(false);
  });
});

describe("truncateText", () => {
  it("returns original when within limit", () => {
    expect(truncateText("hello", 10)).toBe("hello");
    expect(truncateText("", 10)).toBe("");
  });

  it("truncates with ellipsis", () => {
    expect(truncateText("abcdefghij", 5)).toBe("abcd…");
  });
});

describe("getRelativeTime", () => {
  it("returns empty for missing timestamp", () => {
    expect(getRelativeTime(null)).toBe("");
    expect(getRelativeTime(undefined)).toBe("");
  });

  it("formats recent times", () => {
    expect(getRelativeTime(new Date())).toBe("just now");
    expect(
      getRelativeTime(new Date(Date.now() - 5 * 60 * 1000)),
    ).toBe("5 minutes ago");
  });
});

describe("getCategories / filterByCategory", () => {
  const jobs = [
    { category: "tech" },
    { category: "hospitality" },
    { category: "tech" },
    { category: "" },
  ];

  it("extracts distinct categories", () => {
    expect(getCategories(jobs)).toEqual(["tech", "hospitality"]);
    expect(getCategories(null)).toEqual([]);
  });

  it("filters by category or returns all", () => {
    expect(filterByCategory(jobs, "all")).toHaveLength(4);
    expect(filterByCategory(jobs, "tech")).toHaveLength(2);
    expect(filterByCategory(null, "tech")).toEqual([]);
  });
});

describe("categoryLabel", () => {
  it("capitalizes category", () => {
    expect(categoryLabel("tech")).toBe("Tech");
    expect(categoryLabel(undefined)).toBe("Other");
  });
});

describe("formatRichText", () => {
  it("passes through HTML", () => {
    expect(formatRichText("<p>Hi</p>")).toBe("<p>Hi</p>");
  });

  it("formats plain paragraphs and bold", () => {
    expect(formatRichText("Hello **world**")).toBe(
      "<p>Hello <strong>world</strong></p>",
    );
  });

  it("formats bullet lists", () => {
    const html = formatRichText("- one\n- two");
    expect(html).toContain("<ul");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<li>two</li>");
  });

  it("returns empty for blank", () => {
    expect(formatRichText("")).toBe("");
    expect(formatRichText(null)).toBe("");
  });
});
