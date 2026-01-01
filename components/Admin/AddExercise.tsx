'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'

import { Badge } from '@/ds/shadcn/badge'
import { Button } from '@/ds/shadcn/button'
import { Checkbox } from '@/ds/shadcn/checkbox'
import { addExercise, getExercises, updateExercise } from '@/requests/exercises'
import { getTags } from '@/requests/tags'
import { ExerciseEntity, TagEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'
import { notifyError, notifySuccess } from '@/utils/toast'

import { CustomInput } from '../../ds/components/CustomInput'
import { DropdownInput } from '../../ds/components/DropdownInput'
import TextareaWithLabel from '../../ds/components/TextareaWithLabel'

export default function AddExercise() {
  const t = useTranslations('components.Admin.AddExercise')
  const locale = useLocale() as SupportedLanguage
  const { data: session } = useSession()
  const [exercises, setExercises] = useState<ExerciseEntity[]>([])
  const [editingExercise, setEditingExercise] = useState<ExerciseEntity | null>(null)
  const [tags, setTags] = useState<TagEntity[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoadingExercises, setIsLoadingExercises] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Controlled form state
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [annotation, setAnnotation] = useState('')
  const [description, setDescription] = useState('')

  const exercisesLoadedRef = useRef(false)
  const tagsLoadedRef = useRef(false)

  const categories = [
    { value: 'meditations', text: t('categories.meditations') },
    { value: 'breathing', text: t('categories.breathing') },
    { value: 'calming', text: t('categories.calming') },
  ]

  const loadExercises = useCallback(async () => {
    if (!session || exercisesLoadedRef.current) return

    setIsLoadingExercises(true)
    const { data, error } = await getExercises(session)

    if (error) {
      notifyError(t('exercisesList.error'))
      setExercises([])
    } else if (data) {
      setExercises(Array.isArray(data) ? data : [])
      exercisesLoadedRef.current = true
    }

    setIsLoadingExercises(false)
  }, [session, t])

  const loadTags = useCallback(async () => {
    if (!session || tagsLoadedRef.current) return

    const { data, error } = await getTags(session)

    if (error) {
      notifyError(error)
    } else if (data) {
      setTags(data)
      tagsLoadedRef.current = true
    }
  }, [session])

  useEffect(() => {
    loadExercises()
    loadTags()
  }, [loadExercises, loadTags])

  const resetForm = () => {
    setCategory('')
    setTitle('')
    setAnnotation('')
    setDescription('')
    setSelectedTags([])
    setEditingExercise(null)
  }

  const validateFields = (): string | null => {
    if (!category) return t('fields.category.required')
    if (!title.trim()) return t('fields.title.required')
    if (!annotation.trim()) return t('fields.annotation.required')
    if (!description.trim()) return t('fields.description.required')
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (editingExercise) {
      await performEditExercise(editingExercise.id)
    } else {
      await performCreateExercise()
    }
  }

  const performCreateExercise = async (): Promise<void> => {
    if (!session || isSubmitting) return

    const validationError = validateFields()
    if (validationError) {
      notifyError(validationError)
      return
    }

    setIsSubmitting(true)

    const exerciseData = {
      category: category.trim(),
      title: title.trim(),
      annotation: annotation.trim(),
      description: description.trim(),
      tags: selectedTags,
    }

    const { error } = await addExercise(session, exerciseData)

    if (error) {
      notifyError(typeof error === 'string' ? error : JSON.stringify(error))
    } else {
      notifySuccess(t('success'))
      resetForm()
      exercisesLoadedRef.current = false
      await loadExercises()
    }
    setIsSubmitting(false)
  }

  const performEditExercise = async (exerciseId: string): Promise<void> => {
    if (!session || isSubmitting) return

    const validationError = validateFields()
    if (validationError) {
      notifyError(validationError)
      return
    }

    setIsSubmitting(true)

    const exerciseData = {
      category: category.trim(),
      title: title.trim(),
      annotation: annotation.trim(),
      description: description.trim(),
      tags: selectedTags,
    }

    const { error } = await updateExercise(session, exerciseId, exerciseData)

    if (error) {
      notifyError(typeof error === 'string' ? error : JSON.stringify(error))
    } else {
      notifySuccess(t('success'))
      resetForm()
      exercisesLoadedRef.current = false
      await loadExercises()
    }

    setIsSubmitting(false)
  }

  const startEditing = (exercise: ExerciseEntity) => {
    setEditingExercise(exercise)
    setCategory(exercise.category)
    setTitle(exercise.title)
    setAnnotation(exercise.annotation)
    setDescription(exercise.description)
    setSelectedTags(exercise.tags ?? [])
  }

  const cancelEditing = () => {
    resetForm()
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-8 p-6">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <h2>{t('title')}</h2>

        <fieldset className="space-y-4">
          <legend className="sr-only">{t('buttonAdd')}</legend>
          <DropdownInput
            id="category"
            label={t('fields.category.label')}
            placeholder={t('fields.category.required')}
            value={category}
            items={categories}
            onValueChange={(v) => setCategory(v)}
          ></DropdownInput>

          <CustomInput
            id="title"
            label={t('fields.title.label')}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <CustomInput
            id="annotation"
            label={t('fields.annotation.label')}
            type="text"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
          />

          <TextareaWithLabel
            id="description"
            label={t('fields.description.label')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-secondary-pressed focus:border-primary-focus w-full hover:border-primary-hover"
            rows={8}
          />
        </fieldset>

        <fieldset>
          <legend>{t('fields.tags.label')}</legend>
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
                      {tag.translations[locale as SupportedLanguage] || tag.translations.en || tag.key}
                    </label>
                  </div>
                )
              })
            )}
          </div>
        </fieldset>

        <div className="flex justify-between">
          <Button type="submit" color="success" disabled={isSubmitting}>
            {editingExercise ? t('buttonSave') : t('buttonAdd')}
          </Button>

          {editingExercise && (
            <Button variant="secondary" type="button" onClick={cancelEditing}>
              {t('buttonCancel')}
            </Button>
          )}
        </div>
      </form>

      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">{t('exercisesList.title')}</h2>
        {isLoadingExercises ? (
          <p className="text-center text-textcolor-secondary">{t('exercisesList.loading')}</p>
        ) : exercises.length === 0 ? (
          <p className="text-center text-textcolor-secondary">{t('exercisesList.empty')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {exercises.map((exercise: ExerciseEntity) => (
              <Badge
                key={exercise.id}
                variant="active"
                className="bg-secondary-focus flex justify-between text-primary-hover"
              >
                {exercise.title}
                <button
                  type="button"
                  className="text-xs underline hover:no-underline"
                  onClick={() => startEditing(exercise)}
                >
                  {t('buttonEdit')}
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
