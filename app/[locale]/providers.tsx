'use client'
import { ReactNode, useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { FilterContext, SortContext } from '@/context/FilterContext'
import { SidebarProvider } from '@/ds/shadcn/sidebar'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('')
  return (
    <SessionProvider>
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
          <SortContext.Provider value={{ sort, setSort }}>
            <FilterContext.Provider value={{ filter, setFilter }}>{children}</FilterContext.Provider>
          </SortContext.Provider>
        </SidebarProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
