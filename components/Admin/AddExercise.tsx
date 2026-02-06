'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import DeleteExerciseButton from '@/components/Admin/DeleteExerciseButton'
import PublishExerciseButton from '@/components/Admin/PublishExerciseButton'
import ExercisesList from '@/components/Exercises/ExercisesListClient'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'
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
  const [activeTab, setActiveTab] = useState<'unpublished' | 'corrected'>('unpublished')
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
    <div className="w-full space-y-8 p-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold">{t('descriptionGenerate')}</h3>
        <h4>{t('autoAppear')}</h4>
        <p>
          <em>{t('noPrompt')}</em>
        </p>
      </div>

      <GenerateExercise />

      <div>
        <h2 className="mb-4 text-xl font-semibold">{t('addForm.title') || t('buttonAdd')}</h2>
        <AddExerciseForm tags={tags} editing={editingExercise} onSaved={() => setEditingExercise(null)} />
      </div>

      <div className="w-full">
        <h2 className="mb-4 text-xl font-semibold">{t('exercisesList.title')}</h2>

        <div className="mb-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'unpublished' | 'corrected')}>
            <TabsList variant="grey">
              <TabsTrigger value="unpublished">{t('tabs.unpublished')}</TabsTrigger>
              <TabsTrigger value="corrected">{t('tabs.corrected')}</TabsTrigger>
            </TabsList>

            <TabsContent value="unpublished">
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
            </TabsContent>

            <TabsContent value="corrected">
              <ExercisesList
                fetchCorrected
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
