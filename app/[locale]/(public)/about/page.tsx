import type { LucideIcon } from 'lucide-react'
import { ArrowRight, CheckCircle2, Compass, Lightbulb, Search, SlidersHorizontal, Users } from 'lucide-react'
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
  cohort: Users,
  explainable: Compass,
  outcome: CheckCircle2,
}

export default function AboutPage() {
  const t = useTranslations('pages.About')
  const evolutionStepKeys = ['happened', 'means', 'next', 'action', 'evidence'] as const
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
  const valueItems: IconFeatureListItem[] = valuePointKeys.map((key) => {
    const ValueIcon = valueIcons[key as keyof typeof valueIcons]

    return {
      key,
      icon: <ValueIcon className="h-5 w-5" />,
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
                <PageTitle title={t('title')} className="max-w-4xl" />
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('intro')}
                </p>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('introExtended')}
                </p>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={5}>
              <div className="h-full rounded-[32px] bg-background-muted p-6 shadow-sm md:p-8">
                <h2 className="landing-h2">{t('Value.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {t('Value.description')}
                </p>
                <IconFeatureList
                  items={valueItems}
                  className="mt-5"
                  iconWrapperClassName="bg-white text-primary ring-1 ring-primary/10"
                  titleClassName="text-sm font-medium leading-relaxed md:text-base"
                />
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <MosaicGrid className="xl:gap-8">
            <MosaicGridItem xlSpan={5}>
              <div className="h-full rounded-[28px] bg-background-muted p-6 md:p-8">
                <h2 className="landing-h2">{t('Evolution.title')}</h2>
                <p className="mt-2 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {t('Evolution.description')}
                </p>
                <div className="mt-6 rounded-[24px] bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(219,234,254,0.78))] p-5 md:p-6">
                  <p className="text-textcolor-tertiary text-xs font-semibold uppercase tracking-[0.18em]">
                    {t('Evolution.context.eyebrow')}
                  </p>
                  <p className="mt-3 text-lg font-semibold leading-snug text-textcolor-primary md:text-xl">
                    {t('Evolution.context.title')}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-textcolor-secondary md:text-base">
                    {t('Evolution.context.description')}
                  </p>
                  <div className="mt-5 space-y-4">
                    {(['signal', 'prediction', 'validation'] as const).map((itemKey) => (
                      <div
                        key={itemKey}
                        className="border-black/8 border-t pt-4 text-sm leading-relaxed text-textcolor-secondary"
                      >
                        <p className="font-semibold text-textcolor-primary">
                          {t(`Evolution.context.items.${itemKey}.title`)}
                        </p>
                        <p className="mt-1">{t(`Evolution.context.items.${itemKey}.description`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={7}>
              <div className="rounded-[28px] xl:max-w-[50rem] xl:pl-2">
                <IconFeatureList
                  items={evolutionItems}
                  iconWrapperClassName="bg-note text-textcolor-primary"
                  titleClassName="text-base md:text-lg"
                  descriptionClassName="max-w-[36rem] text-sm leading-relaxed md:text-base"
                  itemClassName="gap-5"
                />
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <h2 className="landing-h2 mb-6">{t('ForWhom.title')}</h2>
          <div className="grid gap-4 xl:grid-cols-3">
            {forWhomConfig.map(({ key, className, percentageClassName }) => (
              <ImpactMetricCard
                key={key}
                percentage={t(`ForWhom.${key}.impactPercent`)}
                percentageLabel={t(`ForWhom.${key}.impactLabel`)}
                title={t(`ForWhom.${key}.title`)}
                description={t(`ForWhom.${key}.description`)}
                className={cn('min-h-[18rem]', className)}
                percentageClassName={percentageClassName}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mb-16 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <h2 className="landing-h2 mb-6">{t('Architecture.title')}</h2>
          <ArchitectureLayersShowcase />
        </div>
      </section>
    </div>
  )
}
