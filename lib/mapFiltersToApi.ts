import { FilterValue } from '@/context/moodRecordsFilterContext'
import { energyKeyToLevel } from '@/mappers/energy.mappers'
import { focusKeyToLevel } from '@/mappers/focus.mappers'
import { moodKeyToLevel } from '@/mappers/mood.mappers'
import { stressLevelToNumber } from '@/mappers/stress.mappers'
import { mapWeekToNumbers, WeekValueType } from '@/mappers/weekdays.mapper'
import { SortOrder } from '@/types/sort'

export type MapFiltersToApi = {
  order: SortOrder
  tags: string[]
  moodLevel: FilterValue<'moodLevel'>
  stressLevel: FilterValue<'stressLevel'>
  energyLevel: FilterValue<'energyLevel'>
  focusLevel: FilterValue<'focusLevel'>
  weekdays: WeekValueType[]
}

export function mapFiltersToApi(filters: MapFiltersToApi) {
  return {
    ...filters,
    moodLevel: filters.moodLevel ? moodKeyToLevel(filters.moodLevel) : undefined,
    stressLevel: filters.stressLevel ? stressLevelToNumber(filters.stressLevel) : undefined,
    energyLevel: filters.energyLevel ? energyKeyToLevel(filters.energyLevel) : undefined,
    focusLevel: filters.focusLevel ? focusKeyToLevel(filters.focusLevel) : undefined,
    weekdays: filters.weekdays ? mapWeekToNumbers(filters.weekdays) : undefined,
  }
}
