/**
 * booking-modal.js — Shared booking modal module.
 * Provides the branded "Book a Call" modal with Cal.com embed, loading states,
 * focus trap, and accessibility features. Can be used from any page.
 *
 * Usage (ES module):
 *   import { openBookingModal } from './booking-modal.js';
 *   openBookingModal(triggerElement);
 *
 * Usage (global):
 *   window.BookingModal.open(triggerElement);
 *
 * The module is idempotent: calling init multiple times or from multiple pages
 * will not duplicate the modal HTML or Cal.com SDK script.
 */

import { getBasePath } from './utils.js';

// ─── State ───────────────────────────────────────────────────────────────────

let initialized = false;
let sdkLoaded = false;
let sdkLoading = false;

// ─── Modal HTML Injection ────────────────────────────────────────────────────

/**
 * Injects the booking modal HTML into the DOM if not already present.
 * Idempotent: checks for existing #booking-modal before injecting.
 */
function ensureModalHTML() {
  if (document.getElementById('booking-modal')) return;

  const basePath = getBasePath();

  const modalHTML = `
  <div id="booking-modal"
       role="dialog"
       aria-modal="true"
       aria-labelledby="booking-modal-title"
       class="fixed inset-0 z-[60] hidden"
       data-state="closed">

    <!-- Backdrop -->
    <div id="booking-backdrop"
         class="absolute inset-0 bg-dark/60 transition-opacity duration-300 opacity-0"></div>

    <!-- Modal Content -->
    <div id="booking-content"
         class="absolute inset-0 flex items-center justify-center max-md:p-0 p-4 md:p-6">
      <div id="booking-card"
           class="relative bg-warm rounded-xl md:rounded-2xl w-full max-w-[480px] max-h-[90vh] overflow-hidden shadow-2xl
                  flex flex-col transform scale-95 opacity-0 transition-all duration-300
                  max-md:!max-w-none max-md:!w-full max-md:!h-full max-md:!max-h-full max-md:!rounded-none">

        <!-- Header (max 64px) -->
        <div class="flex items-center gap-3 px-4 py-3 border-b border-primary/10 h-16 flex-shrink-0">
          <img src="${basePath}assets/yasmin-blasi.png" alt="" class="w-10 h-10 rounded-full object-cover">
          <h2 id="booking-modal-title" class="font-accent text-lg font-bold text-primary flex-1">Book a Call with Yasmin</h2>
          <button id="booking-close-btn"
                  class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
                  aria-label="Close booking modal">
            <svg class="w-5 h-5 text-text-main" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div id="booking-body" class="overflow-y-auto overflow-x-hidden flex-1" style="min-height: 400px;">
          <!-- Loading State -->
          <div id="booking-loading" class="flex flex-col items-center justify-center py-16">
            <div class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p class="text-muted text-sm">Loading calendar...</p>
          </div>

          <!-- Cal.com Embed Container -->
          <div id="booking-cal-container" class="hidden w-full overflow-x-hidden"></div>

          <!-- Error State -->
          <div id="booking-error" class="hidden flex flex-col items-center justify-center py-16 px-6 text-center">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
            </div>
            <p class="text-text-main font-semibold mb-2">Calendar unavailable</p>
            <p class="text-muted text-sm mb-6">The scheduling service couldn't be loaded right now.</p>
            <a href="https://cal.com/yasminblasi" target="_blank" rel="noopener"
               class="inline-flex items-center gap-2 px-6 py-3 min-h-[44px] bg-primary text-white text-base font-semibold rounded-full hover:bg-primary-light transition-colors">
              Book on Cal.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ─── Cal.com SDK Lazy Loading ────────────────────────────────────────────────

/**
 * Loads the Cal.com embed SDK if not already loaded.
 * Returns a Promise that resolves when the SDK is ready.
 * Idempotent: will not add the script tag more than once.
 */
function ensureCalSdk() {
  return new Promise((resolve, reject) => {
    // Already loaded and ready
    if (sdkLoaded && window.Cal && window.Cal.ns && window.Cal.ns.booking) {
      resolve();
      return;
    }

    // Check if SDK was loaded by the page (e.g., homepage inline script)
    if (window.Cal && window.Cal.ns && window.Cal.ns.booking) {
      sdkLoaded = true;
      resolve();
      return;
    }

    // Already in the process of loading
    if (sdkLoading) {
      // Poll until ready
      const poll = setInterval(() => {
        if (window.Cal && window.Cal.ns && window.Cal.ns.booking) {
          sdkLoaded = true;
          clearInterval(poll);
          resolve();
        }
      }, 100);
      // Timeout after 10s
      setTimeout(() => {
        clearInterval(poll);
        if (!sdkLoaded) reject(new Error('Cal.com SDK load timeout'));
      }, 10000);
      return;
    }

    sdkLoading = true;

    // Initialize Cal global (same pattern as the homepage inline script)
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    Cal("init", "booking", { origin: "https://cal.com" });

    Cal.ns.booking("ui", {
      theme: "light",
      cssVarsPerTheme: {
        light: {
          "cal-brand": "#8B2252",
          "cal-brand-emphasis": "#A63B6B",
          "cal-brand-text": "#FFFFFF",
          "cal-bg": "#FFFAF5",
          "cal-bg-emphasis": "#F8F0EA",
          "cal-text": "#2D2926",
          "cal-text-emphasis": "#1A1A2E",
          "cal-text-subtle": "#8A8380",
          "cal-border": "rgba(139, 34, 82, 0.15)",
          "cal-border-booker": "transparent",
          "cal-border-booker-width": "0px"
        }
      }
    });

    Cal.ns.booking("preload", { calLink: "yasminblasi" });

    // Poll until SDK is fully ready
    const poll = setInterval(() => {
      if (window.Cal && window.Cal.ns && window.Cal.ns.booking) {
        sdkLoaded = true;
        clearInterval(poll);
        resolve();
      }
    }, 100);

    // Timeout after 10s
    setTimeout(() => {
      clearInterval(poll);
      if (!sdkLoaded) {
        // SDK may still work via the queued commands, mark as loaded
        if (window.Cal && window.Cal.ns && window.Cal.ns.booking) {
          sdkLoaded = true;
          resolve();
        } else {
          reject(new Error('Cal.com SDK load timeout'));
        }
      }
    }, 10000);
  });
}

// ─── BookingModal Controller ─────────────────────────────────────────────────

const BookingModal = {
  el: null,
  backdrop: null,
  card: null,
  calContainer: null,
  loadingEl: null,
  errorEl: null,
  closeBtn: null,
  triggerEl: null,
  isOpen: false,
  calReady: false,
  loadTimeout: null,
  _boundTrapFocus: null,
  _closeHandlersAttached: false,

  /**
   * Initializes the modal controller by ensuring HTML is injected
   * and caching DOM references. Idempotent.
   */
  init() {
    if (initialized) return;

    ensureModalHTML();

    this.el = document.getElementById('booking-modal');
    this.backdrop = document.getElementById('booking-backdrop');
    this.card = document.getElementById('booking-card');
    this.calContainer = document.getElementById('booking-cal-container');
    this.loadingEl = document.getElementById('booking-loading');
    this.errorEl = document.getElementById('booking-error');
    this.closeBtn = document.getElementById('booking-close-btn');

    this._attachCloseHandlers();

    initialized = true;

    // Expose globally for backward compatibility
    window.BookingModal = this;
  },

  /**
   * Attaches close handlers (close button, Escape key, backdrop click).
   * Only attaches once.
   */
  _attachCloseHandlers() {
    if (this._closeHandlersAttached) return;
    this._closeHandlersAttached = true;

    const self = this;

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', function () {
        self.close();
      });
    }

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.isOpen) {
        self.close();
      }
    });

    // Backdrop click
    if (this.backdrop) {
      this.backdrop.addEventListener('click', function (e) {
        if (e.target === self.backdrop) {
          self.close();
        }
      });
    }
  },

  /**
   * Opens the booking modal. Lazily loads the Cal.com SDK on first call.
   * @param {HTMLElement} [triggerElement] - The element that triggered the open (for focus return)
   */
  open(triggerElement) {
    if (this.isOpen) return;

    // Ensure initialized
    if (!initialized) this.init();

    // Store trigger element for focus return
    this.triggerEl = triggerElement || null;

    // Show modal
    this.el.classList.remove('hidden');
    this.el.setAttribute('data-state', 'open');

    // Animate in
    requestAnimationFrame(() => {
      this.backdrop.style.opacity = '1';
      this.card.style.opacity = '1';
      this.card.style.transform = 'scale(1)';
    });

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    this.isOpen = true;

    // Attach focus trap
    if (!this._boundTrapFocus) {
      this._boundTrapFocus = this.trapFocus.bind(this);
    }
    this.el.addEventListener('keydown', this._boundTrapFocus);

    // Load SDK lazily and initialize embed
    const self = this;
    ensureCalSdk()
      .then(() => {
        self.initCalEmbed();
      })
      .catch(() => {
        // SDK failed to load — show error state
        self.showError();
      });

    // Start 8-second load timeout
    this.loadTimeout = setTimeout(() => {
      if (this.loadingEl && !this.loadingEl.classList.contains('hidden')) {
        this.showError();
      }
    }, 8000);
  },

  /**
   * Closes the booking modal and cleans up state.
   */
  close() {
    if (!this.isOpen) return;

    // Clear any pending load timeout
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
      this.loadTimeout = null;
    }

    // Detach focus trap
    if (this._boundTrapFocus) {
      this.el.removeEventListener('keydown', this._boundTrapFocus);
    }

    // Animate out
    this.card.style.opacity = '0';
    this.card.style.transform = 'scale(0.95)';
    this.backdrop.style.opacity = '0';

    const self = this;

    // After animation completes (300ms matches CSS transition-all duration-300)
    setTimeout(function () {
      self.el.classList.add('hidden');
      self.el.setAttribute('data-state', 'closed');

      // Destroy the Cal.com embed so next open starts fresh
      self.calContainer.innerHTML = '';
      self.calContainer.classList.add('hidden');
      self.calContainer.style.position = '';
      self.calContainer.style.opacity = '';
      self.calContainer.style.pointerEvents = '';
      self.calReady = false;

      // Reset to loading state for next open
      if (self.loadingEl) self.loadingEl.classList.remove('hidden');
      if (self.errorEl) self.errorEl.classList.add('hidden');

      // Restore body scroll
      document.body.style.overflow = '';

      // Return focus to trigger element
      if (self.triggerEl && document.body.contains(self.triggerEl)) {
        self.triggerEl.focus();
      } else {
        document.body.focus();
      }

      self.isOpen = false;
    }, 300);
  },

  /**
   * Traps focus within the modal when Tab/Shift+Tab is pressed.
   */
  trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableEls = this.el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  },

  /**
   * Shows the error state in the modal body.
   */
  showError() {
    if (this.loadingEl) this.loadingEl.classList.add('hidden');
    if (this.calContainer) this.calContainer.classList.add('hidden');
    if (this.errorEl) this.errorEl.classList.remove('hidden');
  },

  /**
   * Shows the Cal.com embed (hides loading and error states).
   */
  showEmbed() {
    if (this.loadingEl) this.loadingEl.classList.add('hidden');
    if (this.errorEl) this.errorEl.classList.add('hidden');
    if (this.calContainer) {
      this.calContainer.classList.remove('hidden');
      this.calContainer.style.position = '';
      this.calContainer.style.opacity = '';
      this.calContainer.style.pointerEvents = '';
    }
  },

  /**
   * Initializes the Cal.com inline embed inside the modal.
   */
  initCalEmbed() {
    const self = this;

    // Register event listeners BEFORE initializing the embed
    Cal.ns.booking("on", {
      action: "linkReady",
      callback: function () {
        self.calReady = true;
        self.showEmbed();
        if (self.loadTimeout) {
          clearTimeout(self.loadTimeout);
          self.loadTimeout = null;
        }
      }
    });

    Cal.ns.booking("on", {
      action: "linkFailed",
      callback: function () {
        self.showError();
      }
    });

    // Make container visible (but hidden visually) so Cal.com can render into it
    this.calContainer.classList.remove('hidden');
    this.calContainer.style.position = 'absolute';
    this.calContainer.style.opacity = '0';
    this.calContainer.style.pointerEvents = 'none';

    // Initialize Cal.com inline embed
    Cal.ns.booking("inline", {
      elementOrSelector: "#booking-cal-container",
      calLink: "yasminblasi"
    });

    // Fallback: poll for iframe presence in case linkReady event is missed
    let pollCount = 0;
    const pollForIframe = setInterval(function () {
      pollCount++;
      const iframe = self.calContainer.querySelector('iframe');
      if (iframe && !self.calReady) {
        self.calReady = true;
        self.showEmbed();
        if (self.loadTimeout) {
          clearTimeout(self.loadTimeout);
          self.loadTimeout = null;
        }
        clearInterval(pollForIframe);
      } else if (pollCount >= 40 || self.calReady) {
        clearInterval(pollForIframe);
      }
    }, 200);
  }
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Opens the booking modal. Initializes on first call.
 * This is the primary export for ES module consumers.
 * If window.BookingModal is already set (e.g., by the homepage or a test),
 * delegates to it to ensure consistent behavior.
 * @param {HTMLElement} [triggerElement] - The element that triggered the open
 */
export function openBookingModal(triggerElement) {
  // If window.BookingModal is already set externally (homepage inline or test mock),
  // delegate to it for backward compatibility
  if (window.BookingModal && window.BookingModal !== BookingModal) {
    window.BookingModal.open(triggerElement);
    return;
  }
  if (!initialized) {
    BookingModal.init();
  }
  BookingModal.open(triggerElement);
}

/**
 * Initializes the booking modal without opening it.
 * Useful for pages that want to set up window.BookingModal early.
 */
export function initBookingModal() {
  if (!initialized) {
    BookingModal.init();
  }
}

// Export the controller for advanced usage
export { BookingModal };
