import { energyKeyToLevel } from '@/mappers/energy.mappers'
import { focusKeyToLevel } from '@/mappers/focus.mappers'
import { moodKeyToLevel } from '@/mappers/mood.mappers'
import { stressLevelToNumber } from '@/mappers/stress.mappers'
import { mapWeekToNumbers } from '@/mappers/weekdays.mapper'
import { FilterType } from '@/types/filter'
import { SortOrder } from '@/types/sort'

export type MapFiltersToApi = Required<FilterType> & { order: SortOrder }

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
