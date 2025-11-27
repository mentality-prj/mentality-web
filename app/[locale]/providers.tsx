'use client'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { SessionWrapper } from '@/components/SessionWrapper'
import { ContextProvider } from '@/context/ContextProvider'
import { SidebarProvider } from '@/ds/shadcn/sidebar'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <SessionWrapper>
        <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
          <SidebarProvider
            defaultOpen={true}
            style={
              {
                '--sidebar-width': '275px',
                '--sidebar-width-icon': '80px',
              } as React.CSSProperties
            }
          >
            <ContextProvider>{children}</ContextProvider>
          </SidebarProvider>
        </NextThemesProvider>
      </SessionWrapper>
    </SessionProvider>
  )
}
