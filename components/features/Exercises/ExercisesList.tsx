import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import { getServerSession } from '@/lib/get-server-session'
import { getExercises, getUnpublishedExercises } from '@/requests/exercises'
import { ExerciseEntity } from '@/types/api-responses'

import ExerciseCard from './ExerciseCard'

interface ExercisesListProps {
  fetchUnpublished?: boolean
  page?: number
}

export default async function ExercisesList({ fetchUnpublished = false, page = 1 }: ExercisesListProps) {
  const session = await getServerSession()

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
          return (
            <li key={String(a.id)} className="h-full flex-1">
              <ExerciseCard item={a} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
