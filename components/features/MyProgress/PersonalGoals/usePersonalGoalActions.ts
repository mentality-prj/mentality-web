import { Dispatch, SetStateAction } from 'react'
import { useSession } from 'next-auth/react'

import { createPersonalGoal, deletePersonalGoal, resetPersonalGoal, updatePersonalGoal } from '@/requests/personalGoals'
import { GoalEntity } from '@/types/api-responses'

type SetGoals = Dispatch<SetStateAction<GoalEntity[]>>

export const usePersonalGoalActions = (setPersonalGoals: SetGoals) => {
  const { data: session } = useSession()

  const mark = async (id: string, check: number) => {
    const res = await updatePersonalGoal(session, { id, check })
    if (res.data) {
      setPersonalGoals((prev) => prev.map((g) => (g.id === id ? res.data! : g)))
    }
  }

  const reset = async (id: string) => {
    const res = await resetPersonalGoal(session, { id })
    if (res.data) {
      setPersonalGoals((prev) => prev.map((g) => (g.id === id ? res.data! : g)))
    }
  }

  const duplicate = async (text: string, repeat: number) => {
    const res = await createPersonalGoal(session, { text, repeat })
    if (res.data) {
      setPersonalGoals((prev) => [res.data!, ...prev])
    }
  }

  const remove = async (id: string) => {
    const res = await deletePersonalGoal(session, { id })
    if (!res.error) {
      setPersonalGoals((prev) => prev.filter((g) => g.id !== id))
    }
  }

  return { mark, reset, duplicate, remove }
}

export default usePersonalGoalActions
