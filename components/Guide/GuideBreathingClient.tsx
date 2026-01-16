import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import ExerciseCard from '@/components/Exercises/ExerciseCard'
import { fetchExercisesItems } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

export default async function GuideBreathingClient() {
  const session = await auth()

  const { items, error } = await fetchExercisesItems(session)
  const tServer = await getTranslations('pages.ServerError')
  if (error) return <div className="text-sm text-red-500">{tServer('description')}</div>

  const t = await getTranslations('pages.Guide')
  const breathing: ExerciseEntity[] = items.filter((i) => i.category === 'breathing')

  if (!breathing || breathing.length === 0) return <div className="text-sm text-gray-500">{t('breathing.empty')}</div>

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {breathing.map((m) => {
        const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.exercises} itemId={String(m.id)} />
        return (
          <li key={String(m.id)} className="h-full">
            <ExerciseCard item={m} tools={tools} />
          </li>
        )
      })}
    </ul>
  )
}
