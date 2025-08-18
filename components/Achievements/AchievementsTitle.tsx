import { useTranslations } from 'next-intl'

export const AchievementsTitle = () => {
  const t = useTranslations('components.Achievements.AchievementsTitle')
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xl/[24px]">{t('title')}</div>
      <div className="text-sm/[16px] text-textcolor-purple">{t('subtitle')}</div>
    </div>
  )
}
