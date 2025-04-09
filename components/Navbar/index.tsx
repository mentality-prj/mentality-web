import { ReactNode } from 'react'
import { Search } from 'lucide-react'

import LangSwitch from '@/components/Buttons/LangSwitch'
import Logo from '@/components/Logo'
import Menu from '@/components/Menu'
import { Routes } from '@/constants/routes'
import { Input } from '@/ds/shadcn/input'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/ds/shadcn/navigation-menu'
import { Link } from '@/i18n/routing'

import ThemeSwitch from './ThemeSwitch'
import UserDropdownContainer from './UserDropdownContainer'

interface Props {
  children: ReactNode
}

export default function NavbarWrapper({ children }: Props) {
  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <NavigationMenu className="flex items-center justify-between border-b p-4">
        {/* Left menu */}
        <NavigationMenuList className="flex items-center gap-4">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href={Routes.MAIN}>
                <Logo />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="hidden sm:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input className="w-full pl-10" placeholder="Search..." />
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Right menu. !! Why isn't on the right side? where exactly do the styles overlap?? */}
        <NavigationMenuList className="flex w-full gap-4">
          <NavigationMenuItem>
            <LangSwitch />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <ThemeSwitch />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <UserDropdownContainer />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Menu />
      {children}
    </div>
  )
}
