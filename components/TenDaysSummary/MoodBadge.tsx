import { Badge } from '@/ds/shadcn/badge'
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
}

export const MoodBadge = ({ data }: MoodBadgeProps) => {
  return (
    <Badge variant="colored" className={`flex items-center justify-center text-center ${moodColors[data]}`}>
      {data}
    </Badge>
  )
}
