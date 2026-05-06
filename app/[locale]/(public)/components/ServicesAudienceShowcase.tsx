import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Compass,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  Layers3,
  Route,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  StaticHistoryChartCard,
  type StaticHistoryEntry,
} from '@/app/[locale]/(public)/components/StaticHistoryChartCard'
import { SummaryCard } from '@/components/shared/Cards/SummaryCard'
import { IconFeatureList, type IconFeatureListItem } from '@/components/shared/Content/IconFeatureList'
import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { SectionCard } from '@/ds/components/SectionCard'
import { cn } from '@/lib/utils'

type AudienceKey = 'b2c' | 'b2b' | 'rd'
type CapabilityKey =
  | 'tracking'
  | 'support'
  | 'consistency'
  | 'governance'
  | 'analytics'
  | 'decisionSupport'
  | 'cohorts'
  | 'validation'
  | 'reporting'
type OutcomeKey = 'one' | 'two' | 'three'
type BlueprintCardKey = 'personalFlow' | 'corporateFlow' | 'researchFlow'

type AudienceConfig = {
  key: AudienceKey
  badgeClassName: string
  surfaceClassName: string
  mutedSurfaceClassName: string
  iconWrapperClassName: string
  summaryClassName: string
  icon: LucideIcon
  chartIcon: LucideIcon
  chartColor: string
  maxScore: number
  history: StaticHistoryEntry[]
  capabilityKeys: readonly CapabilityKey[]
}

type BlueprintCardConfig = {
  key: BlueprintCardKey
  icon: LucideIcon
  type: 'info' | 'note' | 'success'
  mdSpan: 3 | 6
  xlSpan: 3 | 4 | 5
}

const outcomeKeys: readonly OutcomeKey[] = ['one', 'two', 'three']

const capabilityIcons: Record<CapabilityKey, LucideIcon> = {
  tracking: Compass,
  support: Sparkles,
  consistency: Route,
  governance: ShieldCheck,
  analytics: BarChart3,
  decisionSupport: Layers3,
  cohorts: Users,
  validation: BrainCircuit,
  reporting: FileText,
}

const outcomeIcons: Record<OutcomeKey, LucideIcon> = {
  one: Gauge,
  two: CheckCircle2,
  three: ShieldCheck,
}

const blueprintCards: readonly BlueprintCardConfig[] = [
  {
    key: 'personalFlow',
    icon: ShieldCheck,
    type: 'note',
    mdSpan: 3,
    xlSpan: 3,
  },
  {
    key: 'corporateFlow',
    icon: Users,
    type: 'info',
    mdSpan: 3,
    xlSpan: 4,
  },
  {
    key: 'researchFlow',
    icon: Sparkles,
    type: 'success',
    mdSpan: 6,
    xlSpan: 5,
  },
]

const audienceConfigs: readonly AudienceConfig[] = [
  {
    key: 'b2c',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    surfaceClassName: 'bg-emerald-50/80',
    mutedSurfaceClassName: 'bg-emerald-50/65',
    iconWrapperClassName: 'bg-white text-emerald-700 ring-1 ring-emerald-200',
    summaryClassName: 'border-emerald-100 bg-emerald-50/70',
    icon: HeartPulse,
    chartIcon: Activity,
    chartColor: '#0f766e',
    maxScore: 24,
    history: [
      { date: '2026-01-01', score: 18 },
      { date: '2026-01-15', score: 16 },
      { date: '2026-02-01', score: 13 },
      { date: '2026-02-15', score: 11 },
      { date: '2026-03-01', score: 9 },
      { date: '2026-03-15', score: 7 },
    ],
    capabilityKeys: ['tracking', 'support', 'consistency'],
  },
  {
    key: 'b2b',
    badgeClassName: 'bg-sky-100 text-sky-700',
    surfaceClassName: 'bg-sky-50/80',
    mutedSurfaceClassName: 'bg-sky-50/65',
    iconWrapperClassName: 'bg-white text-sky-700 ring-1 ring-sky-200',
    summaryClassName: 'border-sky-100 bg-sky-50/70',
    icon: Building2,
    chartIcon: BarChart3,
    chartColor: '#0369a1',
    maxScore: 20,
    history: [
      { date: '2026-01-01', score: 14 },
      { date: '2026-02-01', score: 13 },
      { date: '2026-03-01', score: 11 },
      { date: '2026-04-01', score: 10 },
      { date: '2026-05-01', score: 8 },
      { date: '2026-06-01', score: 6 },
    ],
    capabilityKeys: ['governance', 'analytics', 'decisionSupport'],
  },
  {
    key: 'rd',
    badgeClassName: 'bg-amber-100 text-amber-800',
    surfaceClassName: 'bg-amber-50/80',
    mutedSurfaceClassName: 'bg-amber-50/65',
    iconWrapperClassName: 'bg-white text-amber-800 ring-1 ring-amber-200',
    summaryClassName: 'border-amber-100 bg-amber-50/70',
    icon: FlaskConical,
    chartIcon: BrainCircuit,
    chartColor: '#a16207',
    maxScore: 20,
    history: [
      { date: '2026-01-01', score: 17 },
      { date: '2026-02-01', score: 14 },
      { date: '2026-03-01', score: 12 },
      { date: '2026-04-01', score: 9 },
      { date: '2026-05-01', score: 7 },
      { date: '2026-06-01', score: 5 },
    ],
    capabilityKeys: ['cohorts', 'validation', 'reporting'],
  },
]

function AudienceSection({ config }: { config: AudienceConfig }) {
  const t = useTranslations('pages.Services')
  const sectionKey = `sections.${config.key}`
  const AudienceIcon = config.icon
  const ChartIcon = config.chartIcon
  const capabilityItems: IconFeatureListItem[] = config.capabilityKeys.map((capabilityKey) => {
    const CapabilityIcon = capabilityIcons[capabilityKey as keyof typeof capabilityIcons]

    return {
      key: capabilityKey,
      icon: <CapabilityIcon className="h-5 w-5" />,
      title: t(`${sectionKey}.capabilities.${capabilityKey}.title`),
      description: t(`${sectionKey}.capabilities.${capabilityKey}.description`),
    }
  })
  const outcomeItems: IconFeatureListItem[] = outcomeKeys.map((outcomeKey) => {
    const OutcomeIcon = outcomeIcons[outcomeKey as keyof typeof outcomeIcons]

    return {
      key: outcomeKey,
      icon: <OutcomeIcon className="h-5 w-5" />,
      title: t(`${sectionKey}.outcomes.${outcomeKey}`),
    }
  })

  return (
    <section>
      <MosaicGrid>
        <MosaicGridItem xlSpan={7}>
          <div className={cn('h-full rounded-[28px] p-6 md:p-8', config.surfaceClassName)}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${config.badgeClassName}`}
            >
              <AudienceIcon className="h-4 w-4" />
              {t(`${sectionKey}.tag`)}
            </span>

            <div className="mt-6 space-y-4">
              <h2 className="text-title text-3xl font-semibold leading-tight md:text-4xl">
                {t(`${sectionKey}.title`)}
              </h2>

              <p className="max-w-3xl text-base leading-relaxed text-textcolor-secondary">
                {t(`${sectionKey}.description`)}
              </p>
            </div>
          </div>
        </MosaicGridItem>

        <MosaicGridItem xlSpan={5}>
          <SectionCard className={cn('h-full rounded-[28px] p-6 md:p-7', config.mutedSurfaceClassName)}>
            <IconFeatureList
              items={capabilityItems}
              className="h-full"
              iconWrapperClassName={config.iconWrapperClassName}
            />
          </SectionCard>
        </MosaicGridItem>

        <MosaicGridItem mdSpan={3} xlSpan={4}>
          <div className={cn('rounded-[28px] p-6', config.mutedSurfaceClassName)}>
            <StaticHistoryChartCard
              history={config.history}
              chartLabel={t(`${sectionKey}.chart.label`)}
              chartColor={config.chartColor}
              title={t(`${sectionKey}.chart.title`)}
              stubTitle={t(`${sectionKey}.chart.stubTitle`)}
              icon={<ChartIcon className="h-9 w-9 text-black/15" />}
              maxScore={config.maxScore}
            />
          </div>
        </MosaicGridItem>

        <MosaicGridItem mdSpan={3} xlSpan={8}>
          <SectionCard
            title={t(`${sectionKey}.outcomesTitle`)}
            className={cn('h-full rounded-[28px] p-6 md:p-7', config.mutedSurfaceClassName)}
            titleClassName="text-xl leading-snug"
          >
            <IconFeatureList
              items={outcomeItems}
              compact
              iconWrapperClassName={config.iconWrapperClassName}
              titleClassName="text-sm font-medium leading-relaxed"
            />
          </SectionCard>
        </MosaicGridItem>
      </MosaicGrid>
    </section>
  )
}

export function ServicesAudienceShowcase() {
  const t = useTranslations('pages.Services')

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(236,253,245,0.9),transparent_30%),radial-gradient(circle_at_top_right,rgba(224,242,254,0.9),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#f6f8ef_100%)]">
      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 pb-10 pt-12 tablet:px-6 md:px-8 md:pb-12 md:pt-16 lg:px-10">
          <MosaicGrid>
            <MosaicGridItem xlSpan={7}>
              <div className="h-full rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(255,255,255,0.58))] p-6 md:p-8">
                <p className="text-textcolor-tertiary text-xs font-semibold uppercase tracking-[0.22em]">
                  {t('hero.eyebrow')}
                </p>
                <h1 className="text-title mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] md:text-6xl">
                  {t('hero.title')}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('hero.subtitle')}
                </p>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={5}>
              <div className="grid h-full gap-4 md:grid-cols-2 xl:grid-cols-1">
                {audienceConfigs.map((config, index) => {
                  const AudienceIcon = config.icon

                  return (
                    <div
                      key={config.key}
                      className={cn(
                        'rounded-[28px] border p-5 shadow-sm',
                        config.summaryClassName,
                        index === 2 && 'md:col-span-2 xl:col-span-1'
                      )}
                    >
                      <SummaryCard
                        title={t(`hero.audiences.${config.key}.title`)}
                        icon={<AudienceIcon className="h-10 w-10 text-black/10" />}
                        iconOnTop
                      >
                        <p className="max-w-[16rem] text-sm leading-relaxed text-textcolor-secondary">
                          {t(`hero.audiences.${config.key}.subtitle`)}
                        </p>
                      </SummaryCard>
                    </div>
                  )
                })}
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={12}>
              <div className="rounded-[24px] bg-background-muted px-5 py-4 text-sm leading-relaxed text-textcolor-secondary">
                {t('hero.note')}
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <MosaicGrid>
            <MosaicGridItem xlSpan={5}>
              <div className="h-full rounded-[28px] bg-background-muted p-6 md:p-8">
                <p className="text-textcolor-tertiary text-xs font-semibold uppercase tracking-[0.22em]">
                  {t('blueprint.eyebrow')}
                </p>
                <h2 className="text-title mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                  {t('blueprint.title')}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-textcolor-secondary">{t('blueprint.subtitle')}</p>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={7}>
              <MosaicGrid>
                {blueprintCards.map((card) => {
                  const CardIcon = card.icon

                  return (
                    <MosaicGridItem key={card.key} mdSpan={card.mdSpan} xlSpan={card.xlSpan}>
                      <SectionCard
                        type={card.type}
                        title={t(`blueprint.cards.${card.key}.title`)}
                        subtitle={t(`blueprint.cards.${card.key}.description`)}
                        titleClassName="text-xl leading-snug"
                        className="h-full rounded-[28px] p-6"
                        subtitlePrefix={<CardIcon aria-hidden className="text-black/55" />}
                      >
                        <div className="mt-5 rounded-[20px] bg-white/70 px-4 py-3 text-sm leading-relaxed text-textcolor-secondary">
                          {t(`blueprint.cards.${card.key}.focus`)}
                        </div>
                      </SectionCard>
                    </MosaicGridItem>
                  )
                })}
              </MosaicGrid>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="mb-16 w-full">
        <div className="container-max-width mx-auto space-y-12 px-4 pb-16 tablet:px-6 md:px-8 lg:px-10">
          {audienceConfigs.map((config) => (
            <AudienceSection key={config.key} config={config} />
          ))}
        </div>
      </section>
    </div>
  )
}
