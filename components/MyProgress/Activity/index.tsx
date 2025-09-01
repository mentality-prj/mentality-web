import { ActivityCalendar } from './CalendarActivity'

export const Activity = () => {
  return (
    <div className="rounded-default bg-surface-white p-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl/[24px] font-semibold text-textcolor-primary">Активність на платформі</h2>
        <p className="text-xs text-textcolor-secondary">Навіть маленькі кроки ведуть до великих змін</p>
      </div>
      <div className="mt-6 flex w-full justify-center">
        <ActivityCalendar />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-textcolor-purple"></span>
          <span>Дні з активністю</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border border-outline-secondary"></span>
          <span>Дні без активності</span>
        </div>
      </div>
    </div>
  )
}
