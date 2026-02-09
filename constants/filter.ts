import { MOOD_KEYS } from '@/mappers/mood.mappers'
import { STRESS_LEVELS } from '@/types/stress'

export const filterOptions = {
  tags: ['affirmation', 'tip'],
  moodLevel: MOOD_KEYS,
  stressLevel: STRESS_LEVELS,
  week: ['weekDays', 'weekends'],
} as const
