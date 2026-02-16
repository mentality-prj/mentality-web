'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import Card from '@/components/Cards/Card'
import { tagproperties } from '@/constants/tags'
import { Tag } from '@/ds/components/Tag'
import { Button } from '@/ds/shadcn/button'
import { Input } from '@/ds/shadcn/input'
import { Label } from '@/ds/shadcn/label'
import { addTag, getTags } from '@/requests/tags'
import { TagEntity } from '@/types/api-responses'
import { SupportedLanguage, supportedLanguages } from '@/types/languages'
import { TagProperties } from '@/types/tags'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function AddTag() {
  const t = useTranslations('components.Admin.AddTag')
  const locale = useLocale() as SupportedLanguage
  const { data: session } = useSession()
  const [tags, setTags] = useState<TagEntity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const tagsLoadedRef = useRef(false)

  const loadTags = useCallback(async () => {
    if (!session || tagsLoadedRef.current) return

    setIsLoading(true)
    const result = await getTags(session)

    if ('error' in result) {
      notifyError(String(result.error ?? 'Unknown error'))
      setTags([])
    } else {
      setTags(result.data || [])
      tagsLoadedRef.current = true
    }
    setIsLoading(false)
  }, [session])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const createTag = async (formData: FormData): Promise<void> => {
    if (isSubmitting) return // Prevent duplicate submissions

    setIsSubmitting(true)
    const key = (formData.get('key') as string)?.trim()

    // Validate key is not empty
    if (!key) {
      notifyError(t('fields.key.required'))
      setIsSubmitting(false)
      return
    }

    // Validate key matches snake_case format (must start with a lowercase letter)
    if (!/^[a-z][a-z0-9_]*$/.test(key)) {
      notifyError(t('fields.key.format'))
      setIsSubmitting(false)
      return
    }

    // Validate key is not a duplicate
    if (tags.some((tag) => tag.key === key)) {
      notifyError(t('fields.key.duplicate'))
      setIsSubmitting(false)
      return
    }

    const translations = supportedLanguages.reduce(
      (acc, lang) => {
        acc[`${lang}`] = formData.get(lang) as string
        return acc
      },
      {} as Record<SupportedLanguage, string>
    )

    // Validate all language translations are filled
    const emptyLanguages = supportedLanguages.filter((lang) => {
      const translation = translations[lang as SupportedLanguage]
      return !translation || translation.trim() === ''
    })

    if (emptyLanguages.length > 0) {
      const languageNames = {
        uk: t('fields.languageNames.uk'),
        en: t('fields.languageNames.en'),
        pl: t('fields.languageNames.pl'),
      }
      const missingNames = emptyLanguages.map((lang) => languageNames[lang as SupportedLanguage]).join(', ')
      notifyError(t('fields.missingTranslations', { languages: missingNames }))
      setIsSubmitting(false)
      return
    }

    const tag = { key, translations }

    if (session) {
      try {
        const result = await addTag(session, tag)
        if ('error' in result) {
          notifyError(String(result.error ?? 'Unknown error'))
        } else {
          notifySuccess(t('success'))
          formRef.current?.reset()
          tagsLoadedRef.current = false
          await loadTags()
        }
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex gap-12 p-6">
      <Card type="ghost" className="space-y-8 p-6">
        <form ref={formRef} action={createTag} className="flex w-full flex-col gap-default">
          <h2>{t('title')}</h2>
          {tagproperties.map((prop: TagProperties) => (
            <div key={prop.key} className="flex flex-col gap-xs">
              <Label htmlFor={prop.key}>{t(`fields.${prop.name}.label`)}</Label>
              <Input required id={prop.key} name={prop.name} type="text" className="w-full" />
              <span className="remark">{t(`fields.${prop.name}.description`)}</span>
            </div>
          ))}
          <div>
            <Button size="large" variant="volume" type="submit" className="flex-none" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('button')}
            </Button>
          </div>
        </form>
      </Card>
      <div className="w-full">
        <h3 className="mb-4 text-xl font-semibold">{t('tagsList.title')}</h3>
        {isLoading ? (
          <p className="text-center text-textcolor-secondary">{t('tagsList.loading')}</p>
        ) : tags.length === 0 ? (
          <p className="text-center text-textcolor-secondary">{t('tagsList.empty')}</p>
        ) : (
          <div className="flex flex-wrap gap-xs">
            {tags.map((tag) => {
              const translation = tag.translations?.[locale as SupportedLanguage] || tag.translations?.en || tag.key
              return <Tag key={tag.id} text={translation} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
