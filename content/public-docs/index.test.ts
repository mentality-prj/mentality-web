import { getPublicDoc, getPublicDocs, publicDocSlugs } from './index'

const fundingSlugs = [
  'investment-thesis',
  'scientific-novelty',
  'development-progress',
  'funding-roadmap',
  'validation-plan',
  'funding-request',
]

describe('public investor documentation', () => {
  it('provides a consistent 20-chapter dossier across all languages', () => {
    expect(new Set(publicDocSlugs).size).toBe(20)
    for (const locale of ['uk', 'en', 'pl']) {
      const docs = getPublicDocs(locale)
      expect(docs).not.toHaveProperty('notice')
      expect(docs.articles.map((article) => article.slug)).toEqual(publicDocSlugs)
      expect(docs.articles.slice(0, 6).map((article) => article.slug)).toEqual(fundingSlugs)
      expect(docs.articles.slice(0, 6).every((article) => article.sections.length >= 6)).toBe(true)
      expect(docs.articles.every((article) => article.sections.length >= 2)).toBe(true)
      expect(docs.stageDescription.length).toBeGreaterThan(60)
      expect(docs.fundingHeadline.length).toBeGreaterThan(15)
      for (const slug of fundingSlugs) expect(getPublicDoc(locale, slug)).toBeDefined()
    }
  })
  it('uses the public QDIP research narrative without leaking secrets', () => {
    const forbidden = /(?:private.endpoint|internal.token|service.account|model.weights|hmac.secret|secret.key)/i
    for (const locale of ['uk', 'en', 'pl']) {
      const docs = getPublicDocs(locale)
      expect(JSON.stringify(docs)).not.toMatch(forbidden)
      expect(getPublicDoc(locale, 'scientific-novelty')?.sections.length).toBeGreaterThanOrEqual(6)
    }
  })
  it('rejects unknown documents', () => {
    expect(getPublicDoc('uk', '../internal')).toBeUndefined()
  })
})
