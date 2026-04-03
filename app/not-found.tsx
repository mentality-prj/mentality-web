import { cookies, headers } from 'next/headers'
import Image from 'next/image'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { Providers } from '@/app/[locale]/providers'
import { LandingFooter, LandingHeader } from '@/components/features/Landing'
import Sitemap, { SitemapAdmin } from '@/components/shared/Sitemap'
import { fontSans } from '@/config/fonts'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { SupportedLanguage } from '@/types/languages'
import { Button } from '@/ui/button'

const LOCALE_COOKIE = 'NEXT_LOCALE'

function detectLocaleFromAcceptLanguage(acceptLanguage: string | null): SupportedLanguage {
  if (!acceptLanguage) return 'en' as SupportedLanguage
  for (const part of acceptLanguage.split(',')) {
    const lang = part.split(';')[0].trim().split('-')[0].toLowerCase()
    if (routing.locales.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage
    }
  }
  return 'en' as SupportedLanguage
}

export default async function NotFoundPage() {
  const cookieStore = cookies()
  const headersList = headers()

  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const locale =
    cookieLocale && routing.locales.includes(cookieLocale as SupportedLanguage)
      ? (cookieLocale as SupportedLanguage)
      : detectLocaleFromAcceptLanguage(headersList.get('accept-language'))
  const messages = (await import(`../messages/${locale}`)).default
  const t = await getTranslations({ locale })

  return (
    <html lang={locale} suppressHydrationWarning={true} className={`${fontSans.variable} antialiased`}>
      <body className="text-textcolor-primary">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <main className="flex min-h-screen w-full flex-col justify-between bg-white">
              <LandingHeader />
              <div
                className="flex-1"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%), linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,1)), url('/images/not-found-bg.png')",
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'bottom center',
                }}
              >
                <article className="container-max-width container-center container gap-md">
                  <h1>{t('common.title.NotFoundPage')}</h1>

                  <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-md md:grid-cols-2">
                    <Sitemap />

                    <div className="">
                      <Image
                        src="/images/not-found.png"
                        alt="Not found"
                        width={360}
                        height={240}
                        className="rounded-[28px]"
                        priority
                      />
                    </div>
                  </div>

                  <SitemapAdmin />

                  <Button variant="volume" asChild>
                    <Link href={Routes.MAIN}>{t('components.Navigation.BackToHome')}</Link>
                  </Button>
                </article>
              </div>
              <LandingFooter type="small" />
            </main>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
