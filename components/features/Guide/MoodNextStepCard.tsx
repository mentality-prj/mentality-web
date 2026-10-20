import { getTranslations } from 'next-intl/server'

import { MoodActionPicker, type MoodActionCopy } from '@/components/features/Guide/MoodActionPicker'
import { SectionCard } from '@/ds/components/SectionCard'
import { chooseMoodNextStep } from '@/helpers/moodNextStep'
import type { MoodRecordEntity } from '@/types/api-responses'

type Props = {
  record: MoodRecordEntity
}

/**
 * Uses only the four explicit self-report levels. No inferred medical state,
 * diary content, identifiers, or model-generated predictive confidence.
 */
export async function MoodNextStepCard({ record }: Props) {
  const t = await getTranslations('components.ExercisesForRecovery.nextStep')
  const step = chooseMoodNextStep(record)
  const copy: MoodActionCopy = {
    choosePrompt: t('choosePrompt'),
    userChoiceNote: t('userChoiceNote'),
    options: {
      breathing: t('options.breathing'),
      calming: t('options.calming'),
      meditation: t('options.meditation'),
      focus: t('options.focus'),
    },
    suggestions: {
      breathing: t('suggestions.breathing'),
      calming: t('suggestions.calming'),
      meditation: t('suggestions.meditation'),
      focus: t('suggestions.focus'),
    },
    actions: {
      breathing: t('actions.breathing'),
      calming: t('actions.calming'),
      meditation: t('actions.meditation'),
      focus: t('actions.focus'),
    },
  }

  return (
    <section aria-labelledby="mood-next-step-heading">
      <SectionCard>
        <div className="flex flex-col gap-sm">
          <div>
            <h2 id="mood-next-step-heading" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p className="mt-1 text-sm text-textcolor-secondary">
              {t(`observations.${step.observation}`, { level: step.level ?? 0 })}
            </p>
          </div>
          <MoodActionPicker key={record.id} suggestedAction={step.action} copy={copy} />
          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('limitNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
