import { useTranslations } from 'next-intl'

import { Badge } from '@/ds/shadcn/badge'
import { cn } from '@/lib/utils'
import { Mood, Stress } from '@/types/bestDay'

const moodColors = {
  'very good': 'bg-[#E5FFE6]',
  good: 'bg-[#E5FFF8]',
  neutral: 'bg-[#DBE7FF]',
  bad: 'bg-[#FFDFA9]',
  'very bad': 'bg-[#F8D3D3]',
  absent: 'bg-[#F6F5FF]',
  low: 'bg-[#F6F5FF]',
  average: 'bg-[#F6F5FF]',
  high: 'bg-[#F6F5FF]',
  'very high': 'bg-[#F6F5FF]',
}

interface MoodBadgeProps {
  data: Mood | Stress
  className?: string
}

export const MoodBadge = ({ data, className }: MoodBadgeProps) => {
  const t = useTranslations('components.TenDaysSummary.MoodBadge')
  return (
    <Badge
      variant="colored"
      className={cn(`flex items-center justify-center text-center ${moodColors[data]}`, className)}
    >
      {t('text', { data: data.replaceAll(' ', '_') })}
    </Badge>
  )
}
