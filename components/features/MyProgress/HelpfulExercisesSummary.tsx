import { getTranslations } from 'next-intl/server'

import { SectionCard } from '@/ds/components/SectionCard'
import { MOOD_ACTION_HREF, type MoodAction } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import type { ExerciseFeedbackEntry } from '@/requests/exerciseFeedback'

type Props = {
  feedback: readonly ExerciseFeedbackEntry[]
  failed: boolean
}

/**
 * A summary of the user's latest explicit answers, not an exercise-completion
 * or clinical efficacy report. An unanswered category is never treated as a
 * negative assessment. There are at most four supported activity categories.
 */
export async function HelpfulExercisesSummary({ feedback, failed }: Props) {
  const t = await getTranslations('pages.MyProgress.exercises')

  return (
    <section aria-labelledby="my-progress-exercises-heading">
      <SectionCard>
        <div className="flex flex-col gap-md">
          <div>
            <h2 id="my-progress-exercises-heading" className="text-lg font-semibold">
              {t('heading')}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-textcolor-secondary">{t('description')}</p>
          </div>

          {failed ? (
            <p role="alert" className="text-sm text-textcolor-secondary">
              {t('loadError')}
            </p>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col gap-sm">
              <p className="text-sm text-textcolor-secondary">{t('empty')}</p>
              <Link
                href={MOOD_ACTION_HREF.breathing}
                className="w-fit text-sm font-medium text-primary underline underline-offset-4"
              >
                {t('browseAction')}
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-sm tablet:grid-cols-2">
              {feedback.map(({ category, helpful }) => (
                <li key={category} className="min-w-0 rounded-xl border border-current/10 p-4">
                  <div className="flex flex-col gap-xs">
                    <h3 className="font-medium">{t(`categories.${category}`)}</h3>
                    <p className="text-sm text-textcolor-secondary">
                      {t(helpful ? 'helpful' : 'notHelpful')}
                    </p>
                    <Link
                      href={MOOD_ACTION_HREF[category as MoodAction]}
                      className="mt-1 w-fit text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {t('changeAction')}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs leading-relaxed text-textcolor-secondary">{t('limitNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
