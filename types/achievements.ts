import { IconKey } from '@/components/icons/iconsMap'

import { SupportedLanguage } from './languages'

export type LocalizedText = Record<SupportedLanguage, string>

export type Achievements = {
  icon: IconKey
  id: number
  title: LocalizedText
  description: LocalizedText
  status: 'locked' | 'unlocked'
  progress: number
  currentProgress: number
}
