import { useLocale, useTranslations } from 'next-intl'

import { CalendarMinimalisticIcon } from '@/ds/icons/calendar-minimalistic'
import { Badge } from '@/ds/shadcn/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { PreviousDailyCardProps } from '@/types/dailyCard'

import { SavedToggle } from './SavedToggle'

export const PreviousCard: React.FC<PreviousDailyCardProps> = ({ date, textContent, tag, className }) => {
  const parsedDate = new Date(date)
  const formattedDate = parsedDate.toLocaleDateString('uk-UA')
  const locale = useLocale()
  const localizedTextContent = textContent[locale as 'uk' | 'pl' | 'en']
  const t = useTranslations('AffirmationsPage')

  return (
    <Card className={cn('flex flex-col gap-5 border-outline-secondary bg-surface-white p-5 shadow-none', className)}>
      <CardHeader className="flex max-h-6 flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="flex items-center gap-1 text-base font-medium text-textcolor-tertiary [&_svg]:size-5">
          <CalendarMinimalisticIcon />
          {formattedDate}
        </CardTitle>
        <SavedToggle toastText={t(`toast.${tag}`)} />
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-base">&quot;{localizedTextContent}&quot;</p>
      </CardContent>
      <CardFooter className="p-0">
        <Badge variant="active">{t(`${tag}Tag`)}</Badge>
      </CardFooter>
    </Card>
  )
}
