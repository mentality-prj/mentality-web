import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'
import { Button } from '@/ds/shadcn/button'

import { AchievementsFilter } from './AchievementsFilter'
import { AchievementsList } from './AchievementsList'
import { AchievementsTitle } from './AchievementsTitle'

export const Achievements = () => {
  const t = useTranslations('common.Buttons')
  return (
    <SectionCard className="flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <AchievementsTitle />
        <AchievementsFilter />
      </div>
      <AchievementsList />
      <Button variant="secondary" className="mx-auto flex">
        {t('showMore')}
      </Button>
    </SectionCard>
  )
}
