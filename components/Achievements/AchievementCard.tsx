import { MedalCircleIcon } from '@/ds/icons/medal-circle'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { Progress } from '@/ds/shadcn/progress'
import { cn } from '@/lib/utils'

import { SunIcon } from '../icons/navbar/sun-icon'

export const AchievementCard = ({ status }: { status: 'locked' | 'unlocked' }) => {
  return (
    <Card
      className={cn(
        'flex flex-col justify-between rounded-md border-outline-secondary text-center shadow-none',
        status === 'unlocked' && 'border-textcolor-purple bg-surface-action'
      )}
    >
      <CardHeader className="items-center space-y-1">
        <SunIcon />
        <CardTitle className="text-base">Турбота 3 дні поспіль</CardTitle>
        <CardDescription>Відвідати платформу три дні підряд</CardDescription>
      </CardHeader>
      <CardFooter className="">
        {status === 'unlocked' ? (
          <div className="flex w-full flex-col items-center text-textcolor-purple [&_svg]:size-12">
            <MedalCircleIcon />
            <div className="">Відкрито</div>
          </div>
        ) : status === 'locked' ? (
          <div className="w-full">
            <div className="flex justify-between text-xs/[14px] text-textcolor-tertiary">
              <div className="">Прогрес</div>
              <div className="">3/7</div>
            </div>
            <Progress className="mt-2 h-[6px] bg-surface-secondary" value={(3 / 7) * 100} />
          </div>
        ) : (
          ''
        )}
      </CardFooter>
    </Card>
  )
}
