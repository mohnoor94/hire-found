/**
 * Rich-text HTML helpers for Yasmin Tiptap ↔ Quill 2 Firestore content.
 */

const EMPTY_SHELLS = new Set(["", "<p></p>", "<p><br></p>", "<p><br/></p>"]);

function parseRoot(html: string): HTMLElement | null {
  if (typeof DOMParser === "undefined") return null;
  const doc = new DOMParser().parseFromString(
    `<div id="__hf_root">${html}</div>`,
    "text/html",
  );
  return doc.getElementById("__hf_root");
}

/**
 * Convert Quill 2 list markup into standard HTML before Tiptap parses it.
 * Quill 2 emits all lists as <ol> with li[data-list="bullet"|"ordered"].
 */
export function prepareIncomingHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  const root = parseRoot(trimmed);
  if (!root) return trimmed;

  root.querySelectorAll("span.ql-ui").forEach((el) => el.remove());

  root.querySelectorAll("ol, ul").forEach((list) => {
    const items = Array.from(list.querySelectorAll(":scope > li"));
    if (!items.some((li) => li.hasAttribute("data-list"))) return;

    const frag = root.ownerDocument!.createDocumentFragment();
    let currentType: "ul" | "ol" | null = null;
    let currentList: HTMLElement | null = null;

    for (const li of items) {
      const type: "ul" | "ol" =
        li.getAttribute("data-list") === "bullet" ? "ul" : "ol";
      li.removeAttribute("data-list");
      if (type !== currentType) {
        currentType = type;
        currentList = root.ownerDocument!.createElement(type);
        frag.appendChild(currentList);
      }
      currentList!.appendChild(li);
    }

    list.replaceWith(frag);
  });

  return root.innerHTML;
}

/**
 * Normalize editor HTML before Firestore write:
 * empty shells → "", strip trailing empty paragraphs, unwrap li>p,
 * strip presentation classes from links (keep href/target/rel).
 */
export function normalizeEditorHtml(html: string): string {
  const trimmed = html.trim();
  if (EMPTY_SHELLS.has(trimmed)) return "";

  const root = parseRoot(trimmed);
  if (!root) {
    return trimmed
      .replace(/(?:<p>(?:<br\s*\/?>)?<\/p>)+$/i, "")
      .trim();
  }

  root.querySelectorAll("a").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    const target = anchor.getAttribute("target");
    const rel = anchor.getAttribute("rel");
    Array.from(anchor.attributes).forEach((attr) => {
      anchor.removeAttribute(attr.name);
    });
    if (href) anchor.setAttribute("href", href);
    if (target) anchor.setAttribute("target", target);
    if (rel) anchor.setAttribute("rel", rel);
  });

  root.querySelectorAll("li").forEach((li) => {
    if (
      li.children.length === 1 &&
      li.children[0]!.tagName === "P" &&
      li.childNodes.length === 1
    ) {
      const p = li.children[0]!;
      while (p.firstChild) {
        li.insertBefore(p.firstChild, p);
      }
      p.remove();
    }
  });

  while (root.lastElementChild) {
    const last = root.lastElementChild;
    if (last.tagName !== "P") break;
    const text = last.textContent?.trim() ?? "";
    const onlyBreak =
      !text &&
      (last.innerHTML === "" ||
        last.innerHTML === "<br>" ||
        last.innerHTML === "<br/>");
    if (!onlyBreak) break;
    last.remove();
  }

  const out = root.innerHTML.trim();
  if (EMPTY_SHELLS.has(out)) return "";
  return out;
}
