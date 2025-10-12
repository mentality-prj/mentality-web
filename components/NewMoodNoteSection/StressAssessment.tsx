import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Card, CardContent } from '@/ds/shadcn/card'

import { StressLevelScale } from './StressLevelScale'

export const StressAssessment = () => {
  const t = useTranslations('MoodTracker')

  return (
    <Card className="border-outline-secondary">
      <CardContent className="px-4">
        <div className="py-4">{t('StressAssessment.title')}</div>
        <StressLevelScale />
        <div className="mt-4 flex justify-between rounded-md bg-secondary p-4">
          <span className="text-sm">{t('StressAssessment.description')}</span>
          <Button variant="textButton" size="base">
            {t('StressAssessment.button')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
