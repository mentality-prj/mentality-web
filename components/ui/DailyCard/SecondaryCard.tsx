import { StarIcon } from '@/ds/icons/star'
import { Card, CardContent, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { Toggle } from '@/ds/shadcn/toggle'
import { cn } from '@/lib/utils'
import { SecondaryDailyCardProps } from '@/types/dailyCard'

export const SecondaryCard: React.FC<SecondaryDailyCardProps> = ({ title, textContent, icon, className }) => (
  <Card className={cn('flex flex-col gap-6 border-none bg-surface-white p-8 shadow-none', className)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0">
      <CardTitle className="flex items-center gap-3">
        {icon}
        <p className="text-xl/6">{title}</p>
      </CardTitle>
      <Toggle className="fill-transparent p-0 text-textcolor-primary data-[state='on']:fill-primary data-[state='on']:text-primary [&_svg]:size-6">
        <StarIcon />
      </Toggle>
    </CardHeader>
    <CardContent className="p-0">
      <p className="text-base">{textContent}</p>
    </CardContent>
  </Card>
)
