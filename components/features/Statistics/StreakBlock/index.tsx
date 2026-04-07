'use client'

import { Flame, Trophy } from 'lucide-react'
import { useTranslations } from 'next-intl'

type StreakBlockProps = {
  currentStreak: number
  longestStreak: number
  totalRecords: number
}

export function StreakBlock({ currentStreak, longestStreak, totalRecords }: StreakBlockProps) {
  const t = useTranslations('components.UserStatistics')

  return (
    <div className="grid grid-cols-3 gap-sm">
      <div className="background-alt-white flex flex-col items-center gap-xs rounded-md p-6">
        <Flame className="h-8 w-8 text-orange-500" />
        <span className="text-3xl font-bold text-textcolor-primary">{currentStreak}</span>
        <span className="text-sm text-textcolor-secondary">{t('streak.current')}</span>
      </div>
      <div className="background-alt-white flex flex-col items-center gap-xs rounded-md p-6">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <span className="text-3xl font-bold text-textcolor-primary">{longestStreak}</span>
        <span className="text-sm text-textcolor-secondary">{t('streak.longest')}</span>
      </div>
      <div className="background-alt-white flex flex-col items-center gap-xs rounded-md p-6">
        <span className="text-3xl font-bold text-textcolor-primary">{totalRecords}</span>
        <span className="text-sm text-textcolor-secondary">{t('streak.totalRecords')}</span>
      </div>
    </div>
  )
}
