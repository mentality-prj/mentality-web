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
import { default as Image } from 'next/image'
import { useTranslations } from 'next-intl'

import type { StaticHistoryEntry } from '@/app/[locale]/(public)/components/StaticHistoryChartCard'
import { ServicesHeroBackgroundFigures } from '@/app/[locale]/(public)/components/ServicesHeroBackgroundFigures'
import { IconFeatureList, type IconFeatureListItem } from '@/components/shared/Content/IconFeatureList'
import { IconStatementList, type IconStatementListItem } from '@/components/shared/Content/IconStatementList'
import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { NumberedFeatureList, type NumberedFeatureListItem } from '@/components/shared/Content/NumberedFeatureList'
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
type DetailItemKey = 'one' | 'two' | 'three'
type RdPanelKey = 'delivery' | 'science' | 'support'
type BlueprintCardKey = 'personalFlow' | 'corporateFlow' | 'researchFlow'

type AudienceConfig = {
  key: AudienceKey
  secondaryPanelType: 'chart' | 'details'
  sectionClassName: string
  introCardClassName: string
  surfaceCardClassName: string
  iconWrapperClassName: string
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
const detailItemKeys: readonly DetailItemKey[] = ['one', 'two', 'three']
const rdPanelKeys: readonly RdPanelKey[] = ['delivery', 'science', 'support']

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

const b2cResultSummaryIcons: Record<OutcomeKey, LucideIcon> = {
  one: BarChart3,
  two: CheckCircle2,
  three: ShieldCheck,
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
    secondaryPanelType: 'details',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(209,250,229,0.98),rgba(240,253,244,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(209,250,229,0.82))]',
    surfaceCardClassName: 'bg-white/76',
    iconWrapperClassName: 'bg-white text-emerald-700 ring-1 ring-emerald-200',
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
    secondaryPanelType: 'chart',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(186,230,253,0.98),rgba(239,246,255,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(186,230,253,0.88))]',
    surfaceCardClassName: 'bg-sky-50/84',
    iconWrapperClassName: 'bg-white/92 text-sky-800 ring-1 ring-sky-300',
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
    secondaryPanelType: 'details',
    sectionClassName: 'bg-[linear-gradient(180deg,rgba(221,214,254,0.98),rgba(245,243,255,0.94))]',
    introCardClassName: 'bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(221,214,254,0.9))]',
    surfaceCardClassName: 'bg-violet-50/84',
    iconWrapperClassName: 'bg-white/92 text-violet-800 ring-1 ring-violet-300',
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
  const isResearch = config.key === 'rd'
  const capabilityItems: IconFeatureListItem[] = config.capabilityKeys.map((capabilityKey) => {
    const CapabilityIcon = capabilityIcons[capabilityKey as keyof typeof capabilityIcons]

    return {
      key: capabilityKey,
      icon: <CapabilityIcon className="h-5 w-5" />,
      title: t(`${sectionKey}.capabilities.${capabilityKey}.title`),
      description: t(`${sectionKey}.capabilities.${capabilityKey}.description`),
    }
  })
  const b2cServiceSummaryItems: IconStatementListItem[] =
    config.key === 'b2c'
      ? config.capabilityKeys.map((capabilityKey) => {
          const CapabilityIcon = capabilityIcons[capabilityKey as keyof typeof capabilityIcons]

          return {
            key: capabilityKey,
            icon: <CapabilityIcon className="h-7 w-7 stroke-[1.8]" />,
            text: t(`${sectionKey}.serviceSummaryItems.${capabilityKey}`),
          }
        })
      : []
  const b2cResultSummaryItems: IconStatementListItem[] =
    config.key === 'b2c'
      ? outcomeKeys.map((outcomeKey) => {
          const OutcomeIcon = b2cResultSummaryIcons[outcomeKey as keyof typeof b2cResultSummaryIcons]

          return {
            key: outcomeKey,
            icon: <OutcomeIcon className="h-7 w-7 stroke-[1.8]" />,
            text: t(`${sectionKey}.resultSummaryItems.${outcomeKey}`),
          }
        })
      : []
  const b2bBusinessImpactItems: IconFeatureListItem[] =
    config.key === 'b2b'
      ? outcomeKeys.map((outcomeKey) => {
          const OutcomeIcon = outcomeIcons[outcomeKey as keyof typeof outcomeIcons]

          return {
            key: outcomeKey,
            icon: <OutcomeIcon className="h-5 w-5" />,
            title: t(`${sectionKey}.businessImpact.${outcomeKey}.title`),
            description: t(`${sectionKey}.businessImpact.${outcomeKey}.description`),
          }
        })
      : []
  const rdPanels =
    config.key === 'rd'
      ? rdPanelKeys.map((panelKey) => ({
          key: panelKey,
          title: t(`${sectionKey}.panels.${panelKey}.title`),
          items: detailItemKeys.map(
            (detailKey): NumberedFeatureListItem => ({
              key: detailKey,
              title: t(`${sectionKey}.panels.${panelKey}.items.${detailKey}.title`),
              description: t(`${sectionKey}.panels.${panelKey}.items.${detailKey}.description`),
            })
          ),
        }))
      : []

  if (config.key === 'b2c') {
    return (
      <section className={cn('w-full py-14 md:py-[4.5rem]', config.sectionClassName)}>
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="max-w-[70rem] xl:max-w-[70%]">
            <div className="space-y-4">
              <h2 className="landing-section-title">{t(`${sectionKey}.title`)}</h2>

              <p className="text-base leading-relaxed text-textcolor-secondary md:text-lg">
                {t(`${sectionKey}.description`)}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.06fr)_minmax(0,0.88fr)] xl:items-center">
            <div className="px-1 py-1 md:px-2">
              <IconStatementList
                items={b2cServiceSummaryItems}
                iconClassName="text-emerald-700/85"
                textClassName="text-base md:text-[1.1rem]"
              />
            </div>

            <div className="bg-white/72 overflow-hidden rounded-[30px] shadow-[0_24px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.05]">
              <div className="mx-auto w-full max-w-[40rem]">
                <Image
                  src="/services/b2c.png"
                  alt=""
                  aria-hidden="true"
                  width={1024}
                  height={559}
                  sizes="(min-width: 1280px) 40rem, (min-width: 1024px) 32rem, 100vw"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div className="px-1 py-1 md:px-2">
              <IconStatementList
                items={b2cResultSummaryItems}
                iconClassName="text-emerald-700/85"
                textClassName="text-base md:text-[1.1rem]"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (config.key === 'b2b') {
    return (
      <section className={cn('w-full py-14 md:py-[4.5rem]', config.sectionClassName)}>
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.68fr)] xl:items-start xl:gap-8">
            <div className="px-1 py-2 md:px-2 md:py-3 xl:order-2">
              <div className="max-w-[30rem] space-y-4 md:pt-2">
                <h2 className="landing-section-title">{t(`${sectionKey}.title`)}</h2>

                <p className="text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t(`${sectionKey}.description`)}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:order-1">
              <div className="h-full px-1 py-2 md:px-2 md:py-3">
                <div className="relative h-full overflow-hidden rounded-[30px] bg-white/[0.05] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_60px_rgba(14,116,144,0.12)] ring-1 ring-white/45 backdrop-blur-[24px] backdrop-saturate-[1.8] md:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.02)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-10%] top-[14%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.2),rgba(255,255,255,0)_70%)] blur-2xl"
                  />

                  <div className="relative z-10">
                    <p className="landing-kicker text-sky-900/80">{t(`${sectionKey}.managerTitle`)}</p>
                    <IconFeatureList
                      items={capabilityItems}
                      className="mt-4 h-full"
                      iconWrapperClassName="bg-white/[0.12] text-sky-900 ring-1 ring-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl"
                      titleClassName="text-base font-semibold leading-snug md:text-[1.05rem]"
                      descriptionClassName="text-sm leading-relaxed text-textcolor-secondary md:text-base"
                      dividerClassName="border-white/14"
                    />
                  </div>
                </div>
              </div>

              <div className="h-full px-1 py-2 md:px-2 md:py-3">
                <div className="relative h-full overflow-hidden rounded-[30px] bg-white/[0.05] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_60px_rgba(14,116,144,0.12)] ring-1 ring-white/45 backdrop-blur-[24px] backdrop-saturate-[1.8] md:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.02)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[-8%] top-[12%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.16),rgba(255,255,255,0)_72%)] blur-2xl"
                  />

                  <div className="relative z-10">
                    <p className="landing-kicker text-sky-900/80">{t(`${sectionKey}.outcomesTitle`)}</p>
                    <IconFeatureList
                      items={b2bBusinessImpactItems}
                      className="mt-4 h-full"
                      iconWrapperClassName="bg-white/[0.12] text-sky-900 ring-1 ring-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl"
                      titleClassName="text-base font-semibold leading-snug md:text-[1.05rem]"
                      descriptionClassName="text-sm leading-relaxed text-textcolor-secondary md:text-base"
                      dividerClassName="border-white/14"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('w-full py-14 md:py-[4.5rem]', config.sectionClassName)}>
      <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
        <div className={cn(isResearch && 'relative isolate')}>
          {isResearch && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[52%] top-1 z-0 hidden h-44 w-44 xl:block"
              >
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.99),rgba(243,232,255,0.97)_14%,rgba(196,181,253,0.84)_36%,rgba(139,92,246,0.82)_62%,rgba(76,29,149,0.97)_100%)] shadow-[0_18px_40px_rgba(109,40,217,0.22)]" />
                <div className="absolute left-[14%] top-[10%] h-[22%] w-[30%] rounded-full bg-white/80 blur-[3px]" />
                <div className="absolute left-[18%] top-[23%] h-[10%] w-[18%] rounded-full bg-white/40 blur-[5px]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_72%_76%,rgba(49,46,129,0.32),transparent_48%)] opacity-70 mix-blend-multiply" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[63%] top-[15.75rem] z-0 hidden h-28 w-28 xl:block"
              >
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.99),rgba(243,232,255,0.95)_14%,rgba(196,181,253,0.8)_36%,rgba(139,92,246,0.78)_62%,rgba(76,29,149,0.96)_100%)] shadow-[0_16px_30px_rgba(109,40,217,0.2)]" />
                <div className="bg-white/78 absolute left-[16%] top-[11%] h-[22%] w-[30%] rounded-full blur-[2px]" />
                <div className="bg-white/38 absolute left-[19%] top-[25%] h-[9%] w-[18%] rounded-full blur-[4px]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_72%_76%,rgba(49,46,129,0.28),transparent_48%)] opacity-70 mix-blend-multiply" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 top-[4.75rem] z-0 hidden h-20 w-20 xl:block"
              >
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.99),rgba(243,232,255,0.94)_14%,rgba(196,181,253,0.78)_36%,rgba(139,92,246,0.76)_62%,rgba(76,29,149,0.95)_100%)] shadow-[0_14px_24px_rgba(109,40,217,0.18)]" />
                <div className="bg-white/76 absolute left-[16%] top-[11%] h-[20%] w-[28%] rounded-full blur-[2px]" />
                <div className="bg-white/36 absolute left-[20%] top-[25%] h-[8%] w-[18%] rounded-full blur-[4px]" />
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_72%_76%,rgba(49,46,129,0.24),transparent_48%)] opacity-70 mix-blend-multiply" />
              </div>
            </>
          )}

          <MosaicGrid className={cn('xl:gap-10', isResearch && 'relative z-10')}>
            <MosaicGridItem xlSpan={7} align="start" className="!h-auto [&>*]:!h-auto">
              <div className={cn('md:pr-10', isResearch && 'md:pt-2')}>
                <div
                  className={cn(
                    isResearch
                      ? 'max-w-[48rem] p-1 md:px-2 md:py-3'
                      : 'rounded-[30px] p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-[2px] md:p-8',
                    !isResearch && config.introCardClassName
                  )}
                >
                  <div className="space-y-4">
                    <h2 className="landing-section-title">{t(`${sectionKey}.title`)}</h2>

                    <p className="max-w-3xl text-base leading-relaxed text-textcolor-secondary">
                      {t(`${sectionKey}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            </MosaicGridItem>

            <MosaicGridItem xlSpan={5} align="start" className="!h-auto [&>*]:!h-auto">
              <div
                className={cn(
                  'px-1 py-2 md:px-2 xl:pl-4',
                  isResearch &&
                    'relative overflow-hidden rounded-[30px] bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_24px_60px_rgba(76,29,149,0.12)] ring-1 ring-white/45 backdrop-blur-[24px] backdrop-saturate-[1.8] md:p-8'
                )}
              >
                {isResearch && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_36%,rgba(255,255,255,0.02)_100%)]"
                  />
                )}

                <div className={cn(isResearch && 'relative z-10')}>
                  <p className={cn('landing-kicker', isResearch && 'pl-[3.75rem]')}>
                    {t(`${sectionKey}.technicalTitle`)}
                  </p>

                  <IconFeatureList
                    items={capabilityItems}
                    className="mt-4"
                    iconWrapperClassName="bg-white/[0.07] text-violet-800 ring-1 ring-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl"
                    dividerClassName="border-white/12"
                  />
                </div>
              </div>
            </MosaicGridItem>

            <MosaicGridItem mdSpan={6} xlSpan={12}>
              <div className="px-1 py-2 md:px-2 md:py-3">
                <div className="grid gap-8 xl:grid-cols-3 xl:gap-8">
                  {rdPanels.map((panel) => (
                    <div key={panel.key}>
                      <h3 className="landing-panel-title">{panel.title}</h3>

                      <NumberedFeatureList items={panel.items} className="mt-4" />
                    </div>
                  ))}
                </div>
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </div>
    </section>
  )
}

export function ServicesAudienceShowcase() {
  const t = useTranslations('pages.Services')

  return (
    <div className="bg-white">
      <section className="relative w-full overflow-hidden bg-primary">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_22%),radial-gradient(circle_at_86%_12%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0)_42%)]"
        />
        <ServicesHeroBackgroundFigures />

        <div className="container-max-width relative z-10 mx-auto px-4 pb-14 pt-12 tablet:px-6 md:px-8 md:pb-16 md:pt-16 lg:px-10">
          <div className="grid items-center gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)] xl:gap-16">
            <div className="relative z-10 max-w-4xl">
              <h1 className="landing-display-title max-w-3xl text-[2rem] font-medium leading-[1.04] text-white md:text-[2.75rem]">
                {t('hero.title')}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-white md:text-lg">{t('hero.subtitle')}</p>
            </div>

            <div className="relative isolate min-h-[23rem]">
              <div
                aria-hidden="true"
                className="border-white/28 pointer-events-none absolute -right-6 top-[56%] z-0 hidden h-20 w-10 -translate-y-1/2 rounded-r-full border border-l-0 border-dashed lg:block"
              />

              <div className="relative z-10 w-full">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0" />

                <div className="relative overflow-hidden rounded-[30px] border border-white/50 bg-white/[0.09] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_26px_54px_rgba(2,18,78,0.28)] backdrop-blur-[22px] backdrop-saturate-[1.65] sm:px-7 sm:py-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.06)_38%,rgba(255,255,255,0.02)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[18%] top-[16%] h-[58%] w-[64%] rounded-full bg-[radial-gradient(circle_at_25%_22%,rgba(255,216,135,0.96),rgba(255,160,112,0.9)_18%,rgba(255,73,164,0.84)_36%,rgba(179,88,255,0.72)_63%,rgba(34,211,238,0.16)_100%)] opacity-90 blur-[24px]"
                  />
                  <div className="relative z-10 flex min-h-[18rem] flex-col justify-center">
                    <div className="space-y-4">
                      {audienceConfigs.map((config) => {
                        const AudienceIcon = heroAudienceIcons[config.key]

                        return (
                          <div key={config.key} className="flex items-start gap-4">
                            <span
                              aria-hidden="true"
                              className="border-white/38 flex h-10 w-10 flex-none items-center justify-center rounded-[14px] border bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                            >
                              <AudienceIcon className="h-4.5 w-4.5" />
                            </span>

                            <div className="min-w-0 flex-1">
                              <h2 className="landing-summary-title text-white">
                                {t(`hero.audiences.${config.key}.title`)}
                              </h2>
                              <p className="text-white/74 mt-2 text-sm leading-relaxed">
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
