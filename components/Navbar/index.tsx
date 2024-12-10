import { ReactNode } from 'react'
import { Input, Navbar, NavbarContent } from '@nextui-org/react'

import LangSwitch from '@/components/Buttons/LangSwitch'
import { SearchIcon } from '@/components/icons/searchicon'
import Logo from '@/components/Logo'
import Menu from '@/components/Menu'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/routing'

import { NotificationsDropdown } from './notifications-dropdown'
import ThemeSwitch from './ThemeSwitch'
import UserDropdownContainer from './UserDropdownContainer'

interface Props {
  children: ReactNode
}

export default function NavbarWrapper({ children }: Props) {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: 'w-full max-w-full',
        }}
      >
        <Link href={Routes.MAIN}>
          <Logo />
        </Link>
        <NavbarContent className="w-full">
          <Input
            startContent={<SearchIcon />}
            isClearable
            className="w-full"
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Search..."
          />
        </NavbarContent>
        <NavbarContent justify="end" className="w-fit data-[justify=end]:flex-grow-0">
          <LangSwitch />
          <ThemeSwitch />
          <NotificationsDropdown />
          <UserDropdownContainer />
        </NavbarContent>
      </Navbar>
      <Menu />
      {children}
    </div>
  )
}
