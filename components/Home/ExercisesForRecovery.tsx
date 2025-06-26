import { useTranslations } from 'next-intl'

import { CustomCard } from '@/ds/components/CustomCard'
import { ExercisesForRecoveryProps } from '@/types/exercisesForRecovery'
import { getEmojiFromBackend } from '@/utils/getEmojiFromBackend'

import { SectionCard } from '../ui/SectionCard'

export const ExercisesForRecovery = ({ exercises }: ExercisesForRecoveryProps) => {
  const t = useTranslations('HomePage.ExercisesForRecovery')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
      <div className="mt-6 grid snap-x snap-mandatory auto-cols-[80%] grid-flow-col gap-4 overflow-x-auto tablet:auto-cols-auto tablet:grid-flow-row tablet:grid-cols-2">
        {exercises.map((exercise, id) => (
          <div key={id} className="snap-start">
            <CustomCard
              className="h-full"
              variant="default"
              title={exercise.title}
              description={exercise.description}
              icon={getEmojiFromBackend(exercise.icon)}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
