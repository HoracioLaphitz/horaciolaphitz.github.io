/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './src/pages/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
    './src/presentation/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        'surface-overlay': 'var(--color-surface-overlay)',
        
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
        },
        
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          muted: 'var(--color-accent-muted)',
        },
        
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        
        // Legacy colors (keep for backward compatibility)
        light: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          border: '#EAEAEA',
          text: {
            primary: '#171717',
            secondary: '#666666',
            tertiary: '#A3A3A3',
          },
        },
        dark: {
          bg: '#0A0A0A',
          surface: '#171717',
          border: '#262626',
          text: {
            primary: '#EDEDED',
            secondary: '#A1A1AA',
            tertiary: '#737373',
          },
          accent: {
            cyan: '#00E5FF',
            yellow: '#CCFF00',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', 'Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      spacing: {
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '36px',
        '2xl': '54px',
        '3xl': '81px',
        '4xl': '121.5px',
        '5xl': '182.25px',
      },
      fontSize: {
        xs: '10.24px',
        sm: '12.8px',
        base: '16px',
        lg: '20px',
        xl: '25px',
        '2xl': '31.25px',
        '3xl': '39.06px',
        '4xl': '48.83px',
        '5xl': '61.04px',
        '6xl': '76.29px',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
    },
  },
  plugins: [],
};
