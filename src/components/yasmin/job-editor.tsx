"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Job } from "@/lib/jobs/types";
import {
  CATEGORIES,
  DEFAULTS,
  EMPLOYMENT_TYPES,
  LOCATIONS,
} from "@/lib/jobs/types";
import { randomSlugSuffix, slugFromTitle } from "@/lib/jobs/slug";
import { validateForm, type JobFormData } from "@/lib/jobs/validation";
import { formatOptionLabel } from "@/lib/yasmin/labels";
import {
  normalizeEditorHtml,
  prepareIncomingHtml,
} from "@/lib/yasmin/editor-html";
import { withBasePath } from "@/lib/base-path";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichTextEditor } from "./rich-text-editor";
import {
  ChipField,
  describedBy,
  EditorField,
  EditorSelect,
  EditorTextArea,
  EditorTextInput,
  editorPrimaryButton,
  editorQuietButton,
  editorTextButton,
  LockedContactField,
} from "./editor-fields";

export type JobEditorHandle = {
  requestLeave: (action?: () => void) => void;
};

type JobEditorProps = {
  ref?: React.Ref<JobEditorHandle>;
  job?: Job | null;
  saving: boolean;
  onSave: (data: JobFormData, jobId: string | null) => void | Promise<void>;
  onCancel: () => void;
};

type FormState = {
  title: string;
  titleAr: string;
  slug: string;
  category: string;
  location: string;
  employmentType: string;
  companyName: string;
  salary: string;
  shortDescription: string;
  fullDescription: string;
  fullDescriptionAr: string;
  contactWhatsApp: string;
  contactEmail: string;
  tallyFormId: string;
};

const EMPTY: FormState = {
  title: "",
  titleAr: "",
  slug: "",
  category: "",
  location: "",
  employmentType: "",
  companyName: "",
  salary: "",
  shortDescription: "",
  fullDescription: "",
  fullDescriptionAr: "",
  contactWhatsApp: DEFAULTS.whatsApp,
  contactEmail: DEFAULTS.email,
  tallyFormId: "",
};

const FIELD_ORDER = [
  "title",
  "titleAr",
  "category",
  "location",
  "employmentType",
  "companyName",
  "salary",
  "slug",
  "shortDescription",
  "contactWhatsApp",
  "contactEmail",
] as const;

function jobToForm(job?: Job | null): FormState {
  if (!job) return { ...EMPTY };
  return {
    title: job.title || "",
    titleAr: job.titleAr || "",
    slug: job.slug || "",
    category: job.category || "",
    location: job.location || "",
    employmentType: String(job.employmentType || ""),
    companyName: job.companyName || "",
    salary: job.salary || "",
    shortDescription: job.shortDescription || "",
    fullDescription: job.fullDescription || "",
    fullDescriptionAr: job.fullDescriptionAr || "",
    contactWhatsApp: job.contactWhatsApp || DEFAULTS.whatsApp,
    contactEmail: job.contactEmail || DEFAULTS.email,
    tallyFormId: job.tallyFormId || "",
  };
}

function contactPayload(
  form: FormState,
  whatsAppCustom: boolean,
  emailCustom: boolean,
): FormState {
  return {
    ...form,
    contactWhatsApp: whatsAppCustom ? form.contactWhatsApp : DEFAULTS.whatsApp,
    contactEmail: emailCustom ? form.contactEmail : DEFAULTS.email,
  };
}

function sameHtml(a: string, b: string) {
  return (
    normalizeEditorHtml(prepareIncomingHtml(a)) ===
    normalizeEditorHtml(prepareIncomingHtml(b))
  );
}

function sameListing(a: FormState, b: FormState) {
  return (Object.keys(a) as (keyof FormState)[]).every((key) => {
    if (key === "fullDescription" || key === "fullDescriptionAr") {
      return sameHtml(a[key], b[key]);
    }
    return a[key] === b[key];
  });
}

export function JobEditor({
  ref,
  job,
  saving,
  onSave,
  onCancel,
}: JobEditorProps) {
  const isEdit = Boolean(job?.id);
  const [form, setForm] = useState<FormState>(() => jobToForm(job));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugManual, setSlugManual] = useState(() => Boolean(job?.slug));
  const [slugSuffix, setSlugSuffix] = useState(() => randomSlugSuffix());
  const [whatsAppCustom, setWhatsAppCustom] = useState(() =>
    Boolean(job?.contactWhatsApp && job.contactWhatsApp !== DEFAULTS.whatsApp),
  );
  const [emailCustom, setEmailCustom] = useState(() =>
    Boolean(job?.contactEmail && job.contactEmail !== DEFAULTS.email),
  );
  const [discardOpen, setDiscardOpen] = useState(false);
  const [baseline] = useState(() =>
    contactPayload(
      jobToForm(job),
      Boolean(job?.contactWhatsApp && job.contactWhatsApp !== DEFAULTS.whatsApp),
      Boolean(job?.contactEmail && job.contactEmail !== DEFAULTS.email),
    ),
  );
  const pendingLeave = useRef<(() => void) | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const titleArRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const employmentRef = useRef<HTMLSelectElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const salaryRef = useRef<HTMLInputElement>(null);
  const shortRef = useRef<HTMLTextAreaElement>(null);
  const whatsAppRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const dirty = !sameListing(
    contactPayload(form, whatsAppCustom, emailCustom),
    baseline,
  );

  const requestLeave = useCallback(
    (action?: () => void) => {
      if (saving) return;
      const next = action ?? onCancel;
      if (!dirty) {
        next();
        return;
      }
      pendingLeave.current = next;
      setDiscardOpen(true);
    },
    [dirty, onCancel, saving],
  );

  useImperativeHandle(ref, () => ({ requestLeave }), [requestLeave]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    function onBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugManual) {
        next.slug = slugFromTitle(String(value), slugSuffix);
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }

  function focusField(name: string) {
    const node =
      name === "title"
        ? titleRef.current
        : name === "titleAr"
          ? titleArRef.current
          : name === "slug"
            ? slugRef.current
            : name === "category"
              ? categoryRef.current
              : name === "location"
                ? locationRef.current
                : name === "employmentType"
                  ? employmentRef.current
                  : name === "companyName"
                    ? companyRef.current
                    : name === "salary"
                      ? salaryRef.current
                      : name === "shortDescription"
                        ? shortRef.current
                        : name === "contactWhatsApp"
                          ? whatsAppRef.current
                          : name === "contactEmail"
                            ? emailRef.current
                            : null;
    if (!node) return;
    node.focus();
    if (typeof node.scrollIntoView === "function") {
      node.scrollIntoView({ block: "center", inline: "nearest" });
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const data = contactPayload(form, whatsAppCustom, emailCustom);
    const result = validateForm(data);
    if (!result.valid) {
      setErrors(result.errors);
      const first =
        FIELD_ORDER.find((key) => result.errors[key]) ??
        Object.keys(result.errors)[0];
      if (first) focusField(first);
      return;
    }
    void onSave(data, job?.id ?? null);
  }

  function dismissDiscard() {
    pendingLeave.current = null;
    setDiscardOpen(false);
  }

  function confirmDiscard() {
    const action = pendingLeave.current ?? onCancel;
    pendingLeave.current = null;
    setDiscardOpen(false);
    action();
  }

  function blockEnterSubmit(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target instanceof HTMLTextAreaElement) return;
    if (target instanceof HTMLInputElement || target.closest(".tiptap-editor")) {
      event.preventDefault();
    }
  }

  const errorCount = Object.keys(errors).length;
  const titleId = "field-title";
  const titleArId = "field-titleAr";
  const slugId = "field-slug";
  const typeId = "field-employmentType";
  const companyId = "field-companyName";
  const salaryId = "field-salary";
  const shortId = "field-shortDescription";
  const tallyId = "field-tallyFormId";

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-6 pt-6 pb-36">
      <form
        id="job-editor-form"
        noValidate
        onSubmit={handleSubmit}
        onKeyDown={blockEnterSubmit}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-accent text-2xl text-primary">
            {isEdit ? "Edit job" : "New job"}
          </h2>
          {isEdit && job?.slug ? (
            <a
              href={withBasePath(`/jobs/?id=${encodeURIComponent(job.slug)}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={editorTextButton}
            >
              View on site
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>

        <section data-section="basic-info" className="mt-8 border-t border-secondary pt-6">
          <h3 className="font-accent text-xl text-primary">Role</h3>
          <p className="mt-1 text-sm text-muted">
            The facts a candidate scans first.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <EditorField
              id={titleId}
              label="Title"
              required
              error={errors.title}
            >
              <EditorTextInput
                ref={titleRef}
                id={titleId}
                name="title"
                value={form.title}
                maxLength={120}
                placeholder="e.g. Front Desk Agent"
                invalid={Boolean(errors.title)}
                aria-describedby={describedBy(titleId, {
                  error: Boolean(errors.title),
                })}
                onChange={(event) => setField("title", event.target.value)}
              />
            </EditorField>

            <EditorField
              id={titleArId}
              label="Title (Arabic)"
              error={errors.titleAr}
            >
              <EditorTextInput
                ref={titleArRef}
                id={titleArId}
                name="titleAr"
                dir="rtl"
                lang="ar"
                value={form.titleAr}
                maxLength={120}
                placeholder="العنوان بالعربية"
                invalid={Boolean(errors.titleAr)}
                aria-describedby={describedBy(titleArId, {
                  error: Boolean(errors.titleAr),
                })}
                onChange={(event) => setField("titleAr", event.target.value)}
              />
            </EditorField>

            <ChipField
              label="Category"
              required
              name="category"
              value={form.category}
              options={CATEGORIES}
              error={errors.category}
              placeholder="Type or pick a category"
              helpText="Suggestions appear as you type; you can also enter your own."
              formatLabel="category"
              inputRef={categoryRef}
              onChange={(value) => setField("category", value)}
            />

            <ChipField
              label="Location"
              required
              name="location"
              value={form.location}
              options={LOCATIONS}
              error={errors.location}
              placeholder="Type or pick a location"
              helpText="Suggestions appear as you type; you can also enter a city."
              inputRef={locationRef}
              onChange={(value) => setField("location", value)}
            />

            <EditorField
              id={typeId}
              label="Employment type"
              required
              error={errors.employmentType}
            >
              <EditorSelect
                ref={employmentRef}
                id={typeId}
                name="employmentType"
                value={form.employmentType}
                invalid={Boolean(errors.employmentType)}
                aria-describedby={describedBy(typeId, {
                  error: Boolean(errors.employmentType),
                })}
                onChange={(event) =>
                  setField("employmentType", event.target.value)
                }
              >
                <option value="" disabled>
                  Select type
                </option>
                {EMPLOYMENT_TYPES.map((opt) => (
                  <option key={opt} value={opt}>
                    {formatOptionLabel(opt)}
                  </option>
                ))}
              </EditorSelect>
            </EditorField>

            <EditorField id={salaryId} label="Salary" error={errors.salary}>
              <EditorTextInput
                ref={salaryRef}
                id={salaryId}
                name="salary"
                value={form.salary}
                maxLength={100}
                placeholder="e.g. AED 5,000 - 7,000/month"
                invalid={Boolean(errors.salary)}
                aria-describedby={describedBy(salaryId, {
                  error: Boolean(errors.salary),
                })}
                onChange={(event) => setField("salary", event.target.value)}
              />
            </EditorField>

            <EditorField
              id={companyId}
              label="Company"
              error={errors.companyName}
              className="sm:col-span-2"
            >
              <EditorTextInput
                ref={companyRef}
                id={companyId}
                name="companyName"
                value={form.companyName}
                maxLength={120}
                placeholder="e.g. Marriott International"
                invalid={Boolean(errors.companyName)}
                aria-describedby={describedBy(companyId, {
                  error: Boolean(errors.companyName),
                })}
                onChange={(event) =>
                  setField("companyName", event.target.value)
                }
              />
            </EditorField>

            <EditorField
              id={slugId}
              label="Permalink slug"
              required
              error={errors.slug}
              hint="From the title, plus a short unique id so two openings can share a title."
              className="sm:col-span-2"
            >
              <div className="flex items-center gap-2">
                <EditorTextInput
                  ref={slugRef}
                  id={slugId}
                  name="slug"
                  value={form.slug}
                  maxLength={80}
                  placeholder="auto-generated-from-title"
                  autoComplete="off"
                  spellCheck={false}
                  invalid={Boolean(errors.slug)}
                  aria-describedby={describedBy(slugId, {
                    hint: true,
                    error: Boolean(errors.slug),
                  })}
                  onChange={(event) => {
                    setSlugManual(true);
                    setField("slug", event.target.value);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const nextSuffix = randomSlugSuffix();
                    setSlugSuffix(nextSuffix);
                    setSlugManual(false);
                    setForm((prev) => ({
                      ...prev,
                      slug: slugFromTitle(prev.title, nextSuffix),
                    }));
                    setErrors((prev) => {
                      if (!prev.slug) return prev;
                      const copy = { ...prev };
                      delete copy.slug;
                      return copy;
                    });
                  }}
                  className={`${editorQuietButton} shrink-0`}
                >
                  Regenerate
                </button>
              </div>
            </EditorField>
          </div>
        </section>

        <section data-section="description" className="mt-10 min-w-0 border-t border-secondary pt-6">
          <h3 className="font-accent text-xl text-primary">Description</h3>
          <p className="mt-1 text-sm text-muted">
            Short text for the list. Full text for the page. Arabic is optional.
          </p>
          <div className="mt-5 min-w-0 space-y-5">
            <EditorField
              id={shortId}
              label="Short description"
              error={errors.shortDescription}
              hint={`${form.shortDescription.length} / 300`}
            >
              <EditorTextArea
                ref={shortRef}
                id={shortId}
                name="shortDescription"
                dir="auto"
                value={form.shortDescription}
                maxLength={300}
                rows={4}
                placeholder="Brief summary of the role"
                invalid={Boolean(errors.shortDescription)}
                aria-describedby={describedBy(shortId, {
                  hint: true,
                  error: Boolean(errors.shortDescription),
                })}
                onChange={(event) =>
                  setField("shortDescription", event.target.value)
                }
              />
            </EditorField>

            <EditorField
              id="field-fullDescription"
              label="Full description"
              className="min-w-0"
            >
              <RichTextEditor
                id="field-fullDescription"
                aria-labelledby="field-fullDescription-label"
                aria-label="Full description"
                value={form.fullDescription}
                onChange={(html) => setField("fullDescription", html)}
                placeholder="Responsibilities, requirements, and who should apply"
              />
            </EditorField>

            <EditorField
              id="field-fullDescriptionAr"
              label="Full description (Arabic)"
              className="min-w-0"
            >
              <RichTextEditor
                id="field-fullDescriptionAr"
                aria-labelledby="field-fullDescriptionAr-label"
                aria-label="Full description (Arabic)"
                value={form.fullDescriptionAr}
                onChange={(html) => setField("fullDescriptionAr", html)}
                placeholder="الوصف الكامل بالعربية..."
                dir="rtl"
              />
            </EditorField>
          </div>
        </section>

        <section data-section="contact" className="mt-10 border-t border-secondary pt-6">
          <h3 className="font-accent text-xl text-primary">Apply</h3>
          <p className="mt-1 text-sm text-muted">
            Defaults to Yasmin. Change them only for this role.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <LockedContactField
              label="WhatsApp"
              name="contactWhatsApp"
              value={form.contactWhatsApp}
              custom={whatsAppCustom}
              error={errors.contactWhatsApp}
              placeholder="e.g. 971501234567"
              helpText="Digits only, 7-15."
              inputMode="numeric"
              maxLength={15}
              inputRef={whatsAppRef}
              onToggleCustom={() => {
                if (whatsAppCustom) {
                  setWhatsAppCustom(false);
                  setField("contactWhatsApp", DEFAULTS.whatsApp);
                } else {
                  setWhatsAppCustom(true);
                  setField("contactWhatsApp", "");
                }
              }}
              onChange={(value) => setField("contactWhatsApp", value)}
            />

            <LockedContactField
              label="Email"
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              custom={emailCustom}
              error={errors.contactEmail}
              placeholder="e.g. hr@company.com"
              inputRef={emailRef}
              onToggleCustom={() => {
                if (emailCustom) {
                  setEmailCustom(false);
                  setField("contactEmail", DEFAULTS.email);
                } else {
                  setEmailCustom(true);
                  setField("contactEmail", "");
                }
              }}
              onChange={(value) => setField("contactEmail", value)}
            />

            <EditorField
              id={tallyId}
              label="Tally form ID"
              className="sm:col-span-2"
              hint={
                form.tallyFormId ? (
                  <a
                    href={`https://tally.so/forms/${encodeURIComponent(form.tallyFormId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Open form
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <>
                    Optional. When set, this form is the apply path.{" "}
                    <a
                      href="https://tally.so/forms/create"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      Create a form
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </>
                )
              }
            >
              <EditorTextInput
                id={tallyId}
                name="tallyFormId"
                value={form.tallyFormId}
                placeholder="e.g. wMqROP"
                autoComplete="off"
                spellCheck={false}
                aria-describedby={describedBy(tallyId, { hint: true })}
                onChange={(event) => setField("tallyFormId", event.target.value)}
              />
            </EditorField>
          </div>
        </section>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/15 bg-warm pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 sm:flex-row sm:items-center sm:justify-end">
            {errorCount > 0 ? (
              <p
                id="editor-form-error"
                role="alert"
                className="text-sm text-destructive sm:me-auto"
              >
                Check the highlighted fields before publishing.
              </p>
            ) : null}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => requestLeave()}
                disabled={saving}
                className={`${editorQuietButton} flex-1 sm:flex-none`}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="editor-save-btn"
                disabled={saving}
                aria-describedby={errorCount > 0 ? "editor-form-error" : undefined}
                className={`${editorPrimaryButton} flex-1 sm:flex-none`}
              >
                {saving
                  ? isEdit
                    ? "Saving..."
                    : "Publishing..."
                  : isEdit
                    ? "Save changes"
                    : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <Dialog
        open={discardOpen}
        onOpenChange={(open) => {
          if (!open) dismissDiscard();
        }}
      >
        <DialogContent
          className="rounded-2xl border border-primary/15 bg-warm p-6 shadow-card sm:max-w-md"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="font-accent text-2xl leading-snug text-primary">
              {isEdit ? "Leave without saving?" : "Discard this draft?"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted">
              {isEdit
                ? "Changes to this listing will be lost."
                : "Nothing is published until you save."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="-mx-6 -mb-6 border-primary/15 bg-warm p-6 sm:justify-stretch">
            <button
              type="button"
              onClick={dismissDiscard}
              className={`${editorQuietButton} flex-1`}
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={confirmDiscard}
              className="inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center rounded-full bg-destructive px-4 text-sm font-semibold text-white select-none active:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
            >
              Discard
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
