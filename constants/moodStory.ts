import { Routes } from './routes'

// Action strings come from the backend in the user's active language (UK/EN/PL).
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
