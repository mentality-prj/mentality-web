import type { Metadata } from 'next'

export type PublicPagePath = '/'

// Production serves the apex domain through a redirect to www; canonicals must point at the final URL.
const PUBLIC_ORIGIN = 'https://www.dzvin.co'
const SUPPORTED_LOCALES = ['uk', 'en', 'pl'] as const

/**
 * Metadata for public acquisition routes.
 * Canonicals reflect i18n/routing.ts (`localePrefix: always`).
 * No user activity, health information or tracking is included.
 */
export function publicPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string
  path: PublicPagePath
  title: string
  description: string
}): Metadata {
  const selectedLocale = SUPPORTED_LOCALES.find((supported) => supported === locale) ?? 'uk'
  const localizedPath = (language: (typeof SUPPORTED_LOCALES)[number]) => `/${language}${path === '/' ? '' : path}`
  const canonicalPath = localizedPath(selectedLocale)
  const canonicalUrl = new URL(canonicalPath, PUBLIC_ORIGIN).toString()

  return {
    metadataBase: new URL(PUBLIC_ORIGIN),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        uk: localizedPath('uk'),
        en: localizedPath('en'),
        pl: localizedPath('pl'),
        'x-default': localizedPath('uk'),
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Dzvin',
      title,
      description,
      url: canonicalUrl,
      locale: selectedLocale === 'uk' ? 'uk_UA' : selectedLocale === 'pl' ? 'pl_PL' : 'en_US',
    },
  }
}
