import { EnergyKey } from '../mappers/energy.mappers'
import { FocusKey } from '../mappers/focus.mappers'
import { MoodKey } from '../mappers/mood.mappers'
import { WeekValueType } from '../mappers/weekdays.mapper'

import { StressLevel } from './stress'

export type FilterType = {
  moodLevel?: MoodKey | ''
  stressLevel?: StressLevel | ''
  energyLevel?: EnergyKey | ''
  focusLevel?: FocusKey | ''
  tags?: string[]
  weekdays?: WeekValueType[]
}
