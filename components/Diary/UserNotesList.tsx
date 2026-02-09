'use client'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'

import { PAGE_SIZE } from '../../constants/pagination'
import { getUserTags } from '../../requests/userTags'
import { UserTag } from '../../types/tags'
import { Pagination } from '../Pagination/Pagination'

import { UserNoteCard } from './UserNoteCard'

type Props = {
  notes: {
    id: string
    content: string
    isActive?: boolean
    createdAt?: string
    tags?: string[]
  }[]
}

export const UserNotesList = ({ notes }: Props) => {
  const [page, setPage] = useState(1)
  const total = notes.length
  const paginatedNotes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return notes.slice(start, end)
  }, [notes, page])

  const { data: session } = useSession()
  const [availableTags, setAvailableTags] = useState<UserTag[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchTags() {
      const res = await getUserTags(session)
      if (!mounted) return
      if ('error' in res) {
        setAvailableTags([])
        return
      }
      const data = res.data as Array<Partial<UserTag>>
      if (!Array.isArray(data)) {
        setAvailableTags([])
        return
      }
      const list: UserTag[] = data
        .filter((t) => !!t?.key)
        .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
      setAvailableTags(list)
    }

    fetchTags()
    return () => {
      mounted = false
    }
  }, [session])

  return (
    <div className="grid gap-4">
      {paginatedNotes.map((note) => (
        <UserNoteCard key={note.id} {...note} availableTags={availableTags} />
      ))}
      {notes.length > PAGE_SIZE && (
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onPageChange={setPage} />
      )}
    </div>
  )
}
