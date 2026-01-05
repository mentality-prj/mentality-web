'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/ds/shadcn/badge'
import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addTip, getUnpublishedTipsOnly } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function AddTip() {
  const t = useTranslations('components.Admin.GenerateTip')
  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [allTips, setAllTips] = useState<TipEntity[]>([])
  const [isLoadingTips, setIsLoadingTips] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const tipsLoadedRef = useRef(false)

  const { data } = useSession()
  const session = data as CustomSession

  const loadTips = useCallback(async () => {
    if (!session || tipsLoadedRef.current || isLoadingTips) return

    setIsLoadingTips(true)
    const { data, error } = await getUnpublishedTipsOnly(session)

    if (error) {
      console.error('Failed to load tips:', error)
      setAllTips([])
    } else if (data) {
      setAllTips(Array.isArray(data) ? data : [])
      tipsLoadedRef.current = true
    }

    setIsLoadingTips(false)
  }, [session, isLoadingTips])

  useEffect(() => {
    loadTips()
  }, [loadTips])

  const generateTip = async () => {
    if (session?.user && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const result = await addTip(session, prompt, locale)
        if (result.error) {
          notifyError(result.error)
        } else {
          notifySuccess(t('success'))
          setPrompt('')
          tipsLoadedRef.current = false
          await loadTips()
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
        <div className="flex flex-col gap-default">
          <Button variant="volume" onClick={generateTip} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('generateButton')}
          </Button>
        </div>
        <p className="text-sm">
          Generate a <strong>Tip</strong> using the OpenAI service.
          <br />
          This tip will automatically appear on pages as a <strong>Current Tip</strong>
          <br />
          <em>If no prompt is specified, the tip will be generated with the default prompt.</em>
        </p>
      </div>
      <div className="mt-8 flex w-full flex-col gap-2">
        <em>{t('ukrainianOnly')}</em>
        <Label htmlFor="tipPrompt">Tip Prompt</Label>
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
        {isLoadingTips ? (
          <p className="text-center text-textcolor-secondary">{t('loading')}</p>
        ) : allTips.length === 0 ? (
          <p className="text-center text-textcolor-secondary">{t('empty')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {allTips.map((tip: TipEntity) => (
              <Badge key={tip.id} variant={tip.isPublished ? 'active' : 'default'}>
                {/* eslint-disable-next-line security/detect-object-injection */}
                {tip.translations[locale] || tip.translations.uk || 'No text available'}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
