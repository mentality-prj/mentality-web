'use client'

import {
  deletePersonalGoal,
  fetchPersonalGoals,
  PersonalGoal,
  resetPersonalGoal,
  updatePersonalGoal,
} from '@/actions/personalGoals.action'
import { StarMotionEmoji } from '@/ds/icons/emoji/star-motion'
import { ThoughtBalloonIcon } from '@/ds/icons/emotion/thought-balloon'
import { RestartIcon } from '@/ds/icons/restart'
import { TrashIcon } from '@/ds/icons/trash'
import { Button } from '@/ds/shadcn/button'
import { Progress } from '@/ds/shadcn/progress'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { Dispatch, SetStateAction } from 'react'

export interface PersonalGoalsCardProps {
  id: string
  text: string
  check: number
  repeat: number
  status: 'pending' | 'completed' | 'in progress'
  setPersonalGoals: Dispatch<SetStateAction<PersonalGoal[]>>
}

export const PersonalGoalsCard = ({ id, text, check, repeat, status, setPersonalGoals }: PersonalGoalsCardProps) => {
  const { data } = useSession()
  console.log('status and text', status, text)
  const userId = data?.user?.id
  if (!userId) {
    return null
  }
  const handleClick = async () => {
    await updatePersonalGoal({ id, userId, check })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
  }

  const resetClick = async () => {
    await resetPersonalGoal({ id, userId })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
  }

  const deleteClick = async () => {
    await deletePersonalGoal({ id, userId })
    await fetchPersonalGoals(userId).then((goals) => setPersonalGoals(goals))
  }

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
        <Button onClick={resetClick} variant="iconButton">
          <RestartIcon />
        </Button>
        <Button onClick={deleteClick} variant="iconButton">
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
          <Button onClick={handleClick}>Відмітити</Button>
        )}
      </div>
    </div>
  )
}
