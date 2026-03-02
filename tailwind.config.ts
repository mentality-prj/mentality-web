import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './ds/**/*.{ts,tsx}',
    './ui/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './helpers/**/*.{ts,tsx}',
  ],
  safelist: ['font-logo'],

  theme: {
    extend: {
      screens: {
        tablet: '480px',
        laptop: '768px',
        desktop: '1024px',
      },

      colors: {
        /* ===== Layout & Base ===== */
        background: {
          DEFAULT: 'hsl(var(--background))',
          alt: 'hsl(var(--background-alt))',
          soft: 'hsl(var(--background-soft))',
          muted: 'hsl(var(--background-muted))',
        },
        admin: {
          DEFAULT: 'hsl(var(--admin-background))',
          surface: 'hsl(var(--admin-surface))',
          accent: 'hsl(var(--admin-accent))',
          text: 'hsl(var(--admin-text))',
        },
        border: {
          DEFAULT: 'hsl(var(--border))',
          success: 'hsl(var(--success))',
          error: 'hsl(var(--error))',
          info: 'hsl(var(--info))',
        },

        /* ===== Text ===== */
        textcolor: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          muted: 'hsl(var(--text-muted))',
          state: 'hsl(var(--text-state))',
        },

        /* ===== Brand ===== */
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
          foreground: 'hsl(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          soft: 'hsl(var(--secondary-soft))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        tertiary: {
          DEFAULT: 'hsl(var(--tertiary))',
          soft: 'hsl(var(--tertiary-soft))',
          foreground: 'hsl(var(--tertiary-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          soft: 'hsl(var(--accent-soft))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        /* ===== States ===== */
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--text-state))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--text-state))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--special-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--special-foreground))',
        },
        note: {
          DEFAULT: 'hsl(var(--note))',
          foreground: 'hsl(var(--text-state))',
        },
        support: {
          DEFAULT: 'hsl(var(--support))',
          foreground: 'hsl(var(--text-state))',
        },

        special: {
          from: 'hsl(var(--special-from))',
          to: 'hsl(var(--special-to))',
          foreground: 'hsl(var(--special-foreground))',
        },
      },

      borderRadius: {
        xs: 'calc(var(--radius) / 4)',
        sm: 'calc(var(--radius) / 2)',
        md: 'calc(var(--radius) - 4px)',
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) * 3)',
        xl: 'calc(var(--radius) * 5)',
      },

      gap: {
        default: '1.5rem', // gap-6
        xxs: '0.25rem', // gap-1
        xs: '0.5rem', // gap-2
        sm: '1rem', // gap-4
        md: '2rem', // gap-8
        lg: '2.5rem', // gap-10
      },
    },
  },
}

export default config
