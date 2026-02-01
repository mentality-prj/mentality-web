import { cn } from '@/lib/utils'

export const Days = ({ weekDays }: { weekDays?: string[] }) => {
  const defaultWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const source = weekDays && weekDays.length ? weekDays : defaultWeekDays
  const days = Array.from({ length: 10 }, (_, i) => source[i % source.length])

  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-1 tablet:flex">
      {days.map((day, idx) => (
        <div
          key={idx}
          className={cn(
            'border-outline-tertiary text-textcolor-tertiary mt-auto flex flex-col rounded-sm border px-[5px] text-center',
            idx === 9 && 'text-textcolor-purple'
          )}
        >
          <div className="font-medium">{idx === 9 ? 0 : '-'}</div>
          <div className="text-xs/[14px]">{day}</div>
        </div>
      ))}
    </div>
  )
}
