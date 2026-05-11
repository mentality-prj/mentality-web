import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BadgeInfo,
  CheckCircle2,
  Lightbulb,
  Search,
  SlidersHorizontal,
  Users2,
  Workflow,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ArchitectureLayersShowcase } from '@/app/[locale]/(public)/components/ArchitectureLayersShowcase'
import { IconFeatureList, type IconFeatureListItem } from '@/components/shared/Content/IconFeatureList'
import { ImpactMetricCard } from '@/components/shared/Content/ImpactMetricCard'
import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { PageTitle } from '@/ds/components/PageTitle'
import { cn } from '@/lib/utils'

const forWhomConfig = [
  {
    key: 'user',
    className: 'bg-[linear-gradient(145deg,rgba(216,250,228,0.96),rgba(187,247,208,0.9))]',
    percentageClassName: 'text-[#2f7a56]',
  },
  {
    key: 'business',
    className: 'bg-[linear-gradient(145deg,rgba(212,232,255,0.96),rgba(147,197,253,0.88))]',
    percentageClassName: 'text-[#2f668f]',
  },
  {
    key: 'research',
    className:
      'bg-[linear-gradient(145deg,rgba(227,203,248,0.98)_0%,rgba(204,155,246,0.92)_56%,rgba(219,93,234,0.88)_100%)]',
    percentageClassName: 'text-[#7a3db8]',
  },
] as const

const evolutionIcons: Record<'happened' | 'means' | 'next' | 'action' | 'evidence', LucideIcon> = {
  happened: Search,
  means: Lightbulb,
  next: ArrowRight,
  action: SlidersHorizontal,
  evidence: CheckCircle2,
}

const valueIcons: Record<'cohort' | 'explainable' | 'outcome', LucideIcon> = {
  cohort: Users2,
  explainable: BadgeInfo,
  outcome: Workflow,
}

export default function AboutPage() {
  const t = useTranslations('pages.About')
  const evolutionStepKeys = ['happened', 'means', 'next', 'action', 'evidence'] as const
  const evolutionContextKeys = ['signal', 'prediction', 'validation'] as const
  const valuePointKeys = ['cohort', 'explainable', 'outcome'] as const
  const evolutionItems: IconFeatureListItem[] = evolutionStepKeys.map((key) => {
    const StepIcon = evolutionIcons[key as keyof typeof evolutionIcons]

    return {
      key,
      icon: <StepIcon className="h-5 w-5" />,
      title: t(`Evolution.steps.${key}`),
      description: t(`Evolution.stepDescriptions.${key}`),
    }
  })
  const evolutionContextItems: IconFeatureListItem[] = evolutionContextKeys.map((key, index) => {
    return {
      key,
      icon: (
        <span className="text-[1.85rem] font-semibold leading-none tracking-[-0.04em]">
          {String(index + 1).padStart(2, '0')}
        </span>
      ),
      title: t(`Evolution.context.items.${key}.title`),
      description: t(`Evolution.context.items.${key}.description`),
    }
  })
  const valueItems: IconFeatureListItem[] = valuePointKeys.map((key) => {
    const ValueIcon = valueIcons[key as keyof typeof valueIcons]

    return {
      key,
      icon: <ValueIcon className="h-7 w-7 stroke-[1.8]" />,
      title: t(`Value.points.${key}`),
    }
  })

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.8),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(254,243,199,0.75),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-12 md:py-16">
      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <MosaicGrid>
            <MosaicGridItem xlSpan={7}>
              <div className="h-full rounded-[32px] bg-white p-8 shadow-sm md:p-10">
                <PageTitle title={t('title')} className="max-w-4xl" titleClassName="landing-page-title" />
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('intro')}
                </p>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('introExtended')}
                </p>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={5}>
              <div className="h-full p-6 md:p-8">
                <h2 className="landing-section-title">{t('Value.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {t('Value.description')}
                </p>

                <ul className="mt-6 flex flex-col">
                  {valueItems.map((item, index) => {
                    const hasDivider = index < valueItems.length - 1

                    return (
                      <li
                        key={item.key}
                        className={cn('flex items-center gap-4 py-4', hasDivider && 'border-black/8 border-b')}
                      >
                        <span aria-hidden="true" className="flex-none text-[#2f668f]">
                          {item.icon}
                        </span>

                        <p className="text-[0.98rem] font-medium leading-relaxed text-textcolor-primary md:text-base">
                          {item.title}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="mb-6 max-w-4xl md:mb-8">
            <h2 className="landing-section-title">{t('Evolution.title')}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textcolor-secondary md:text-base">
              {t('Evolution.description')}
            </p>
          </div>

          <MosaicGrid className="xl:gap-8">
            <MosaicGridItem xlSpan={5}>
              <div className="flex h-full flex-col rounded-[28px] bg-background-muted p-6 md:p-8">
                <p className="landing-section-eyebrow">{t('Evolution.context.eyebrow')}</p>
                <h3 className="landing-card-title mt-2 max-w-[26rem]">{t('Evolution.context.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {t('Evolution.context.description')}
                </p>

                <IconFeatureList
                  items={evolutionContextItems}
                  className="mt-5"
                  itemClassName="gap-5"
                  iconWrapperClassName="h-auto w-12 items-start justify-start rounded-none bg-transparent text-textcolor-primary/30"
                  titleClassName="text-sm font-medium leading-relaxed md:text-base"
                  descriptionClassName="text-sm leading-relaxed md:text-base"
                />
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={7}>
              <div className="h-full p-6 md:p-8">
                <IconFeatureList
                  items={evolutionItems}
                  className="h-full"
                  iconWrapperClassName="bg-note text-textcolor-primary ring-1 ring-black/5"
                  titleClassName="text-base md:text-lg"
                  descriptionClassName="max-w-[36rem] text-sm leading-relaxed md:text-base"
                  itemClassName="gap-5"
                />
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section aria-label={t('ForWhom.title')} className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="grid gap-4 xl:grid-cols-3">
            {forWhomConfig.map(({ key, className, percentageClassName }) => (
              <ImpactMetricCard
                key={key}
                highlightValue={t(`ForWhom.${key}.highlightValue`)}
                highlightLabel={t(`ForWhom.${key}.highlightLabel`)}
                title={t(`ForWhom.${key}.title`)}
                description={t(`ForWhom.${key}.description`)}
                className={cn('min-h-[18rem]', className)}
                highlightClassName={percentageClassName}
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label={t('Architecture.title')} className="mb-16 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <ArchitectureLayersShowcase />
        </div>
      </section>
    </div>
  )
}
