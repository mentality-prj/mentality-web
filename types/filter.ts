import { MoodKey } from '../mappers/mood.mappers'
import { WeekValueType } from '../mappers/weekdays.mapper'

import { StressLevel } from './stress'

export type FilterType = {
  moodLevel?: MoodKey | ''
  stressLevel?: StressLevel | ''
  energyLevel?: string
  focusLevel?: string
  tags?: string[]
  weekdays?: WeekValueType[]
}
