'use client'

import { BrainCircuit } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { HistoryChart } from '@/components/shared/HistoryChart'
import { Phq9HistoryEntry } from '@/types/phq9'

interface Props {
  history: Phq9HistoryEntry[]
  isStub?: boolean
}

export function Phq9HistoryChartClient({ history, isStub }: Props) {
  const t = useTranslations('pages.MentalCheck')

  return (
    <HistoryChart
      history={history}
      isStub={isStub}
      chartLabel="PHQ-9"
      gradientId="phq9Fill"
      title={t('chart.title')}
      stubTitle={t('chart.stubNote')}
      icon={<BrainCircuit className="opacity-50" color="white" size={128} />}
      maxScore={27}
      ticks={[0, 5, 10, 15, 20, 27]}
    />
  )
}
