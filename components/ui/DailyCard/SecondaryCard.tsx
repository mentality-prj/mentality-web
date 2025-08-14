import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { cn } from '@/lib/utils'
import { SecondaryDailyCardProps } from '@/types/dailyCard'

import { SavedToggle } from './SavedToggle'

export const SecondaryCard: React.FC<SecondaryDailyCardProps> = ({
  title,
  textContent,
  icon,
  className,
  toastText,
}) => (
  <Card className={cn('flex flex-col gap-6 border-none bg-surface-white p-8 shadow-none', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
      <CardTitle className="flex items-center gap-3">
        {icon}
        <p className="text-xl/6">{title}</p>
      </CardTitle>
      <SavedToggle toastText={toastText} />
    </CardHeader>
    <CardContent className="p-0">
      <p className="text-base">{textContent}</p>
    </CardContent>
  </Card>
)
