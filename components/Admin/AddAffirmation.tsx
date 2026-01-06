'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import AffirmationsList from '@/components/Affirmations/AffirmationsList'
import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addAffirmation } from '@/requests/affirmations'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

import DeleteAffirmationButton from './DeleteAffirmationButton'
import PublishAffirmationButton from './PublishAffirmationButton'

export default function AddAffirmation() {
  const t = useTranslations('components.Admin.GenerateAffirmation')
  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const { data } = useSession()
  const session = data as CustomSession

  const generateAffirmation = async () => {
    if (session?.user && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const result = await addAffirmation(session, prompt, locale)
        if ('error' in result) {
          notifyError(String(result.error ?? 'Unknown error'))
        } else {
          notifySuccess(t('success'))
          setPrompt('')
          setReloadKey((k) => k + 1)
        }
      } finally {
        setIsSubmitting(false)
      }
    }
    return
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex w-full gap-default">
        <p className="text-sm">
          {t('description')}
          <br />
          {t('autoAppear')}
          <br />
          <em>{t('noPrompt')}</em>
        </p>
        <div className="flex flex-col gap-default">
          <Button variant="volume" onClick={generateAffirmation} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('generateButton')}
          </Button>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col gap-2">
        <Label htmlFor="affirmationPrompt">
          <em>{t('ukrainianOnly')}</em>
        </Label>
        <Textarea
          id="affirmationPrompt"
          placeholder={t('promptPlaceholder')}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={isSubmitting}
        />
      </div>

      <div className="w-full">
        <h3 className="mb-4 text-xl font-semibold">{t('allAffirmationsTitle')}</h3>
        <AffirmationsList
          fetchUnpublished
          reloadTrigger={reloadKey}
          renderTools={(affirmation, remove) => (
            <>
              <PublishAffirmationButton
                id={String(affirmation.id)}
                session={session}
                onPublished={() => remove(String(affirmation.id))}
              />
              <DeleteAffirmationButton
                id={String(affirmation.id)}
                session={session}
                onDeleted={() => remove(String(affirmation.id))}
              />
            </>
          )}
        />
      </div>
    </div>
  )
}
