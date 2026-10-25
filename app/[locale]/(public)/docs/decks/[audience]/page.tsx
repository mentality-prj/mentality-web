import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { type DeckAudience, deckAudiences, getProductDeck } from '@/content/public-docs/decks'

import { DeckToolbar } from '../DeckToolbar'

import '../deck.css'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string; audience: string }> }

const wording = {
  uk: {
    print: 'Друк / зберегти PDF',
    full: 'Повний екран',
    overview: 'Документація',
    demo: 'Запросити демо',
    funding: 'Обговорити фінансування',
    fundingLabel: 'Інвестиції та дослідження',
    label: 'Презентація продукту',
    page: 'Слайд',
    illustration: 'Схематичне відображення можливостей, не клієнтські дані',
  },
  en: {
    print: 'Print / save as PDF',
    full: 'Full screen',
    overview: 'Documentation',
    demo: 'Request demo',
    funding: 'Discuss funding',
    fundingLabel: 'Investment & Research',
    label: 'Product presentation',
    page: 'Slide',
    illustration: 'Conceptual product workflow, not customer data',
  },
  pl: {
    print: 'Drukuj / zapisz PDF',
    full: 'Pełny ekran',
    overview: 'Dokumentacja',
    demo: 'Poproś o demo',
    funding: 'Omów finansowanie',
    fundingLabel: 'Inwestycje i badania',
    label: 'Prezentacja produktu',
    page: 'Slajd',
    illustration: 'Schemat procesu, nie dane klienta',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, audience } = await params
  if (!deckAudiences.includes(audience as DeckAudience)) return {}
  const deck = getProductDeck(locale, audience as DeckAudience)
  return {
    title: `${deck.title} | Dzvin.co`,
    description: deck.subtitle,
    alternates: { canonical: `https://docs.dzvin.co/${locale}/docs/decks/${audience}` },
    openGraph: { title: deck.title, description: deck.subtitle, type: 'article' },
  }
}

export default async function ProductDeckPage({ params }: Props) {
  const { locale, audience } = await params
  if (!deckAudiences.includes(audience as DeckAudience)) notFound()
  const lang = locale === 'en' || locale === 'pl' ? locale : 'uk'
  const c = wording[lang]
  const deck = getProductDeck(lang, audience as DeckAudience)
  const isFunding = audience === 'investment' || audience === 'grant'
  const demoUrl = isFunding
    ? `https://www.dzvin.co/${lang}/contacts?source=docs&intent=funding&segment=${audience}`
    : `https://www.dzvin.co/${lang}/contacts?source=docs&intent=demo&segment=${audience}`

  return (
    <div className="dzvin-deck min-h-screen bg-slate-100">
      <DeckToolbar printLabel={c.print} fullscreenLabel={c.full} />
      <div className="dzvin-deck-shell mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8">
        <div className="dzvin-deck-links flex flex-wrap items-center justify-between gap-3 text-sm">
          <a className="font-semibold text-violet-700 hover:underline" href={`/${lang}/docs`}>
            {c.overview}
          </a>
          <a className="inline-flex items-center gap-1 font-semibold text-violet-700 hover:underline" href={demoUrl}>
            {isFunding ? c.funding : c.demo}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <section className="dzvin-slide dzvin-slide-cover relative flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-800 p-8 text-white shadow-xl md:p-14">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="font-semibold tracking-[0.25em] text-violet-200">DZVIN.CO</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">{isFunding ? c.fundingLabel : c.label}</span>
          </div>
          <div className="relative z-10 max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">{isFunding ? c.fundingLabel : c.label}</p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-6xl">{deck.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-2xl">{deck.subtitle}</p>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full border-[54px] border-violet-400/20"
          />
          <span className="relative z-10 text-sm text-violet-200">Dzvin.co · 2026</span>
        </section>
        {deck.slides.map((slide, index) => (
          <section
            key={slide.title}
            className="dzvin-slide flex aspect-[16/9] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-14"
            aria-label={`${c.page} ${index + 2}: ${slide.title}`}
          >
            <div>
              <div className="mb-8 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-widest text-violet-700">DZVIN.CO</span>
                <span className="text-sm text-slate-400">
                  {String(index + 2).padStart(2, '0')} / {String(deck.slides.length + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
                {slide.title}
              </h2>
              <p className="mt-5 max-w-4xl text-base leading-relaxed text-slate-600 md:text-xl">{slide.description}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 md:gap-5">
              {slide.points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-3 md:p-5"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-violet-700" aria-hidden="true" />
                  <span className="text-sm font-semibold leading-relaxed text-slate-800 md:text-lg">{point}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <span>{c.illustration}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </section>
        ))}
        <div className="dzvin-deck-links flex flex-wrap items-center justify-between gap-4 pb-10 text-sm">
          <a className="font-semibold text-violet-700 hover:underline" href={`/${lang}/docs`}>
            {c.overview}
          </a>
          <a
            className="rounded-full bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800"
            href={demoUrl}
          >
            {isFunding ? c.funding : c.demo}
          </a>
        </div>
      </div>
    </div>
  )
}
