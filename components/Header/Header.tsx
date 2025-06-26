'use client'

import LangSwitch from '@/components/Buttons/LangSwitch'

import { LocalDate } from './LocalDate'
import { SearchBar } from './SearchBar'
import { ThemeToggleButton } from './ThemeToggleButton'
import { UserMenu } from './UserMenu'

export function Header() {
  return (
    <header className="flex w-full items-center justify-between rounded-b-default bg-surface-white px-4 py-4 tablet:px-8">
      <LocalDate className="hidden tablet:block" />
      <div className="flex items-center gap-4">
        <SearchBar />
        <div className="flex flex-col tablet:flex-row">
          <ThemeToggleButton />
          <LangSwitch />
        </div>
        {/* додати сесію */}
        <UserMenu name="User Name" email="username@example.com" avatarUrl="" />
      </div>
    </header>
  )
}
