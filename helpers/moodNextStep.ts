import { Routes } from '@/constants/routes'
import type { MoodRecordEntity } from '@/types/api-responses'

export const MOOD_ACTIONS = ['breathing', 'calming', 'meditation', 'focus'] as const
export type MoodAction = (typeof MOOD_ACTIONS)[number]
export type MoodObservation = 'stress' | 'mood' | 'energy' | 'focus' | 'preference' | 'general'

export const MOOD_ACTION_HREF: Record<MoodAction, string> = {
  breathing: `${Routes.GUIDE}/breathing`,
  calming: `${Routes.GUIDE}/calming`,
  meditation: Routes.MEDITATIONS,
  focus: Routes.ATTENTION_SPRINT,
}

export type MoodPreference = { category: MoodAction; helpful: boolean }

export type MoodNextStep = {
  observation: MoodObservation
  action: MoodAction
  href: string
  level?: number
}

function validLevel(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
}

/**
 * Non-predictive first option from one self-reported check-in. The order is
 * deliberate: an optional calming action outranks games or concentration work
 * when someone reports high stress or low mood. The user can override it.
 * Never inspect diary text, tags, identifiers or inferred risk scores.
 */
export function chooseMoodNextStep(
  record: MoodRecordEntity,
  feedback: readonly MoodPreference[] = []
): MoodNextStep {
  if (validLevel(record.stressLevel) && record.stressLevel >= 4) {
    return {
      observation: 'stress',
      action: 'breathing',
      href: MOOD_ACTION_HREF.breathing,
      level: record.stressLevel,
    }
  }

  if (validLevel(record.moodLevel) && record.moodLevel <= 2) {
    return {
      observation: 'mood',
      action: 'calming',
      href: MOOD_ACTION_HREF.calming,
      level: record.moodLevel,
    }
  }

  if (validLevel(record.energyLevel) && record.energyLevel <= 2) {
    return {
      observation: 'energy',
      action: 'meditation',
      href: MOOD_ACTION_HREF.meditation,
      level: record.energyLevel,
    }
  }

  if (validLevel(record.focusLevel) && record.focusLevel <= 2) {
    return {
      observation: 'focus',
      action: 'focus',
      href: MOOD_ACTION_HREF.focus,
      level: record.focusLevel,
    }
  }

  // Current self-report signals always take priority. When no signal stands
  // out, reuse the most recent activity the user explicitly found helpful.
  // API preferences are ordered newest first and only contain owner data.
  const positive = feedback.find(
    (entry) => entry.helpful === true && MOOD_ACTIONS.includes(entry.category)
  )
  if (positive) {
    return {
      observation: 'preference',
      action: positive.category,
      href: MOOD_ACTION_HREF[positive.category],
    }
  }

  return {
    observation: 'general',
    action: 'breathing',
    href: MOOD_ACTION_HREF.breathing,
  }
}
