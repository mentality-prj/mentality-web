import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

import { SectionCard } from '../ui/SectionCard'

export const StressAssessment = () => {
  const t = useTranslations('MoodTracker.StressAssessment')

  return (
    <SectionCard title={t('title')} subtitle={t('description')}>
      <Button>{t('button')}</Button>
    </SectionCard>
  )
}
