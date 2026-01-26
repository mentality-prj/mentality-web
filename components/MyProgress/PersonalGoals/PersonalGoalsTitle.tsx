import { useTranslations } from 'next-intl'

export const PersonalGoalsTitle = () => {
  const t = useTranslations('components.PersonalGoals')
  return (
    <div className="flex flex-col gap-2">
      <h4>{t('Title')}</h4>
      <h5>{t('Subtitle')}</h5>
    </div>
  )
}
