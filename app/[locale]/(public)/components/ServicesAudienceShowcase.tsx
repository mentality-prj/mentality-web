import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  FlaskConical,
  Gauge,
  Heart,
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
import { IconFeatureList, type IconFeatureListItem } from '@/components/shared/Content/IconFeatureList'
import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
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
  sectionClassName: string
  introCardClassName: string
  surfaceCardClassName: string
  iconWrapperClassName: string
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
  iconClassName?: string
}

const blueprintIconTintClassName = 'text-slate-100'
const layerIcons: Record<AudienceKey, LucideIcon> = {
  b2c: Heart,
  b2b: BriefcaseBusiness,
  rd: FlaskConical,
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
    icon: layerIcons.b2c,
    iconClassName: blueprintIconTintClassName,
  },
  {
    key: 'corporateFlow',
    icon: layerIcons.b2b,
    iconClassName: blueprintIconTintClassName,
  },
  {
    key: 'researchFlow',
    icon: layerIcons.rd,
    iconClassName: blueprintIconTintClassName,
  },
]

const heroAudienceIcons = layerIcons

const audienceConfigs: readonly AudienceConfig[] = [
  {
    key: 'b2c',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(209,250,229,0.98),rgba(240,253,244,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(209,250,229,0.82))]',
    surfaceCardClassName: 'bg-white/76',
    iconWrapperClassName: 'bg-white text-emerald-700 ring-1 ring-emerald-200',
    icon: layerIcons.b2c,
    chartIcon: Activity,
    chartColor: '#059669',
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
    badgeClassName: 'bg-sky-200 text-sky-900',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(186,230,253,0.98),rgba(239,246,255,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(186,230,253,0.88))]',
    surfaceCardClassName: 'bg-sky-50/84',
    iconWrapperClassName: 'bg-white/92 text-sky-800 ring-1 ring-sky-300',
    icon: layerIcons.b2b,
    chartIcon: BarChart3,
    chartColor: '#0284c7',
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
    badgeClassName: 'bg-violet-200 text-violet-900',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(221,214,254,0.98),rgba(245,243,255,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(221,214,254,0.9))]',
    surfaceCardClassName: 'bg-violet-50/84',
    iconWrapperClassName: 'bg-white/92 text-violet-800 ring-1 ring-violet-300',
    icon: layerIcons.rd,
    chartIcon: BrainCircuit,
    chartColor: '#6d28d9',
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
    <section className={cn('w-full py-14 md:py-[4.5rem]', config.sectionClassName)}>
      <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
        <MosaicGrid className="xl:gap-10">
          <MosaicGridItem xlSpan={7}>
            <div className="h-full md:pr-10">
              <div
                className={cn(
                  'rounded-[30px] p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-[2px] md:p-8',
                  config.introCardClassName
                )}
              >
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-[0.1em] ${config.badgeClassName}`}
                >
                  <AudienceIcon className="h-4 w-4" />
                  {t(`${sectionKey}.tag`)}
                </span>

                <div className="mt-6 space-y-4">
                  <h2 className="landing-section-title">{t(`${sectionKey}.title`)}</h2>

                  <p className="max-w-3xl text-base leading-relaxed text-textcolor-secondary">
                    {t(`${sectionKey}.description`)}
                  </p>
                </div>
              </div>
            </div>
          </MosaicGridItem>

          <MosaicGridItem xlSpan={5}>
            <div
              className={cn(
                'h-full rounded-[30px] p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-[2px] md:p-7 xl:pl-4',
                config.surfaceCardClassName
              )}
            >
              <IconFeatureList
                items={capabilityItems}
                className="h-full"
                iconWrapperClassName={config.iconWrapperClassName}
                dividerClassName="border-black/[0.06]"
              />
            </div>
          </MosaicGridItem>

          <MosaicGridItem mdSpan={3} xlSpan={4}>
            <div
              className={cn(
                'rounded-[30px] p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-[2px]',
                config.surfaceCardClassName
              )}
            >
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
            <div
              className={cn(
                'h-full rounded-[30px] p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-[2px] md:p-7 xl:pl-6',
                config.surfaceCardClassName
              )}
            >
              <h3 className="landing-panel-title">{t(`${sectionKey}.outcomesTitle`)}</h3>
              <IconFeatureList
                items={outcomeItems}
                compact
                className="mt-4"
                iconWrapperClassName={config.iconWrapperClassName}
                titleClassName="text-sm font-medium leading-relaxed"
                dividerClassName="border-black/[0.06]"
              />
            </div>
          </MosaicGridItem>
        </MosaicGrid>
      </div>
    </section>
  )
}

export function ServicesAudienceShowcase() {
  const t = useTranslations('pages.Services')

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(236,253,245,0.9),transparent_30%),radial-gradient(circle_at_top_right,rgba(224,242,254,0.9),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#f6f8ef_100%)]">
      <section className="w-full">
        <div className="container-max-width mx-auto px-4 pb-10 pt-12 tablet:px-6 md:px-8 md:pb-12 md:pt-16 lg:px-10">
          <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] xl:gap-20">
            <div className="max-w-4xl">
              <h1 className="landing-display-title max-w-3xl">{t('hero.title')}</h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="rounded-[30px] bg-[linear-gradient(145deg,rgba(255,255,255,0.82),rgba(255,255,255,0.6))] p-4 xl:pt-4">
              <div className="flex h-full flex-col divide-y divide-black/[0.06]">
                {audienceConfigs.map((config, index) => {
                  const AudienceIcon = heroAudienceIcons[config.key]

                  return (
                    <div
                      key={config.key}
                      className={cn(
                        'flex items-start gap-4 px-2 py-5',
                        index === 0 && 'pt-3',
                        index === audienceConfigs.length - 1 && 'pb-3'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex h-11 w-11 flex-none items-center justify-center rounded-2xl',
                          config.iconWrapperClassName
                        )}
                      >
                        <AudienceIcon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0">
                        <h2 className="landing-summary-title">{t(`hero.audiences.${config.key}.title`)}</h2>
                        <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-textcolor-secondary">
                          {t(`hero.audiences.${config.key}.subtitle`)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-14 md:py-16">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <article className="relative flex min-h-[360px] flex-col justify-between overflow-hidden px-3 py-6 md:px-4 xl:px-2">
              <div className="relative z-10">
                <h2 className="text-title text-[2rem] font-semibold leading-[1.08] md:text-[2.45rem]">
                  {t('blueprint.title')}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-textcolor-secondary">{t('blueprint.subtitle')}</p>
              </div>
            </article>

            {blueprintCards.map((card) => {
              const BlueprintIcon = card.icon

              return (
                <article
                  key={card.key}
                  className="relative flex h-full min-h-[20rem] flex-col overflow-hidden rounded-[28px] bg-white p-6 text-textcolor-primary md:p-7"
                >
                  <BlueprintIcon
                    aria-hidden
                    strokeWidth={1.2}
                    className={cn(
                      'pointer-events-none absolute right-5 top-5 h-24 w-24 md:right-6 md:top-6 md:h-28 md:w-28',
                      card.iconClassName
                    )}
                  />

                  <div className="relative z-10 flex flex-1 flex-col gap-sm pt-1">
                    <h3 className="landing-panel-title">{t(`blueprint.cards.${card.key}.title`)}</h3>
                    <p className="text-base leading-relaxed text-textcolor-secondary">
                      {t(`blueprint.cards.${card.key}.description`)}
                    </p>
                    <p className="text-base leading-relaxed text-textcolor-secondary">
                      {t(`blueprint.cards.${card.key}.focus`)}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <div>
        {audienceConfigs.map((config) => (
          <AudienceSection key={config.key} config={config} />
        ))}
      </div>
    </div>
  )
}
