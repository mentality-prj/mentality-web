import { ExerciseFeedbackPanel } from '@/components/features/Guide/ExerciseFeedbackPanel'
import type { MoodAction } from '@/helpers/moodNextStep'
import { getServerSession } from '@/lib/get-server-session'
import { getExerciseFeedback } from '@/requests/exerciseFeedback'

/** A single read behind the existing authenticated NestJS BFF. */
export async function ExerciseFeedback({ category }: { category: MoodAction }) {
  const session = await getServerSession()
  const response = await getExerciseFeedback(session)
  const loadFailed = 'error' in response
  const saved = loadFailed ? null : (response.data.find((entry) => entry.category === category)?.helpful ?? null)

  return <ExerciseFeedbackPanel category={category} initialHelpful={saved} loadFailed={loadFailed} />
}
