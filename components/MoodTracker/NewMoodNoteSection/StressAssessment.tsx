import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'

import CardContainer from '../../Cards/CardContainer'

import { StressLevelScale } from './StressLevelScale'

export const StressAssessment = () => {
  const t = useTranslations('components.StressAssessment')

  return (
    <CardContainer>
      <div className="py-4">{t('title')}</div>
      <StressLevelScale />
      <div className="mt-4 flex justify-between rounded-md bg-secondary p-4">
        <span className="text-sm">{t('description')}</span>
        <Button variant="textButton" size="base">
          {t('button')}
        </Button>
      </div>
    </CardContainer>
  )
}
