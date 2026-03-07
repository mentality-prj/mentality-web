import { MOODS } from '@/constants/moods'

interface MoodEmojiSectionProps {
  counts: { mood: string; count: number }[]
}

export const MoodEmojiSection = ({ counts }: MoodEmojiSectionProps) => {
  return (
    <section className="grid w-full grid-cols-5 items-center gap-1 px-2">
      {counts.map((c, i) => {
        const moodInfo = MOODS.find((mood) => mood.key === c.mood)
        const Emoji = moodInfo?.icon

        if (!Emoji) {
          return <div key={i} className="h-6 w-6" />
        }

        return (
          <div key={i} className="flex flex-col items-center text-xl">
            <Emoji className="h-6 w-6" />
          </div>
        )
      })}
    </section>
  )
}
