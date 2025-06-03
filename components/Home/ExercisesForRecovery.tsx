import { useTranslations } from 'next-intl'

import { CustomCard } from '@/ds/components/CustomCard'
import { ExercisesForRecoveryProps } from '@/types/exercisesForRecovery'
import { getEmojiFromBackend } from '@/utils/getEmojiFromBackend'

import { SectionCard } from '../ui/SectionCard'

export const ExercisesForRecovery = ({ exercises }: ExercisesForRecoveryProps) => {
  const t = useTranslations('HomePage.ExercisesForRecovery')
  return (
    <SectionCard title={t('title')} subtitle={t('subtitle')}>
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
