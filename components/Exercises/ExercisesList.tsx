import { auth } from '@/auth'
import FavoriteButtonWrapper from '@/components/Buttons/FavoriteButtonWrapper'
import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getExercises, getUnpublishedExercises } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import ExerciseCard from './ExerciseCard'

interface ExercisesListProps {
  fetchUnpublished?: boolean
  page?: number
}

export default async function ExercisesList({ fetchUnpublished = false, page = 1 }: ExercisesListProps) {
  const session = await auth()

  const res = fetchUnpublished
    ? await getUnpublishedExercises(session, page, ADMIN_PAGE_SIZE)
    : await getExercises(session)
  if ('error' in res) return null

  let items: ExerciseEntity[] = []

  if ('data' in res) {
    if (Array.isArray(res.data)) {
      items = res.data
    } else if (
      res.data &&
      typeof res.data === 'object' &&
      'items' in res.data &&
      Array.isArray((res.data as { items?: unknown }).items)
    ) {
      items = (res.data as { items: ExerciseEntity[] }).items
    }
  }

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => {
          const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.exercises} itemId={String(a.id)} />
          return (
            <li key={String(a.id)} className="h-full flex-1">
              <ExerciseCard item={a} tools={tools} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
