import { useLocale, useTranslations } from 'next-intl'

import { AstronomyIcon } from '@/ds/icons/blueIcons/astronomy'
import { StarRingIcon } from '@/ds/icons/blueIcons/star-ring'
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { SecondaryDailyCardProps } from '@/types/dailyCard'
import { SupportedLanguage } from '@/types/languages'

import { SavedToggle } from './SavedToggle'

export const SecondaryCard: React.FC<SecondaryDailyCardProps> = ({ type, translations, className }) => {
  const t = useTranslations('components.DailyCard')

  const locale = useLocale() as SupportedLanguage
  return (
    <Card className={cn('flex flex-col gap-6 border-none bg-surface-white p-8 shadow-none', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="flex items-center gap-3">
          {type === 'affirmation' ? <StarRingIcon /> : type === 'tip' ? <AstronomyIcon /> : ''}
          <p className="text-xl/6">{t('title', { type })}</p>
        </CardTitle>
        <SavedToggle toastText={t('toastText', { type })} />
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-base">{translations[`${locale}`]}</p>
      </CardContent>
    </Card>
  )
}
