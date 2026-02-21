import { Dispatch, SetStateAction } from 'react'
import { useSession } from 'next-auth/react'

import { createPersonalGoal, deletePersonalGoal, resetPersonalGoal, updatePersonalGoal } from '@/requests/personalGoals'
import { GoalEntity } from '@/types/api-responses'
import type { GoalCategory } from '@/types/goals'

type SetGoals = Dispatch<SetStateAction<GoalEntity[]>>

export const usePersonalGoalActions = (setPersonalGoals: SetGoals) => {
  const { data: session } = useSession()

  const mark = async (id: string, check: number) => {
    try {
      const res = await updatePersonalGoal(session, { id, check })
      if (res.data) {
        setPersonalGoals((prev) => prev.map((g) => (g.id === id ? res.data! : g)))
      } else {
        console.error('Failed to update personal goal progress: missing response data.', res)
      }
    } catch (error) {
      console.error('Failed to update personal goal progress.', error)
    }
  }

  const reset = async (id: string) => {
    try {
      const res = await resetPersonalGoal(session, { id })
      if (res.data) {
        setPersonalGoals((prev) => prev.map((g) => (g.id === id ? res.data! : g)))
      } else {
        console.error('Failed to reset personal goal: missing response data.', res)
      }
    } catch (error) {
      console.error('Failed to reset personal goal.', error)
    }
  }

  const duplicate = async (text: string, repeat: number, category: GoalCategory, deadline?: string) => {
    try {
      const res = await createPersonalGoal(session, { text, repeat, category, deadline })
      if (res.data) {
        setPersonalGoals((prev) => [res.data!, ...prev])
      } else {
        console.error('Failed to duplicate personal goal: missing response data.', res)
      }
    } catch (error) {
      console.error('Failed to duplicate personal goal.', error)
    }
  }

  const remove = async (id: string) => {
    try {
      const res = await deletePersonalGoal(session, { id })
      if (!res.error) {
        setPersonalGoals((prev) => prev.filter((g) => g.id !== id))
      } else {
        console.error('Failed to remove personal goal.', res.error)
      }
    } catch (error) {
      console.error('Failed to remove personal goal.', error)
    }
  }

  return { mark, reset, duplicate, remove }
}

export default usePersonalGoalActions
