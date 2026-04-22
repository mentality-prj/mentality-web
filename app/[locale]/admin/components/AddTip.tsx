'use client'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import DeleteTipButton from '@/app/[locale]/admin/components/DeleteTipButton'
import EditTipButton from '@/app/[locale]/admin/components/EditTipButton'
import { useEditTranslations } from '@/app/[locale]/admin/components/hooks/useEditTranslations'
import PublishTipButton from '@/app/[locale]/admin/components/PublishTipButton'
import TipsList from '@/components/features/Tips/TipsListClient'
import { useAuth } from '@/context/AuthProvider'
import { addTip, updateTip } from '@/requests/tips'
import { TipEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs'
import { Textarea } from '@/ui/textarea'
import { notifyError, notifySuccess } from '@/utils/toast'

import TabsLanguages from './TabsLanguages'

export default function AddTip() {
  const t = useTranslations('components.Admin.AddTip')
  const tCommon = useTranslations('common')
  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const {
    editingEntity: editingTip,
    setEditingEntity: setEditingTip,
    translationsState,
    setTranslationsState,
    activeLang,
    setActiveLang,
    startEditing,
    handleCancel,
    getUpdatedTranslations,
    clearTranslations,
  } = useEditTranslations<TipEntity>(locale)

  const { session: data } = useAuth()
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
      const updatedTranslations = getUpdatedTranslations()

      const res = await updateTip(session, String(editingTip.id), { translations: updatedTranslations })
      if ('error' in res) {
        notifyError(String(res.error ?? 'Unknown error'))
      } else {
        notifySuccess(tCommon('notifications.updated'))
        setEditingTip(null)
        clearTranslations()
        setReloadKey((k) => k + 1)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      {!editingTip ? (
        <>
          <div className="flex w-full gap-default">
            <div>
              <h3 className="mb-4 text-xl font-semibold">{t('description')}</h3>
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
          <div className="mt-8 flex w-full flex-col gap-xs">
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
            <h3 className="mb-4 text-xl font-semibold">{t('editLabel')}</h3>
            <Textarea
              id="tipInput"
              value={translationsState[activeLang as SupportedLanguage]}
              onChange={(e) => {
                setTranslationsState((prev) => ({ ...prev, [activeLang]: e.target.value }))
              }}
              rows={6}
            />
          </div>
          <div className="flex gap-xs">
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
        <Tabs defaultValue="unpublished">
          <TabsList variant="grey">
            <TabsTrigger value="unpublished">{t('tabs.unpublished')}</TabsTrigger>
            <TabsTrigger value="published">{t('tabs.published')}</TabsTrigger>
          </TabsList>

          <TabsContent value="unpublished">
            <TipsList
              fetchUnpublished
              reloadTrigger={reloadKey}
              renderTools={(tip: TipEntity, remove: (id: string) => void) => (
                <>
                  <PublishTipButton id={String(tip.id)} session={session} onPublished={() => remove(String(tip.id))} />
                  <DeleteTipButton id={String(tip.id)} session={session} onDeleted={() => remove(String(tip.id))} />
                  <EditTipButton onEdit={() => startEditing(tip)} />
                </>
              )}
            />
          </TabsContent>

          <TabsContent value="published">
            <TipsList
              reloadTrigger={reloadKey}
              renderTools={(tip: TipEntity) => <EditTipButton onEdit={() => startEditing(tip)} />}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
