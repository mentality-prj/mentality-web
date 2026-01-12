'use client'

import ExerciseCard from '@/components/Exercises/ExerciseCard'
import useExercises from '@/hooks/useExercises'
import { ExerciseEntity } from '@/types/api-responses'

export default function GuideCalmingClient() {
  const { items, error } = useExercises(false, 1)

  const calming: ExerciseEntity[] = items.filter((i) => i.category === 'calming')

  if (error) return <div className="text-sm text-red-500">{error}</div>
  if (!calming || calming.length === 0) return <div className="text-sm text-gray-500">No calming exercises found.</div>

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calming.map((m) => (
        <li key={String(m.id)} className="h-full">
          <ExerciseCard item={m} />
        </li>
      ))}
    </ul>
  )
}
