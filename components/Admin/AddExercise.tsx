'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import DeleteExerciseButton from '@/components/Admin/DeleteExerciseButton'
import PublishExerciseButton from '@/components/Admin/PublishExerciseButton'
import ExercisesList from '@/components/Exercises/ExercisesList'
import { getTags } from '@/requests/tags'
import { ExerciseEntity } from '@/types/api-responses'
import { AdminTag } from '@/types/tags'
import { notifyError } from '@/utils/toast'

import AddExerciseForm from './AddExerciseForm'
import EditExerciseButton from './EditExerciseButton'
import GenerateExercise from './GenerateExercise'

export default function AddExercise() {
  const t = useTranslations('components.Admin.AddExercise')
  const { data: session } = useSession()
  const [editingExercise, setEditingExercise] = useState<ExerciseEntity | null>(null)
  const [tags, setTags] = useState<AdminTag[]>([])

  const tagsLoadedRef = useRef(false)

  const loadTags = useCallback(async () => {
    if (!session || tagsLoadedRef.current) return

    const { data, error } = await getTags(session)

    if (error) {
      notifyError(error)
    } else if (data) {
      if ('translations' in data[0]) {
        setTags(data as AdminTag[])
      }
      tagsLoadedRef.current = true
    }
  }, [session])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const startEditing = (exercise: ExerciseEntity) => {
    setEditingExercise(exercise)
  }

  return (
    <div className="space-y-8 p-6">
      <h2>{t('title')}</h2>

      <GenerateExercise />

      <div>
        <h3 className="mb-4 text-lg font-medium">{t('addForm.title') || t('buttonAdd')}</h3>
        <AddExerciseForm tags={tags} editing={editingExercise} onSaved={() => setEditingExercise(null)} />
      </div>

      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">{t('exercisesList.title')}</h2>
        <ExercisesList
          fetchUnpublished
          reloadTrigger={0}
          renderTools={(exercise, remove) => (
            <>
              <PublishExerciseButton
                id={String(exercise.id)}
                session={session}
                onPublished={() => remove(String(exercise.id))}
              />
              <DeleteExerciseButton
                id={String(exercise.id)}
                session={session}
                onDeleted={() => remove(String(exercise.id))}
              />
              <EditExerciseButton onEdit={() => startEditing(exercise)} />
            </>
          )}
        />
      </div>
    </div>
  )
}
