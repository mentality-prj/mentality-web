import { useTranslations } from 'next-intl'

import { EmojiKey, getIconsForMoodTracker } from '@/assets/iconsForMoodTracker'
import { CustomCard } from '@/ds/components/CustomCard'

import { SectionCard } from '../ui/SectionCard'

type WeekMood = {
  title: 'notes-amount' | 'mood' | 'average-mood' | 'stress-level'
  description?: React.ReactNode
  icon: EmojiKey
}

const weekData: WeekMood[] = [
  { title: 'notes-amount', description: '0', icon: 'pancil-page' },
  { title: 'mood', icon: 'diagram' },
  { title: 'average-mood', icon: 'sun' },
  { title: 'stress-level', icon: 'cloud' },
]

export const WeekSummary = () => {
  const t = useTranslations('MoodTracker.WeekSummary')

  return (
    <SectionCard title={t('title')}>
      <div className="grid w-full flex-1 grid-cols-1 grid-rows-4 gap-2 tablet:grid-cols-2 tablet:grid-rows-2 tablet:gap-4">
        {weekData.map((day, index) => (
          <CustomCard
            key={index}
            className="bg-surface"
            variant="noninteractive"
            title={t(day.title)}
            description={day.description}
            icon={getIconsForMoodTracker(day.icon)}
          />
        ))}
      </div>
    </SectionCard>
  )
}
