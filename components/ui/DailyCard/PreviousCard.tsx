import { useLocale, useTranslations } from 'next-intl'

import { CalendarMinimalisticIcon } from '@/ds/icons/calendar-minimalistic'
import { Badge } from '@/ds/shadcn/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { PreviousDailyCardProps } from '@/types/dailyCard'
import { SupportedLanguage } from '@/types/languages'

import { SavedToggle } from './SavedToggle'

export const PreviousCard: React.FC<PreviousDailyCardProps> = ({
  id,
  type,
  translations,
  createdAt,
  className,
  isPublished,
}) => {
  const parsedDate = new Date(createdAt)
  const formattedDate = parsedDate.toLocaleDateString('uk-UA')
  const locale = useLocale() as SupportedLanguage

  const t = useTranslations('components.DailyCard')

  return (
    <Card className={cn('flex flex-col gap-5 border-outline-secondary bg-surface-white p-5 shadow-none', className)}>
      <CardHeader className="flex max-h-6 flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="flex items-center gap-1 text-base font-medium text-textcolor-tertiary [&_svg]:size-5">
          <CalendarMinimalisticIcon />

          {formattedDate}
        </CardTitle>
        <SavedToggle
          saveFunc={() => {
            const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]')
            localStorage.setItem(
              'savedItems',
              JSON.stringify([...savedItems, { id, createdAt, translations, type, isPublished }])
            )
          }}
          toastText={t('toastText', { type })}
        />
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-base">&quot;{translations[`${locale}`]}&quot;</p>
      </CardContent>
      <CardFooter className="p-0">
        <Badge variant="active">{t('type', { type })}</Badge>
      </CardFooter>
    </Card>
  )
}
