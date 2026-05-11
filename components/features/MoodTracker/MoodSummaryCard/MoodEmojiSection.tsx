import { MOODS } from '@/constants/moods'

const WIDE_SHADOW_KEYS = ['veryBad', 'bad', 'neutral']

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
          return <div key={i} className="h-12 w-12" />
        }

        return (
          <div key={i} className="flex flex-col items-center text-xl">
            <div className="relative flex items-center justify-center">
              <Emoji />
              <div
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] rounded-full bg-black/65 blur-[3px]"
                style={{
                  width: WIDE_SHADOW_KEYS.includes(c.mood) ? '80%' : '60%',
                  height: '2px',
                }}
              />
            </div>
          </div>
        )
      })}
    </section>
  )
}
