import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export const AchievementsFilter = () => {
  const t = useTranslations('components.Achievements.AchievementsFilter')
  return (
    <Tabs defaultValue="All">
      <TabsList className="gap-3">
        <TabsTrigger value="Unlocked">{t('unlocked')}</TabsTrigger>
        <TabsTrigger value="Locked">{t('locked')}</TabsTrigger>
        <TabsTrigger value="All">{t('all')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
