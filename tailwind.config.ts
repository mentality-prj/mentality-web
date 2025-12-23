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
        accent: {
          action: 'var(--accent-action)',
        },
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
        destructive: {
          DEFAULT: 'var(--destructive)',
          hover: 'var(--destructive-hover)',
          focus: 'var(--destructive-focus)',
          pressed: 'var(--destructive-pressed)',
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
          card: 'var(--surface)',
          cardInfo: 'hsl(var(--card-info))',
          cardAlert: 'hsl(var(--card-alert))',
          cardSuccess: 'hsl(var(--card-success))',
        },
        cta: {
          DEFAULT: 'hsl(var(--cta))',
          hover: 'hsl(var(--cta-hover))',
          focus: 'hsl(var(--cta-focus))',
          pressed: 'hsl(var(--cta-pressed))',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
        tag: {
          DEFAULT: 'var(--tag)',
          surfaceLightPurple: 'var(--tag-surface-light-purple)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Custom border radius values using CSS variable --radius:
      // xs: ¼, sm: ½, md: -4px, default: base, lg: ×3, xl: ×5
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
}
export default config
