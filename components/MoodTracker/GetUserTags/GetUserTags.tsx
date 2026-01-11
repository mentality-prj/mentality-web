'use client'
import React, { JSX, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { getUserTags } from '@/requests/userTags'
import { UserTag } from '@/types/tags'

import { CustomSession } from '../../../types/auth'

type Props = {
  children: (tags: UserTag[]) => React.ReactNode
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
