import { CalendarMinimalisticIcon } from '@/ds/icons/calendar-minimalistic'
import { Badge } from '@/ds/shadcn/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { PreviousDailyCardProps } from '@/types/dailyCard'

import { SavedToggle } from './SavedToggle'

export const PreviousCard: React.FC<PreviousDailyCardProps> = ({ textContent, className, date, tag, toastText }) => {
  const newdate = new Date(date)

  const formatted = newdate.toLocaleDateString('uk-UA')
  return (
    <Card className={cn('flex flex-col gap-5 border-outline-secondary bg-surface-white p-5 shadow-none', className)}>
      <CardHeader className="flex max-h-6 flex-row items-center justify-between space-y-0 p-0">
        <CardTitle className="flex items-center gap-1 text-base font-medium text-textcolor-tertiary [&_svg]:size-5">
          <CalendarMinimalisticIcon />
          {formatted}
        </CardTitle>
        <SavedToggle toastText={toastText} />
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-base">&quot;{textContent}&quot;</p>
      </CardContent>
      <CardFooter className="p-0">
        <Badge variant="active">{tag}</Badge>
      </CardFooter>
    </Card>
  )
}
