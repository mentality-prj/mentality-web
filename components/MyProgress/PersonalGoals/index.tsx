import { SectionCard } from '@/components/ui/SectionCard'
import { Section } from 'lucide-react'
import { PersonalGoalsTitle } from './PersonalGoalsTitle'
import { PersonalGoalsFilter } from './PersonalGoalsFilter'
import { PersonalGoalsList } from './PersonalGoalsList'

export const PersonalGoals = () => {
  return (
    <SectionCard className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between">
        <PersonalGoalsTitle />
        <PersonalGoalsFilter />
      </div>
      <PersonalGoalsList />
    </SectionCard>
  )
}
