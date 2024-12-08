'use client'
import { useCallback } from 'react'
import { Avatar, Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import GoToLoginPageButton from '@/components/Buttons/GoToLoginPageButton'
import { Spinner } from '@/components/icons/navbar/spinner-icon'
import { Routes } from '@/constants/routes'
import { CustomSession } from '@/types/auth'

export default function AvatarContainer() {
  const router = useRouter()
  const { data, status } = useSession()

  const session = data as CustomSession
  const user = session?.OAuthToken && session.user ? session.user : null

  const handleProfile = useCallback(async () => {
    router.replace(Routes.PROFILE)
  }, [router])

  if (status === 'loading') {
    return (
      <Button isIconOnly color="danger" aria-label="Loading" isDisabled>
        <Spinner />
      </Button>
    )
  }

  if (!session || !user || status === 'unauthenticated') {
    return <GoToLoginPageButton />
  }

  return <Avatar as="button" color="secondary" size="md" src={user?.image || undefined} onClick={handleProfile} />
}
