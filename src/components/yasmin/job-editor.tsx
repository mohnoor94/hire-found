"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import type { Job } from "@/lib/jobs/types";
import {
  CATEGORIES,
  DEFAULTS,
  EMPLOYMENT_TYPES,
  LOCATIONS,
} from "@/lib/jobs/types";
import { generateSlug } from "@/lib/jobs/slug";
import { validateForm, type JobFormData } from "@/lib/jobs/validation";
import { formatOptionLabel } from "@/lib/yasmin/labels";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "./rich-text-editor";
import { cn } from "@/lib/utils";

type JobEditorProps = {
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

const SECTIONS = [
  {
    id: "basic-info",
    title: "Basic Info",
  },
  {
    id: "company-details",
    title: "Company Details",
  },
  {
    id: "description",
    title: "Description",
  },
  {
    id: "contact",
    title: "Contact",
  },
] as const;

export function JobEditor({ job, saving, onSave, onCancel }: JobEditorProps) {
  const isEdit = Boolean(job?.id);
  const [form, setForm] = useState<FormState>(() => jobToForm(job));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugManual, setSlugManual] = useState(() => Boolean(job?.slug));
  const [whatsAppCustom, setWhatsAppCustom] = useState(() =>
    Boolean(job?.contactWhatsApp && job.contactWhatsApp !== DEFAULTS.whatsApp),
  );
  const [emailCustom, setEmailCustom] = useState(() =>
    Boolean(job?.contactEmail && job.contactEmail !== DEFAULTS.email),
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "basic-info": true,
    "company-details": true,
    description: true,
    contact: true,
  });

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugManual) {
        next.slug = generateSlug(String(value));
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data: JobFormData = {
      ...form,
      contactWhatsApp: whatsAppCustom
        ? form.contactWhatsApp
        : DEFAULTS.whatsApp,
      contactEmail: emailCustom ? form.contactEmail : DEFAULTS.email,
    };
    const result = validateForm(data);
    if (!result.valid) {
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0];
      if (first) {
        document.getElementById(`field-${first}`)?.focus();
      }
      return;
    }
    void onSave(data, job?.id ?? null);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-accent mb-1 text-2xl font-bold text-primary">
            {isEdit ? "Edit Job Post" : "Create New Job Post"}
          </h2>
          {isEdit && job?.slug ? (
            <a
              href={`/jobs/?id=${encodeURIComponent(job.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors duration-200 hover:text-primary-light"
            >
              View on site
            </a>
          ) : null}
        </div>
        <p className="text-sm text-[#6B6560]">
          {isEdit
            ? "Update the job listing details below."
            : "Fill in the details to publish a new job listing."}
        </p>
      </div>

      <form id="job-editor-form" noValidate onSubmit={handleSubmit}>
        <EditorSection
          id="basic-info"
          title="Basic Info"
          open={openSections["basic-info"]}
          onToggle={() =>
            setOpenSections((s) => ({ ...s, "basic-info": !s["basic-info"] }))
          }
        >
          <Field error={errors.title}>
            <Label htmlFor="field-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="field-title"
              name="title"
              value={form.title}
              maxLength={120}
              placeholder="e.g. Front Desk Agent"
              onChange={(e) => setField("title", e.target.value)}
              className={fieldClass(errors.title)}
            />
          </Field>

          <Field error={errors.titleAr}>
            <Label htmlFor="field-titleAr">Title (Arabic)</Label>
            <Input
              id="field-titleAr"
              name="titleAr"
              dir="rtl"
              value={form.titleAr}
              maxLength={120}
              placeholder="العنوان بالعربية"
              onChange={(e) => setField("titleAr", e.target.value)}
              className={cn(fieldClass(errors.titleAr), "text-right")}
            />
          </Field>

          <Field error={errors.slug}>
            <Label htmlFor="field-slug">
              Slug <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="field-slug"
                name="slug"
                value={form.slug}
                maxLength={80}
                placeholder="auto-generated-from-title"
                onChange={(e) => {
                  setSlugManual(true);
                  setField("slug", e.target.value);
                }}
                className={cn("flex-1", fieldClass(errors.slug))}
              />
              <button
                type="button"
                title="Regenerate slug from title"
                onClick={() => {
                  setField("slug", generateSlug(form.title));
                  setSlugManual(false);
                }}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20"
              >
                <RefreshIcon />
              </button>
            </div>
            <p className="mt-1 text-xs text-[#6B6560]">
              URL-friendly identifier. Auto-generated from title.
            </p>
          </Field>

          <ChipField
            label="Category"
            required
            name="category"
            value={form.category}
            options={[...CATEGORIES]}
            error={errors.category}
            placeholder="Type or pick a category..."
            helpText="Choose from suggestions or type your own."
            onChange={(v) => setField("category", v)}
          />

          <ChipField
            label="Location"
            required
            name="location"
            value={form.location}
            options={[...LOCATIONS]}
            error={errors.location}
            placeholder="Type a location or pick below..."
            helpText="Choose a country or type a specific city/region."
            onChange={(v) => setField("location", v)}
          />

          <Field error={errors.employmentType}>
            <Label htmlFor="field-employmentType">
              Employment Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="field-employmentType"
              name="employmentType"
              value={form.employmentType}
              onChange={(e) => setField("employmentType", e.target.value)}
              className={cn(
                "w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-text-main transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none",
                errors.employmentType ? "border-red-500" : "border-gray-200",
                "min-h-[44px]",
              )}
            >
              <option value="" disabled>
                Select employment type
              </option>
              {EMPLOYMENT_TYPES.map((opt) => (
                <option key={opt} value={opt}>
                  {formatOptionLabel(opt)}
                </option>
              ))}
            </select>
          </Field>
        </EditorSection>

        <EditorSection
          id="company-details"
          title="Company Details"
          open={openSections["company-details"]}
          onToggle={() =>
            setOpenSections((s) => ({
              ...s,
              "company-details": !s["company-details"],
            }))
          }
        >
          <Field error={errors.companyName}>
            <Label htmlFor="field-companyName">Company Name</Label>
            <Input
              id="field-companyName"
              value={form.companyName}
              maxLength={120}
              placeholder="e.g. Marriott International"
              onChange={(e) => setField("companyName", e.target.value)}
              className={fieldClass(errors.companyName)}
            />
          </Field>
          <Field error={errors.salary}>
            <Label htmlFor="field-salary">Salary</Label>
            <Input
              id="field-salary"
              value={form.salary}
              maxLength={100}
              placeholder="e.g. AED 5,000 - 7,000/month"
              onChange={(e) => setField("salary", e.target.value)}
              className={fieldClass(errors.salary)}
            />
          </Field>
        </EditorSection>

        <EditorSection
          id="description"
          title="Description"
          open={openSections.description}
          onToggle={() =>
            setOpenSections((s) => ({
              ...s,
              description: !s.description,
            }))
          }
        >
          <Field error={errors.shortDescription}>
            <Label htmlFor="field-shortDescription">Short Description</Label>
            <Textarea
              id="field-shortDescription"
              value={form.shortDescription}
              maxLength={300}
              rows={6}
              placeholder="Brief summary of the role (max 300 characters)"
              onChange={(e) => setField("shortDescription", e.target.value)}
              className={cn("min-h-[144px] resize-y", fieldClass(errors.shortDescription))}
            />
            <p className="mt-1 text-xs text-[#6B6560]">300 characters max</p>
          </Field>

          <div className="field-group space-y-1.5">
            <Label>Full Description</Label>
            <RichTextEditor
              id="field-fullDescription"
              aria-label="Full Description"
              value={form.fullDescription}
              onChange={(html) => setField("fullDescription", html)}
              placeholder="Detailed job description, responsibilities, requirements..."
            />
          </div>

          <div className="field-group space-y-1.5">
            <Label>Full Description (Arabic)</Label>
            <RichTextEditor
              id="field-fullDescriptionAr"
              aria-label="Full Description (Arabic)"
              value={form.fullDescriptionAr}
              onChange={(html) => setField("fullDescriptionAr", html)}
              placeholder="الوصف الكامل بالعربية..."
              dir="rtl"
            />
          </div>
        </EditorSection>

        <EditorSection
          id="contact"
          title="Contact"
          open={openSections.contact}
          onToggle={() =>
            setOpenSections((s) => ({ ...s, contact: !s.contact }))
          }
        >
          <LockedContactField
            label="WhatsApp Number"
            name="contactWhatsApp"
            value={form.contactWhatsApp}
            defaultValue={DEFAULTS.whatsApp}
            custom={whatsAppCustom}
            error={errors.contactWhatsApp}
            placeholder="e.g. 971501234567"
            helpText="Digits only, 7–15 characters."
            onToggleCustom={() => {
              if (whatsAppCustom) {
                setWhatsAppCustom(false);
                setField("contactWhatsApp", DEFAULTS.whatsApp);
              } else {
                setWhatsAppCustom(true);
                setField("contactWhatsApp", "");
              }
            }}
            onChange={(v) => setField("contactWhatsApp", v)}
          />

          <LockedContactField
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={form.contactEmail}
            defaultValue={DEFAULTS.email}
            custom={emailCustom}
            error={errors.contactEmail}
            placeholder="e.g. hr@company.com"
            onToggleCustom={() => {
              if (emailCustom) {
                setEmailCustom(false);
                setField("contactEmail", DEFAULTS.email);
              } else {
                setEmailCustom(true);
                setField("contactEmail", "");
              }
            }}
            onChange={(v) => setField("contactEmail", v)}
          />

          <Field>
            <Label htmlFor="field-tallyFormId">Tally Form ID</Label>
            <Input
              id="field-tallyFormId"
              value={form.tallyFormId}
              placeholder="e.g. wMqROP"
              onChange={(e) => setField("tallyFormId", e.target.value)}
              className={fieldClass()}
            />
            <p className="mt-1 text-xs text-[#6B6560]">
              {form.tallyFormId ? (
                <a
                  href={`https://tally.so/forms/${form.tallyFormId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#7C3AED] hover:underline"
                >
                  View/edit form →
                </a>
              ) : (
                <>
                  Optional.{" "}
                  <a
                    href="https://tally.so/forms/create"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#7C3AED] hover:underline"
                  >
                    Create a new form →
                  </a>
                </>
              )}
            </p>
          </Field>
        </EditorSection>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="submit"
            id="editor-save-btn"
            disabled={saving}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-warm transition-all duration-300 hover:bg-primary-light disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Job"
                : "Create Job"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary/10 px-8 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/20"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Keep SECTIONS referenced for parity checklist readability */}
      <span className="sr-only">{SECTIONS.map((s) => s.title).join(", ")}</span>
    </div>
  );
}

function fieldClass(error?: string) {
  return cn(
    "min-h-[44px] rounded-xl border bg-white text-sm text-text-main transition-all duration-200 focus-visible:border-primary focus-visible:ring-primary/30",
    error ? "border-red-500" : "border-gray-200",
  );
}

function Field({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="field-group space-y-1.5">
      {children}
      {error ? (
        <p className="text-xs text-red-500" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function EditorSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      className="mb-6 overflow-hidden rounded-2xl border border-gray-200"
      data-section={id}
    >
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex min-h-[44px] w-full items-center justify-between bg-warm-dark/50 px-6 py-4 transition-colors duration-200 hover:bg-warm-dark"
        aria-expanded={open}
        aria-controls={`section-content-${id}`}
        onClick={onToggle}
      >
        <span className="text-sm font-semibold text-text-main">{title}</span>
        <svg
          className={cn(
            "h-5 w-5 text-[#6B6560] transition-transform duration-300",
            !open && "-rotate-90",
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={`section-content-${id}`}
          className="space-y-5 px-6 py-5"
        >
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function ChipField({
  label,
  required,
  name,
  value,
  options,
  error,
  placeholder,
  helpText,
  onChange,
}: {
  label: string;
  required?: boolean;
  name: string;
  value: string;
  options: string[];
  error?: string;
  placeholder?: string;
  helpText?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field error={error}>
      <Label htmlFor={`field-${name}`}>
        {label}
        {required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </Label>
      <Input
        id={`field-${name}`}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        className={cn("mb-2", fieldClass(error))}
      />
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = opt.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150",
                selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-text-main hover:border-primary hover:bg-primary/10 hover:text-primary",
              )}
            >
              {formatOptionLabel(opt)}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            onChange("");
            document.getElementById(`field-${name}`)?.focus();
          }}
          className="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[#6B6560] transition-all duration-150 hover:border-primary hover:text-primary"
        >
          ✏️ Custom...
        </button>
      </div>
      {helpText ? (
        <p className="mt-2 text-xs text-[#6B6560]">{helpText}</p>
      ) : null}
    </Field>
  );
}

function LockedContactField({
  label,
  name,
  value,
  custom,
  error,
  placeholder,
  helpText,
  type = "text",
  onToggleCustom,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  defaultValue: string;
  custom: boolean;
  error?: string;
  placeholder?: string;
  helpText?: string;
  type?: string;
  onToggleCustom: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <Field error={error}>
      <div className="mb-1.5 flex items-center justify-between">
        <Label htmlFor={`field-${name}`}>{label}</Label>
        <button
          type="button"
          onClick={onToggleCustom}
          className="text-xs font-medium text-primary transition-colors duration-200 hover:text-primary-light"
        >
          {custom ? "Reset to default" : "Use custom"}
        </button>
      </div>
      <Input
        id={`field-${name}`}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={!custom}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          fieldClass(error),
          !custom && "cursor-not-allowed bg-gray-50 text-[#6B6560]",
        )}
      />
      {!custom ? (
        <p className="mt-1 text-xs text-[#6B6560]">
          Using Yasmin&apos;s default. Click &quot;Use custom&quot; to override.
        </p>
      ) : helpText ? (
        <p className="mt-1 text-xs text-[#6B6560]">{helpText}</p>
      ) : null}
    </Field>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
