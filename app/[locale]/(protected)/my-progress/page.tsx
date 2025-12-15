import { useTranslations } from 'next-intl'

import { Achievements } from '@/components/Achievements'
import { Calendar } from '@/components/Calendar'
import { ChartDynamics } from '@/components/MyProgress/ChartDynamics'
import { PersonalGoals } from '@/components/MyProgress/PersonalGoals'
import { TodayObservations } from '@/components/MyProgress/TodayObservations'
import { PageTitle } from '@/ds/components/PageTitle'
import { HeartHandsEmoji } from '@/ds/icons/emoji/heart-hands'

export default function MyProgress() {
  const t = useTranslations()
  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title={t('common.PageTitle.title', { title: 'myProgress' })}
        subtitle={t('common.PageTitle.subtitle', { subtitle: 'myProgress' })}
      />

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
        <TodayObservations />
      </div>
      <ChartDynamics />
      <PersonalGoals />
      <Achievements />
    </div>
  )
}
