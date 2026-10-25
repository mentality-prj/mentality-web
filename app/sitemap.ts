import type { MetadataRoute } from 'next'

import { publicDocSlugs } from '@/content/public-docs'
import { deckAudiences } from '@/content/public-docs/decks'

const locales = ['uk', 'en', 'pl'] as const
const updated = new Date('2026-10-25T00:00:00Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = locales.flatMap((locale) => [
    {
      url: `https://docs.dzvin.co/${locale}/docs`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...publicDocSlugs.map((slug) => ({
      url: `https://docs.dzvin.co/${locale}/docs/${slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...deckAudiences.map((audience) => ({
      url: `https://docs.dzvin.co/${locale}/docs/decks/${audience}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ])
  const publicSite = locales.flatMap((locale) =>
    ['', '/services', '/about', '/contacts'].map((path) => ({
      url: `https://www.dzvin.co/${locale}${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )
  return [...docs, ...publicSite]
}
