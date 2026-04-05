import { Routes } from './routes'

import type { MoodStoryActionType } from '@/types/api-responses'

// Maps structured action.type (+ optional category) to a client route.
export const ACTION_TYPE_ROUTES: Record<MoodStoryActionType, string> = {
  exercise: Routes.GUIDE,
  sleep: Routes.GUIDE,
  checkin: Routes.MOODTRACKER,
}

export const EXERCISE_CATEGORY_ROUTES: Record<string, string> = {
  breathing: Routes.GUIDE,
  meditation: Routes.MEDITATIONS,
  calming: Routes.GUIDE,
}

// Legacy: regex-based mapping for plain-string actions (backward compatibility).
// If none of the patterns match, the CTA button is silently omitted.
export const ACTION_ROUTES: [RegExp, string][] = [
  // Ukrainian
  [/дихальн/i, Routes.GUIDE],
  [/медитац/i, Routes.MEDITATIONS],
  [/вправ/i, Routes.GUIDE],
  [/стрес/i, Routes.MOODTRACKER],
  [/настрій|мудж/i, Routes.MOODTRACKER],
  [/сон|відпочин/i, Routes.GUIDE],
  // English
  [/breath/i, Routes.GUIDE],
  [/meditat/i, Routes.MEDITATIONS],
  [/exercis|workout/i, Routes.GUIDE],
  [/stress/i, Routes.MOODTRACKER],
  [/mood/i, Routes.MOODTRACKER],
  [/sleep|rest/i, Routes.GUIDE],
  // Polish
  [/oddech/i, Routes.GUIDE],
  [/medytac/i, Routes.MEDITATIONS],
  [/ćwicze|cwicze/i, Routes.GUIDE],
  [/stres/i, Routes.MOODTRACKER],
  [/nastrój|nastroj/i, Routes.MOODTRACKER],
  [/sen|odpoczynek|relaks/i, Routes.GUIDE],
]
