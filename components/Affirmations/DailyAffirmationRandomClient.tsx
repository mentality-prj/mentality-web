'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { AffirmationEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import { Button } from '../../ds/shadcn/button'

import AffirmationCard from './AffirmationCard'

interface Props {
  affirmations: AffirmationEntity[]
}

export function DailyAffirmationRandomClient({ affirmations }: Props) {
  const t = useTranslations('components.DailyCard')
  const [showAffirmation, setShowAffirmation] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * affirmations.length))

  if (!affirmations || affirmations.length === 0) return null

  const currentAffirmation = affirmations[currentIndex as number]

  const handleShowNext = () => {
    const newIndex = Math.floor(Math.random() * affirmations.length)
    setCurrentIndex(newIndex)
    setShowAffirmation(true)
  }

  if (!showAffirmation) {
    return (
      <div className="flex flex-col items-start gap-default">
        <Button variant="volume" onClick={handleShowNext} className="w-full whitespace-nowrap">
          <Sparkles />
          {t('showMyAffirmation')}
        </Button>
        <p className="text-remark">{t('affirmationEncouragement')}</p>
      </div>
    )
  }

  const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.affirmations} itemId={currentAffirmation.id} />

  return <AffirmationCard item={currentAffirmation} tools={tools} hideDate />
}
