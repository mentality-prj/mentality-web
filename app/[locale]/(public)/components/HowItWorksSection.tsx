import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import { HighlightInfoCard } from './HighlightInfoCard'
import { landingContainer, landingH2, landingPrimaryCta } from './landingStyles'

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
  },
] as const

export function HowItWorksSection() {
  const t = useTranslations('pages.Landing')

  const howItWorksSteps = stepsSectionConfig.steps.map((stepKey, index) => {
    const rawText = t(`HowItWorks.steps.${stepKey}`)
    const [stepTitle, rawDescription] = rawText.split(' — ')
    const stepDescription = rawDescription
      ? rawDescription.charAt(0).toUpperCase() + rawDescription.slice(1)
      : undefined
    const isActive = index === 0
    return (
      <li key={stepKey}>
        <div
          className={`flex items-center gap-sm rounded-[24px] px-5 max-md:flex-wrap md:items-start ${
            isActive ? 'bg-white/70 py-5 shadow-[0_12px_36px_rgba(93,78,210,0.12)] backdrop-blur-sm' : ''
          }`}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              isActive
                ? 'bg-[linear-gradient(110deg,#7545dd,#4368e6)] text-white shadow-[0_10px_20px_rgba(93,78,210,0.28)]'
                : 'border border-[var(--outline-tertiary)] bg-white text-textcolor-secondary'
            }`}
          >
            {index + 1}
          </span>
          <div className="max-md:contents md:space-y-1">
            <h3 className="text-lg font-semibold leading-[130%] text-[#302a4f] max-md:flex-1">
              {stepTitle ?? rawText}
            </h3>
            {stepDescription && (
              <p className="text-sm leading-relaxed text-textcolor-secondary max-md:basis-full">{stepDescription}</p>
            )}
          </div>
        </div>
      </li>
    )
  })

  return (
    <section className="w-full bg-[#f8f6ff]">
      <div
        className={`${landingContainer} grid grid-cols-1 gap-8 tablet:gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center`}
      >
        <div className="rounded-[32px] border border-[#e1d1f7] bg-[linear-gradient(145deg,#f9f2ff,#eef4ff)] p-6 md:p-8 lg:p-10">
          <h2 className={landingH2}>{t(stepsSectionConfig.titleKey)}</h2>
          <p className="mt-1 text-sm text-textcolor-secondary">{t(stepsSectionConfig.subtitleKey)}</p>
          <ol className="mt-6 flex flex-col gap-default">{howItWorksSteps}</ol>
          <div className="mt-6 flex justify-center tablet:block lg:mt-8">
            <Link href={Routes.AUTH} className={landingPrimaryCta}>
              {t(stepsSectionConfig.ctaKey)}
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-10 md:items-start md:justify-between">
          {highlightCards.map((card) => {
            const title = t(card.titleKey)
            const subtitle = t(card.subtitleKey)
            return <HighlightInfoCard key={card.titleKey} title={title} subtitle={subtitle} />
          })}
        </div>
      </div>
    </section>
  )
}
