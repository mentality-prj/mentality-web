'use client'
import { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

import { SessionWrapper } from '@/components/shared/SessionWrapper'
import { AuthProvider } from '@/context/AuthProvider'
import { ContextProvider } from '@/context/ContextProvider'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [sort, setSort] = useState('newest')
  const [filter, setFilter] = useState('')
  return (
    <AuthProvider>
      <SessionWrapper>
        <NextThemesProvider defaultTheme="system" attribute="class" {...themeProps}>
          <ContextProvider>{children}</ContextProvider>
        </NextThemesProvider>
      </SessionWrapper>
    </AuthProvider>
  )
}
