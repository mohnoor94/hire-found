import { getBasePath } from './utils.js';

const FOOTER_CONFIG = {
  whatsAppNumber: '962793001043',
  whatsAppMessage: "Hi Yasmin! I found you through your website.",
  calLink: 'https://cal.com/yasminblasi',
  linkedIn: 'https://www.linkedin.com/in/yasminblasi',
  instagram: 'https://www.instagram.com/hirefound',
  email: 'yasmin@hirefound.com',
  logoFile: 'hirefound-logo-white.svg',
  tagline: "Looking for a Hire? We've got you Found.",
  italicTagline: "Find your match. Find your future.",
  credit: { text: 'Mohammad Noor', url: 'https://noor.sh' },
  copyright: '© 2026 HireFound. All rights reserved.',
};

/**
 * Renders the footer component into the provided container element.
 * Content matches the homepage contact section (source of truth).
 * @param {HTMLElement} container - The element to render the footer into
 */
export function initFooter(container) {
  if (!container) return;

  const basePath = getBasePath();
  const whatsAppUrl = `https://wa.me/${FOOTER_CONFIG.whatsAppNumber}?text=${encodeURIComponent(FOOTER_CONFIG.whatsAppMessage)}`;

  container.innerHTML = `
    <section class="py-20 lg:py-28 px-6 bg-dark text-white relative overflow-hidden">
      <!-- Decorative radial gradient overlays -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 opacity-40" style="background: radial-gradient(circle at 30% 40%, rgba(139, 34, 82, 0.2), transparent 50%);"></div>
        <div class="absolute inset-0 opacity-30" style="background: radial-gradient(circle at 80% 70%, rgba(212, 165, 116, 0.15), transparent 50%);"></div>
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        <!-- Contact CTA -->
        <div class="text-center mb-14">
          <h2 class="font-accent text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Your next game-changer is<br>just a conversation away.</h2>
          <p class="text-white/50 text-lg">Let's find them together.</p>
        </div>

        <div class="text-center">
          <p class="text-white/70 text-lg mb-6">The fastest way to reach me? WhatsApp. I'm usually one message away.</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="${FOOTER_CONFIG.calLink}" target="_blank" rel="noopener"
               class="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-primary-light transition-all duration-300 text-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
              Book a Call
            </a>
            <a href="${whatsAppUrl}" target="_blank" rel="noopener"
               class="inline-flex items-center gap-3 px-8 py-4 bg-whatsapp text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          <!-- Social links row -->
          <div class="flex items-center justify-center gap-4 mt-4">
            <a href="${FOOTER_CONFIG.linkedIn}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" aria-label="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="${FOOTER_CONFIG.instagram}" target="_blank" rel="noopener" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" aria-label="Instagram">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="mailto:${FOOTER_CONFIG.email}" class="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200" aria-label="Email">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </a>
          </div>
        </div>

        <!-- Footer branding -->
        <div class="mt-24 pt-10 border-t border-white/8 text-center">
          <img src="${basePath}assets/${FOOTER_CONFIG.logoFile}" alt="HireFound" class="h-10 md:h-12 mx-auto mb-4 opacity-70">
          <p class="text-white/30 text-sm mb-1">${FOOTER_CONFIG.tagline}</p>
          <p class="text-white/30 text-sm font-accent italic mt-4">${FOOTER_CONFIG.italicTagline}</p>
          <p class="text-white/20 text-xs mt-6">Made with \u2764 by <a href="${FOOTER_CONFIG.credit.url}" target="_blank" rel="noopener" class="text-white/30 hover:text-white/50 transition-colors">${FOOTER_CONFIG.credit.text}</a></p>
          <p class="text-white/15 text-xs mt-3">${FOOTER_CONFIG.copyright}</p>
        </div>
      </div>
    </section>
  `;
}
