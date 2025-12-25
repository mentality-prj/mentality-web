import { MessageKeys, useTranslations } from 'next-intl'

import CardContainer from '@/components/Cards/CardContainer'
import VerticalCard from '@/components/Cards/VerticalCard'

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
    titleKey: 'Services.cards.coaching.title',
    descriptionKey: 'Services.cards.coaching.text',
    imageSrc: '/services/communion.jpg',
    imageAltKey: 'Services.cards.coaching.title',
  },
  {
    titleKey: 'Services.cards.meditations.title',
    descriptionKey: 'Services.cards.meditations.text',
    imageSrc: '/services/breathing.jpg',
    imageAltKey: 'Services.cards.meditations.title',
  },
  {
    titleKey: 'Services.cards.monitoring.title',
    descriptionKey: 'Services.cards.monitoring.text',
    imageSrc: '/services/monitoring.jpg',
    imageAltKey: 'Services.cards.monitoring.title',
  },
]

export function ServicesSection() {
  const t = useTranslations('pages.Landing')

  return (
    <CardContainer className="mb-12">
      <div className="mb-10 px-8">
        <h1 className="landing-h1">{t('Services.title')}</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
    </CardContainer>
  )
}
