import { useTranslations } from 'next-intl'

import { Achievements } from '@/components/Achievements'
import { Calendar } from '@/components/Calendar'
import { ChartDynamics } from '@/components/MyProgress/ChartDynamics'
import { PersonalGoals } from '@/components/MyProgress/PersonalGoals'
import { TodayObservations } from '@/components/MyProgress/TodayObservations'
import { PageTitle } from '@/ds/components/PageTitle'
import { HeartHandsEmoji } from '@/ds/icons/emoji/heart-hands'

export default function MyProgress() {
  const t = useTranslations('MyProgress')
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('PageTitle.title')} subtitle={t('PageTitle.subtitle')} />

      <div className="grid grid-cols-2 gap-4">
        <Calendar
          title={t('Activity.Title')}
          subtitle={
            <p className="flex items-center gap-1 text-xs text-textcolor-secondary">
              <HeartHandsEmoji />
              {t('Activity.Subtitle')}
            </p>
          }
          activeLabel={t('Activity.DaysWithActivity')}
          inactiveLabel={t('Activity.DaysWithoutActivity')}
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
