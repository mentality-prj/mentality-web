'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import Card from '@/components/Cards/Card'
import HelloIcon from '@/ds/icons/moodNote/hello.svg'
import { Button } from '@/ds/shadcn/button'

import AddNewMood from './AddNewMood'
import { MOODS, MOODS_MAP } from './moods'

const availableTags = [{ key: 'work' }, { key: 'family' }, { key: 'health' }, { key: 'friends' }, { key: 'hobby' }].map(
  (t) => t.key
)

interface MoodSummaryCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  counts?: { mood: string; count: number }[]
}

const MoodSummaryCard = ({ title = '', subtitle, counts = [] }: MoodSummaryCardProps) => {
  const tm = useTranslations('components.Mood')
  const [showEntry, setShowEntry] = useState(false)
  const max = Math.max(...counts.map((c) => c.count), 1)

  if (showEntry) {
    return (
      <AddNewMood
        onClose={() => setShowEntry(false)}
        onSave={() => setShowEntry(false)}
        availableTags={availableTags}
      />
    )
  }

  return (
    <Card className="relative p-6">
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

      <div className="mt-6 flex flex-col gap-4">
        <section className="grid w-full grid-cols-5 items-end gap-1 px-2">
          {counts.map((c, idx) => {
            const moodInfo = MOODS_MAP[c.mood as keyof typeof MOODS_MAP]
            const height = Math.round((c.count / max) * 140)
            const statusClass = moodInfo ? moodInfo.statusClass : 'tag'
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className="text-sm text-gray-500">{c.count}</div>
                <div className={`w-full rounded-sm ${statusClass}`} style={{ height: `${height}px` }} />
              </div>
            )
          })}
        </section>

        <div className="flex items-center justify-between">
          <section className="grid w-full grid-cols-5 items-center gap-1 px-2">
            {counts.map((c, i) => {
              const moodInfo = MOODS_MAP[c.mood as keyof typeof MOODS_MAP]
              const Icon = moodInfo ? moodInfo.icon : MOODS[i as number]?.icon
              return (
                <div key={i} className="flex flex-col items-center text-xl">
                  <Icon className="h-6 w-6" />
                </div>
              )
            })}
          </section>
        </div>

        <Button variant="volume" onClick={() => setShowEntry(true)} className="mt-4 w-full">
          {tm('recordMood')}
        </Button>
      </div>
    </Card>
  )
}
export default MoodSummaryCard
