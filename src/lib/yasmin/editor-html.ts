/**
 * Normalize empty rich-text editor HTML shells to "".
 * Shared by Tiptap save path and public HTML round-trip expectations.
 */
export function normalizeEditorHtml(html: string): string {
  const trimmed = html.trim();
  if (
    !trimmed ||
    trimmed === "<p></p>" ||
    trimmed === "<p><br></p>" ||
    trimmed === "<p><br/></p>"
  ) {
    return "";
  }
  return html;
}
