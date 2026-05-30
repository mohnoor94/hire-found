// Shared Tailwind configuration for HireFound
// This is a side-effect script — sets tailwind.config on the global scope.
// Must be loaded via <script> AFTER the Tailwind CDN script.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        warm: '#FFFAF5',
        'warm-dark': '#F8F0EA',
        primary: '#7A1E4A',
        'primary-light': '#963B63',
        'primary-dark': '#5E1639',
        secondary: '#D4A574',
        'secondary-light': '#E0BA92',
        dark: '#1A1A2E',
        'dark-light': '#252540',
        'text-main': '#2D2926',
        muted: '#6B6560',
        success: '#7A9E7E',
        whatsapp: '#25D366',
        'butterfly-lavender': '#C4B5FD',
        'butterfly-lavender-dark': '#7C3AED',
        'butterfly-rose': '#FDA4AF',
        'butterfly-gold': '#FCD34D',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
        accent: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(45, 41, 38, 0.06)',
        'card-hover': '0 12px 40px rgba(45, 41, 38, 0.12)',
        warm: '0 4px 20px rgba(139, 34, 82, 0.12)',
        glow: '0 0 40px rgba(139, 34, 82, 0.2)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.06)',
      },
    }
  }
};
