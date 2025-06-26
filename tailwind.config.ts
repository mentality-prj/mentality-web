import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './ds/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        tablet: '480px',
        laptop: '768px',
        desktop: '1024px',
      },
      colors: {
        disable: 'var(--disable)',
        reversed: 'var(--reversed)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          focus: 'var(--primary-focus)',
          pressed: 'var(--primary-pressed)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          focus: 'var(--secondary-focus)',
          pressed: 'var(--secondary-pressed)',
        },
        textcolor: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          purple: 'var(--text-purple)',
          error: 'var(--text-error)',
          success: 'var(--text-success)',
        },
        iconcolor: {
          primary: 'var(--icon-primary)',
          secondary: 'var(--icon-secondary)',
          tertiary: 'var(--icon-tertiary)',
          error: 'var(--icon-error)',
          success: 'var(--icon-success)',
        },
        outline: {
          primary: 'var(--outline-primary)',
          secondary: 'var(--outline-secondary)',
          tertiary: 'var(--outline-tertiary)',
          error: 'var(--outline-error)',
          success: 'var(--outline-success)',
        },
        surface: {
          white: 'var(--surface)',
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          action: 'var(--surface-action)',
          dark: 'var(--surface-dark)',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xs: 'calc(var(--radius) / 4)',
        sm: 'calc(var(--radius) / 2)',
        md: 'calc(var(--radius) - 4px)',
        default: 'var(--radius)',
        lg: 'calc(var(--radius) * 3)',
        xl: 'calc(var(--radius) * 5)',
      },
    },
  },
  darkMode: ['class', 'class'],
}
export default config
