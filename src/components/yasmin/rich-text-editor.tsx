"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import {
  normalizeEditorHtml,
  prepareIncomingHtml,
} from "@/lib/yasmin/editor-html";
import { editorControlClass, editorQuietButton, editorTextButton } from "./editor-fields";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  id?: string;
  "aria-label"?: string;
};

/** Shared extension set for the admin editor and round-trip tests. */
export function createYasminEditorExtensions(placeholder = "") {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      // Register Link/Underline once (not via StarterKit duplicates).
      link: false,
      underline: false,
      // Avoid appending a trailing empty paragraph on every save.
      trailingNode: false,
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      // Style links via CSS - never write Tailwind classes into Firestore HTML.
      HTMLAttributes: {},
    }),
    Placeholder.configure({
      placeholder,
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      showOnlyWhenEditable: true,
      showOnlyCurrent: false,
    }),
  ];
}

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
    shouldRerenderOnTransaction: true,
    extensions: createYasminEditorExtensions(placeholder),
    content: prepareIncomingHtml(value || ""),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        "aria-label": ariaLabel || "",
        ...(dir === "rtl" ? { lang: "ar" } : {}),
        class: cn(
          "tiptap-editor min-h-40 scroll-mb-32 px-4 py-3 text-base leading-relaxed outline-none focus:outline-none",
          dir === "rtl" && "text-start",
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
    const next = normalizeEditorHtml(prepareIncomingHtml(value || ""));
    if (current !== next) {
      editor.commands.setContent(prepareIncomingHtml(value || ""), {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="min-h-56 rounded-2xl border border-primary/15 bg-white"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="scroll-mb-32 rounded-2xl border border-primary/25 bg-white transition-[border-color] has-[.tiptap-editor:focus]:border-primary">
      <EditorToolbar editor={editor} label={ariaLabel} fieldId={id} />
      <EditorContent editor={editor} />
    </div>
  );
}

function EditorToolbar({
  editor,
  label,
  fieldId,
}: {
  editor: Editor;
  label?: string;
  fieldId?: string;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [tabStop, setTabStop] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const linkFieldId = `${fieldId ?? "rich-text"}-link`;

  useEffect(() => {
    if (linkOpen) linkInputRef.current?.focus();
  }, [linkOpen]);

  function openLink() {
    const { from, to } = editor.state.selection;
    selectionRef.current = { from, to };
    const prev = editor.getAttributes("link").href as string | undefined;
    setLinkUrl(prev || "https://");
    setLinkOpen((open) => !open);
  }

  function applyLink(raw: string) {
    const href = raw.trim();
    const selection = selectionRef.current;
    const chain = editor.chain().focus();
    if (selection) chain.setTextSelection(selection);
    if (!href || href === "https://") {
      chain.extendMarkRange("link").unsetLink().run();
    } else {
      chain.extendMarkRange("link").setLink({ href }).run();
    }
    setLinkOpen(false);
  }

  const tools: {
    label: string;
    pressed: boolean;
    run: () => void;
    className?: string;
  }[] = [
    {
      label: "Heading",
      pressed: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Subhead",
      pressed: editor.isActive("heading", { level: 3 }),
      run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Bold",
      pressed: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
      className: "font-bold",
    },
    {
      label: "Italic",
      pressed: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
      className: "italic",
    },
    {
      label: "Underline",
      pressed: editor.isActive("underline"),
      run: () => editor.chain().focus().toggleUnderline().run(),
      className: "underline",
    },
    {
      label: "Bullets",
      pressed: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbers",
      pressed: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  function onToolbarKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    const buttons = [
      ...(barRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-toolbar-item]",
      ) ?? []),
    ];
    const current = buttons.findIndex((button) => button === document.activeElement);
    if (current < 0 || buttons.length === 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : event.key === "ArrowRight"
            ? (current + 1) % buttons.length
            : (current - 1 + buttons.length) % buttons.length;
    setTabStop(next);
    buttons[next]?.focus();
  }

  const linkIndex = tools.length;
  const clearIndex = tools.length + 1;

  return (
    <div
      dir="ltr"
      className="rounded-t-2xl border-b border-primary/15 bg-warm"
    >
      <div
        ref={barRef}
        className="flex flex-wrap gap-2 px-3 py-2"
        role="toolbar"
        aria-label={label ? `${label} formatting` : "Formatting"}
        aria-orientation="horizontal"
        onKeyDown={onToolbarKeyDown}
      >
        {tools.map((tool, index) => (
          <ToolbarButton
            key={tool.label}
            pressed={tool.pressed}
            tabIndex={tabStop === index ? 0 : -1}
            onClick={() => {
              setTabStop(index);
              tool.run();
            }}
            label={tool.label}
            className={tool.className}
          />
        ))}
        <ToolbarButton
          pressed={linkOpen || editor.isActive("link")}
          tabIndex={tabStop === linkIndex ? 0 : -1}
          onClick={() => {
            setTabStop(linkIndex);
            openLink();
          }}
          label="Link"
          aria-expanded={linkOpen}
          aria-controls={linkOpen ? linkFieldId : undefined}
        />
        <ToolbarButton
          pressed={false}
          tabIndex={tabStop === clearIndex ? 0 : -1}
          onClick={() => {
            setTabStop(clearIndex);
            editor.chain().focus().clearNodes().unsetAllMarks().run();
          }}
          label="Clear format"
        />
      </div>
      {linkOpen ? (
        <div className="flex flex-col gap-2 border-t border-primary/15 px-3 py-3 sm:flex-row sm:items-center">
          <label htmlFor={linkFieldId} className="text-sm font-semibold text-text-main">
            Link address
          </label>
          <input
            ref={linkInputRef}
            id={linkFieldId}
            value={linkUrl}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="done"
            className={cn(editorControlClass, "sm:flex-1")}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              applyLink(linkUrl);
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyLink(linkUrl)}
              className={editorQuietButton}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => applyLink("")}
              className={editorTextButton}
            >
              Remove
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  pressed,
  onClick,
  label,
  className,
  ...props
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-toolbar-item=""
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full px-3 text-sm font-semibold whitespace-nowrap text-text-main select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        pressed && "bg-primary text-primary-foreground active:bg-primary-dark",
        className,
      )}
      {...props}
    >
      {label}
    </button>
  );
}
