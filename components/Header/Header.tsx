'use client'

import { useSession } from 'next-auth/react'

import LangSwitch from '@/components/Buttons/LangSwitch'

import { LocalDate } from './LocalDate'
import { SearchBar } from './SearchBar'
import { ThemeToggleButton } from './ThemeToggleButton'
import { UserMenu } from './UserMenu'

export function Header() {
  const { data } = useSession()
  const user = data?.user

  if (!user) return null
  return (
    <header className="flex w-full items-center justify-between rounded-b-default bg-surface-white px-2 py-2 tablet:mb-4 tablet:px-4 desktop:mb-8 desktop:px-8 desktop:py-3">
      <LocalDate className="hidden text-sm tablet:block desktop:text-base" />
      <div className="flex items-center gap-1 desktop:gap-2">
        <SearchBar />
        <ThemeToggleButton />
        <LangSwitch />
        <UserMenu name={user.name ?? ''} email={user.email ?? ''} avatarUrl={user.image ?? ''} />
      </div>
    </header>
  )
}
