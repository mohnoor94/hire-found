"use client";

import { formatCategoryLabel, formatOptionLabel } from "@/lib/yasmin/labels";
import { cn } from "@/lib/utils";

export const editorControlClass =
  "h-12 w-full scroll-mb-32 rounded-full border border-primary/25 bg-white px-5 text-base text-text-main placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-warm-dark disabled:text-muted";

export const editorTextareaClass =
  "min-h-36 w-full max-w-full min-w-0 scroll-mb-32 resize-y overflow-x-hidden break-words rounded-2xl border border-primary/25 bg-white px-5 py-3 text-base text-text-main placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const editorPrimaryButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

export const editorQuietButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-primary/25 bg-white px-5 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

export const editorTextButton =
  "inline-flex min-h-11 touch-manipulation items-center px-3 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

export function describedBy(
  id: string,
  opts: { hint?: boolean; error?: boolean },
) {
  const ids = [
    opts.hint ? `${id}-hint` : null,
    opts.error ? `${id}-error` : null,
  ].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function EditorField({
  id,
  label,
  required,
  error,
  hint,
  action,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label
          id={`${id}-label`}
          htmlFor={id}
          className="text-sm font-semibold text-text-main"
        >
          {label}
          {required ? (
            <>
              <span aria-hidden="true"> *</span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </label>
        {action}
      </div>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted tabular-nums">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function EditorTextInput({
  invalid,
  className,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        editorControlClass,
        invalid && "border-destructive",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function EditorTextArea({
  invalid,
  className,
  ...props
}: React.ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        editorTextareaClass,
        invalid && "border-destructive",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function EditorSelect({
  invalid,
  className,
  children,
  ...props
}: React.ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        editorControlClass,
        "cursor-pointer",
        invalid && "border-destructive",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function ChipField({
  label,
  required,
  name,
  value,
  options,
  error,
  placeholder,
  helpText,
  formatLabel = "option",
  inputRef,
  onChange,
}: {
  label: string;
  required?: boolean;
  name: string;
  value: string;
  options: readonly string[];
  error?: string;
  placeholder?: string;
  helpText?: string;
  formatLabel?: "option" | "category";
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
}) {
  const id = `field-${name}`;
  const listId = `${id}-suggestions`;
  const labelFor = (opt: string) =>
    formatLabel === "category" ? formatCategoryLabel(opt) : formatOptionLabel(opt);

  return (
    <EditorField
      id={id}
      label={label}
      required={required}
      error={error}
      hint={helpText}
    >
      <EditorTextInput
        ref={inputRef}
        id={id}
        name={name}
        value={value}
        list={listId}
        maxLength={name === "category" ? 50 : 100}
        placeholder={placeholder}
        autoComplete="off"
        invalid={Boolean(error)}
        aria-describedby={describedBy(id, {
          hint: Boolean(helpText),
          error: Boolean(error),
        })}
        onChange={(event) => onChange(event.target.value)}
      />
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelFor(opt)}
          </option>
        ))}
      </datalist>
    </EditorField>
  );
}

export function LockedContactField({
  label,
  name,
  value,
  custom,
  error,
  placeholder,
  helpText,
  type = "text",
  inputMode,
  maxLength,
  inputRef,
  onToggleCustom,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  custom: boolean;
  error?: string;
  placeholder?: string;
  helpText?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onToggleCustom: () => void;
  onChange: (value: string) => void;
}) {
  const id = `field-${name}`;
  const hint = custom
    ? helpText
    : "Using the default. Choose custom to override this listing.";

  return (
    <EditorField
      id={id}
      label={label}
      error={error}
      hint={hint}
      action={
        <button type="button" onClick={onToggleCustom} className={editorTextButton}>
          {custom ? "Use default" : "Use custom"}
        </button>
      }
    >
      <EditorTextInput
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={!custom}
        invalid={Boolean(error)}
        aria-describedby={describedBy(id, {
          hint: Boolean(hint),
          error: Boolean(error),
        })}
        onChange={(event) => onChange(event.target.value)}
      />
    </EditorField>
  );
}
