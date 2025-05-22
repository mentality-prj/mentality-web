import { DailyCard } from '@/components/Dashboard/DailyCard'

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="flex gap-6">
        <DailyCard
          textContent="Every day, I grow stronger, wiser, and more confident in my journey."
          type="affirmation"
        />
        <DailyCard
          textContent="Start your day by setting one small, achievable goal—it builds momentum for bigger successes!"
          type="tip"
        />
      </div>
    </div>
  )
}
