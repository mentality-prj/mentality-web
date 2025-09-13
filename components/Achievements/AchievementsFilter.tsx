import { useTranslations } from 'next-intl'

import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export const AchievementsFilter = () => {
  const t = useTranslations('components.Achievements.AchievementsFilter')
  return (
    <Tabs defaultValue="All">
      <TabsList className="gap-3">
        <TabsTrigger value="Unlocked">{t('Unlocked')}</TabsTrigger>
        <TabsTrigger value="Locked">{t('Locked')}</TabsTrigger>
        <TabsTrigger value="All">{t('All')}</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
