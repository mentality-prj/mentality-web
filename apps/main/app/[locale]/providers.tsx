'use client'
import { ReactNode } from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextUIProvider>
        <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  )
}
