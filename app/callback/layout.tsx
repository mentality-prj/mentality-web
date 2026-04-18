import { ReactNode } from 'react'
import { cookies } from 'next/headers'

import { fontSans } from '@/config/fonts'
import { routing } from '@/i18n/routing'

export default function CallbackLayout({ children }: { children: ReactNode }) {
  const lang = cookies().get('NEXT_LOCALE')?.value ?? routing.defaultLocale
  return (
    <html lang={lang} className={`${fontSans.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-white text-textcolor-primary">
        <header className="w-full py-4">
          <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
            <a href="/" aria-label="Go to homepage">
              <div className="logo">
                <span className="logo-highlight text-primary" style={{ textShadow: '-2px 2px 0 hsl(20 98% 85%)' }}>
                  Dzvin.co
                </span>
              </div>
            </a>
          </div>
        </header>
        <main className="flex flex-1 items-center justify-center">{children}</main>
        <footer className="w-full py-6 text-center text-sm text-textcolor-muted">
          <div className="container-max-width mx-auto px-4">© {new Date().getFullYear()} Dzvin.co</div>
        </footer>
      </body>
    </html>
  )
}
