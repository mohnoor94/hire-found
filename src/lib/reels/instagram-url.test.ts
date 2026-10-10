import { describe, it, expect } from "vitest";
import {
  extractInstagramShortcode,
  getInstagramReelUrl,
  getInstagramEmbedUrl,
  isValidInstagramUrl,
} from "./instagram-url";

describe("Instagram URL parser", () => {
  it("extracts shortcode from standard reel link", () => {
    const url = "https://www.instagram.com/reel/C8f01Executive/";
    expect(extractInstagramShortcode(url)).toBe("C8f01Executive");
  });

  it("extracts shortcode from reel link without www and with query parameters", () => {
    const url = "https://instagram.com/reel/DABC1234/?utm_source=ig_web_copy_link";
    expect(extractInstagramShortcode(url)).toBe("DABC1234");
  });

  it("extracts shortcode from post link format", () => {
    const url = "https://www.instagram.com/p/B_xyz987/";
    expect(extractInstagramShortcode(url)).toBe("B_xyz987");
  });

  it("handles instagr.am short links", () => {
    const url = "https://instagr.am/reel/Short123/";
    expect(extractInstagramShortcode(url)).toBe("Short123");
  });

  it("returns null for non-instagram links or invalid input", () => {
    expect(extractInstagramShortcode("https://youtube.com/watch?v=123")).toBeNull();
    expect(extractInstagramShortcode("not a url")).toBeNull();
    expect(extractInstagramShortcode("")).toBeNull();
  });

  it("validates correct Instagram links with isValidInstagramUrl", () => {
    expect(isValidInstagramUrl("https://www.instagram.com/reel/C8f01/")).toBe(true);
    expect(isValidInstagramUrl("https://twitter.com/")).toBe(false);
  });

  it("generates correct embed and permalink URLs", () => {
    expect(getInstagramReelUrl("C8f01")).toBe("https://www.instagram.com/reel/C8f01/");
    expect(getInstagramEmbedUrl("C8f01")).toBe("https://www.instagram.com/reel/C8f01/embed/");
  });
});
