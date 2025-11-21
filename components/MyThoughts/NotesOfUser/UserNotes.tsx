'use client'
// import { useEffect, useState } from 'react'
import { PencilLine } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'

import { UserNotesCardFilter } from './UserNotesCardFilter'
import { UserNotesCardList } from './UserNotesCardList'

export function UserNotes({ notes }: { notes: { key: string }[] }) {
  const t = useTranslations('MyThougtsPage.ThoughtsList')
  console.log('notes', notes)

  const isEmpty = !notes || (Array.isArray(notes) && notes.length === 0)

  return isEmpty ? (
    <SectionCard title={t('title')} subtitle={t('subtitle')} subtitlePrefix={<PencilLine />}></SectionCard>
  ) : (
    <SectionCard title={t('title')}>
      <div className="flex flex-row items-start gap-6">
        <UserNotesCardFilter className="w-1/4" />
        <UserNotesCardList notes={notes} className="w-3/4" />
      </div>
    </SectionCard>
  )
}
