import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,jsx,ts,tsx}',
    './stories/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      colors: {
        primary: {
          DEFAULT: '#166534',
          hover: '#14532d',
          active: '#15803d',
        },
        secondary: {
          DEFAULT: '#F9C97C',
          hover: '#F7B750',
          active: '#FBDBA7',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  // darkMode: 'class',
  plugins: [
    nextui({
      layout: {},
    }),
  ],
}
export default config
