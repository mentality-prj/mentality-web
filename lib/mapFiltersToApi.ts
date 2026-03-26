import { FilterValue } from '../context/moodRecordsFilterContext'
import { moodKeyToLevel } from '../mappers/mood.mappers'
import { stressLevelToNumber } from '../mappers/stress.mappers'
import { mapWeekToNumbers, WeekValueType } from '../mappers/weekdays.mapper'
import { SortOrder } from '../types/sort'

export type MapFiltersToApi = {
  order: SortOrder
  tags: string[]
  moodLevel: FilterValue<'moodLevel'>
  stressLevel: FilterValue<'stressLevel'>
  weekdays: WeekValueType[]
}

export function mapFiltersToApi(filters: MapFiltersToApi) {
  return {
    ...filters,
    moodLevel: filters.moodLevel ? moodKeyToLevel(filters.moodLevel) : undefined,
    stressLevel: filters.stressLevel ? stressLevelToNumber(filters.stressLevel) : undefined,
    weekdays: filters.weekdays ? mapWeekToNumbers(filters.weekdays) : undefined,
  }
}
