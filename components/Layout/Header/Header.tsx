'use client'

import { useState } from 'react'

import { AvatarMenu, LocalDate, SearchBar } from '@/components/Layout/Header'
import LangSwitch from '@/components/Layout/Header/LangSwitch'
import MobileNavDrawer from '@/components/Layout/MobileNavDrawer/MobileNavDrawer'
import { SidebarMenuItemType, userTopMenu } from '@/constants/menu'
import { cn } from '@/lib/utils'

import TopMenu from '../TopMenu/TopMenu'

const Header = ({ sidebarMenu }: { sidebarMenu?: SidebarMenuItemType[] }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'text-remark shadow-light flex w-full items-center justify-between gap-2 tablet:mb-0 md:px-1',
        isMobileOpen ? 'mb-6' : ''
      )}
    >
      <div className="flex items-center gap-sm">
        <MobileNavDrawer menu={sidebarMenu} />
        <span className="hidden xl:block">
          <LocalDate />
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-md">
        <TopMenu collapseToMyDayOnTablet={true} menu={userTopMenu} />
        <SearchBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <LangSwitch />
        <AvatarMenu />
      </div>
    </header>
  )
}

export default Header
