/**
 * Form validation — from yasmin/js/editor.js validateForm.
 */
import { EMPLOYMENT_TYPES, SLUG_PATTERN } from "./types";

type FieldRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  enum?: readonly string[];
};

const VALIDATION_RULES: Record<string, FieldRules> = {
  title: { required: true, minLength: 1, maxLength: 120 },
  titleAr: { required: false, maxLength: 120 },
  slug: { required: true, pattern: SLUG_PATTERN, maxLength: 80 },
  category: { required: true, minLength: 1, maxLength: 50 },
  location: { required: true, minLength: 1, maxLength: 100 },
  employmentType: { required: true, enum: EMPLOYMENT_TYPES },
  shortDescription: { required: false, maxLength: 300 },
  companyName: { required: false, maxLength: 120 },
  salary: { required: false, maxLength: 100 },
  contactWhatsApp: { required: false, pattern: /^\d{7,15}$/ },
  contactEmail: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export type JobFormData = Record<string, string | undefined | null>;

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

function formatFieldLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function getPatternErrorMessage(field: string): string {
  switch (field) {
    case "slug":
      return "Slug must contain only lowercase letters, numbers, and hyphens (e.g. my-job-post)";
    case "contactWhatsApp":
      return "WhatsApp number must contain only digits (7–15 characters)";
    case "contactEmail":
      return "Please enter a valid email address";
    default:
      return `${formatFieldLabel(field)} format is invalid`;
  }
}

/** Validates job form fields. Returns { valid, errors }. */
export function validateForm(formData: JobFormData): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(VALIDATION_RULES)) {
    const value = formData[field] ?? "";
    const trimmed =
      typeof value === "string" ? value.trim() : String(value).trim();

    if (rules.required && trimmed.length === 0) {
      errors[field] = `${formatFieldLabel(field)} is required`;
      continue;
    }

    if (!rules.required && trimmed.length === 0) {
      continue;
    }

    if (rules.enum && !rules.enum.includes(trimmed)) {
      errors[field] =
        `${formatFieldLabel(field)} must be one of: ${rules.enum.join(", ")}`;
      continue;
    }

    if (
      rules.minLength !== undefined &&
      trimmed.length < rules.minLength
    ) {
      errors[field] =
        `${formatFieldLabel(field)} must be at least ${rules.minLength} character(s)`;
      continue;
    }

    if (
      rules.maxLength !== undefined &&
      trimmed.length > rules.maxLength
    ) {
      errors[field] =
        `${formatFieldLabel(field)} must be at most ${rules.maxLength} characters`;
      continue;
    }

    if (rules.pattern && !rules.pattern.test(trimmed)) {
      errors[field] = getPatternErrorMessage(field);
      continue;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
