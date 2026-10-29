import type { ComponentType } from 'react'
import { useTranslations } from 'next-intl'

import { BreathIllustration, HistoryIllustration, JournalIllustration } from './LandingIllustrations'
import { landingContainer, landingH2 } from './landingStyles'

const serviceCards: {
  key: 'cohortEvidence' | 'scenarioSimulation' | 'predictionEngine'
  Illustration: ComponentType<{ className?: string }>
}[] = [
  { key: 'cohortEvidence', Illustration: JournalIllustration },
  { key: 'scenarioSimulation', Illustration: BreathIllustration },
  { key: 'predictionEngine', Illustration: HistoryIllustration },
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
          {serviceCards.map(({ key, Illustration }) => (
            <article key={key} className="flex flex-col">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-[#ece6f6]">
                <Illustration />
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
