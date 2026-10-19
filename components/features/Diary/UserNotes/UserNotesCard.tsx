'use client'

import { useState } from 'react'
import { ArchiveIcon, Calendar, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Card from '@/components/shared/Cards/Card'
import { useAuth } from '@/context/AuthProvider'
import { TooltipIcon } from '@/ds/components/TooltipIcon'
import { formatDate } from '@/helpers/data'
import { useRouter } from '@/i18n/navigation'
import { authService } from '@/lib/auth'
import { activateDiary, deleteDiary } from '@/requests/diary'
import { UserTag } from '@/types/tags'
import extractErrorMessage from '@/utils/apiError'
import { notifyError, notifySuccess } from '@/utils/toast'

type Props = {
  id: string
  content: string
  createdAt?: string
  availableTags: UserTag[]
  tags?: string[]
}

export function UserNotesCard({ id, content, createdAt, availableTags, tags }: Props) {
  const [isArchiving, setIsArchiving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { session } = useAuth()
  const t = useTranslations('components.Diary.UserNoteCard')
  const router = useRouter()
  const date = createdAt ? formatDate(createdAt) : ''
  const safeTags = tags ?? []

  const cardTags = availableTags.filter((t) => safeTags.includes(t.key)).map((t) => t.name)
  const onArchive = async () => {
    if (isArchiving || isDeleting) return
    setIsArchiving(true)
    try {
      // SSR can show actions before the client AuthProvider has hydrated.
      // Re-check the *server-verified* cookie session, never trust a local ID.
      const verifiedSession = session?.user ? session : null
      const user = verifiedSession?.user ?? (await authService.getUser())
      if (!user) {
        notifyError(t('notAuthenticated'))
        return
      }
      const result = await activateDiary(verifiedSession ?? { user }, id)
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

  const onDelete = async () => {
    if (isDeleting || isArchiving) return
    setIsDeleting(true)
    try {
      // Confirm the authenticated identity even if React's auth hydration is
      // still pending. API BFF/NestJS independently enforce ownership.
      const verifiedSession = session?.user ? session : null
      const user = verifiedSession?.user ?? (await authService.getUser())
      if (!user) {
        notifyError(t('notAuthenticated'))
        return
      }
      // No destructive request is sent without a native confirmation.
      if (!window.confirm(t('deleteConfirm'))) return
      const result = await deleteDiary(verifiedSession ?? { user }, id)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('deleteError')))
        return
      }
      notifySuccess(t('deleteSuccess'))
      router.refresh()
    } catch {
      notifyError(t('deleteError'))
    } finally {
      setIsDeleting(false)
    }
  }

  const archiveIcon = (
    <TooltipIcon label={t('archive')} onClick={onArchive}>
      <ArchiveIcon size={24} />
    </TooltipIcon>
  )
  const deleteIcon = (
    <TooltipIcon label={t('delete')} onClick={onDelete}>
      <Trash2 size={20} aria-hidden="true" />
    </TooltipIcon>
  )
  return (
    <Card
      key={id}
      className="relative"
      text={content}
      tags={cardTags}
      icon={<Calendar size={12} />}
      sup={date}
      tools={[archiveIcon, deleteIcon]}
    />
  )
}
