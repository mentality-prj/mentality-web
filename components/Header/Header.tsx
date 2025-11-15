'use client'

import { useSession } from 'next-auth/react'

import LangSwitch from '@/components/Header/LangSwitch'
import { HamburgerMenu } from '@/ds/icons/hamburger-menu'
import { Button } from '@/ds/shadcn/button'
import { useSidebar } from '@/ds/shadcn/sidebar'

import { LocalDate } from './LocalDate'
import { SearchBar } from './SearchBar'
import { UserMenu } from './UserMenu'

export function Header() {
  const { isMobile, toggleSidebar } = useSidebar()
  const { data } = useSession()
  const user = data?.user

  if (!user) return null
  return (
    <header className="flex w-full items-center justify-between rounded-b-default bg-surface-white px-2 py-2 tablet:mb-4 tablet:px-4 desktop:mb-8 desktop:px-8 desktop:py-3">
      {isMobile && (
        <Button
          className="h-6 w-6"
          onClick={toggleSidebar}
          variant="iconButton"
          size="icon"
          aria-label="Toggle Sidebar"
        >
          <HamburgerMenu />
        </Button>
      )}
      <LocalDate />
      <div className="flex items-center gap-1 desktop:gap-4">
        <SearchBar />
        <LangSwitch />
        <UserMenu name={user.name ?? ''} email={user.email ?? ''} avatarUrl={user.image ?? ''} role={user.role ?? ''} />
      </div>
    </header>
  )
}
