"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { normalizeEditorHtml } from "@/lib/yasmin/editor-html";

export { normalizeEditorHtml } from "@/lib/yasmin/editor-html";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  id?: string;
  "aria-label"?: string;
};

/**
 * Tiptap rich-text field. HTML in, HTML out (Quill job HTML still loads).
 * Uses the hook API with immediatelyRender:false for Next.js static export SSR.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  dir = "ltr",
  id,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline underline-offset-[3px] font-medium",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        id: id || "",
        "aria-label": ariaLabel || "",
        class: cn(
          "tiptap-editor min-h-[180px] px-4 py-3 text-sm leading-relaxed outline-none",
          dir === "rtl" && "text-right",
        ),
        dir,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(normalizeEditorHtml(ed.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = normalizeEditorHtml(editor.getHTML());
    const next = normalizeEditorHtml(value || "");
    if (current !== next) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[220px] rounded-xl border border-gray-200 bg-white" />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white",
        dir === "rtl" && "tiptap-rtl",
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-[#fafafa] px-2 py-1.5">
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          label="H2"
        />
        <ToolbarButton
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          label="H3"
        />
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="B"
          className="font-bold"
        />
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="I"
          className="italic"
        />
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="U"
          className="underline"
        />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="• List"
        />
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="1. List"
        />
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href as
              | string
              | undefined;
            const url = window.prompt("URL", prev || "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          label="Link"
        />
        <ToolbarButton
          active={false}
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          label="Clear"
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  className,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-[11px] text-text-main transition-colors hover:bg-gray-200",
        active && "bg-butterfly-lavender/20 text-[#7C3AED]",
        className,
      )}
    >
      {label}
    </button>
  );
}
