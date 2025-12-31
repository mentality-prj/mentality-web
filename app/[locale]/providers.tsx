'use client'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { SessionWrapper } from '@/components/SessionWrapper'
import { ContextProvider } from '@/context/ContextProvider'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <SessionWrapper>
        <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
          <ContextProvider>{children}</ContextProvider>
        </NextThemesProvider>
      </SessionWrapper>
    </SessionProvider>
  )
}
