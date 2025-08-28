import { useTranslations } from 'next-intl'

import { ChartIcon } from '@/ds/icons/summary/chart'
import { Mood } from '@/types/bestDay'

import { MoodBadge } from './MoodBadge'
import { SummaryCard } from './SummaryCard'

export const MoodMarks = () => {
  const moods: Mood[] = ['very good', 'good', 'neutral', 'bad', 'very bad']
  const t = useTranslations('components.TenDaysSummary.MoodMarks')
  return (
    <SummaryCard icon={<ChartIcon />} title={t('title')}>
      <div className="mt-6 grid auto-rows-min grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex flex-col gap-2">
          {moods.slice(0, 3).map((mood) => (
            <div key={mood} className="flex w-full justify-between">
              <MoodBadge className="w-full" data={mood} />
              <span className="ml-2">-</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-end gap-2">
          {moods.slice(3).map((mood) => (
            <div key={mood} className="flex w-full justify-between">
              <MoodBadge className="w-full" data={mood} />
              <span className="ml-2">-</span>
            </div>
          ))}
        </div>
      </div>
    </SummaryCard>
  )
}
