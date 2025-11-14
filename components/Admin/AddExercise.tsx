'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/ds/shadcn/badge'
import { Button } from '@/ds/shadcn/button'
import { Checkbox } from '@/ds/shadcn/checkbox'
import { Input } from '@/ds/shadcn/input'
import { Label } from '@/ds/shadcn/label'
import { Textarea } from '@/ds/shadcn/textarea'
import { addExercise, getExercises } from '@/requests/exercises'
import { getTags } from '@/requests/tags'
import { ExerciseEntity, TagEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

export default function AddExercise() {
  const t = useTranslations('components.Admin.AddExercise')
  const locale = useLocale() as SupportedLanguage
  const { data: session } = useSession()
  const [exercises, setExercises] = useState<ExerciseEntity[]>([])
  const [tags, setTags] = useState<TagEntity[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoadingExercises, setIsLoadingExercises] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const exercisesLoadedRef = useRef(false)
  const tagsLoadedRef = useRef(false)

  const loadExercises = useCallback(async () => {
    if (!session || exercisesLoadedRef.current) return

    exercisesLoadedRef.current = true
    setIsLoadingExercises(true)
    const { data, error } = await getExercises(session)

    if (error) {
      notifyError(t('exercisesList.error'))
      setExercises([])
      exercisesLoadedRef.current = false
    } else if (data) {
      setExercises(Array.isArray(data) ? data : [])
    }

    setIsLoadingExercises(false)
  }, [session, t])

  const loadTags = useCallback(async () => {
    if (!session || tagsLoadedRef.current) return

    tagsLoadedRef.current = true
    const { data, error } = await getTags(session)

    if (error) {
      notifyError(error)
      tagsLoadedRef.current = false
    } else if (data) {
      setTags(data)
    }
  }, [session])

  useEffect(() => {
    loadExercises()
    loadTags()
  }, [loadExercises, loadTags])

  const createExercise = async (formData: FormData): Promise<void> => {
    if (!session) return

    const category = formData.get('category') as string
    const title = formData.get('title') as string
    const annotation = formData.get('annotation') as string
    const description = formData.get('description') as string

    // Validate all fields are filled
    if (!category || category.trim() === '') {
      notifyError(t('fields.category.required'))
      return
    }

    if (!title || title.trim() === '') {
      notifyError(t('fields.title.required'))
      return
    }

    if (!annotation || annotation.trim() === '') {
      notifyError(t('fields.annotation.required'))
      return
    }

    if (!description || description.trim() === '') {
      notifyError(t('fields.description.required'))
      return
    }

    const exerciseData = {
      category: category.trim(),
      title: title.trim(),
      annotation: annotation.trim(),
      description: description.trim(),
      tags: selectedTags,
    }

    const { error } = await addExercise(session, exerciseData)

    if (error) {
      notifyError(error)
    } else {
      notifySuccess(t('success'))
      formRef.current?.reset()
      setSelectedTags([])
      exercisesLoadedRef.current = false
      await loadExercises()
    }
  }

  return (
    <div className="flex w-full gap-8 py-6">
      <form ref={formRef} action={createExercise} className="flex w-full flex-col gap-4">
        <h2>{t('title')}</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="category">{t('fields.category.label')}</Label>
            <Input required id="category" name="category" type="text" className="w-full" />
          </div>

          <div>
            <Label htmlFor="title">{t('fields.title.label')}</Label>
            <Input required id="title" name="title" type="text" className="w-full" />
          </div>

          <div>
            <Label htmlFor="annotation">{t('fields.annotation.label')}</Label>
            <Input required id="annotation" name="annotation" type="text" className="w-full" />
          </div>

          <div>
            <Label htmlFor="description">{t('fields.description.label')}</Label>
            <Textarea required id="description" name="description" className="w-full" rows={4} />
          </div>

          <div>
            <Label>{t('fields.tags.label')}</Label>
            <div className="mt-2 space-y-2">
              {tags.length === 0 ? (
                <p className="text-sm text-textcolor-secondary">{t('fields.tags.empty')}</p>
              ) : (
                tags.map((tag) => {
                  const isChecked = selectedTags.includes(tag.id)
                  return (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag.id])
                          } else {
                            setSelectedTags(selectedTags.filter((id) => id !== tag.id))
                          }
                        }}
                      />
                      <label htmlFor={`tag-${tag.id}`} className="cursor-pointer text-sm">
                        {/* eslint-disable-next-line security/detect-object-injection */}
                        {tag.translations[locale as SupportedLanguage] || tag.translations.en || tag.key}
                      </label>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div>
          <Button type="submit" className="flex-none" color="success">
            {t('button')}
          </Button>
        </div>
      </form>

      <div className="w-full">
        <h3 className="mb-4 text-xl font-semibold">{t('exercisesList.title')}</h3>
        {isLoadingExercises ? (
          <p className="text-center text-textcolor-secondary">{t('exercisesList.loading')}</p>
        ) : exercises.length === 0 ? (
          <p className="text-center text-textcolor-secondary">{t('exercisesList.empty')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {exercises.map((exercise: ExerciseEntity) => (
              <Badge key={exercise.id} variant="active">
                {exercise.title}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
