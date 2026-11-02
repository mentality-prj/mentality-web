import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { chooseMoodNextStep } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import type { MoodRecordEntity } from '@/types/api-responses'
import { Button } from '@/ui/button'

type Props = {
  record: MoodRecordEntity
}

/**
 * The recommendation is optional and based on one self-reported record only.
 * No diary text, tags, diagnosis or unverified predictive confidence is used.
 */
export async function MoodNextStepCard({ record }: Props) {
  const t = await getTranslations('components.ExercisesForRecovery.nextStep')
  const step = chooseMoodNextStep(record)

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
          <p className="text-sm leading-relaxed">{t(`suggestions.${step.action}`)}</p>
          <Button asChild variant="secondary" size="medium" className="w-fit">
            <Link href={step.href}>{t(`actions.${step.action}`)}</Link>
          </Button>
          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('limitNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
