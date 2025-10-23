import { CreatePersonalGoals } from './CreatePersonalGoals'
import { PersonalGoalsCard } from './PersonalGoalsCard'

export const PersonalGoalsList = () => {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 laptop:grid-cols-2 desktop:grid-cols-3">
      <CreatePersonalGoals />
      <PersonalGoalsCard text="Відвідати 3 сесії з психологом" repeat={8} check={8} status="completed" />
      <PersonalGoalsCard text="Відвідати 3 сесії з психологом" repeat={8} check={4} status="pending" />
    </div>
  )
}
