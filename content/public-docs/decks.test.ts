import { deckAudiences, getProductDeck } from './decks'

describe('public product presentations', () => {
  it('keeps grant work packages aligned with the four-package investment programme', () => {
    for (const locale of ['uk', 'en', 'pl'] as const) {
      const grant = getProductDeck(locale, 'grant')
      const workPackageSlide = grant.slides.find((slide) => slide.points.some((point) => point.startsWith('WP1')))
      expect(workPackageSlide).toBeDefined()
      for (const number of [1, 2, 3, 4]) {
        expect(workPackageSlide?.points.some((point) => point.startsWith(`WP${number}`))).toBe(true)
      }
    }
  })

  it('keeps presentation claims aligned with a project still in development', () => {
    const obsolete = /(?:No asserted revenue or traction|Unit economics remain unknown|Wartość pilotażu trzeba sprawdzić|Przygotujmy demo|Відкрийте особисті сервіси|Немає заявлених продажів|No invented grant commitments)/i
    for (const locale of ['uk', 'en', 'pl']) {
      for (const audience of deckAudiences) {
        const deck = getProductDeck(locale, audience)
        const publishedCopy = [
          deck.title,
          deck.subtitle,
          ...deck.slides.flatMap((slide) => [slide.title, slide.description, ...slide.points]),
        ].join(' ')
        expect(publishedCopy).not.toMatch(obsolete)
      }
    }
  })

  it('provides seven substantial slides for every audience in all locales', () => {
    for (const locale of ['uk', 'en', 'pl']) {
      for (const audience of deckAudiences) {
        const deck = getProductDeck(locale, audience)
        expect(deck.title.length).toBeGreaterThan(10)
        expect(deck.slides).toHaveLength(audience === 'investment' || audience === 'grant' ? 10 : 7)
        for (const slide of deck.slides) {
          expect(slide.title.length).toBeGreaterThan(5)
          expect(slide.description.length).toBeGreaterThan(15)
          expect(slide.points.length).toBeGreaterThanOrEqual(2)
        }
      }
    }
  })
})
