import { readFileSync } from 'node:fs'

import enAbout from '@/messages/en/pages/About.json'
import enLanding from '@/messages/en/pages/Landing.json'
import plAbout from '@/messages/pl/pages/About.json'
import plLanding from '@/messages/pl/pages/Landing.json'
import ukAbout from '@/messages/uk/pages/About.json'
import ukLanding from '@/messages/uk/pages/Landing.json'

const footerSource = readFileSync('components/features/Landing/LandingFooter.tsx', 'utf8')
const aboutSource = readFileSync('app/[locale]/(public)/about/page.tsx', 'utf8')

describe('QDIP ecosystem brand attribution', () => {
  it.each([
    { locale: 'en', about: enAbout, landing: enLanding },
    { locale: 'uk', about: ukAbout, landing: ukLanding },
    { locale: 'pl', about: plAbout, landing: plLanding },
  ])(
    '$locale uses the shared QDIP footer signature while About describes the actual integration',
    ({ about, landing }) => {
      expect(landing.Footer.ecosystem).toBe('Powered by QDIP')
      expect(about.Technology.title.length).toBeGreaterThan(0)
      expect(about.Technology.description).toContain('QDIP')
      expect(about.Technology.description).toContain('Dzvin')
      expect(about.Technology.cta.length).toBeGreaterThan(0)
      expect(JSON.stringify(about.Technology)).not.toMatch(/Powered by QDIP/i)
    }
  )

  it('links to the exact QDIP origin in both public surfaces', () => {
    expect(footerSource).toContain('href="https://qdip.ai"')
    expect(footerSource).toContain("{t('Footer.ecosystem')}")
    const copyright = footerSource.indexOf('Footer.copyright')
    const attribution = footerSource.indexOf('Footer.ecosystem')
    const backToTop = footerSource.indexOf('Footer.backToTop')
    expect(copyright).toBeGreaterThan(-1)
    expect(attribution).toBeGreaterThan(copyright)
    expect(backToTop).toBeGreaterThan(attribution)
    expect(footerSource).toMatch(
      /<div className="shadow-light text-center text-sm">[\s\S]*?Footer\.copyright[\s\S]*?<Link[\s\S]*?Footer\.ecosystem[\s\S]*?<\/Link>\s*<\/div>/
    )
    expect(aboutSource).toContain('href="https://qdip.ai"')
    expect(aboutSource).toContain("{t('Technology.title')}")
    expect(aboutSource).toContain("{t('Technology.description')}")
    expect(aboutSource).toContain("{t('Technology.cta')}")
  })
})
