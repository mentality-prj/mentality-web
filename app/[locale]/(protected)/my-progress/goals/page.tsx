import { DeadlineCountdown } from '@/components/features/MyProgress/PersonalGoals/DeadlineCountdown'
import { PersonalGoals } from '@/components/features/MyProgress/PersonalGoals/PersonalGoals'
import { Routes } from '@/constants/routes'

export default function MyProgressGoalsPage() {
  return (
    <>
      <PersonalGoals />
      <DeadlineCountdown href={Routes.MYPROGRESSGOALS} />
    </>
  )
}
