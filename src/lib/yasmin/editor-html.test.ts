/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, afterEach } from "vitest";
import { Editor } from "@tiptap/core";
import {
  normalizeEditorHtml,
  prepareIncomingHtml,
} from "@/lib/yasmin/editor-html";
import { createYasminEditorExtensions } from "@/components/yasmin/rich-text-editor";

describe("prepareIncomingHtml (Quill 2)", () => {
  it("converts data-list=bullet ol items into ul", () => {
    const quill = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Greet guests</li><li data-list="bullet">Serve drinks</li></ol>`;
    const prepared = prepareIncomingHtml(quill);
    expect(prepared).toContain("<ul>");
    expect(prepared).not.toContain("data-list");
    expect(prepared).not.toContain("ql-ui");
    expect(prepared).toContain("Greet guests");
  });

  it("keeps data-list=ordered as ol", () => {
    const quill = `<ol><li data-list="ordered">First</li><li data-list="ordered">Second</li></ol>`;
    const prepared = prepareIncomingHtml(quill);
    expect(prepared).toMatch(/<ol>/);
    expect(prepared).not.toContain("data-list");
  });

  it("splits mixed bullet and ordered groups", () => {
    const quill = `<ol><li data-list="bullet">A</li><li data-list="ordered">B</li></ol>`;
    const prepared = prepareIncomingHtml(quill);
    expect(prepared).toContain("<ul>");
    expect(prepared).toContain("<ol>");
  });
});

describe("normalizeEditorHtml", () => {
  it("collapses empty editor shells", () => {
    expect(normalizeEditorHtml("<p></p>")).toBe("");
    expect(normalizeEditorHtml("<p><br></p>")).toBe("");
  });

  it("strips trailing empty paragraphs", () => {
    expect(normalizeEditorHtml("<p>Hello</p><p></p>")).toBe("<p>Hello</p>");
    expect(normalizeEditorHtml("<ul><li>One</li></ul><p></p>")).toBe(
      "<ul><li>One</li></ul>",
    );
  });

  it("unwraps list-item paragraph wrappers", () => {
    expect(normalizeEditorHtml("<ul><li><p>Classic</p></li></ul>")).toBe(
      "<ul><li>Classic</li></ul>",
    );
  });

  it("strips presentation classes from links", () => {
    const html =
      '<p><a href="https://hirefound.com" class="text-blue-600 underline font-medium">Site</a></p>';
    expect(normalizeEditorHtml(html)).toBe(
      '<p><a href="https://hirefound.com">Site</a></p>',
    );
  });

  it("preserves Quill-style content after prepare", () => {
    const quillHtml =
      "<h2>Role</h2><p>Join our <strong>team</strong></p><ul><li>One</li></ul>";
    expect(normalizeEditorHtml(quillHtml)).toBe(quillHtml);
  });
});

describe("Tiptap Quill HTML round-trip", () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  function roundTrip(html: string): string {
    editor = new Editor({
      extensions: createYasminEditorExtensions(),
      content: prepareIncomingHtml(html),
    });
    return normalizeEditorHtml(editor.getHTML());
  }

  it("keeps Quill 2 bullets as unordered lists", () => {
    const quill = `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Greet guests</li><li data-list="bullet">Serve drinks</li></ol>`;
    const out = roundTrip(quill);
    expect(out).toContain("<ul>");
    expect(out).toContain("Greet guests");
    expect(out).toContain("Serve drinks");
    expect(out).not.toMatch(/<ol>[\s\S]*Greet guests/);
  });

  it("round-trips headings, marks, and links without Tailwind classes", () => {
    const input =
      '<h2>Role</h2><p>Join our <strong>team</strong> and <em>grow</em> with <u>us</u>. <a href="https://hirefound.com">Apply</a></p>';
    const out = roundTrip(input);
    expect(out).toContain("<h2>Role</h2>");
    expect(out).toContain("<strong>team</strong>");
    expect(out).toContain("<em>grow</em>");
    expect(out).toContain("<u>us</u>");
    expect(out).toContain('href="https://hirefound.com"');
    expect(out).not.toContain("text-blue-600");
  });

  it("round-trips Arabic paragraphs without injecting dir", () => {
    const input = "<p>مرحبا بالعالم</p>";
    const out = roundTrip(input);
    expect(out).toContain("مرحبا بالعالم");
    expect(out).not.toContain('dir="rtl"');
  });

  it("does not append a trailing empty paragraph", () => {
    const out = roundTrip("<ul><li>Classic</li></ul>");
    expect(out).toBe("<ul><li>Classic</li></ul>");
    expect(out.endsWith("<p></p>")).toBe(false);
  });
});
