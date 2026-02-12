import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { fetchExercisesItems } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'
import ITEM_TYPE_DEFS from '@/types/itemTypes'

import MeditationCard from './MeditationCard'

type Params = {
  currentMeditationId: string
}

export const OtherMeditations = async ({ currentMeditationId }: Params) => {
  const session = await auth()
  const t = await getTranslations('pages.Meditation')
  const { items } = await fetchExercisesItems(session)

  const meditations: ExerciseEntity[] = items
    .filter((i) => i.category === 'meditation')
    .filter((m) => m.id !== currentMeditationId)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-4">
      <h2>{t('otherMeditations')}</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meditations.map((m) => {
          const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.exercises} itemId={String(m.id)} />
          return (
            <li key={String(m.id)} className="h-full">
              <MeditationCard item={m} tools={tools} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
