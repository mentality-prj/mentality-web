'use client'

import { useState } from 'react'
import { ArchiveIcon, Calendar, EditIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { TooltipIcon } from '../../ds/components/TooltipIcon'
import { formatDate } from '../../helpers/data'
import { useRouter } from '../../i18n/navigation'
import { activateDiary } from '../../requests/diary'
import { UserTag } from '../../types/tags'
import extractErrorMessage from '../../utils/apiError'
import { notifyError, notifySuccess } from '../../utils/toast'
import Card from '../Cards/Card'
import FullScreenBackdrop from '../FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'

import { EditNoteForm } from './EditNoteForm'

type Props = {
  id: string
  content: string
  createdAt?: string
  availableTags: UserTag[]
  tags?: string[]
}

export const UserNoteCard = ({ id, content, createdAt, tags, availableTags }: Props) => {
  const [showEntry, setShowEntry] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const { data: session } = useSession()
  const t = useTranslations('components.Diary.UserNoteCard')
  const router = useRouter()

  const safeTags = tags ?? []

  const cardTags = availableTags.filter((t) => safeTags.includes(t.key)).map((t) => t.name)

  const date = formatDate(createdAt)

  const onArchive = async () => {
    if (isArchiving) return
    if (!session?.user) {
      notifyError(t('notAuthenticated'))
      return
    }
    setIsArchiving(true)
    try {
      const result = await activateDiary(session, id)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('archiveError')))
        return
      }
      notifySuccess(t('archiveSuccess'))
      router.refresh()
    } finally {
      setIsArchiving(false)
    }
  }

  const onEdit = () => {
    setShowEntry(true)
  }

  const editIcon = (
    <TooltipIcon label={t('edit')} onClick={onEdit}>
      <EditIcon size={24} />
    </TooltipIcon>
  )

  const archiveIcon = (
    <TooltipIcon label={t('archive')} onClick={onArchive}>
      <ArchiveIcon size={24} />
    </TooltipIcon>
  )
  return (
    <Card
      className="relative"
      text={content}
      tags={cardTags}
      icon={<Calendar size={12} />}
      sup={date}
      tools={[editIcon, archiveIcon]}
    >
      {showEntry && (
        <>
          <FullScreenBackdrop onClick={() => setShowEntry(false)} />
          <div className="absolute inset-0 z-50">
            <EditNoteForm idNote={id} availableTags={availableTags} onClose={() => setShowEntry(false)} />
          </div>
        </>
      )}
    </Card>
  )
}
