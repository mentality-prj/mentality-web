export type WeekValueType = 'weekDays' | 'weekends' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

const weekToNumberMap: Record<WeekValueType, number | number[]> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
  weekDays: [1, 2, 3, 4, 5],
  weekends: [6, 7],
}

export const weekOptions: WeekValueType[] = ['weekDays', 'weekends', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function mapWeekToNumbers(input: WeekValueType | WeekValueType[]): number[] {
  const items = Array.isArray(input) ? input : [input]

  const numbers = items.flatMap((day) => {
    if (!(day in weekToNumberMap)) {
      return []
    }
    const value = weekToNumberMap[`${day}`]
    return Array.isArray(value) ? value : [value]
  })
  return Array.from(new Set(numbers))
}
