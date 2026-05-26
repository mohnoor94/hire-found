/**
 * Editor Module
 * Handles the create/edit form with collapsible sections and field rendering.
 * Validation logic and slug generation are implemented in separate tasks.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

// Default contact details (Yasmin's)
const DEFAULT_CONTACT = {
  contactWhatsApp: '962793001043',
  contactEmail: 'yasmin@hirefound.com',
};

const CATEGORIES = [
  'hospitality',
  'tech',
  'fnb',
  'aviation',
  'retail',
  'healthcare',
  'education',
  'finance',
  'marketing',
  'engineering',
  'design',
  'customer-service',
  'logistics',
  'real-estate',
  'media',
];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance'];

const LOCATIONS = [
  'Jordan',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Egypt',
  'Remote',
];

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
  category:         { required: true, minLength: 1, maxLength: 50 },
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
  const viewLink = isEdit && jobData.slug
    ? `<a href="/jobs/?id=${escapeHtml(jobData.slug)}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-light transition-colors duration-200">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
        View on site
      </a>`
    : '';

  container.innerHTML = `
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h2 class="font-accent text-2xl font-bold text-primary mb-1">${heading}</h2>
        ${viewLink}
      </div>
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

  // Wire up contact field override buttons
  setupContactOverrides(container);

  // Wire up category chip selection
  setupCategoryChips(container);

  // Initialize Quill WYSIWYG editors
  setupQuillEditors(container);
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
      return slugInput({
        name: 'slug',
        label: 'Slug',
        value,
        required: true,
        maxLength: 80,
        placeholder: 'auto-generated-from-title',
        helpText: 'URL-friendly identifier. Auto-generated from title.',
      });

    case 'category':
      return datalistInput({
        name: 'category',
        label: 'Category',
        value,
        required: true,
        options: CATEGORIES,
        placeholder: 'Type or pick a category...',
        helpText: 'Choose from suggestions or type your own.',
      });

    case 'location':
      return datalistInput({
        name: 'location',
        label: 'Location',
        value,
        required: true,
        options: LOCATIONS,
        placeholder: 'Type a location or pick below...',
        helpText: 'Choose a country or type a specific city/region.',
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
      return quillEditorHtml({
        name: 'fullDescription',
        label: 'Full Description',
        value,
        placeholder: 'Detailed job description, responsibilities, requirements...',
      });

    case 'fullDescriptionAr':
      return quillEditorHtml({
        name: 'fullDescriptionAr',
        label: 'Full Description (Arabic)',
        value,
        placeholder: 'الوصف الكامل بالعربية...',
        dir: 'rtl',
      });

    case 'contactWhatsApp':
      return lockedContactInput({
        name: 'contactWhatsApp',
        label: 'WhatsApp Number',
        value,
        defaultValue: DEFAULT_CONTACT.contactWhatsApp,
        placeholder: 'e.g. 971501234567',
        helpText: 'Digits only, 7–15 characters.',
      });

    case 'contactEmail':
      return lockedContactInput({
        name: 'contactEmail',
        label: 'Contact Email',
        value,
        defaultValue: DEFAULT_CONTACT.contactEmail,
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
 * Renders the slug field with a regenerate button.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function slugInput({ name, label, value = '', required = false, maxLength, placeholder = '', helpText = '' }) {
  const requiredMark = required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';

  return `
    <div class="field-group">
      <label for="field-${name}" class="block text-sm font-medium text-text-main mb-1.5">
        ${label}${requiredMark}
      </label>
      <div class="flex items-center gap-2">
        <input
          type="text"
          id="field-${name}"
          name="${name}"
          value="${escapeHtml(String(value))}"
          placeholder="${placeholder}"
          ${maxLengthAttr}
          ${required ? 'required' : ''}
          class="flex-1 px-4 py-3 min-h-[44px] text-sm text-text-main bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
        >
        <button
          type="button"
          id="slug-regenerate-btn"
          title="Regenerate slug from title"
          class="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 text-xs font-medium text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
      </div>
      ${helpText ? `<p class="text-xs text-muted mt-1">${helpText}</p>` : ''}
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

/**
 * Renders a text input with clickable chip suggestions below.
 * Allows free-text entry while showing predefined options as selectable chips.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function datalistInput({ name, label, value = '', required = false, options = [], placeholder = '', helpText = '' }) {
  const requiredMark = required ? '<span class="text-red-500 ml-0.5">*</span>' : '';
  const chipsHtml = options
    .map((opt) => {
      const isSelected = opt.toLowerCase() === (value || '').toLowerCase();
      const selectedClass = isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-text-main';
      return `<button type="button" class="chip-option px-3 py-1.5 text-xs font-medium rounded-full border ${selectedClass} hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-150 whitespace-nowrap" data-value="${escapeHtml(opt)}" data-field="${name}">${formatOptionLabel(opt)}</button>`;
    })
    .join('');

  // "Custom..." chip — clears field and focuses it
  const customChip = `<button type="button" class="chip-custom px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-gray-300 text-muted hover:border-primary hover:text-primary transition-all duration-150 whitespace-nowrap" data-field="${name}">✏️ Custom...</button>`;

  return `
    <div class="field-group">
      <label for="field-${name}" class="block text-sm font-medium text-text-main mb-1.5">
        ${label}${requiredMark}
      </label>
      <input
        type="text"
        id="field-${name}"
        name="${name}"
        value="${escapeHtml(String(value))}"
        placeholder="${placeholder}"
        ${required ? 'required' : ''}
        autocomplete="off"
        class="w-full px-4 py-3 min-h-[44px] text-sm text-text-main bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 mb-2"
      >
      <div class="flex flex-wrap gap-1.5" data-chips-for="${name}">
        ${chipsHtml}
        ${customChip}
      </div>
      ${helpText ? `<p class="text-xs text-muted mt-2">${helpText}</p>` : ''}
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

/**
 * Renders a contact field that's pre-filled and disabled by default (Yasmin's details).
 * Includes an "Override" button to unlock the field for custom values.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function lockedContactInput({ name, label, value = '', defaultValue = '', placeholder = '', helpText = '', type = 'text' }) {
  // Use the existing value if it differs from default (custom override), otherwise use default
  const displayValue = value || defaultValue;
  const isCustom = value && value !== defaultValue;
  const disabledAttr = isCustom ? '' : 'disabled';
  const disabledClass = isCustom ? '' : 'bg-gray-50 text-muted cursor-not-allowed';
  const btnLabel = isCustom ? 'Reset to default' : 'Use custom';

  return `
    <div class="field-group" data-locked-field="${name}">
      <div class="flex items-center justify-between mb-1.5">
        <label for="field-${name}" class="block text-sm font-medium text-text-main">
          ${label}
        </label>
        <button
          type="button"
          class="contact-override-btn text-xs font-medium text-primary hover:text-primary-light transition-colors duration-200"
          data-field="${name}"
          data-default="${escapeHtml(defaultValue)}"
        >
          ${btnLabel}
        </button>
      </div>
      <input
        type="${type}"
        id="field-${name}"
        name="${name}"
        value="${escapeHtml(String(displayValue))}"
        placeholder="${placeholder}"
        ${disabledAttr}
        class="w-full px-4 py-3 min-h-[44px] text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 ${disabledClass}"
      >
      ${!isCustom ? `<p class="text-xs text-muted mt-1">Using Yasmin's default. Click "Use custom" to override.</p>` : ''}
      ${helpText && isCustom ? `<p class="text-xs text-muted mt-1">${helpText}</p>` : ''}
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

/**
 * Renders a Quill WYSIWYG editor container.
 * @param {Object} opts
 * @returns {string} HTML string
 */
function quillEditorHtml({ name, label, value = '', placeholder = '', dir = '' }) {
  const rtlClass = dir === 'rtl' ? 'quill-rtl' : '';

  return `
    <div class="field-group">
      <label class="block text-sm font-medium text-text-main mb-1.5">
        ${label}
      </label>
      <div id="quill-${name}" class="${rtlClass}" data-quill-field="${name}" data-quill-placeholder="${escapeHtml(placeholder)}">
        ${value || ''}
      </div>
      <input type="hidden" id="field-${name}" name="${name}" value="${escapeHtml(String(value))}">
      <p class="field-error text-xs text-red-500 mt-1 hidden" aria-live="polite"></p>
    </div>
  `;
}

/** @type {Object<string, Quill>} */
const quillInstances = {};

/**
 * Initializes Quill editors for fullDescription and fullDescriptionAr fields.
 * @param {HTMLElement} container
 */
function setupQuillEditors(container) {
  if (typeof Quill === 'undefined') {
    console.warn('Quill not loaded — falling back to plain text');
    return;
  }

  const quillContainers = container.querySelectorAll('[data-quill-field]');
  quillContainers.forEach((el) => {
    const fieldName = el.getAttribute('data-quill-field');
    const placeholder = el.getAttribute('data-quill-placeholder') || '';
    const hiddenInput = container.querySelector(`#field-${fieldName}`);

    const quill = new Quill(el, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link'],
          ['clean'],
        ],
      },
    });

    // Sync Quill content to hidden input on every change
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      if (hiddenInput) {
        hiddenInput.value = html === '<p><br></p>' ? '' : html;
      }
    });

    // Store instance for later access
    quillInstances[fieldName] = quill;
  });
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
  const regenerateBtn = container.querySelector('#slug-regenerate-btn');

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

  // Regenerate button — resets slug from current title and re-enables auto-generation
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', () => {
      slugField.value = generateSlug(titleField.value);
      slugManuallyEdited = false;
    });
  }
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
 * Sets up the contact field override toggle buttons.
 * Clicking "Use custom" unlocks the field; clicking "Reset to default" locks it back.
 * @param {HTMLElement} container
 */
function setupContactOverrides(container) {
  const overrideBtns = container.querySelectorAll('.contact-override-btn');

  overrideBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const fieldName = btn.getAttribute('data-field');
      const defaultValue = btn.getAttribute('data-default');
      const input = container.querySelector(`#field-${fieldName}`);
      if (!input) return;

      const isCurrentlyLocked = input.disabled;

      if (isCurrentlyLocked) {
        // Unlock: enable field, clear value for custom entry
        input.disabled = false;
        input.value = '';
        input.classList.remove('bg-gray-50', 'text-muted', 'cursor-not-allowed');
        input.focus();
        btn.textContent = 'Reset to default';

        // Update help text
        const helpEl = input.parentElement?.querySelector('p:not(.field-error)');
        if (helpEl && helpEl.textContent.includes('default')) {
          helpEl.textContent = '';
        }
      } else {
        // Lock: disable field, restore default value
        input.disabled = true;
        input.value = defaultValue;
        input.classList.add('bg-gray-50', 'text-muted', 'cursor-not-allowed');
        btn.textContent = 'Use custom';

        // Restore help text
        const fieldGroup = input.closest('.field-group');
        const helpEl = fieldGroup?.querySelector('p:not(.field-error)');
        if (helpEl) {
          helpEl.textContent = 'Using Yasmin\'s default. Click "Use custom" to override.';
        }

        // Clear any validation error
        const errorEl = fieldGroup?.querySelector('.field-error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.add('hidden');
        }
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-200');
      }
    });
  });
}

/**
 * Sets up chip click handlers for all datalist-style fields (category, location, etc.).
 * Clicking a chip sets the input value and highlights it.
 * Clicking "Custom..." clears the field and focuses it for free-text entry.
 * @param {HTMLElement} container
 */
function setupCategoryChips(container) {
  // Handle option chips
  const chips = container.querySelectorAll('.chip-option');
  chips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const fieldName = chip.getAttribute('data-field');
      const value = chip.getAttribute('data-value');
      const input = container.querySelector(`#field-${fieldName}`);
      if (!input) return;

      input.value = value;

      // Update chip styles for this field
      const siblings = container.querySelectorAll(`.chip-option[data-field="${fieldName}"]`);
      siblings.forEach((c) => {
        c.classList.remove('border-primary', 'bg-primary/10', 'text-primary');
        c.classList.add('border-gray-200', 'text-text-main');
      });
      chip.classList.remove('border-gray-200', 'text-text-main');
      chip.classList.add('border-primary', 'bg-primary/10', 'text-primary');
    });
  });

  // Handle "Custom..." chips
  const customChips = container.querySelectorAll('.chip-custom');
  customChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const fieldName = chip.getAttribute('data-field');
      const input = container.querySelector(`#field-${fieldName}`);
      if (!input) return;

      // Clear the field and focus it
      input.value = '';
      input.focus();

      // Deselect all option chips for this field
      const siblings = container.querySelectorAll(`.chip-option[data-field="${fieldName}"]`);
      siblings.forEach((c) => {
        c.classList.remove('border-primary', 'bg-primary/10', 'text-primary');
        c.classList.add('border-gray-200', 'text-text-main');
      });
    });
  });

  // Sync chip highlighting when user types
  const datalistInputs = container.querySelectorAll('[data-chips-for]');
  datalistInputs.forEach((chipsContainer) => {
    const fieldName = chipsContainer.getAttribute('data-chips-for');
    const input = container.querySelector(`#field-${fieldName}`);
    if (!input) return;

    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      const fieldChips = chipsContainer.querySelectorAll('.chip-option');
      fieldChips.forEach((c) => {
        if (c.getAttribute('data-value').toLowerCase() === val) {
          c.classList.remove('border-gray-200', 'text-text-main');
          c.classList.add('border-primary', 'bg-primary/10', 'text-primary');
        } else {
          c.classList.remove('border-primary', 'bg-primary/10', 'text-primary');
          c.classList.add('border-gray-200', 'text-text-main');
        }
      });
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

  // Ensure chip-based fields are captured (their values are set programmatically)
  const chipFields = ['category', 'location'];
  chipFields.forEach((field) => {
    const input = form.querySelector(`#field-${field}`);
    if (input && input.value.trim()) {
      data[field] = input.value.trim();
    }
  });

  // Include disabled contact fields (they use defaults when locked)
  for (const [field, defaultVal] of Object.entries(DEFAULT_CONTACT)) {
    if (!(field in data)) {
      const input = form.querySelector(`#field-${field}`);
      if (input && input.disabled) {
        data[field] = input.value.trim() || defaultVal;
      }
    }
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
