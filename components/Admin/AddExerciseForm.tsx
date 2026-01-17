'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import Tag from '@/components/Tag/Tag'
import { DropdownInput } from '@/ds/components/DropdownInput'
import { Button } from '@/ds/shadcn/button'
import { Input } from '@/ds/shadcn/input'
import { Tabs, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'
import { Textarea } from '@/ds/shadcn/textarea'
import { addExercise, updateExercise } from '@/requests/exercises'
import { ExerciseCategory, ExerciseEntity } from '@/types/api-responses'
import { CustomSession } from '@/types/auth'
import type { SupportedLanguage } from '@/types/languages'
import { LocaleNativeLabels, supportedLanguages } from '@/types/languages'
import type { AdminTag as TagType } from '@/types/tags'
import { notifyError, notifySuccess } from '@/utils/toast'

import { buildCreatePayload, buildUpdatePayload } from './helpers/exerciseMappers'
import useExerciseTranslations from './hooks/useExerciseTranslations'

interface AddExerciseFormProps {
  tags: TagType[]
  editing?: ExerciseEntity | null
  onSaved?: () => void
}

export default function AddExerciseForm({ tags = [], editing = null, onSaved }: AddExerciseFormProps) {
  const t = useTranslations('components.Admin.AddExercise')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const localeKey = locale as SupportedLanguage
  const { data } = useSession()
  const session = data as CustomSession

  const [category, setCategory] = useState<ExerciseCategory | ''>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const { translationsState, translationsByLang, setTranslationField, resetTranslations, activeLang, setActiveLang } =
    useExerciseTranslations(editing, localeKey)

  useEffect(() => {
    if (editing) {
      setCategory((editing.category as ExerciseCategory) || '')
      setSelectedTags(editing.tags ?? [])
    } else {
      setCategory('')
      setSelectedTags([])
      resetTranslations()
    }
  }, [editing, resetTranslations])

  const categories: { value: ExerciseCategory; text: string }[] = [
    { value: 'meditation', text: t('categories.meditations') },
    { value: 'breathing', text: t('categories.breathing') },
    { value: 'calming', text: t('categories.calming') },
  ]

  const handleSave = async () => {
    if (!session) return
    if (!category) {
      notifyError(t('fields.type.required'))
      return
    }
    setIsSaving(true)
    try {
      if (editing) {
        const payload = buildUpdatePayload({ category, translations: translationsState, tags: selectedTags })
        const { error } = await updateExercise(session, editing.id, payload)
        if (error) notifyError(String(error))
        else {
          notifySuccess(t('saved'))
          if (onSaved) onSaved()
        }
      } else {
        const payload = buildCreatePayload({
          category,
          translations: translationsState,
          localeKey,
          tags: selectedTags,
        })
        const { error } = await addExercise(session, payload)
        if (error) notifyError(String(error))
        else {
          notifySuccess(t('created'))
          if (onSaved) onSaved()
          setCategory('')
          setSelectedTags([])
          resetTranslations()
        }
      }
    } finally {
      setIsSaving(false)
    }
  }

  const addTag = (tId: string) => setSelectedTags((prev) => (prev.includes(tId) ? prev : [...prev, tId]))
  const removeTag = (tId: string) => setSelectedTags((prev) => prev.filter((x) => x !== tId))

  const getTagLabel = (id?: string) => {
    if (!id) return id || ''
    const found: TagType | undefined = tags.find((tg) => tg.id === id)
    if (!found) return id
    if (found.translations && found.translations[localeKey as SupportedLanguage])
      return found.translations[localeKey as SupportedLanguage]
    return found.key || id
  }

  const handleCancel = () => {
    resetTranslations()
    if (onSaved) onSaved()
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <DropdownInput
          id="category"
          label={t('fields.category.label')}
          placeholder={t('fields.category.required')}
          value={category}
          items={categories}
          onValueChange={(v) => setCategory(v as ExerciseCategory)}
        />
      </div>

      <div className="mb-4">
        <Tabs value={activeLang} onValueChange={(v) => setActiveLang(v as SupportedLanguage)}>
          <TabsList className="gap-2">
            {supportedLanguages.map((l) => (
              <TabsTrigger key={l} value={l}>
                {LocaleNativeLabels[l as SupportedLanguage]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-4">
        <label className="block text-sm">{t('fields.title.label')}</label>
        <Input
          value={translationsByLang[activeLang as SupportedLanguage]?.title ?? ''}
          onChange={(e) => setTranslationField(activeLang, 'title', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm">{t('fields.annotation.label')}</label>
        <Input
          value={translationsByLang[activeLang as SupportedLanguage]?.annotation ?? ''}
          onChange={(e) => setTranslationField(activeLang, 'annotation', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm">{t('fields.description.label')}</label>
        <Textarea
          value={translationsByLang[activeLang as SupportedLanguage]?.description ?? ''}
          onChange={(e) => setTranslationField(activeLang, 'description', e.target.value)}
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm">{t('fields.tags.label')}</label>
        {selectedTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedTags.map((tg) => (
              <Tag key={tg} text={getTagLabel(tg)} onRemove={() => removeTag(tg)} />
            ))}
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tg) => {
            const tagId = tg.id ?? tg.key
            return <Tag key={tagId} text={getTagLabel(tagId)} onClick={() => addTag(tagId)} />
          })}
        </div>
      </div>

      <div className="flex gap-2">
        {editing && (
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
            {t('buttonCancel')}
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {editing ? t('Buttons.update') : tCommon('Buttons.create')}
        </Button>
      </div>
    </div>
  )
}
