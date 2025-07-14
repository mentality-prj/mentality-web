import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import AppIntlProvider from '@/app/(providers)/AppIntlProvider'
import { fontSans } from '@/config/fonts'
import { routing } from '@/i18n/routing'
import { SupportedLanguage } from '@/types/languages'

import { Providers } from './providers'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Mentality',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: SupportedLanguage }
}) {
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning={true} className={`${fontSans.variable} antialiased`}>
      <body>
        <AppIntlProvider>
          <Providers>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </Providers>
        </AppIntlProvider>
      </body>
    </html>
  )
}
