import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('Dzvin public docs design system guard', () => {
  const landing = read('app/[locale]/(public)/docs/page.tsx')
  const deck = read('app/[locale]/(public)/docs/decks/[audience]/page.tsx')
  const article = read('app/[locale]/(public)/docs/[slug]/page.tsx')

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

  it('preserves funding information and the original shared header', () => {
    expect(landing).toContain('fundingHeadline')
    expect(landing).toContain('fundingIntro')
    expect(landing).toContain('/docs/decks/investment')
    expect(landing).toContain('/docs/decks/grant')
    expect(landing).toContain('/docs/evidence-register')
    expect(landing).not.toContain('<Header')
  })
})
