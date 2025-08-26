import { cn } from '@/lib/utils'

export const Days = () => {
  return (
    <div className="flex gap-1">
      {['пт', 'сб', 'нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'].map((day, idx) => (
        <div
          key={idx}
          className={cn(
            'mt-auto flex flex-col rounded-sm border border-outline-tertiary px-[5px] text-center text-textcolor-tertiary',
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
