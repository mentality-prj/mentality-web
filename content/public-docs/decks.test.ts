import { deckAudiences, getProductDeck } from './decks'

describe('public product presentations', () => {
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
