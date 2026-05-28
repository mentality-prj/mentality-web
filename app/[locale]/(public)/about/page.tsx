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
import { IconStatementList, type IconStatementListItem } from '@/components/shared/Content/IconStatementList'
import { ImpactMetricCard } from '@/components/shared/Content/ImpactMetricCard'
import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { NumberedFeatureList, type NumberedFeatureListItem } from '@/components/shared/Content/NumberedFeatureList'
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
  const evolutionContextItems: NumberedFeatureListItem[] = evolutionContextKeys.map((key) => {
    return {
      key,
      title: t(`Evolution.context.items.${key}.title`),
      description: t(`Evolution.context.items.${key}.description`),
    }
  })
  const valueItems: IconStatementListItem[] = valuePointKeys.map((key) => {
    const ValueIcon = valueIcons[key as keyof typeof valueIcons]

    return {
      key,
      icon: <ValueIcon className="h-7 w-7 stroke-[1.8]" />,
      text: t(`Value.points.${key}`),
    }
  })

  return (
    <div className="flex flex-col gap-8 bg-[radial-gradient(circle_at_top_left,rgba(219,234,254,0.8),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(254,243,199,0.75),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] py-8 tablet:py-10 sm:py-12 md:gap-12 md:py-16">
      <section className="w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <MosaicGrid>
            <MosaicGridItem xlSpan={7}>
              <div className="h-full px-2 py-4 md:px-0 md:py-6">
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
              <div className="landing-glass-panel h-full rounded-[32px] p-6 md:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(191,219,254,0.55),rgba(255,255,255,0)_38%),radial-gradient(circle_at_85%_18%,rgba(192,132,252,0.26),rgba(255,255,255,0)_34%),radial-gradient(circle_at_18%_88%,rgba(110,231,183,0.24),rgba(255,255,255,0)_30%),linear-gradient(145deg,rgba(239,246,255,0.9),rgba(236,253,245,0.8)_52%,rgba(233,213,255,0.72))]"
                />

                <div className="relative z-10">
                  <h2 className="landing-section-title">{t('Value.title')}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                    {t('Value.description')}
                  </p>

                  <IconStatementList
                    items={valueItems}
                    className="mt-4 md:mt-6"
                    dividerClassName="border-black/[0.09]"
                    iconClassName="text-[#2f668f]"
                  />
                </div>
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>
      <section className="w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="mb-6 max-w-4xl md:mb-8">
            <h2 className="landing-section-title">{t('Evolution.title')}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textcolor-secondary md:text-base">
              {t('Evolution.description')}
            </p>
          </div>

          <MosaicGrid className="gap-5 xl:gap-8">
            <MosaicGridItem xlSpan={5}>
              <div className="landing-outline-panel flex h-full flex-col rounded-[28px] p-6 md:p-8">
                <p className="landing-section-eyebrow">{t('Evolution.context.eyebrow')}</p>
                <h3 className="landing-card-title mt-2 max-w-[26rem]">{t('Evolution.context.title')}</h3>
                <p className="mt-3 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {t('Evolution.context.description')}
                </p>

                <NumberedFeatureList
                  items={evolutionContextItems}
                  className="mt-1 md:mt-5"
                  titleClassName="text-sm font-medium leading-relaxed md:text-base"
                  descriptionClassName="text-sm leading-relaxed md:text-base"
                />
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={7}>
              <div className="landing-glass-panel h-full rounded-[28px] px-6 py-2 md:p-8">
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
      <section aria-labelledby="for-whom-title" className="w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <h2 id="for-whom-title" className="sr-only">
            {t('ForWhom.title')}
          </h2>

          <div className="grid gap-y-4 xl:grid-cols-3 xl:gap-x-8">
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

      <section aria-label={t('Architecture.title')} className="w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <ArchitectureLayersShowcase />
        </div>
      </section>
    </div>
  )
}
