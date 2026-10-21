import en from '@/messages/en/pages/Landing.json'
import pl from '@/messages/pl/pages/Landing.json'
import uk from '@/messages/uk/pages/Landing.json'

describe('public B2C landing copy', () => {
  it.each([
    { locale: 'uk', catalog: uk },
    { locale: 'en', catalog: en },
    { locale: 'pl', catalog: pl },
  ])('$locale has truthful self-support content across the landing', ({ catalog }) => {
    expect(catalog.Hero.title.length).toBeGreaterThan(5)
    expect(catalog.Hero.returnCta.length).toBeGreaterThan(5)
    expect(catalog.Hero.path.heading.length).toBeGreaterThan(5)
    expect(catalog.Hero.path.mood.length).toBeGreaterThan(5)
    expect(catalog.Hero.path.diary.length).toBeGreaterThan(5)
    expect(catalog.Hero.path.support.length).toBeGreaterThan(5)
    expect(catalog.Hero.path.note.length).toBeGreaterThan(5)
    expect(catalog.HowItWorks.steps.choose).toContain(' — ')
    expect(catalog.HowItWorks.steps.register).toContain(' — ')
    expect(catalog.HowItWorks.steps.receive).toContain(' — ')
    const allText = JSON.stringify(catalog)
    expect(allText).not.toContain('725+')
    expect(allText).not.toContain('testimonial')
  })
})
