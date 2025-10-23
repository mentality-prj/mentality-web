import { StarMotionEmoji } from '@/ds/icons/emoji/star-motion'
import { ThoughtBalloonIcon } from '@/ds/icons/emotion/thought-balloon'
import { RestartIcon } from '@/ds/icons/restart'
import { TrashIcon } from '@/ds/icons/trash'
import { Button } from '@/ds/shadcn/button'
import { Progress } from '@/ds/shadcn/progress'
import { cn } from '@/lib/utils'

interface PersonalGoalsCardProps {
  text: string
  check: number
  repeat: number
  status: 'pending' | 'completed'
}

export const PersonalGoalsCard = ({ text, check, repeat, status }: PersonalGoalsCardProps) => {
  return (
    <div
      className={cn(
        'flex aspect-[11/8] flex-col justify-between gap-7 rounded-md border border-outline-secondary p-6',
        status === 'completed' && 'border-primary bg-surface-action'
      )}
    >
      <div className="flex items-start gap-2">
        <div className="">
          <ThoughtBalloonIcon />
        </div>
        <div
          className={cn(
            'mx-auto text-base font-medium text-textcolor-primary',
            status === 'completed' && 'text-primary'
          )}
        >
          {text}
        </div>
        <Button variant="iconButton">
          <RestartIcon />
        </Button>
        <Button variant="iconButton">
          <TrashIcon />
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="">
          <Progress value={(check / repeat) * 100} className="h-[6px] bg-surface-secondary" />
          <div className="mt-2 flex justify-between text-xs/[14px] font-normal text-textcolor-tertiary">
            <div>Прогрес</div>
            <div>
              {check}/{repeat}
            </div>
          </div>
        </div>
        {status === 'completed' ? (
          <div className="flex items-center justify-center gap-3 rounded-md border border-primary bg-surface-white px-3 py-4 text-xs/[14px]">
            <StarMotionEmoji />
            <p>Вау! Ціль досягнута, так тримати!</p>
          </div>
        ) : (
          <Button>Відмітити</Button>
        )}
      </div>
    </div>
  )
}
