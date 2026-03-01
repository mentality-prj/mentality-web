import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import ExerciseCard from '@/components/features/Exercises/ExerciseCard'
import { fetchExercisesItems } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'

export default async function GuideCalmingClient() {
  const session = await auth()

  const { items, error } = await fetchExercisesItems(session)
  const tServer = await getTranslations('pages.ServerError')
  if (error) return <div className="text-sm text-red-500">{tServer('description')}</div>

  const t = await getTranslations('pages.Guide')
  const calming: ExerciseEntity[] = items.filter((i) => i.category === 'calming')

  if (!calming || calming.length === 0) return <div className="text-sm text-gray-500">{t('calming.empty')}</div>

  return (
    <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3">
      {calming.map((m) => {
        return (
          <li key={String(m.id)} className="h-full">
            <ExerciseCard item={m} />
          </li>
        )
      })}
    </ul>
  )
}
