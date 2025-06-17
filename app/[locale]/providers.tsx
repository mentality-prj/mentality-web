'use client'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import SidebarWrapper from '@/components/Sidebar'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </NextThemesProvider>
    </SessionProvider>
  )
}
