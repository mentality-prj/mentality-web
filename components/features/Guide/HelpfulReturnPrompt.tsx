import { getTranslations } from 'next-intl/server'

import { MOOD_ACTION_HREF } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import { getServerSession } from '@/lib/get-server-session'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'

/**
 * An optional return path based only on the user's explicit helpful rating.
 * Never infer completed sessions, clinical efficacy, mood changes or risk.
 * Kept behind Suspense so urgent grounding is never blocked by this read.
 */
export async function HelpfulReturnPrompt() {
  const result = await getExerciseFeedback(await getServerSession())
  if ('error' in result) return null

  const previouslyHelpful = result.data.find(({ helpful }) => helpful === true)
  if (!previouslyHelpful) return null

  const t = await getTranslations('components.ExercisesForRecovery.quickSupport.returnToHelpful')
  return (
    <div className="border-current/10 flex flex-col gap-xs border-t pt-3">
      <p className="text-sm leading-relaxed text-textcolor-secondary">
        {t('prompt', { category: t(`categories.${previouslyHelpful.category}`) })}
      </p>
      <Link
        href={MOOD_ACTION_HREF[previouslyHelpful.category]}
        className="w-fit text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t('open')}
      </Link>
    </div>
  )
}
