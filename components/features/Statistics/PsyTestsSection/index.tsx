'use client'

import { useLocale, useTranslations } from 'next-intl'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import { PSY_TEST_CONFIG } from '@/constants/userStatistics'
import { SupportedLanguage } from '@/types/languages'
import { PsyTestBlock, PsyTestKey } from '@/types/userStatistics'
import { Badge } from '@/ui/badge'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart'

type PsyTestsSectionProps = {
  k10: PsyTestBlock
  phq9: PsyTestBlock
  gad7: PsyTestBlock
}

function TestCard({ testKey, block }: { testKey: PsyTestKey; block: PsyTestBlock }) {
  const t = useTranslations('components.UserStatistics')
  const locale = useLocale() as SupportedLanguage

  const config = PSY_TEST_CONFIG[testKey as PsyTestKey]

  const chartConfig = {
    score: { label: t('psyTests.score'), color: config.color },
  } satisfies ChartConfig

  return (
    <div className="background-alt-white rounded-md p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-textcolor-primary">{t(`psyTests.${testKey}.title`)}</h4>
        <span className="text-sm text-textcolor-secondary">
          {t('psyTests.totalTaken', { count: block.totalTaken })}
        </span>
      </div>

      {block.latest ? (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl font-bold text-textcolor-primary">{block.latest.score}</span>
          <div className="flex flex-col">
            <Badge variant="secondary">{block.latest.level}</Badge>
            <span className="mt-1 text-xs text-textcolor-secondary">
              {new Date(block.latest.date).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-textcolor-secondary">{t('psyTests.noResults')}</p>
      )}

      {block.trend.length > 1 && (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }} data={block.trend}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={40}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
                }
              />
              <YAxis domain={[0, config.maxScore]} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke={config.color}
                strokeWidth={2}
                dot={{ r: 4, fill: 'white', stroke: config.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  )
}

export function PsyTestsSection({ k10, phq9, gad7 }: PsyTestsSectionProps) {
  const t = useTranslations('components.UserStatistics')

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-textcolor-primary">{t('psyTests.title')}</h3>
      <div className="grid grid-cols-1 gap-sm lg:grid-cols-3">
        <TestCard testKey="k10" block={k10} />
        <TestCard testKey="phq9" block={phq9} />
        <TestCard testKey="gad7" block={gad7} />
      </div>
    </div>
  )
}
