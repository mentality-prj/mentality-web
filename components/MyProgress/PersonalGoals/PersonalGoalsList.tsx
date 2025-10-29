import { auth } from '@/auth'
import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'
import { CustomSession } from '@/types/auth'
import { fetchPersonalGoals } from '@/actions/personalGoals.action'

export const PersonalGoalsList = async () => {
  const session = (await auth()) as CustomSession
  const user = session.user

  const userId = user?.id

  if (!userId) {
    return null
  }
  const personalGoals = await fetchPersonalGoals(userId)

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
      <CreatePersonalGoals />
      {personalGoals.map((goal) => (
        <PersonalGoalsCard
          key={goal.id}
          id={goal.id}
          text={goal.text}
          repeat={goal.repeat}
          check={goal.check}
          status={goal.status}
        />
      ))}
    </div>
  )
}
