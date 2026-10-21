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
    expect('note' in catalog.Hero.path).toBe(false)
    expect(catalog.HowItWorks.steps.choose).toContain(' — ')
    expect(catalog.HowItWorks.steps.register).toContain(' — ')
    expect(catalog.HowItWorks.steps.receive).toContain(' — ')
    const allText = JSON.stringify(catalog)
    expect(allText).not.toContain('725+')
    expect(allText).not.toContain('testimonial')
    expect(catalog.Hero.subtitle).not.toContain('простір для щоденної самопідтримки')
    expect(catalog.Hero.subtitle).not.toContain('to ease tension')
    expect(catalog.Platform.title.length).toBeGreaterThan(15)
    expect(catalog.Platform.primaryCta.length).toBeGreaterThan(5)
    expect(catalog.Platform.capabilities.analytics.title.length).toBeGreaterThan(5)
    expect(catalog.Products.b2b.title.length).toBeGreaterThan(5)
    expect(catalog.Products.b2c.title.length).toBeGreaterThan(5)
    expect(catalog.Products.rd.title.length).toBeGreaterThan(5)
    expect(catalog.Products.b2b.features.teams.length).toBeGreaterThan(5)
    expect(catalog.Products.rd.features.cohorts.length).toBeGreaterThan(5)
    expect(catalog.Hero.tryCta.length).toBeGreaterThan(5)
    expect(catalog.Preview.start.length).toBeGreaterThan(2)
    expect(catalog.Preview.withoutAccount.length).toBeGreaterThan(2)
    expect(catalog.Next.mood.title.length).toBeGreaterThan(2)
    expect(catalog.Next.diary.title.length).toBeGreaterThan(2)
    expect(catalog.Next.practice.title.length).toBeGreaterThan(2)
  })
})
