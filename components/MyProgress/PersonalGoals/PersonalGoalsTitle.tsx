import { useTranslations } from 'next-intl'

export const PersonalGoalsTitle = () => {
  const t = useTranslations('components.PersonalGoals')
  return (
    <div className="flex flex-col">
      <div className="text-xl/[24px] font-semibold text-textcolor-primary">{t('Title')}</div>
      <div className="font-normal text-textcolor-secondary">{t('Subtitle')}</div>
    </div>
  )
}
