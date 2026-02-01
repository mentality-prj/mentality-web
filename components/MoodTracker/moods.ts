import { ElementType } from 'react'

import { Bad, Good, Neutral, VeryBad, VeryGood } from '@/ds/icons/moodNote'
import { StatusType } from '@/types/status.types'

export type MoodKey = 'very-bad' | 'bad' | 'neutral' | 'good' | 'great'

export type MoodInfo = {
  key: MoodKey
  label: string
  icon: ElementType<{ color?: string; fillColor?: string }>
  statusClass: StatusType
}

export const MOODS: MoodInfo[] = [
  { key: 'very-bad', label: 'labelsEmoji.veryBad', icon: VeryBad, statusClass: 'error' },
  { key: 'bad', label: 'labelsEmoji.bad', icon: Bad, statusClass: 'warn' },
  { key: 'neutral', label: 'labelsEmoji.neutral', icon: Neutral, statusClass: 'info' },
  { key: 'good', label: 'labelsEmoji.good', icon: Good, statusClass: 'success' },
  { key: 'great', label: 'labelsEmoji.veryGood', icon: VeryGood, statusClass: 'support' },
]

export const MOODS_MAP: Record<MoodKey, MoodInfo> = MOODS.reduce<Record<MoodKey, MoodInfo>>(
  (acc, m) => {
    acc[m.key] = m
    return acc
  },
  {} as Record<MoodKey, MoodInfo>
)

export type MoodMarksData = Record<string, number> | undefined
