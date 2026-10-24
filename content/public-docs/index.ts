import uk from './uk.json'
import en from './en.json'
import pl from './pl.json'

export type PublicDocs = {
  title: string; kicker: string; lead: string; browse: string; back: string; nav: string
  notice: string; status: string; links: string; services: string; faq: string; privacy: string
  articles: { slug: string; category: string; title: string; summary: string
    sections: { title: string; paragraphs: string[] }[] }[]
}
const translations: Record<'uk' | 'en' | 'pl', PublicDocs> = { uk, en, pl }

export function getPublicDocs(locale: string): PublicDocs {
  if (locale === 'en' || locale === 'pl') return translations[locale]
  return translations.uk
}
export const publicDocSlugs = uk.articles.map((article) => article.slug)
export function getPublicDoc(locale: string, slug: string) {
  return getPublicDocs(locale).articles.find((article) => article.slug === slug)
}
