'use client'

import { useLocale, useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { ENERGIES } from '@/constants/energy'
import { FOCUSES } from '@/constants/focus'
import { MOODS } from '@/constants/moods'
import { STRESSES } from '@/constants/stress'
import { Tag } from '@/ds/components/Tag'
import { formatDate } from '@/helpers/data'
import type { MoodRecordEntity } from '@/types/api-responses'

type Props = {
  records: MoodRecordEntity[]
}

export function MoodRecordsList({ records }: Props) {
  const t = useTranslations('components.Mood')
  const commonGeneral = useTranslations('common.General')
  const ts = useTranslations('components.StressLevelScale')
  const te = useTranslations('components.EnergyLevelScale')
  const tf = useTranslations('components.FocusLevelScale')

  return (
    <div className="grid gap-sm">
      {records.map((r) => {
        const level = r.moodLevel ?? 3
        const moodIndex = Math.max(1, Math.min(5, level))
        const moodInfo = MOODS[moodIndex - 1]
        const IconComponent = moodInfo.icon
        const label = t(moodInfo.label as string)
        const date = r.createdAt ? formatDate(new Date(r.createdAt).toISOString()) : ''

        const stressInfo = STRESSES.find((s) => s.value === r.stressLevel) ?? STRESSES[0]
        const energyInfo = ENERGIES.find((e) => e.value === r.energyLevel) ?? ENERGIES[2]
        const focusInfo = FOCUSES.find((f) => f.value === r.focusLevel) ?? FOCUSES[2]

        return (
          <Card
            key={r.id}
            className="w-full"
            title={label}
            text={
              <span className="flex flex-wrap items-center gap-xs">
                <span className="text-xs">{commonGeneral('stress')}:</span>
                <Tag type={stressInfo.statusClass} text={ts(stressInfo.label as string)} />
                <span className="text-xs">{commonGeneral('energy')}:</span>
                <Tag type={energyInfo.statusClass} text={te(energyInfo.label as string)} />
                <span className="text-xs">{commonGeneral('focus')}:</span>
                <Tag type={focusInfo.statusClass} text={tf(focusInfo.label as string)} />
              </span>
            }
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
