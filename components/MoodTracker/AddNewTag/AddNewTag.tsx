'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Input } from '@/ds/shadcn/input'
import { addUserTag } from '@/requests/userTags'
import { UserTag } from '@/types/tags'
import { extractErrorMessage } from '@/utils/apiError'
import { makeTagKeyFromName } from '@/utils/tagKey'
import { notifyError, notifySuccess } from '@/utils/toast'

type Props = {
  onClose: () => void
  onCreated?: (tag: { key: string; name: string }) => void
}

export default function AddNewTag({ onClose, onCreated }: Props) {
  const { data: session } = useSession()
  const t = useTranslations('components.Tags')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitting) return
    const trimmedName = name.trim()
    if (!trimmedName) {
      notifyError(t('addNewTag.keyRequired'))
      return
    }
    // generate key from name
    const key = makeTagKeyFromName(trimmedName)
    if (!key) {
      notifyError(t('addNewTag.keyFormat'))
      return
    }

    setIsSubmitting(true)
    try {
      const tag: UserTag = { key, name: trimmedName }

      const result = await addUserTag(session, tag)
      if ('error' in result) {
        notifyError(extractErrorMessage(result.error, t('addNewTag.failure')))
        return
      }

      notifySuccess(t('addNewTag.success'))
      onCreated?.({ key, name: trimmedName })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="m-6 max-w-md rounded bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold">{t('addNewTag.title')}</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <Input id="tag-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="medium" onClick={onClose} className="flex-1">
            {t('addNewTag.cancel')}
          </Button>
          <Button type="submit" size="medium" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? t('addNewTag.adding') : t('addNewTag.add')}
          </Button>
        </div>
      </form>
    </div>
  )
}
