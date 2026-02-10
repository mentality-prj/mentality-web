import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { fetchExercisesItems } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import MeditationCard from '../Meditations/MeditationCard'

export default async function GuideMeditationsClient() {
  const session = await auth()

  const { items, error } = await fetchExercisesItems(session)
  const tServer = await getTranslations('pages.ServerError')
  if (error) return <div className="text-sm text-red-500">{tServer('description')}</div>

  const t = await getTranslations('pages.Guide')
  const meditations: ExerciseEntity[] = items.filter((i) => i.category === 'meditation')

  if (!meditations || meditations.length === 0)
    return <div className="text-sm text-gray-500">{t('meditations.empty')}</div>

  return (
    <ul className="grid grid-cols-1 gap-sm sm:grid-cols-2 lg:grid-cols-3">
      {meditations.map((m) => {
        const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.exercises} itemId={String(m.id)} />
        return (
          <li key={String(m.id)} className="h-full">
            <MeditationCard item={m} tools={tools} />
          </li>
        )
      })}
    </ul>
  )
}
