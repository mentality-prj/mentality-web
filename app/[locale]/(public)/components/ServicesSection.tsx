import { MessageKeys, useTranslations } from 'next-intl'

import VerticalCard from '@/components/shared/Cards/VerticalCard'

type ServiceCardConfig = {
  titleKey?: string
  descriptionKey: string
  imageSrc?: string
  imageAltKey?: string
  variant?: 'default' | 'background'
  backgroundImageSrc?: string
  smoothing?: boolean
}

type LandingKeys = MessageKeys<typeof import('@/messages/uk/pages/Landing.json'), ''>

const serviceCards: ServiceCardConfig[] = [
  {
    descriptionKey: 'Services.cards.intro.text',
    variant: 'background',
    backgroundImageSrc: '/services/rain.jpg',
    smoothing: true,
  },

  {
    titleKey: 'Services.cards.cohortEvidence.title',
    descriptionKey: 'Services.cards.cohortEvidence.text',
    imageSrc: '/services/communion.jpg',
    imageAltKey: 'Services.cards.cohortEvidence.title',
  },
  {
    titleKey: 'Services.cards.scenarioSimulation.title',
    descriptionKey: 'Services.cards.scenarioSimulation.text',
    imageSrc: '/services/breathing.jpg',
    imageAltKey: 'Services.cards.scenarioSimulation.title',
  },
  {
    titleKey: 'Services.cards.predictionEngine.title',
    descriptionKey: 'Services.cards.predictionEngine.text',
    imageSrc: '/services/monitoring.jpg',
    imageAltKey: 'Services.cards.predictionEngine.title',
  },
]

export function ServicesSection() {
  const t = useTranslations('pages.Landing')

  return (
    <section className="w-full bg-[linear-gradient(180deg,#fff_0%,#f7fbff_100%)] py-8 tablet:py-12">
      <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
        <div className="rounded-[32px] border border-[#dce7f5] bg-white p-4 shadow-[0_12px_36px_rgba(67,104,230,0.08)] tablet:p-6 md:p-8">
          <div className="mb-5 tablet:px-6 md:mb-10 md:px-8">
            <h2 className="landing-h2 whitespace-pre-line text-textcolor-primary tablet:text-4xl">
              {t('Services.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-default lg:grid-cols-4">
            {serviceCards.map((card) => {
              const title = card.titleKey ? t(card.titleKey as LandingKeys) : undefined
              const description = t(card.descriptionKey as LandingKeys)
              const imageAlt = card.imageAltKey ? t(card.imageAltKey as LandingKeys) : undefined
              const smoothing = card['smoothing']

              return (
                <VerticalCard
                  key={card.descriptionKey}
                  title={title}
                  description={description}
                  imageSrc={card.imageSrc}
                  imageAlt={imageAlt}
                  variant={card.variant}
                  backgroundImageSrc={card.backgroundImageSrc}
                  {...(smoothing !== undefined ? { ['smoothing']: smoothing } : {})}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
