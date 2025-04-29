import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './ds/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        disable: 'hsl(var(--disable))',
        reversed: 'hsl(var(--reversed))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          focus: 'hsl(var(--primary-focus))',
          pressed: 'hsl(var(--primary-pressed))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          hover: 'hsl(var(--secondary-hover))',
          focus: 'hsl(var(--secondary-focus))',
          pressed: 'hsl(var(--secondary-pressed))',
        },
        // when for example: Text/Text Primary
        textcolor: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          tertiary: 'hsl(var(--text-tertiary))',
          error: 'hsl(var(--text-error))',
          success: 'hsl(var(--text-success))',
        },
        iconcolor: {
          primary: 'hsl(var(--icon-primary))',
          secondary: 'hsl(var(--icon-secondary))',
          tertiary: 'hsl(var(--icon-tertiary))',
          error: 'hsl(var(--icon-error))',
          success: 'hsl(var(--icon-success))',
        },
        outline: {
          primary: 'hsl(var(--outline-primary))',
          secondary: 'hsl(var(--outline-secondary))',
          tertiary: 'hsl(var(--outline-tertiary))',
          error: 'hsl(var(--outline-error))',
          success: 'hsl(var(--outline-success))',
        },
        surface: {
          white: 'hsl(var(--surface))',
          primary: 'hsl(var(--surface-primary))',
          secondary: 'hsl(var(--surface-secondary))',
          action: 'hsl(var(--surface-action))',
          dark: 'hsl(var(--surface-dark))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        xlg: 'calc(var(--radius) * 3)',
        xxlg: 'calc(var(--radius) * 5)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        xsm: 'calc(var(--radius) - 12px)',
      },
    },
  },
  darkMode: ['class', 'class'],
}
export default config
