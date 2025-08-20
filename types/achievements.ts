import { IconKey } from '@/ds/icons/iconsMap'

export type Achievements = {
  icon: IconKey
  id: number
  title: {
    en: string
    uk: string
    pl: string
  }
  description: {
    en: string
    uk: string
    pl: string
  }
  status: 'locked' | 'unlocked'
  progress: number
  currentProgress: number
}
