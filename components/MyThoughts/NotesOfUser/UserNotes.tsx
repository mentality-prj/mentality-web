'use client'
import { PencilLine } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SectionCard } from '@/ds/components/SectionCard'

import { UserNotesCardFilter } from './UserNotesCardFilter'
import { UserNotesCardList } from './UserNotesCardList'

export function UserNotes({ notes }: { notes: { key: string }[] }) {
  const t = useTranslations('MyThougtsPage.ThoughtsList')

  const isEmpty = !notes || notes.length === 0

  return (
    <SectionCard
      title={t('title')}
      subtitle={isEmpty ? t('subtitle') : undefined}
      subtitlePrefix={isEmpty ? <PencilLine /> : undefined}
    >
      {!isEmpty && (
        <div className="flex flex-row items-start gap-6">
          <UserNotesCardFilter />
          <UserNotesCardList notes={notes} className="w-3/4" />
        </div>
      )}
    </SectionCard>
  )
}
