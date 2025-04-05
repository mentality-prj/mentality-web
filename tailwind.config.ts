import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './ds/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './ds/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: 'hsl(var(--black))',
        white: 'hsl(var(--white))',
        gray: {
          '95': 'hsl(var(--gray-95))',
          '90': 'hsl(var(--gray-90))',
          '60': 'hsl(var(--gray-60))',
          '30': 'hsl(var(--gray-30))',
          '20': 'hsl(var(--gray-20))',
        },
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
        red: {
          '70': 'hsl(var(--red-70))',
          '50': 'hsl(var(--red-50))',
          '30': 'hsl(var(--red-30))',
        },
        green: {
          '40': 'hsl(var(--green-40))',
          '35': 'hsl(var(--green-35))',
          '30': 'hsl(var(--green-30))',
        },
        yellow: {
          '60': 'hsl(var(--yellow-60))',
          '50': 'hsl(var(--yellow-50))',
          '40': 'hsl(var(--yellow-40))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  darkMode: ['class', 'class'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [nextui(), require('tailwindcss-animate')],
  darkMode: ['class', 'class'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [nextui(), require('tailwindcss-animate')],
}
export default config
