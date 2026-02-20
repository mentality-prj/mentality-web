import { AudioLines } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import Card from '@/components/shared/Cards/Card'
import { MoodMarksData, MOODS_MAP } from '@/constants/moods'
import { Tag } from '@/ds/components/Tag'

import { SummaryCard } from './SummaryCard'

export const MoodMarks = async ({ data }: { data?: MoodMarksData } = {}) => {
  const moods = Object.keys(MOODS_MAP)

  let moodMarksData: Record<string, number> = {}
  if (data && Object.keys(data).length > 0) {
    moodMarksData = data
  }

  const t = await getTranslations('components.MoodMarks')
  const tMood = await getTranslations('components.Mood')

  return (
    <Card type="ghost" className="w-full">
      <SummaryCard icon={<AudioLines className="opacity-50" color="white" size="128" />} title={t('title')}>
        <div className="grid grid-flow-col auto-rows-min grid-rows-3 content-start items-start gap-x-8 gap-y-2">
          {moods.map((mood) => {
            const info = MOODS_MAP[mood as keyof typeof MOODS_MAP]
            const label = info ? tMood(info.label) : mood
            const status = info?.statusClass || 'tag'
            return (
              <div key={mood} className="flex w-full justify-between">
                <Tag className="truncate" type={status} text={label} />
                <span className="ml-2">{(moodMarksData[`${mood}`] ?? 0) < 1 ? 0 : moodMarksData[`${mood}`]}</span>
              </div>
            )
          })}
        </div>
      </SummaryCard>
    </Card>
  )
}
