'use client'

import { useTranslations } from 'next-intl'

import { ISO_WEEKDAYS } from '@/constants/userStatistics'
import { buildWeekdayMap, getMoodHeatmapColor } from '@/helpers/userStatistics.helpers'
import { WeekdayAverage } from '@/types/userStatistics'

type WeekdayHeatmapProps = {
  data: WeekdayAverage[]
}

export function WeekdayHeatmap({ data }: WeekdayHeatmapProps) {
  const t = useTranslations('components.UserStatistics')

  const weekdayMap = buildWeekdayMap(data)

  return (
    <div className="background-alt-white rounded-md p-6">
      <h3 className="mb-5 text-xl font-semibold text-textcolor-primary">{t('weekday.title')}</h3>
      <div className="grid grid-cols-7 gap-2">
        {ISO_WEEKDAYS.map((day) => {
          const entry = weekdayMap.get(day)
          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-textcolor-secondary">{t(`weekday.days.${day}`)}</span>
              <div
                className={`flex h-14 w-full items-center justify-center rounded-md ${getMoodHeatmapColor(entry?.mood)}`}
                title={entry ? `${t('metrics.mood')}: ${entry.mood.toFixed(1)} (${entry.count})` : undefined}
              >
                {entry && <span className="text-sm font-semibold text-textcolor-primary">{entry.mood.toFixed(1)}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
