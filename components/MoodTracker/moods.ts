import { ComponentType, SVGProps } from 'react'
import { Annoyed, Frown, Laugh, Meh, Smile } from 'lucide-react'

export type MoodKey = 'very-bad' | 'bad' | 'neutral' | 'good' | 'great'

export type MoodInfo = {
  key: MoodKey
  icon: ComponentType<SVGProps<SVGSVGElement>>
  statusClass: string
}

export const MOODS: MoodInfo[] = [
  { key: 'very-bad', icon: Frown, statusClass: 'error' },
  { key: 'bad', icon: Annoyed, statusClass: 'warn' },
  { key: 'neutral', icon: Meh, statusClass: 'note' },
  { key: 'good', icon: Smile, statusClass: 'success' },
  { key: 'great', icon: Laugh, statusClass: 'support' },
]

export const MOODS_MAP: Record<MoodKey, MoodInfo> = MOODS.reduce<Record<MoodKey, MoodInfo>>(
  (acc, m) => {
    acc[m.key] = m
    return acc
  },
  {} as Record<MoodKey, MoodInfo>
)
