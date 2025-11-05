import { useTranslations } from 'next-intl'

import { Achievements } from '@/components/Achievements'
import { Activity } from '@/components/MyProgress/Activity'
import { ChartDynamics } from '@/components/MyProgress/ChartDynamics'
import { PersonalGoals } from '@/components/MyProgress/PersonalGoals'
import { TodayObservations } from '@/components/MyProgress/TodayObservations'
import { PageTitle } from '@/components/ui/PageTitle'

export default function MyProgress() {
  const t = useTranslations('MyProgress')
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title={t('PageTitle.title')} subtitle={t('PageTitle.subtitle')} />

      <div className="grid grid-cols-2 gap-4">
        <Activity />
        <TodayObservations />
      </div>
      <ChartDynamics />
      <PersonalGoals />
      <Achievements />
    </div>
  )
}
