import { CloudLightning } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import { SummaryCard } from '@/components/shared/Cards/SummaryCard'
import { DaySummary } from '@/types/daySummary'

import { StressLevelChart } from './StressLevelChart'

export const StressLevel = async ({ summaries }: { summaries?: DaySummary[] }) => {
  const t = await getTranslations('components.StressLevel')
  const locale = await getLocale()

  return (
    <SummaryCard
      className="gap-0"
      title={t('title')}
      icon={<CloudLightning className="opacity-50" color="white" size="128" />}
    >
      <div className="flex w-full flex-col gap-xs">
        <StressLevelChart summaries={summaries} locale={locale} />
      </div>
    </SummaryCard>
  )
}
