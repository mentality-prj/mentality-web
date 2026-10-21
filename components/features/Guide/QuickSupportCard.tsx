import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { SectionCard } from '@/ds/components/SectionCard'
import { MOOD_ACTION_HREF } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'

/**
 * A small grounding prompt is always available without waiting for the
 * exercises API or requiring a mood check-in. The links reuse the Guide.
 */
export async function QuickSupportCard({ showHelpfulReturn = false }: { showHelpfulReturn?: boolean } = {}) {
  const t = await getTranslations('components.ExercisesForRecovery.quickSupport')
  // Only My Day asks for an earlier, explicitly helpful activity. Other Guide entry
  // points remain fast and never perform a redundant feedback request.
  const feedbackResult = showHelpfulReturn ? await getExerciseFeedback(await getServerSession()) : null
  const previouslyHelpful =
    feedbackResult && 'data' in feedbackResult
      ? feedbackResult.data.find(({ helpful }) => helpful === true)
      : null

  return (
    <section aria-labelledby="quick-support-heading">
      <SectionCard>
        <div className="flex flex-col gap-sm">
          <div>
            <h2 id="quick-support-heading" className="text-lg font-semibold">
              {t('title')}
            </h2>
            <p className="mt-1 text-sm text-textcolor-secondary">{t('description')}</p>
          </div>
          <p className="text-sm leading-relaxed">{t('groundingPrompt')}</p>
          <div className="flex flex-wrap gap-sm">
            <Link
              href={`${Routes.GUIDE}/breathing`}
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('breathingAction')}
            </Link>
            <Link
              href={`${Routes.GUIDE}/calming`}
              className="inline-flex min-h-11 items-center rounded-xl border border-current px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('calmingAction')}
            </Link>
          </div>
          {previouslyHelpful && (
            <div className="flex flex-col gap-xs border-t border-current/10 pt-3">
              <p className="text-sm leading-relaxed text-textcolor-secondary">
                {t('returnToHelpful.prompt', {
                  category: t(`returnToHelpful.categories.${previouslyHelpful.category}`),
                })}
              </p>
              <Link
                href={MOOD_ACTION_HREF[previouslyHelpful.category]}
                className="w-fit text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t('returnToHelpful.open')}
              </Link>
            </div>
          )}
          <p className="text-xs text-textcolor-secondary">{t('optionalNote')}</p>
        </div>
      </SectionCard>
    </section>
  )
}
