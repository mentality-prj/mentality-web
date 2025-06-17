import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import type { Metadata } from 'next'

import AppIntlProvider from '@/app/(providers)/AppIntlProvider'
import { Header } from '@/components/Header/Header'
import Layout from '@/components/Layout'
import { fontSans } from '@/config/fonts'

import { Providers } from '../providers'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Mentality',
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} suppressHydrationWarning={true} className={`${fontSans.variable} antialiased`}>
      <body>
        <AppIntlProvider>
          <Providers>
            <Toaster position="top-right" reverseOrder={false} />
            <Header />
            <Layout>{children}</Layout>
          </Providers>
        </AppIntlProvider>
      </body>
    </html>
  )
}
