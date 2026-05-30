/**
 * HireFound — Navigation Component
 * Renders the unified navigation bar across all pages.
 *
 * Usage:
 *   import { initNav } from './nav.js';
 *   initNav(document.getElementById('navbar'));
 *
 * Progressive Enhancement / <noscript> fallback:
 *   The container element should include a <noscript> block with a static
 *   fallback link to the homepage:
 *
 *   <nav id="navbar" class="fixed top-0 left-0 right-0 z-50 nav-glass">
 *     <noscript>
 *       <div class="max-w-6xl mx-auto px-6 py-3">
 *         <a href="/" class="font-accent text-xl font-bold text-primary">HireFound</a>
 *       </div>
 *     </noscript>
 *   </nav>
 */

import { getBasePath } from './utils.js';

/**
 * Canonical navigation items.
 * Homepage uses anchor hrefs; other pages use absolute paths.
 */
const NAV_ITEMS = [
  { label: 'About',           homepageHref: '#about',       otherHref: '#about',       isHomepageSection: true },
  { label: 'Find Your Match', homepageHref: '#vacancies',   otherHref: 'jobs/',         isHomepageSection: false },
  { label: 'Services',        homepageHref: '#services',    otherHref: '#services',     isHomepageSection: true },
  { label: 'Process',         homepageHref: '#how-it-works', otherHref: '#how-it-works', isHomepageSection: true },
];

/**
 * Determines if the current page is the homepage.
 * @returns {boolean}
 */
function isHomepage() {
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);
  // Remove filename
  if (segments.length > 0 && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }
  // Homepage = no known subdirectory in the path
  const knownSubDirs = ['jobs', 'yasmin'];
  return !segments.some(s => knownSubDirs.includes(s));
}

/**
 * Determines if a nav item represents the currently active page.
 * @param {object} item - A NAV_ITEMS entry
 * @returns {boolean}
 */
function isActivePage(item) {
  const path = window.location.pathname;
  // "Find Your Match" is active on the jobs page
  if (item.otherHref === 'jobs/' && (path.endsWith('/jobs/') || path.endsWith('/jobs/index.html'))) {
    return true;
  }
  return false;
}

/**
 * Renders the navigation bar into the given container element.
 * @param {HTMLElement} container - The <nav> element to render into
 */
export function initNav(container) {
  if (!container) return;

  const onHomepage = isHomepage();
  const basePath = getBasePath();

  // Resolve href for a nav item
  function resolveHref(item) {
    if (onHomepage) return item.homepageHref;
    if (item.isHomepageSection) return `${basePath}${item.otherHref}`;
    return `${basePath}${item.otherHref}`;
  }

  // Build desktop nav links
  const desktopLinks = NAV_ITEMS.map(item => {
    const href = resolveHref(item);
    const active = isActivePage(item);
    const activeClasses = active
      ? 'text-primary font-semibold border-b-2 border-primary pb-0.5'
      : 'text-muted hover:text-primary transition-colors duration-200';
    const ariaCurrent = active ? ' aria-current="page"' : '';
    return `<a href="${href}" class="text-sm ${activeClasses}"${ariaCurrent}>${item.label}</a>`;
  }).join('\n        ');

  // Build "Get Started" CTA
  const ctaDesktop = onHomepage
    ? `<a id="nav-get-started-desktop" role="button" tabindex="0" class="magnetic inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm cursor-pointer" aria-label="Get Started - Contact us">Get Started</a>`
    : `<a href="${basePath}#contact" class="magnetic inline-flex items-center px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light transition-colors duration-200 shadow-warm" aria-label="Get Started - Contact us">Get Started</a>`;

  const ctaMobile = onHomepage
    ? `<a href="#vacancies" class="md:hidden magnetic inline-flex items-center px-4 py-2 min-h-[44px] min-w-[44px] bg-primary text-white text-base font-semibold rounded-full shadow-warm" aria-label="View open job positions">Job Posts</a>`
    : `<a href="${basePath}jobs/" class="md:hidden magnetic inline-flex items-center px-4 py-2 min-h-[44px] min-w-[44px] bg-primary text-white text-base font-semibold rounded-full shadow-warm" aria-label="View open job positions">Job Posts</a>`;

  // Logo href: homepage scrolls to top, other pages navigate home
  const logoHref = onHomepage ? '#hero' : basePath;
  const logoLabel = onHomepage ? 'HireFound - Go to top' : 'HireFound - Go to homepage';
  const logoSrc = `${basePath}assets/hirefound-signature-primary.svg`;

  // Render nav HTML
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
      <a href="${logoHref}" class="inline-flex items-center" aria-label="${logoLabel}">
        <img src="${logoSrc}" alt="HireFound" class="h-8 w-auto nav-logo">
      </a>
      <div class="hidden md:flex items-center gap-8">
        ${desktopLinks}
        ${ctaDesktop}
      </div>
      ${ctaMobile}
    </div>
  `;

  // === Homepage: scroll-triggered entrance ===
  if (onHomepage) {
    // Start hidden (translated above viewport)
    container.classList.add('translate-y-[-100%]', 'transition-transform', 'duration-500');

    const hero = document.getElementById('hero');
    if (hero) {
      const navObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          container.style.transform = 'translateY(-100%)';
        } else {
          container.style.transform = 'translateY(0)';
        }
      }, { threshold: 0 });
      navObserver.observe(hero);
    }
  }

  // === Homepage: "Get Started" opens booking modal ===
  if (onHomepage) {
    const desktopBtn = document.getElementById('nav-get-started-desktop');

    const openModal = (e, triggerEl) => {
      e.preventDefault();
      if (window.BookingModal && typeof window.BookingModal.open === 'function') {
        window.BookingModal.open(triggerEl);
      } else {
        // Fallback: navigate to contact section
        window.location.href = '/#contact';
      }
    };

    if (desktopBtn) {
      desktopBtn.addEventListener('click', (e) => openModal(e, desktopBtn));
      desktopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openModal(e, desktopBtn);
        }
      });
    }
  }
}
