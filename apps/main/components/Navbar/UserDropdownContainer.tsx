import { useCallback } from 'react'
import { Avatar, Button } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

import { GoToLoginPageButton } from '@/components/Buttons'
import { Spinner } from '@/components/icons/navbar/spinner-icon'
import { Routes } from '@/constants/routes'
import { useRouter } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'
import { Roles } from '@/types/security'

import UserDropdown from './UserDropdown'

export default function UserDropdownContainer() {
  const router = useRouter()
  const { data, status } = useSession()

  const session = data as CustomSession
  const user = session?.OAuthToken && session.user ? session.user : null
  const role = user?.role || Roles.USER

  const handleProfile = useCallback(() => {
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

  if (role === Roles.ADMIN) {
    return <UserDropdown />
  }

  return <Avatar as="button" color="secondary" size="md" src={user?.image || undefined} onClick={handleProfile} />
}
