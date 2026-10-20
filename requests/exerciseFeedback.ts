import { MOOD_ACTIONS, type MoodAction } from '@/helpers/moodNextStep'
import type { CustomSession } from '@/types/auth'

import { APIUrl } from './config'
import { performAuthRequest, type ApiResponseDecoder } from './genericFetch'

export type ExerciseFeedbackEntry = {
  category: MoodAction
  helpful: boolean
}

const FEEDBACK_URL = `${APIUrl}/learning/feedback`

function parseEntry(value: unknown): ExerciseFeedbackEntry | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const candidate = value as Record<string, unknown>
  if (
    typeof candidate.category !== 'string' ||
    !MOOD_ACTIONS.some((action) => action === candidate.category) ||
    typeof candidate.helpful !== 'boolean'
  ) {
    return null
  }
  return { category: candidate.category as MoodAction, helpful: candidate.helpful }
}

const decodeEntries: ApiResponseDecoder<ExerciseFeedbackEntry[]> = (value) => {
  if (!Array.isArray(value) || value.length > MOOD_ACTIONS.length) {
    return { success: false }
  }
  const result: ExerciseFeedbackEntry[] = []
  for (const entry of value) {
    const parsed = parseEntry(entry)
    if (!parsed || result.some((item) => item.category === parsed.category)) {
      return { success: false }
    }
    result.push(parsed)
  }
  return { success: true, data: result }
}

export async function getExerciseFeedback(session: CustomSession | null) {
  return performAuthRequest(session, FEEDBACK_URL, {
    method: 'GET',
    decodeResponse: decodeEntries,
  })
}

export async function saveExerciseFeedback(
  session: CustomSession | null,
  category: MoodAction,
  helpful: boolean
): Promise<{ data: ExerciseFeedbackEntry } | { error: string; status?: number }> {
  if (!MOOD_ACTIONS.includes(category) || typeof helpful !== 'boolean') {
    return { error: 'Invalid exercise feedback input' }
  }

  return performAuthRequest(session, FEEDBACK_URL, {
    method: 'POST',
    body: { category, helpful },
    decodeResponse: (value) => {
      const parsed = parseEntry(value)
      return parsed && parsed.category === category && parsed.helpful === helpful
        ? { success: true, data: parsed }
        : { success: false }
    },
  })
}
