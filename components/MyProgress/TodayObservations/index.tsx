import { Insight } from '@/components/Insight'

export const TodayObservations = () => {
  return (
    <div className="rounded-default bg-surface-white p-8">
      <div className="text-xl font-semibold text-textcolor-primary">Cьогоднішні спостереження</div>
      <div className="mt-6 flex flex-col gap-4">
        <Insight text="Твоя активність на хорошому рівні - так тримати!" />
        <Insight text="Стабільне покращення настрою за останні 3 місяці" />
      </div>
    </div>
  )
}
