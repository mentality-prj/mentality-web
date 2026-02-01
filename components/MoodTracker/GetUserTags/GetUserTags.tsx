'use client'
import { JSX, ReactNode, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getUserTags } from '@/requests/userTags'
import { CustomSession } from '@/types/auth'
import { UserTag } from '@/types/tags'

type Props = {
  children: (tags: UserTag[]) => ReactNode
}

export default function GetUserTags({ children }: Props): JSX.Element {
  const { data: session } = useSession()
  const [tags, setTags] = useState<UserTag[]>([])

  useEffect(() => {
    let mounted = true
    async function fetchTags() {
      const res = await getUserTags(session as CustomSession)
      if (!mounted) return
      if ('error' in res) {
        setTags([])
        return
      }
      const data = res.data as Array<Partial<UserTag>>
      if (!Array.isArray(data)) {
        setTags([])
        return
      }
      const list: UserTag[] = data
        .filter((t) => !!t?.key)
        .map((t) => ({ key: t!.key as string, name: (t!.name as string) ?? '' }))
      setTags(list)
    }

    fetchTags()
    return () => {
      mounted = false
    }
  }, [session])

  return <>{children(tags)}</>
}
