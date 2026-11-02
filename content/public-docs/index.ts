import en from './en.json'
import pl from './pl.json'
import uk from './uk.json'

export type PublicDocs = {
  title: string
  kicker: string
  lead: string
  fundingHeadline: string
  fundingIntro: string
  stageLabel: string
  stageDescription: string
  fundingCta: string
  fundingSecondaryCta: string
  fundingLibrary: string
  productLibrary: string
  evidenceLabel: string
  fundingNote: string
  browse: string
  referenceTitle: string
  featuredCta: string
  featuredNote: string
  back: string
  nav: string
  status: string
  links: string
  services: string
  faq: string
  privacy: string
  articles: {
    slug: string
    category: string
    title: string
    summary: string
    sections: { title: string; paragraphs: string[] }[]
  }[]
}
export function getPublicDocs(locale: string): PublicDocs {
  if (locale === 'en') return en
  if (locale === 'pl') return pl
  return uk
}
export const publicDocSlugs = uk.articles.map((article) => article.slug)
export function getPublicDoc(locale: string, slug: string) {
  return getPublicDocs(locale).articles.find((article) => article.slug === slug)
}
