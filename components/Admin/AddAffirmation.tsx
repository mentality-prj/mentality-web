'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { useEditTranslations } from '@/components/Admin/hooks/useEditTranslations'
import AffirmationsList from '@/components/Affirmations/AffirmationsListClient'
import { Button } from '@/ds/shadcn/button'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addAffirmation, updateAffirmation } from '@/requests/affirmations'
import { CustomSession } from '@/types/auth'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

import { AffirmationEntity } from '../../types/api-responses'

import DeleteAffirmationButton from './DeleteAffirmationButton'
import EditAffirmationButton from './EditAffirmationButton'
import PublishAffirmationButton from './PublishAffirmationButton'
import TabsLanguages from './TabsLanguages'

export default function AddAffirmation() {
  const t = useTranslations('components.Admin.GenerateAffirmation')
  const tCommon = useTranslations('common')

  const locale = useLocale() as SupportedLanguage
  const [prompt, setPrompt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  const {
    editingEntity: editingAffirmation,
    setEditingEntity: setEditingAffirmation,
    translationsState,
    setTranslationsState,
    activeLang,
    setActiveLang,
    startEditing,
    handleCancel,
    getUpdatedTranslations,
    clearTranslations,
  } = useEditTranslations<AffirmationEntity>(locale)

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

  const handleSave = async () => {
    if (!session?.user || isSaving || !editingAffirmation) return

    setIsSaving(true)
    try {
      const updatedTranslations = getUpdatedTranslations()
      const res = await updateAffirmation(session, String(editingAffirmation.id), { translations: updatedTranslations })
      if ('error' in res) {
        notifyError(String(res.error ?? 'Unknown error'))
      } else {
        notifySuccess(tCommon('notifications.updated'))
        setEditingAffirmation(null)
        clearTranslations()
        setReloadKey((k) => k + 1)
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      {!editingAffirmation ? (
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
              <Button size="large" variant="volume" onClick={generateAffirmation} disabled={isSubmitting}>
                {isSubmitting ? t('submitting') : t('generateButton')}
              </Button>
            </div>
          </div>
          <div className="mt-8 flex w-full flex-col gap-xs">
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
        </>
      ) : (
        <>
          <div className="mb-4">
            <TabsLanguages activeLang={activeLang} onLangChange={setActiveLang} />
          </div>

          <div className="mb-4">
            <h3 className="mb-4 text-xl font-semibold">{t('editLabel')}</h3>
            <Textarea
              id="afirmationInput"
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
              <EditAffirmationButton onEdit={() => startEditing(affirmation)} />
            </>
          )}
        />
      </div>
    </div>
  )
}
