/**
 * Editor Module
 * Handles the create/edit form with collapsible sections and field rendering.
 * Validation logic and slug generation are implemented in separate tasks.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['hospitality', 'tech', 'fnb', 'aviation', 'other'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance'];

const SECTIONS = [
  {
    id: 'basic-info',
    title: 'Basic Info',
    fields: ['title', 'titleAr', 'slug', 'category', 'location', 'employmentType'],
  },
  {
    id: 'company-details',
    title: 'Company Details',
    fields: ['companyName', 'salary'],
  },
  {
    id: 'description',
    title: 'Description',
    fields: ['shortDescription', 'fullDescription', 'fullDescriptionAr'],
  },
  {
    id: 'contact',
    title: 'Contact',
    fields: ['contactWhatsApp', 'contactEmail', 'tallyFormId'],
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Opens the editor in create mode with empty fields.
 * @param {HTMLElement} container - The editor container element
 * @param {Object} callbacks
 * @param {Function} callbacks.onSave - Called with form data on successful validation
 * @param {Function} callbacks.onCancel - Called when cancel is clicked
 */
export function openCreateEditor(container, callbacks) {
  renderEditor(container, {}, null, callbacks);
}

/**
 * Opens the editor in edit mode with pre-populated fields.
 * @param {HTMLElement} container - The editor container element
 * @param {Object} jobData - Existing job document data
 * @param {string} jobId - Firestore document ID
 * @param {Object} callbacks
 * @param {Function} callbacks.onSave - Called with updated form data
 * @param {Function} callbacks.onCancel - Called when cancel is clicked
 */
export function openEditEditor(container, jobData, jobId, callbacks) {
  renderEditor(container, jobData, jobId, callbacks);
}

/**
 * Generates a URL-safe slug from a title string.
 * @param {string} title - The title to slugify
 * @returns {string} The generated slug (max 80 chars)
 */
export function generateSlug(title) {
  if (!title || typeof title !== 'string') return '';

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and non-alphanumeric with hyphens
    .replace(/-{2,}/g, '-')        // Collapse consecutive hyphens
    .replace(/^-+|-+$/g, '')       // Strip leading and trailing hyphens
    .slice(0, 80);                 // Truncate to 80 characters
}

/**
 * Appends a numeric suffix to make a slug unique among existing slugs.
 * @param {string} baseSlug - The base slug to deduplicate
 * @param {string[]} existingSlugs - Array of slugs already in use
 * @returns {string} A unique slug (baseSlug if not taken, or baseSlug-N)
 */
export function deduplicateSlug(baseSlug, existingSlugs) {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;

  let suffix = 2;
  while (existingSlugs.includes(`${baseSlug}-${suffix}`)) {
    suffix++;
  }
  return `${baseSlug}-${suffix}`;
}

// ─── Validation Rules ────────────────────────────────────────────────────────

const VALIDATION_RULES = {
  title:            { required: true, minLength: 1, maxLength: 120 },
  titleAr:          { required: false, maxLength: 120 },
  slug:             { required: true, pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, maxLength: 80 },
  category:         { required: true, enum: CATEGORIES },
  location:         { required: true, minLength: 1, maxLength: 100 },
  employmentType:   { required: true, enum: EMPLOYMENT_TYPES },
  shortDescription: { required: false, maxLength: 300 },
  companyName:      { required: false, maxLength: 120 },
  salary:           { required: false, maxLength: 100 },
  contactWhatsApp:  { required: false, pattern: /^\d{7,15}$/ },
  contactEmail:     { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
};

/**
 * Validates all form fields and returns validation result.
 * @param {Object} formData - The form field values
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateForm(formData) {
  const errors = {};

  for (const [field, rules] of Object.entries(VALIDATION_RULES)) {
    const value = formData[field] ?? '';
    const trimmed = typeof value === 'string' ? value.trim() : String(value).trim();

    // Required field check
    if (rules.required && trimmed.length === 0) {
      errors[field] = `${formatFieldLabel(field)} is required`;
      continue;
    }

    // Skip further validation if optional and empty
    if (!rules.required && trimmed.length === 0) {
      continue;
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(trimmed)) {
      errors[field] = `${formatFieldLabel(field)} must be one of: ${rules.enum.join(', ')}`;
      continue;
    }

    // Min length validation
    if (rules.minLength !== undefined && trimmed.length < rules.minLength) {
      errors[field] = `${formatFieldLabel(field)} must be at least ${rules.minLength} character(s)`;
      continue;
    }

    // Max length validation
    if (rules.maxLength !== undefined && trimmed.length > rules.maxLength) {
      errors[field] = `${formatFieldLabel(field)} must be at most ${rules.maxLength} characters`;
      continue;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(trimmed)) {
      errors[field] = getPatternErrorMessage(field);
      continue;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Returns a human-readable error message for pattern validation failures.
 * @param {string} field
 * @returns {string}
 */
function getPatternErrorMessage(field) {
  switch (field) {
    case 'slug':
      return 'Slug must contain only lowercase letters, numbers, and hyphens (e.g. my-job-post)';
    case 'contactWhatsApp':
      return 'WhatsApp number must contain only digits (7–15 characters)';
    case 'contactEmail':
      return 'Please enter a valid email address';
    default:
      return `${formatFieldLabel(field)} format is invalid`;
  }
}

/**
 * Converts a camelCase field name to a human-readable label.
 * @param {string} field
 * @returns {string}
 */
function formatFieldLabel(field) {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

// ─── Internal Rendering ──────────────────────────────────────────────────────

/**
 * Renders the full editor form inside the container.
 * @param {HTMLElement} container
 * @param {Object} jobData - Pre-existing data (empty for create mode)
 * @param {string|null} jobId - Document ID (null for create mode)
 * @param {Object} callbacks
 */
function renderEditor(container, jobData, jobId, callbacks) {
  const isEdit = jobId !== null;
  const heading = isEdit ? 'Edit Job Post' : 'Create New Job Post';

  container.innerHTML = `
    <div class="mb-8">
      <h2 class="font-accent text-2xl font-bold text-primary mb-1">${heading}</h2>
      <p class="text-muted text-sm">${isEdit ? 'Update the job listing details below.' : 'Fill in the details to publish a new job listing.'}</p>
    </div>
    <form id="job-editor-form" novalidate>
      ${SECTIONS.map((section) => renderSection(section, jobData)).join('')}
      <div class="flex items-center gap-4 mt-8">
        <button
          type="submit"
          id="editor-save-btn"
          class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-8 py-3 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-light transition-all duration-300 shadow-warm"
        >
          ${isEdit ? 'Update Job' : 'Create Job'}
        </button>
        <button
          type="button"
          id="editor-cancel-btn"
          class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-8 py-3 text-sm font-semibold text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </form>
  `;

  // Wire up cancel button
  const cancelBtn = container.querySelector('#editor-cancel-btn');
  if (cancelBtn && callbacks?.onCancel) {
    cancelBtn.addEventListener('click', () => callbacks.onCancel());
  }

  // Wire up form submit (save) — block submission when invalid
  const form = container.querySelector('#job-editor-form');
  if (form && callbacks?.onSave) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = collectFormData(form);
      const { valid, errors } = validateForm(formData);

      // Clear all previous errors
      clearAllFieldErrors(form);

      if (!valid) {
        // Show all validation errors inline
        for (const [field, message] of Object.entries(errors)) {
          showFieldError(form, field, message);
        }
        // Focus the first invalid field
        const firstErrorField = Object.keys(errors)[0];
        const firstInput = form.querySelector(`[name="${firstErrorField}"]`);
        if (firstInput) firstInput.focus();
        return;
      }

      callbacks.onSave(formData, jobId);
    });
  }

  // Wire up inline validation on blur for required fields
  setupBlurValidation(form);

  // Wire up slug auto-generation from title
  setupSlugAutoGeneration(container);

  // Wire up collapsible section toggles
  setupCollapsibleSections(container);
}

/**
 * Renders a collapsible section with its fields.
 * @param {Object} section
 * @param {Object} jobData
 * @returns {string} HTML string
 */
function renderSection(section, jobData) {
  const fieldsHtml = section.fields.map((field) => renderField(field, jobData)).join('');

  return `
    <fieldset class="mb-6 border border-gray-200 rounded-2xl overflow-hidden" data-section="${section.id}">
      <legend class="sr-only">${section.title}</legend>
      <button
        type="button"
        class="section-toggle w-full flex items-center justify-between px-6 py-4 bg-warm-dark/50 hover:bg-warm-dark transition-colors duration-200 min-h-[44px]"
        aria-expanded="true"
        aria-controls="section-content-${section.id}"
      >
        <span class="font-semibold text-text-main text-sm">${section.title}</span>
        <svg class="section-chevron w-5 h-5 text-muted transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="section-content-${section.id}" class="section-content px-6 py-5 space-y-5">
        ${fieldsHtml}
      </div>
    </fieldset>
  `;
}

/**
 * Renders a single form field based on its name.
 * @param {string} fieldName
 * @param {Object} jobData
 * @returns {string} HTML string
 */
function renderField(fieldName, jobData) {
  const value = jobData[fieldName] ?? '';

  switch (fieldName) {
    case 'title':
      return textInput({
        name: 'title',
        label: 'Title',
        value,
        required: true,
        maxLength: 120,
        placeholder: 'e.g. Front Desk Agent',
      });

    case 'titleAr':
      return textInput({
        name: 'titleAr',
        label: 'Title (Arabic)',
        value,
        maxLength: 120,
        placeholder: 'العنوان بالعربية',
        dir: 'rtl',
      });

    case 'slug':
      return textInput({
        name: 'slug',
        label: 'Slug',
        value,
        required: true,
        maxLength: 80,
        placeholder: 'auto-generated-from-title',
        helpText: 'URL-friendly identifier. Auto-generated from title.',
      });

    case 'category':
      return selectInput({
        name: 'category',
        label: 'Category',
        value,
        required: true,
        options: CATEGORIES,
        placeholder: 'Select a category',
      });

    case 'location':
      return textInput({
        name: 'location',
        label: 'Location',
        value,
        required: true,
        maxLength: 100,
        placeholder: 'e.g. Dubai, UAE',
      });

    case 'employmentType':
      return selectInput({
        name: 'employmentType',
        label: 'Employment Type',
        value,
        required: true,
        options: EMPLOYMENT_TYPES,
        placeholder: 'Select employment type',
      });

    case 'companyName':
      return textInput({
        name: 'companyName',
        label: 'Company Name',
        value,
        maxLength: 120,
        placeholder: 'e.g. Marriott International',
      });

    case 'salary':
      return textInput({
        name: 'salary',
        label: 'Salary',
        value,
        maxLength: 100,
        placeholder: 'e.g. AED 5,000 - 7,000/month',
      });

    case 'shortDescription':
      return textareaInput({
        name: 'shortDescription',
        label: 'Short Description',
        value,
        maxLength: 300,
        rows: 6,
        placeholder: 'Brief summary of the role (max 300 characters)',
      });

    case 'fullDescription':
      return textareaInput({
        name: 'fullDescription',
        label: 'Full Description',
        value,
        rows: 12,
        placeholder: 'Detailed job description, responsibilities, requirements...',
      });

    case 'fullDescriptionAr':
      return textareaInput({
        name: 'fullDescriptionAr',
        label: 'Full Description (Arabic)',
        value,
        rows: 12,
        placeholder: 'الوصف الكامل بالعربية...',
        dir: 'rtl',
      });

    case 'contactWhatsApp':
      return textInput({
        name: 'contactWhatsApp',
        label: 'WhatsApp Number',
        value,
        placeholder: 'e.g. 971501234567',
        helpText: 'Digits only, 7–15 characters.',
      });

    case 'contactEmail':
      return textInput({
        name: 'contactEmail',
        label: 'Contact Email',
        value,
        placeholder: 'e.g. hr@company.com',
        type: 'email',
      });

    case 'tallyFormId':
      return textInput({
        name: 'tallyFormId',
        label: 'Tally Form ID',
        value,
        placeholder: 'e.g. wMqROP',
        helpText: 'Optional Tally form for applications.',
      });

    default:
      return '';
  }
}

// ─── Field Renderers ─────────────────────────────────────────────────────────

/**
 * Renders a text input field.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function textInput({ name, label, value = '', required = false, maxLength, placeholder = '', helpText = '', type = 'text', dir = '' }) {
  const requiredMark = required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
  const dirAttr = dir ? `dir="${dir}"` : '';
  const textAlignClass = dir === 'rtl' ? 'text-right' : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';

  return `
    <div class="field-group">
      <label for="field-${name}" class="block text-sm font-medium text-text-main mb-1.5">
        ${label}${requiredMark}
      </label>
      <input
        type="${type}"
        id="field-${name}"
        name="${name}"
        value="${escapeHtml(String(value))}"
        placeholder="${placeholder}"
        ${dirAttr}
        ${maxLengthAttr}
        ${required ? 'required' : ''}
        class="w-full px-4 py-3 min-h-[44px] text-sm text-text-main bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${textAlignClass}"
      >
      ${helpText ? `<p class="text-xs text-muted mt-1">${helpText}</p>` : ''}
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

/**
 * Renders a select dropdown field.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function selectInput({ name, label, value = '', required = false, options = [], placeholder = '' }) {
  const requiredMark = required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
  const optionsHtml = options
    .map((opt) => `<option value="${opt}" ${opt === value ? 'selected' : ''}>${formatOptionLabel(opt)}</option>`)
    .join('');

  return `
    <div class="field-group">
      <label for="field-${name}" class="block text-sm font-medium text-text-main mb-1.5">
        ${label}${requiredMark}
      </label>
      <select
        id="field-${name}"
        name="${name}"
        ${required ? 'required' : ''}
        class="w-full px-4 py-3 min-h-[44px] text-sm text-text-main bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 appearance-none"
      >
        <option value="" ${!value ? 'selected' : ''} disabled>${placeholder}</option>
        ${optionsHtml}
      </select>
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

/**
 * Renders a textarea field.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function textareaInput({ name, label, value = '', maxLength, rows = 6, placeholder = '', dir = '' }) {
  const dirAttr = dir ? `dir="${dir}"` : '';
  const textAlignClass = dir === 'rtl' ? 'text-right' : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';
  const minHeight = rows === 12 ? 'min-h-[288px]' : 'min-h-[144px]';

  return `
    <div class="field-group">
      <label for="field-${name}" class="block text-sm font-medium text-text-main mb-1.5">
        ${label}
      </label>
      <textarea
        id="field-${name}"
        name="${name}"
        rows="${rows}"
        placeholder="${placeholder}"
        ${dirAttr}
        ${maxLengthAttr}
        class="w-full px-4 py-3 text-sm text-text-main bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 resize-y ${minHeight} ${textAlignClass}"
      >${escapeHtml(String(value))}</textarea>
      ${maxLength ? `<p class="text-xs text-muted mt-1">${maxLength} characters max</p>` : ''}
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sets up auto-generation of slug from title input.
 * Stops auto-generating if the user manually edits the slug field.
 * @param {HTMLElement} container
 */
function setupSlugAutoGeneration(container) {
  const titleField = container.querySelector('#field-title');
  const slugField = container.querySelector('#field-slug');

  if (!titleField || !slugField) return;

  let slugManuallyEdited = false;

  // If slug already has a value (edit mode), consider it manually set
  if (slugField.value.trim() !== '') {
    slugManuallyEdited = true;
  }

  // Track manual edits to the slug field
  slugField.addEventListener('input', () => {
    slugManuallyEdited = true;
  });

  // Auto-generate slug from title when slug hasn't been manually edited
  titleField.addEventListener('input', () => {
    if (!slugManuallyEdited) {
      slugField.value = generateSlug(titleField.value);
    }
  });
}

/**
 * Sets up collapsible section toggle behavior.
 * All sections start expanded.
 * @param {HTMLElement} container
 */
function setupCollapsibleSections(container) {
  const toggles = container.querySelectorAll('.section-toggle');

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      const contentId = toggle.getAttribute('aria-controls');
      const content = container.querySelector(`#${contentId}`);
      const chevron = toggle.querySelector('.section-chevron');

      if (expanded) {
        // Collapse
        toggle.setAttribute('aria-expanded', 'false');
        if (content) content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(-90deg)';
      } else {
        // Expand
        toggle.setAttribute('aria-expanded', 'true');
        if (content) content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });
  });
}

/**
 * Collects all form field values into an object.
 * @param {HTMLFormElement} form
 * @returns {Object}
 */
function collectFormData(form) {
  const formData = new FormData(form);
  const data = {};

  for (const [key, val] of formData.entries()) {
    data[key] = val.trim();
  }

  return data;
}

/**
 * Formats an option value into a display label.
 * @param {string} value
 * @returns {string}
 */
function formatOptionLabel(value) {
  // Capitalize first letter of each word, keep hyphens as spaces
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Inline Validation Helpers ───────────────────────────────────────────────

/** Fields that trigger inline validation on blur */
const BLUR_VALIDATED_FIELDS = ['title', 'category', 'location', 'employmentType', 'contactEmail'];

/**
 * Sets up blur validation on required fields and contactEmail.
 * Shows inline error when a required field is left empty or contactEmail is invalid.
 * @param {HTMLFormElement} form
 */
function setupBlurValidation(form) {
  if (!form) return;

  BLUR_VALIDATED_FIELDS.forEach((fieldName) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    input.addEventListener('blur', () => {
      const value = input.value.trim();
      const rules = VALIDATION_RULES[fieldName];
      if (!rules) return;

      // Clear previous error for this field
      clearFieldError(form, fieldName);

      // Required field left empty
      if (rules.required && value.length === 0) {
        showFieldError(form, fieldName, `${formatFieldLabel(fieldName)} is required`);
        return;
      }

      // Pattern validation (e.g. contactEmail) when value is present
      if (rules.pattern && value.length > 0 && !rules.pattern.test(value)) {
        showFieldError(form, fieldName, getPatternErrorMessage(fieldName));
        return;
      }

      // Enum validation
      if (rules.enum && value.length > 0 && !rules.enum.includes(value)) {
        showFieldError(form, fieldName, `${formatFieldLabel(fieldName)} must be one of: ${rules.enum.join(', ')}`);
      }
    });
  });
}

/**
 * Shows an inline validation error message beneath a field.
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 * @param {string} message
 */
function showFieldError(form, fieldName, message) {
  const input = form.querySelector(`[name="${fieldName}"]`);
  if (!input) return;

  const fieldGroup = input.closest('.field-group');
  if (!fieldGroup) return;

  const errorEl = fieldGroup.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  // Add error styling to the input
  input.classList.add('border-red-500');
  input.classList.remove('border-gray-200');
}

/**
 * Clears the inline validation error for a specific field.
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 */
function clearFieldError(form, fieldName) {
  const input = form.querySelector(`[name="${fieldName}"]`);
  if (!input) return;

  const fieldGroup = input.closest('.field-group');
  if (!fieldGroup) return;

  const errorEl = fieldGroup.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  // Remove error styling
  input.classList.remove('border-red-500');
  input.classList.add('border-gray-200');
}

/**
 * Clears all inline validation errors in the form.
 * @param {HTMLFormElement} form
 */
function clearAllFieldErrors(form) {
  if (!form) return;

  const errorEls = form.querySelectorAll('.field-error');
  errorEls.forEach((el) => {
    el.textContent = '';
    el.classList.add('hidden');
  });

  const inputs = form.querySelectorAll('.border-red-500');
  inputs.forEach((input) => {
    input.classList.remove('border-red-500');
    input.classList.add('border-gray-200');
  });
}
