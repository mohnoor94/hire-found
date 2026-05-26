// Shared Tailwind configuration for HireFound
// This is a side-effect script — sets tailwind.config on the global scope.
// Must be loaded via <script src="/js/tailwind-config.js"></script> BEFORE the Tailwind CDN script.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        warm: '#FFFAF5',
        'warm-dark': '#F8F0EA',
        primary: '#8B2252',
        'primary-light': '#A63B6B',
        'primary-dark': '#6D1A3F',
        secondary: '#D4A574',
        'secondary-light': '#E0BA92',
        dark: '#1A1A2E',
        'dark-light': '#252540',
        'text-main': '#2D2926',
        muted: '#8A8380',
        success: '#7A9E7E',
        whatsapp: '#25D366',
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
