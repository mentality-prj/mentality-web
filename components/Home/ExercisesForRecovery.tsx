import { useTranslations } from 'next-intl'

import { CustomCard } from '@/ds/components/CustomCard'
import { ExercisesForRecoveryProps } from '@/types/exercisesForRecovery'
import { getEmojiFromBackend } from '@/utils/getEmojiFromBackend'

import { SectionCard } from '../ui/SectionCard'

export const ExercisesForRecovery = ({ exercises }: ExercisesForRecoveryProps) => {
  const t = useTranslations('HomePage.ExercisesForRecovery')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
      <div className="mt-6 grid snap-x snap-mandatory auto-cols-[80%] grid-flow-col gap-4 overflow-x-auto tablet:max-laptop:auto-cols-auto tablet:max-laptop:grid-flow-row tablet:max-laptop:grid-cols-2 desktop:auto-cols-auto desktop:grid-flow-row desktop:grid-cols-2">
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
