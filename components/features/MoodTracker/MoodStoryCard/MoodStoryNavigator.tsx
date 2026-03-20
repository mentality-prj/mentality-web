'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { MoodStoryScreenEntity } from '@/types/api-responses'
import { Button } from '@/ui/button'

import { MoodStoryAdminBar } from './MoodStoryAdminBar'
import { ProgressDots } from './ProgressDots'
import { StoryScreenContent } from './StoryScreenContent'

interface MoodStoryNavigatorProps {
  screens: MoodStoryScreenEntity[]
  isAdmin?: boolean
}

export function MoodStoryNavigator({ screens, isAdmin }: MoodStoryNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const t = useTranslations('components.MoodStoryCard.card')
  const locale = useLocale()

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, screens.length - 1))
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0))

  const clampedIndex = Math.min(Math.max(currentIndex, 0), screens.length - 1)
  // eslint-disable-next-line security/detect-object-injection -- clampedIndex is internal numeric state, not user input
  const currentScreen = screens[clampedIndex]

  const title = currentScreen.title[locale as keyof typeof currentScreen.title] ?? currentScreen.title.en

  return (
    <Card title={title || t('title')} tools={isAdmin ? <MoodStoryAdminBar /> : undefined}>
      {screens.length > 1 && (
        <div className="flex w-full items-center justify-between">
          <Button
            variant="iconButton"
            size="iconLG"
            onClick={goPrev}
            disabled={clampedIndex === 0}
            aria-label={t('prevAriaLabel')}
          >
            <ChevronLeft size={20} />
          </Button>
          <ProgressDots total={screens.length} current={clampedIndex} />
          <Button
            variant="iconButton"
            size="iconLG"
            onClick={goNext}
            disabled={clampedIndex === screens.length - 1}
            aria-label={t('nextAriaLabel')}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
      <div aria-live="polite" aria-atomic="true">
        <StoryScreenContent screen={currentScreen} />
      </div>
    </Card>
  )
}
