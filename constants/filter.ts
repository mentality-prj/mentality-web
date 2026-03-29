import { ENERGY_KEYS } from '@/mappers/energy.mappers'
import { FOCUS_KEYS } from '@/mappers/focus.mappers'
import { MOOD_KEYS } from '@/mappers/mood.mappers'
import { STRESS_LEVELS } from '@/types/stress'

export const filterOptions = {
  categories: ['affirmation', 'tip', 'breathing', 'calming', 'meditation'],
  moodLevel: MOOD_KEYS,
  stressLevel: STRESS_LEVELS,
  energyLevel: ENERGY_KEYS,
  focusLevel: FOCUS_KEYS,
} as const
