import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

import { HighlightInfoCard } from './HighlightInfoCard'

const stepsKeys = ['register', 'choose', 'receive'] as const

const stepsSectionConfig = {
  titleKey: 'HowItWorks.title',
  subtitleKey: 'HowItWorks.subtitle',
  ctaKey: 'HowItWorks.cta',
  steps: stepsKeys,
} as const

const highlightCards = [
  {
    titleKey: 'ReduceStress.title',
    subtitleKey: 'ReduceStress.subtitle',
    imageSrc: '/services/consultation.png',
    imageAltKey: 'ReduceStress.title',
  },
] as const

export function HowItWorksSection() {
  const t = useTranslations('pages.Landing')

  const howItWorksSteps = stepsSectionConfig.steps.map((stepKey, index) => {
    const rawText = t(`HowItWorks.steps.${stepKey}`)
    const [stepTitle, stepDescription] = rawText.split(' — ')
    const isActive = index === 0
    return (
      <li key={stepKey}>
        <div
          className={`flex flex-col gap-sm rounded-[24px] p-5 md:gap-0 ${
            isActive ? 'bg-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.12)] backdrop-blur-sm' : ''
          }`}
        >
          <div className="flex items-center gap-sm">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-[0_10px_20px_rgba(37,99,235,0.35)]'
                  : 'border border-[var(--outline-tertiary)] bg-white text-textcolor-secondary'
              }`}
            >
              {index + 1}
            </span>

            <h4 className="text-title text-lg leading-[130%]">{stepTitle ?? rawText}</h4>
          </div>
          {stepDescription && (
            <p className="text-sm leading-relaxed text-textcolor-secondary md:ml-[52px] md:mt-1">{stepDescription}</p>
          )}
        </div>
      </li>
    )
  })

  return (
    <section className="mb-7 w-full tablet:mb-14">
      <div className="container-max-width mx-auto grid grid-cols-1 gap-5 px-4 tablet:gap-10 tablet:px-6 md:grid-cols-[1.1fr_0.9fr] md:px-8 lg:px-10">
        <div className="rounded-[40px] bg-background-muted p-6 md:p-8 lg:p-10">
          <h2 className="landing-h2">{t(stepsSectionConfig.titleKey)}</h2>
          <p className="mt-1 text-sm text-textcolor-secondary">{t(stepsSectionConfig.subtitleKey)}</p>
          <ol className="mt-6 flex flex-col gap-5 md:gap-default">{howItWorksSteps}</ol>
          <div className="mt-4 flex justify-center tablet:mt-8 tablet:block">
            <Button asChild variant="volume" size="large">
              <Link href={Routes.AUTH}>{t(stepsSectionConfig.ctaKey)}</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-10 md:items-start md:justify-between">
          {highlightCards.map((card) => {
            const title = t(card.titleKey)
            const subtitle = t(card.subtitleKey)
            const imageAlt = t(card.imageAltKey)
            return (
              <HighlightInfoCard
                key={card.titleKey}
                title={title}
                subtitle={subtitle}
                imageSrc={card.imageSrc}
                imageAlt={imageAlt}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
