'use client'
import { ReactNode, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import HelloIcon from '@/ds/icons/moodNote/hello.svg'
import { UserTag } from '@/types/tags'
import { Button } from '@/ui/button'

import AddNewMood from '../AddNewMood/AddNewMood'

import { MoodBarsSection } from './MoodBarsSection'
import { MoodEmojiSection } from './MoodEmojiSection'

interface MoodSummaryCardClientProps {
  title?: ReactNode
  subtitle?: ReactNode
  counts?: { mood: string; count: number }[]
  availableTags?: UserTag[]
}

const MoodSummaryCardClient = ({
  title = '',
  subtitle,
  counts = [],
  availableTags = [],
}: MoodSummaryCardClientProps) => {
  const tm = useTranslations('components.Mood')
  const [showEntry, setShowEntry] = useState(false)

  return (
    <Card className="relative p-6">
      {showEntry && (
        <>
          <FullScreenBackdrop onClick={() => setShowEntry(false)} />
          <div className="absolute inset-0 z-50">
            <AddNewMood
              onClose={() => setShowEntry(false)}
              onSave={() => setShowEntry(false)}
              availableTags={availableTags}
            />
          </div>
        </>
      )}
      <h2 className="flex items-center gap-1">
        <Image
          src={typeof HelloIcon === 'string' ? HelloIcon : (HelloIcon as { src: string }).src}
          alt="hello"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}

      <div className="mt-6 flex flex-col gap-sm">
        <MoodBarsSection counts={counts} />
        <MoodEmojiSection counts={counts} />

        <Button variant="volume" onClick={() => setShowEntry(true)} className="mt-4 w-full">
          {tm('recordMood')}
        </Button>
      </div>
    </Card>
  )
}

export default MoodSummaryCardClient
