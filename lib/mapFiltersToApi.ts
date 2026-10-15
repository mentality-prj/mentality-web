import { energyKeyToLevel, EnergyKey } from '@/mappers/energy.mappers'
import { focusKeyToLevel, FocusKey } from '@/mappers/focus.mappers'
import { moodKeyToLevel, MoodKey } from '@/mappers/mood.mappers'
import { stressLevelToNumber } from '@/mappers/stress.mappers'
import { mapWeekToNumbers, WeekValueType } from '@/mappers/weekdays.mapper'
import { SortOrder } from '@/types/sort'
import { StressLevel } from '@/types/stress'

export type MapFiltersToApi = {
  order: SortOrder
  tags: string[]
  moodLevel: MoodKey[]
  stressLevel: StressLevel[]
  energyLevel: EnergyKey[]
  focusLevel: FocusKey[]
  weekdays: WeekValueType[]
}

export function mapFiltersToApi(filters: MapFiltersToApi) {
  const toLevels = (values: string[], map: (value: string) => number | undefined): number[] =>
    values.map(map).filter((level): level is number => level !== undefined)

  return {
    ...filters,
    moodLevel: toLevels(filters.moodLevel, moodKeyToLevel),
    stressLevel: filters.stressLevel.map(stressLevelToNumber),
    energyLevel: toLevels(filters.energyLevel, energyKeyToLevel),
    focusLevel: toLevels(filters.focusLevel, focusKeyToLevel),
    weekdays: mapWeekToNumbers(filters.weekdays),
  }
}
