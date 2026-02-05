import { MOOD_KEYS } from '@/helpers/moodMapper'
import { STRESS_LEVELS } from '@/types/stress'

export const filterOptions = {
  tags: ['affirmation', 'tip'],
  moodLevel: MOOD_KEYS,
  stressLevel: STRESS_LEVELS,
  week: ['weekDays', 'weekends'],
} as const
