'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import DeleteTipButton from '@/components/Admin/DeleteTipButton'
import PublishTipButton from '@/components/Admin/PublishTipButton'
import TipsList from '@/components/Tips/TipsListClient'
import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addTip } from '@/requests/tips'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function AddTip() {
  const t = useTranslations('components.Admin.GenerateTip')
  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const { data } = useSession()
  const session = data as CustomSession

  const generateTip = async () => {
    if (session?.user && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const result = await addTip(session, prompt, locale)
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
        <div>
          <h3 className="mb-4">{t('description')}</h3>
          <h4>{t('autoAppear')}</h4>
          <p>
            <em>{t('noPrompt')}</em>
          </p>
        </div>
        <div className="flex flex-col gap-default">
          <Button size="large" variant="volume" onClick={generateTip} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('generateButton')}
          </Button>
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2">
        <em>{t('ukrainianOnly')}</em>
        <Label htmlFor="tipPrompt">{t('promptLabel')}</Label>
        <Textarea
          id="tipPrompt"
          placeholder={t('promptPlaceholder')}
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          disabled={isSubmitting}
        />
      </div>

      <div className="w-full">
        <h3 className="mb-4 text-xl font-semibold">{t('allTipsTitle')}</h3>
        <TipsList
          fetchUnpublished
          reloadTrigger={reloadKey}
          renderTools={(tip, remove) => (
            <>
              <PublishTipButton id={String(tip.id)} session={session} onPublished={() => remove(String(tip.id))} />
              <DeleteTipButton id={String(tip.id)} session={session} onDeleted={() => remove(String(tip.id))} />
            </>
          )}
        />
      </div>
    </div>
  )
}
