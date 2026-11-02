import { useTranslations } from 'next-intl'

import { DoodleIcon, type DoodleName, type DoodleTone } from './doodle/DoodleIcon'
import { landingContainer, landingH2 } from './landingStyles'

const serviceCards: {
  key: 'cohortEvidence' | 'scenarioSimulation' | 'predictionEngine'
  glyph: DoodleName
  tone: DoodleTone
  /** Disc offset and tilt, so the three tiles don't repeat one layout. */
  at: { x: number; y: number; rotate: number }
}[] = [
  {
    key: 'cohortEvidence',
    glyph: 'journal',
    tone: 'sky',
    at: { x: 44, y: 54, rotate: -8 },
  },
  {
    key: 'scenarioSimulation',
    glyph: 'breath',
    tone: 'mint',
    at: { x: 54, y: 46, rotate: 5 },
  },
  {
    key: 'predictionEngine',
    glyph: 'rise',
    tone: 'peach',
    at: { x: 52, y: 55, rotate: -4 },
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
          {serviceCards.map(({ key, glyph, tone, at }) => (
            <article key={key} className="group flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#efe9e2] bg-[#fbf9f6]">
                <span aria-hidden="true" className="absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-[#d9d2e6]" />
                <span
                  aria-hidden="true"
                  className="absolute bottom-[18%] right-[14%] h-3 w-3 rounded-full bg-[#e7ddd2]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-[22%] top-[12%] h-1.5 w-1.5 rounded-full bg-[#d9d2e6]"
                />
                <DoodleIcon
                  name={glyph}
                  tone={tone}
                  size={196}
                  className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-[1.03]"
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
