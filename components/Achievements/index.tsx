import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

import { SectionCard } from '../ui/SectionCard'

import { AchievementsFilter } from './AchievementsFilter'
import { AchievementsList } from './AchievementsList'
import { AchievementsTitle } from './AchievementsTitle'

export const Achievements = () => {
  const t = useTranslations('components.Achievements')
  return (
    <SectionCard className="flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <AchievementsTitle />
        <AchievementsFilter />
      </div>
      <AchievementsList />
      <Button variant="secondary" className="mx-auto flex">
        {t('Button')}
      </Button>
    </SectionCard>
  )
}
