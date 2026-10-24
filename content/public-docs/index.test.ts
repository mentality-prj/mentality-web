import { getPublicDoc, getPublicDocs, publicDocSlugs } from './index'

describe('public documentation', () => {
  it('has the same six valid slugs in all three locales', () => {
    expect(new Set(publicDocSlugs).size).toBe(6)
    for (const locale of ['uk', 'en', 'pl']) {
      const docs = getPublicDocs(locale)
      expect(docs).not.toHaveProperty('notice')
      expect(docs.articles.map((doc) => doc.slug)).toEqual(publicDocSlugs)
      expect(docs.articles.every((doc) => doc.sections.length >= 2)).toBe(true)
      for (const slug of publicDocSlugs) expect(getPublicDoc(locale, slug)).toBeDefined()
    }
  })
  it('keeps implementation details out of public copy', () => {
    const forbidden = /qdip|kernel|worker|hmac|api.key|private.endpoint|internal.token|service.account|model.weights/i
    for (const locale of ['uk', 'en', 'pl']) expect(JSON.stringify(getPublicDocs(locale))).not.toMatch(forbidden)
  })
  it('rejects unknown documents', () => {
    expect(getPublicDoc('uk', '../internal')).toBeUndefined()
  })
})
