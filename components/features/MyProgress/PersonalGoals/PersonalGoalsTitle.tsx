import { useTranslations } from 'next-intl'

export const PersonalGoalsTitle = () => {
  const t = useTranslations('components.PersonalGoals')
  return (
    <div className="flex flex-col gap-xs">
      <h4>{t('Title')}</h4>
      <h5>{t('Subtitle')}</h5>
    </div>
  )
}
