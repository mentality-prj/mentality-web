import { CustomCard } from '@/ds/components/CustomCard'
import { ExercisesForRecoveryProps } from '@/types/exercisesForRecovery'
import { getEmojiFromBackend } from '@/utils/getEmojiFromBackend'

import { SectionCard } from '../ui/SectionCard'

export const ExercisesForRecovery = ({ exercises }: ExercisesForRecoveryProps) => {
  return (
    <SectionCard title="Вправи для відновлення" subtitle="Практики для психологічного здоров’я">
      <div className="mt-6 grid grid-cols-2 gap-4">
        {exercises.map((exercise, id) => (
          <CustomCard
            variant="default"
            key={id}
            title={exercise.title}
            description={exercise.description}
            icon={getEmojiFromBackend(exercise.icon)}
            className="min-h-[196px]"
          />
        ))}
      </div>
    </SectionCard>
  )
}
