'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import DeleteTipButton from '@/components/Admin/DeleteTipButton'
import EditTipButton from '@/components/Admin/EditTipButton'
import PublishTipButton from '@/components/Admin/PublishTipButton'
import TipsList from '@/components/Tips/TipsListClient'
import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addTip, updateTip } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

import TabsLanguages from './TabsLanguages'

export default function AddTip() {
  const t = useTranslations('components.Admin.AddTip')
  const tCommon = useTranslations('common')
  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [editingTip, setEditingTip] = useState<TipEntity | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(locale)
  const [translationsState, setTranslationsState] = useState<Record<SupportedLanguage, string>>(() => {
    const initial = {} as Record<SupportedLanguage, string>
    supportedLanguages.forEach((lang) => {
      initial[lang as SupportedLanguage] = ''
    })
    return initial
  })

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

  const handleSave = async () => {
    if (!session?.user || isSaving || !editingTip) return

    setIsSaving(true)
    try {
      const updatedTranslations = { ...(editingTip.translations || {}) } as Record<string, string>
      supportedLanguages.forEach((l) => {
        updatedTranslations[l as SupportedLanguage] = translationsState[l as SupportedLanguage]
      })

      const res = await updateTip(session, String(editingTip.id), { translations: updatedTranslations })
      if ('error' in res) {
        notifyError(String(res.error ?? 'Unknown error'))
      } else {
        notifySuccess(tCommon('notifications.updated'))
        setEditingTip(null)
        setTranslationsState((prev) => {
          const cleared = { ...prev }
          supportedLanguages.forEach((l) => (cleared[l as SupportedLanguage] = ''))
          return cleared
        })
        setReloadKey((k) => k + 1)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingTip(null)
    setTranslationsState((prev) => {
      const cleared = { ...prev }
      supportedLanguages.forEach((lang) => (cleared[lang as SupportedLanguage] = ''))
      return cleared
    })
  }

  const startEditing = (tip: TipEntity) => {
    setEditingTip(tip)
    const next = {} as Record<SupportedLanguage, string>
    supportedLanguages.forEach((l) => {
      next[l as SupportedLanguage] =
        (tip.translations as Record<SupportedLanguage, string>)?.[l as SupportedLanguage] || ''
    })
    setTranslationsState(next)
  }

  return (
    <div className="space-y-8 p-6">
      {!editingTip ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mb-4">
            <TabsLanguages activeLang={activeLang} onLangChange={setActiveLang} />
          </div>

          <div className="mb-4">
            <h2 className="mb-4 font-semibold">{t('editLabel')}</h2>
            <Textarea
              id="tipInput"
              value={translationsState[activeLang as SupportedLanguage]}
              onChange={(e) => {
                setTranslationsState((prev) => ({ ...prev, [activeLang]: e.target.value }))
              }}
              rows={6}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
              {tCommon('Buttons.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {tCommon('Buttons.save')}
            </Button>
          </div>
        </>
      )}
      <div className="w-full">
        <h3 className="mb-4 text-xl font-semibold">{t('allTipsTitle')}</h3>
        <TipsList
          fetchUnpublished
          reloadTrigger={reloadKey}
          renderTools={(tip, remove) => (
            <>
              <PublishTipButton id={String(tip.id)} session={session} onPublished={() => remove(String(tip.id))} />
              <DeleteTipButton id={String(tip.id)} session={session} onDeleted={() => remove(String(tip.id))} />
              <EditTipButton onEdit={() => startEditing(tip)} />
            </>
          )}
        />
      </div>
    </div>
  )
}
