import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import AppIntlProvider from '@/app/(providers)/AppIntlProvider'
import CookieConsent from '@/components/shared/CookieConsent'
import { fontSans } from '@/config/fonts'
import { routing } from '@/i18n/routing'
import { SupportedLanguage } from '@/types/languages'

import { Providers } from './providers'

import '@/styles/globals.css'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'common.title' })
  return {
    title: t('AppTitle', { default: 'Dzvin.co' }),
    manifest: '/favicons/site.webmanifest',
    themeColor: '#ffffff',
    icons: {
      apple: '/favicons/apple-touch-icon.png',
      icon: [
        { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      shortcut: '/favicons/favicon.ico',
    },
    other: {
      'msapplication-TileColor': '#ffffff',
    },
  }
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
      <body className="text-textcolor-primary">
        <AppIntlProvider>
          <Providers>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
            <CookieConsent />
          </Providers>
        </AppIntlProvider>
      </body>
    </html>
  )
}
