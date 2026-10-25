import { getPublicDoc, getPublicDocs, publicDocSlugs } from './index'

const fundingSlugs = [
  'funding-brief',
  'investment-thesis',
  'scientific-novelty',
  'development-progress',
  'evidence-register',
  'funding-roadmap',
  'execution-plan',
  'validation-plan',
  'funding-request',
]

describe('public investor documentation', () => {
  it('provides a consistent 23-chapter dossier across all languages', () => {
    expect(new Set(publicDocSlugs).size).toBe(23)
    for (const locale of ['uk', 'en', 'pl']) {
      const docs = getPublicDocs(locale)
      expect(docs).not.toHaveProperty('notice')
      expect(docs.articles.map((article) => article.slug)).toEqual(publicDocSlugs)
      expect(docs.articles.slice(0, 9).map((article) => article.slug)).toEqual(fundingSlugs)
      expect(docs.articles.slice(0, 9).every((article) => article.sections.length >= 6)).toBe(true)
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
  it('includes an investor one-pager, QDIP science and work-package gates in all languages', () => {
    for (const locale of ['uk', 'en', 'pl']) {
      const brief = getPublicDoc(locale, 'funding-brief')
      const science = getPublicDoc(locale, 'scientific-novelty')
      const plan = getPublicDoc(locale, 'execution-plan')
      expect(brief?.sections.length).toBeGreaterThanOrEqual(6)
      expect(science?.sections.some((section) => section.paragraphs.join(' ').includes('QDIP'))).toBe(true)
      expect(plan?.sections.some((section) => section.title.includes('WP1'))).toBe(true)
      expect(plan?.sections.some((section) => section.title.includes('WP4'))).toBe(true)
    }
  })
  it('presents a fundable opportunity instead of asking visitors to construct our budget', () => {
    const titles = {
      uk: 'Інвестиційна можливість Dzvin.co',
      en: 'Dzvin.co Investment Opportunity',
      pl: 'Dzvin.co — możliwość inwestycyjna',
    }
    for (const locale of ['uk', 'en', 'pl'] as const) {
      const article = getPublicDoc(locale, 'funding-request')
      expect(article?.title).toBe(titles[locale])
      expect(article?.sections).toHaveLength(6)
      expect(article?.sections.every((section) => section.paragraphs.length >= 2)).toBe(true)
      expect(JSON.stringify(article)).not.toMatch(
        /(?:CRM|вигадує суму|fikcyjnych inwestorów|fabricated estimate|на що підуть кошти)/i
      )
    }
  })
  it('keeps enterprise project documentation consistent across all locales', () => {
    const expectedTitles = {
      uk: 'Інвестиційна можливість Dzvin.co',
      en: 'Dzvin.co Investment Opportunity',
      pl: 'Dzvin.co — możliwość inwestycyjna',
    }
    for (const locale of ['uk', 'en', 'pl'] as const) {
      const docs = getPublicDocs(locale)
      expect(docs.articles).toHaveLength(23)
      expect(getPublicDoc(locale, 'funding-request')?.title).toBe(expectedTitles[locale])
      expect(getPublicDoc(locale, 'scientific-novelty')?.sections.length).toBeGreaterThanOrEqual(7)
      expect(getPublicDoc(locale, 'economics')?.sections).toHaveLength(3)
      for (const article of docs.articles) {
        expect(article.summary.length).toBeGreaterThan(25)
        expect(article.sections.every((section) => section.paragraphs.length >= 2)).toBe(true)
      }
    }
  })
  it('keeps internal editorial notes, fabricated returns and ROI calculators out of public documents', () => {
    const banned = /(?:we don.t invent|ми не вигадуємо|nie wymyślamy|не є CRM|not a CRM|kalkulator nie jest|не комерційна оферта|traction|підставляйте свої дані)/i
    for (const locale of ['uk', 'en', 'pl']) {
      const docs = getPublicDocs(locale)
      const text = docs.articles.map((article) =>
        [article.title, article.summary, ...article.sections.flatMap((section) => [section.title, ...section.paragraphs])].join(' ')
      ).join(' ')
      expect(text).not.toMatch(banned)
    }
  })
  it('rejects unknown documents', () => {
    expect(getPublicDoc('uk', '../internal')).toBeUndefined()
  })
})
