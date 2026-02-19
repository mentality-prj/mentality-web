'use client'
import { ReactNode, useState } from 'react'

import FavoriteButtonWrapper from '@/components/shared/Buttons/FavoriteButtonWrapper'
import { Pagination } from '@/components/shared/Pagination/Pagination'
import { ADMIN_PAGE_SIZE } from '@/constants/pagination'
import useExercises from '@/hooks/useExercises'
import { ExerciseEntity } from '@/types/api-responses'
import { ITEM_TYPE_DEFS } from '@/types/itemTypes'

import ExerciseCard from './ExerciseCard'

interface Props {
  fetchUnpublished?: boolean
  fetchCorrected?: boolean
  renderTools?: (item: ExerciseEntity, remove: (id: string) => void) => ReactNode
  reloadTrigger?: number
}

export default function ExercisesListClient({
  fetchUnpublished = false,
  fetchCorrected = false,
  renderTools,
  reloadTrigger,
}: Props) {
  const [page, setPage] = useState(1)
  const { items, total, loading, error, setItems } = useExercises(fetchUnpublished, page, reloadTrigger, fetchCorrected)

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => String(i.id) !== String(id)))

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-500">{error}</div>}
      {!loading && !error && items.length === 0 && <div className="text-sm text-gray-500">No exercises found.</div>}

      <ul className="grid grid-cols-1 items-stretch gap-sm sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => {
          const tools = <FavoriteButtonWrapper itemType={ITEM_TYPE_DEFS.exercises} itemId={String(a.id)} />
          return (
            <li key={String(a.id)} className="h-full flex-1">
              <ExerciseCard item={a} tools={renderTools ? renderTools(a, removeItem) : tools} />
            </li>
          )
        })}
      </ul>

      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE))} onPageChange={setPage} />
    </div>
  )
}
