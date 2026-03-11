'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { FavoriteButtonWrapper } from '@/components/shared/Buttons/FavoriteButtonWrapper'
import { Link } from '@/i18n/navigation'
import { AffirmationEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'
import { Button } from '@/ui/button'
import { saveAffirmation } from '@/utils/dailyAffirmation'

import AffirmationCard from './AffirmationCard'

interface Props {
  randomAffirmation: AffirmationEntity
  onLoadNewAffirmation: () => Promise<AffirmationEntity | null>
  initialShowState: boolean
}

export function DailyAffirmationRandomClient({ randomAffirmation, onLoadNewAffirmation, initialShowState }: Props) {
  const t = useTranslations('components.DailyCard')
  const [showAffirmation, setShowAffirmation] = useState(initialShowState)
  const [currentAffirmation, setCurrentAffirmation] = useState<AffirmationEntity>(randomAffirmation)
  const [isUsedToday, setIsUsedToday] = useState(initialShowState)
  const [isLoading, setIsLoading] = useState(false)

  const handleShowAffirmation = async () => {
    if (isUsedToday) return

    setIsLoading(true)
    try {
      const newAffirmation = await onLoadNewAffirmation()
      if (newAffirmation) {
        setCurrentAffirmation(newAffirmation)
        saveAffirmation(newAffirmation)
        setShowAffirmation(true)
        setIsUsedToday(true)
      }
    } catch (error) {
      console.error('Failed to load affirmation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!showAffirmation) {
    return (
      <div className="flex flex-col items-start gap-default">
        <Button
          variant="volume"
          onClick={handleShowAffirmation}
          className="w-full whitespace-nowrap"
          disabled={isLoading || isUsedToday}
        >
          <Sparkles />
          {t('showMyAffirmation')}
        </Button>
        <p className="text-remark">{t('affirmationEncouragement')}</p>
      </div>
    )
  }

  const tools = (
    <FavoriteButtonWrapper
      className="absolute right-6 top-2 z-20"
      itemType={ITEM_TYPE_DEFS.affirmations}
      itemId={currentAffirmation.id}
    />
  )

  return (
    <AffirmationCard className="relative" item={currentAffirmation} tools={tools} hideDate>
      <Link className="absolute inset-0 z-0" href="/affirmations" title={t('linkText', { type: 'affirmation' })} />
    </AffirmationCard>
  )
}
