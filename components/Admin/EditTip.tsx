'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { updateTip } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

interface EditTipProps {
  tip: TipEntity
  onUpdate: (updatedTip: TipEntity) => void
  onCancel: () => void
}

export default function EditTip({ tip, onUpdate, onCancel }: EditTipProps) {
  const t = useTranslations('components.Admin.EditTip')
  const locale = useLocale() as SupportedLanguage
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState(tip.translations?.[locale as SupportedLanguage] || '')

  const { data } = useSession()
  const session = data as CustomSession

  const handleSave = async () => {
    if (!session?.user || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await updateTip(session, String(tip.id), {
        translations: {
          ...tip.translations,
          [locale]: content,
        },
      })

      if ('error' in result) {
        notifyError(String(result.error ?? 'Unknown error'))
      } else {
        notifySuccess(t('success'))
        if (result.data) {
          onUpdate(result.data)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-6">
      <h3>{t('title')}</h3>

      <div>
        <Label htmlFor="tipContent">{t('contentLabel')}</Label>
        <Textarea
          id="tipContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          rows={8}
        />
      </div>

      <div className="flex gap-4">
        <Button size="large" onClick={handleSave} disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? t('saving') : t('save')}
        </Button>
        <Button size="large" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  )
}
