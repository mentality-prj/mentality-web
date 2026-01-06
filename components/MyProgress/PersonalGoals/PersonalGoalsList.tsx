'use client'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { mockCreateGoal, mockDeleteGoal, mockGetGoals, mockUpdateGoal } from '@/REST/mockApi'
import { CreateGoalDto, GoalEntity } from '@/types/api-responses'
import { ApiResult } from '@/types/requests'
import { notifyError } from '@/utils/toast'

import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'
import { Filter } from './PersonalGoalsFilter'

const FILTERS_MAP: Record<Filter, (goal: GoalEntity) => boolean> = {
  all: () => true,
  pending: (goal) => goal.status === 'pending' || goal.status === 'in progress',
  completed: (goal) => goal.status === 'completed',
}

export const PersonalGoalsList = ({ filter }: { filter: Filter }) => {
  const { data: session } = useSession()
  const [personalGoals, setPersonalGoals] = useState<GoalEntity[]>([])
  const filteredGoals = personalGoals.filter(FILTERS_MAP[`${filter}`])

  const loadGoals = useCallback(async () => {
    if (!session) return
    // const result = await getGoals(session) TODO: uncomment when API is ready
    const result = await mockGetGoals()
    if (result.error) {
      notifyError(result.error)
      setPersonalGoals([])
    } else {
      setPersonalGoals(result.data || [])
    }
  }, [session])

  const runMutation = async <T,>(action: () => Promise<ApiResult<T>>, errorMessage: string) => {
    if (!session) return

    try {
      const result = await action()

      if (result.error) {
        notifyError(result.error)
        return
      }

      await loadGoals()
    } catch {
      notifyError(errorMessage)
    }
  }

  const onMarkProgress = (goalId: string, check: number) => {
    runMutation(() => mockUpdateGoal(goalId, { check: check + 1 }), 'Unexpected error while updating goal')
  }

  const onCreateGoal = (goalData: CreateGoalDto) => {
    runMutation(() => mockCreateGoal(goalData), 'Failed to create goal')
  }

  const onResetGoal = (goalId: string) => {
    runMutation(() => mockUpdateGoal(goalId, { check: 0 }), 'Failed to reset goal')
  }

  const onDeleteGoal = (goalId: string) => {
    runMutation(() => mockDeleteGoal(goalId), 'Failed to delete goal')
  }

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
      <CreatePersonalGoals onCreateGoal={onCreateGoal} />
      {filteredGoals.map((goal) => (
        <PersonalGoalsCard
          key={goal.id}
          id={goal.id}
          text={goal.text}
          repeat={goal.repeat}
          check={goal.check}
          status={goal.status}
          onMarkProgress={onMarkProgress}
          onResetGoal={onResetGoal}
          onDeleteGoal={onDeleteGoal}
        />
      ))}
    </div>
  )
}
