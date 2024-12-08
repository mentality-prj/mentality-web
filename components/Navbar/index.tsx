import { ReactNode } from 'react'
import { Input, Link, Navbar, NavbarContent } from '@nextui-org/react'

import LangSwitch from '@/components/Buttons/LangSwitch'
import { SearchIcon } from '@/components/icons/searchicon'
import Logo from '@/components/Logo'
import { Routes } from '@/constants/routes'

import AvatarContainer from './AvatarContainer'
import { NotificationsDropdown } from './notifications-dropdown'
import ThemeSwitch from './ThemeSwitch'

interface Props {
  children: ReactNode
}

export const NavbarWrapper = ({ children }: Props) => {
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
          <AvatarContainer />
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  )
}
