'use client'

import LangSwitch from '@/components/Buttons/LangSwitch'

import { LocalDate } from './LocalDate'
import { SearchBar } from './SearchBar'
import { ThemeToggleButton } from './ThemeToggleButton'
import { UserMenu } from './UserMenu'

export function Header() {
  return (
    <header className="mb-2 flex w-full items-center justify-between rounded-b-default bg-surface-white px-2 py-2 tablet:mb-4 tablet:px-4 desktop:mb-8 desktop:px-8 desktop:py-4">
      <LocalDate className="hidden tablet:block" />
      <div className="flex items-center gap-1 tablet:gap-2 desktop:gap-8">
        <SearchBar />
        <ThemeToggleButton />
        <LangSwitch />
        {/* додати сесію */}
        <UserMenu name="User Name" email="username@example.com" avatarUrl="" />
      </div>
    </header>
  )
}
