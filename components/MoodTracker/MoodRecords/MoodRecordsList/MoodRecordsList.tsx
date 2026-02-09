'use client'

import { useTranslations } from 'next-intl'

import Card from '@/components/Cards/Card'
import { MOODS } from '@/constants/moods'
import type { MoodRecordEntity } from '@/types/api-responses'

type Props = {
  records: MoodRecordEntity[]
}

export function MoodRecordsList({ records }: Props) {
  const t = useTranslations('components.Mood')

  return (
    <div className="grid gap-sm">
      {records.map((r) => {
        const level = r.moodLevel ?? 3
        const moodIndex = Math.max(1, Math.min(5, level))
        const moodInfo = MOODS[moodIndex - 1]
        const IconComponent = moodInfo.icon
        const label = t(moodInfo.label as string)
        const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : ''

        return (
          <Card
            key={r.id}
            className="w-full"
            title={label}
            text={r.description ?? ''}
            icon={<IconComponent />}
            tags={r.tags}
          >
            <div className="mt-2 text-xs text-gray-400">{date}</div>
          </Card>
        )
      })}
    </div>
  )
}
