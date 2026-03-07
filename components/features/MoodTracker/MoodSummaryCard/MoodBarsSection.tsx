import { MOOD_COL_HEIGHT_PX } from '@/constants/general'
import { MOODS_MAP } from '@/constants/moods'

interface MoodBarsSectionProps {
  counts: { mood: string; count: number }[]
}

export const MoodBarsSection = ({ counts }: MoodBarsSectionProps) => {
  const max = Math.max(...counts.map((c) => c.count), 1)

  return (
    <section className="grid w-full grid-cols-5 items-end gap-1 px-2">
      {counts.map((c, idx) => {
        const moodInfo = MOODS_MAP[c.mood as keyof typeof MOODS_MAP]
        const height = Math.round((c.count / max) * MOOD_COL_HEIGHT_PX)
        const statusClass = moodInfo ? moodInfo.statusClass : 'tag'

        return (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div className="text-sm text-gray-500">{c.count}</div>
            <div className={`w-full rounded-sm ${statusClass}`} style={{ height: `${height}px` }} />
          </div>
        )
      })}
    </section>
  )
}
