import { ElementType } from 'react'

import { Bad, Good, Neutral, VeryBad, VeryGood } from '@/ds/icons/moodNote'
import { StatusType } from '@/types/status.types'

export type MoodKey = 'veryBad' | 'bad' | 'neutral' | 'good' | 'great'

export type MoodInfo = {
  key: MoodKey
  label: string
  icon: ElementType<{ color?: string; fillColor?: string; size?: number }>
  statusClass: StatusType
  glowColor: string
}

export const MOODS: MoodInfo[] = [
  {
    key: 'veryBad',
    label: 'labelsEmoji.veryBad',
    icon: VeryBad,
    statusClass: 'error',
    glowColor: 'rgba(239,68,68,0.75)',
  },
  { key: 'bad', label: 'labelsEmoji.bad', icon: Bad, statusClass: 'warn', glowColor: 'rgba(251,164,63,0.75)' },
  {
    key: 'neutral',
    label: 'labelsEmoji.neutral',
    icon: Neutral,
    statusClass: 'info',
    glowColor: 'rgba(81,158,219,0.75)',
  },
  { key: 'good', label: 'labelsEmoji.good', icon: Good, statusClass: 'success', glowColor: 'rgba(82,145,105,0.75)' },
  {
    key: 'great',
    label: 'labelsEmoji.veryGood',
    icon: VeryGood,
    statusClass: 'support',
    glowColor: 'rgba(163,93,200,0.75)',
  },
]

export const MOODS_MAP: Record<MoodKey, MoodInfo> = MOODS.reduce<Record<MoodKey, MoodInfo>>(
  (acc, m) => {
    acc[m.key] = m
    return acc
  },
  {} as Record<MoodKey, MoodInfo>
)

export type MoodMarksData = Record<string, number> | undefined
