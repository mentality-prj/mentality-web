import { useTranslations } from 'next-intl'

import { SectionCard } from '../ui/SectionCard'

export const AffirmationHistory = () => {
  const t = useTranslations('AffirmationsPage')
  return <SectionCard title={t('sectionCard.title')} subtitle={t('sectionCard.subtitle')} />
}
