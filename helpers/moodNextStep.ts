import { Routes } from '@/constants/routes'
import type { MoodRecordEntity } from '@/types/api-responses'

type Action = 'breathing' | 'calming'
type Observation = 'stress' | 'mood' | 'general'

export type MoodNextStep = {
  observation: Observation
  action: Action
  href: string
  level?: number
}

function validLevel(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
}

/**
 * Transparent, non-predictive UI selection from a single self-report.
 * This is NOT a diagnosis, risk assessment or QDIP/Future Engine decision.
 */
export function chooseMoodNextStep(record: MoodRecordEntity): MoodNextStep {
  if (validLevel(record.stressLevel) && record.stressLevel >= 4) {
    return {
      observation: 'stress',
      action: 'breathing',
      href: `${Routes.GUIDE}/breathing`,
      level: record.stressLevel,
    }
  }

  if (validLevel(record.moodLevel) && record.moodLevel <= 2) {
    return {
      observation: 'mood',
      action: 'calming',
      href: `${Routes.GUIDE}/calming`,
      level: record.moodLevel,
    }
  }

  return {
    observation: 'general',
    action: 'breathing',
    href: `${Routes.GUIDE}/breathing`,
  }
}
