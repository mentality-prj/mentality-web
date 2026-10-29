import { useTranslations } from 'next-intl'

import { GlassMedallion, type GlassTone } from './glass/GlassMedallion'
import type { GlyphName } from './glass/glyphs'
import { type WaterColors, WaterSurface } from './water/WaterSurface'
import { landingContainer, landingH2 } from './landingStyles'

const serviceCards: {
  key: 'cohortEvidence' | 'scenarioSimulation' | 'predictionEngine'
  glyph: GlyphName
  tone: GlassTone
  water: WaterColors
  /** Where the pebble rests on the water (percent of the tile). */
  at: { x: number; y: number; rotate: number }
}[] = [
  {
    key: 'cohortEvidence',
    glyph: 'journal',
    tone: 'sky',
    water: { deep: '#8fb7ea', mid: '#e3eefc', light: '#ffffff' },
    at: { x: 34, y: 58, rotate: -9 },
  },
  {
    key: 'scenarioSimulation',
    glyph: 'breath',
    tone: 'mint',
    water: { deep: '#78c9bb', mid: '#dcf5ef', light: '#ffffff' },
    at: { x: 58, y: 42, rotate: 6 },
  },
  {
    key: 'predictionEngine',
    glyph: 'rise',
    tone: 'peach',
    water: { deep: '#efae95', mid: '#fde6dc', light: '#fffaf3' },
    at: { x: 66, y: 62, rotate: 14 },
  },
]

export function ServicesSection() {
  const t = useTranslations('pages.Landing')

  return (
    <section aria-labelledby="services-heading" className="w-full bg-white">
      <div className={landingContainer}>
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-end md:gap-12">
          <h2 id="services-heading" className={`${landingH2} whitespace-pre-line`}>
            {t('Services.title')}
          </h2>
          <p className="max-w-xl text-base leading-[1.75] text-[#575570] tablet:text-lg">
            {t('Services.cards.intro.text')}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {serviceCards.map(({ key, glyph, tone, water, at }) => (
            <article key={key} className="group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] shadow-[0_24px_50px_-28px_rgba(60,60,120,0.45)]">
                <WaterSurface
                  colors={water}
                  source={{ x: at.x / 100, y: at.y / 100 }}
                  every={3.2}
                  still
                  className="absolute inset-0"
                />
                <GlassMedallion
                  glyph={glyph}
                  tone={tone}
                  size={84}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:-translate-y-[56%]"
                  style={{ left: `${at.x}%`, top: `${at.y}%`, rotate: `${at.rotate}deg` }}
                />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#302a4f]">{t(`Services.cards.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#575570] tablet:text-base">
                {t(`Services.cards.${key}.text`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
