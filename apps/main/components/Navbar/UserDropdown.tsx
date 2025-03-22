'use client'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem } from '@nextui-org/react'
import { useSession } from 'next-auth/react'

import { SignOut } from '@/components/Buttons'
import { Routes, RoutesTitles } from '@/constants/routes'
import { Texts } from '@/constants/texts'
import { useRouter } from '@/i18n/routing'
import { CustomSession } from '@/types/auth'
import { RouteKeyType } from '@/types/routes'

export default function UserDropdown() {
  const router = useRouter()
  const { data } = useSession()

  const session = data as CustomSession
  const user = session?.OAuthToken && session.user ? session.user : null

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar as="button" color="secondary" size="md" src={user?.image || undefined} />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(key) => {
          if (key !== 'logout') {
            const actionKey = key as RouteKeyType
            router.replace(actionKey)
          }
        }}
      >
        <DropdownItem
          key={Routes.PROFILE}
          textValue={RoutesTitles.PROFILE}
          className="flex w-full flex-col items-start justify-start"
        >
          {user?.email}
        </DropdownItem>
        <DropdownItem key={Routes.ADMIN} textValue={RoutesTitles.ADMIN}>
          {Texts.ADMIN}
        </DropdownItem>
        <DropdownItem key="logout" textValue={Texts.LOGOUT} color="danger" className="text-danger">
          <SignOut />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
