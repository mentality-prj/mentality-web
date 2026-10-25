import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('Dzvin public docs design system guard', () => {
  const landing = read('app/[locale]/(public)/docs/page.tsx')
  const deck = read('app/[locale]/(public)/docs/decks/[audience]/page.tsx')
  const article = read('app/[locale]/(public)/docs/[slug]/page.tsx')
  const deckToolbar = read('app/[locale]/(public)/docs/decks/DeckToolbar.tsx')
  const landingHeader = read('components/features/Landing/LandingHeader.tsx')
  const landingDrawer = read('components/Layout/MobileNavDrawer/LandingMobileMenu.tsx')

  it('keeps the existing light documentation layout and brand components', () => {
    expect(landing).toContain('bg-[radial-gradient(circle_at_top_left')
    expect(landing).toContain('rounded-3xl border border-slate-200 bg-white/90')
    expect(landing).toContain('text-slate-900')
    expect(landing).not.toContain('bg-gradient-to-br from-slate-950')
    expect(landing).not.toContain('rounded-[2rem] bg-gradient-to-br')
  })

  it('never places default dark global headings onto dark deck covers', () => {
    expect(deck).toContain('dzvin-slide-cover')
    expect(deck).toContain('bg-background-muted')
    expect(deck).toContain('text-textcolor-primary')
    expect(deck).not.toContain('bg-gradient-to-br from-slate-950')
    expect(article).not.toContain('rounded-3xl bg-slate-950')
  })

  it('keeps deck content readable at mobile portrait and landscape widths', () => {
    expect(deck.split('xl:aspect-[16/9]')).toHaveLength(3)
    expect(deck).not.toContain(' aspect-[16/9]')
    expect(deck).toContain('gap-8 overflow-hidden')
    expect(deck).toContain('sm:p-8 lg:p-14')
    expect(deckToolbar).toContain('grid grid-cols-2')
    expect(deckToolbar).toContain('min-w-0 items-center justify-center')
    expect(landingHeader).toContain('hidden lg:block')
    expect(landingDrawer).toContain('lg:hidden')
  })

  it('preserves funding information and the original shared header', () => {
    expect(landing).toContain('fundingHeadline')
    expect(landing).toContain('fundingIntro')
    expect(landing).toContain('/docs/decks/investment')
    expect(landing).toContain('/docs/decks/grant')
    expect(landing).toContain('/docs/evidence-register')
    expect(landing).not.toContain('<Header')
  })
})
