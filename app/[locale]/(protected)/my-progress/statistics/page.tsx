import { useTranslations } from 'next-intl'

import { Calendar } from '@/components/Calendar'
import { ChartDynamics } from '@/components/MyProgress/ChartDynamics'
import { HeartHandsEmoji } from '@/ds/icons/emoji/heart-hands'

export default function MyProgressStatisticsPage() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Calendar
          title={t('components.Calendar.title', { type: 'myProgress' })}
          subtitle={
            <p className="flex items-center gap-1 text-xs text-textcolor-secondary">
              <HeartHandsEmoji />
              {t('components.Calendar.subtitle', { type: 'myProgress' })}
            </p>
          }
          activeLabel={t('components.Calendar.daysWithActivity', { type: 'myProgress' })}
          inactiveLabel={t('components.Calendar.daysWithoutActivity', { type: 'myProgress' })}
          selectedDays={[new Date()]}
        />
      </div>
      <ChartDynamics />
    </div>
  )
}
