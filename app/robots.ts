import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/callback',
          '/uk/company/',
          '/en/company/',
          '/pl/company/',
          '/uk/research/',
          '/en/research/',
          '/pl/research/',
        ],
      },
    ],
    sitemap: 'https://docs.dzvin.co/sitemap.xml',
  }
}
