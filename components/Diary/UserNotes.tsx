import { getTranslations } from 'next-intl/server'

import { UserNotesList } from './UserNotesList'

type Props = {
  notes: {
    id: string
    content: string
    isActive?: boolean
    createdAt?: string
    tags?: string[]
  }[]
}

export default async function UserNotes({ notes }: Props) {
  const availableNotes = notes.filter((note) => !note.isActive)
  const hasAvailableNotes = availableNotes.length > 0
  const t = await getTranslations('components.Diary')

  return (
    <>
      {!hasAvailableNotes && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <p className="mt-1 text-sm text-gray-500">{t('Empty')}</p>
          </div>
        </div>
      )}
      {hasAvailableNotes && <UserNotesList notes={availableNotes} />}
    </>
  )
}
