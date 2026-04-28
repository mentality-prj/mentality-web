'use client'

import { useState } from 'react'

import { AvatarMenu, LocalDate, SearchBar } from '@/components/Layout/Header'
import LangSwitch from '@/components/Layout/Header/LangSwitch'
import CompanyMobileNavDrawer from '@/components/Layout/MobileNavDrawer/CompanyMobileNavDrawer'
import { SidebarMenuItemType, userTopMenu } from '@/constants/menu'
import { cn } from '@/lib/utils'

import TopMenu from '../TopMenu/TopMenu'

export const CompanyHeader = ({ menu, extra }: { menu?: SidebarMenuItemType[]; extra?: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  return (
    <header
      className={cn(
        'text-remark shadow-light flex w-full items-center justify-between gap-sm md:px-1',
        isMobileOpen ? 'mb-6' : ''
      )}
    >
      <div className="flex items-center gap-sm">
        <CompanyMobileNavDrawer menu={menu} extra={extra} />
        <span className="hidden xl:block">
          <LocalDate />
        </span>
      </div>
      <div className="flex items-center gap-2 md:gap-md">
        <TopMenu menu={userTopMenu} collapseToMyDayOnTablet={true} />
        <SearchBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <LangSwitch />
        <AvatarMenu />
      </div>
    </header>
  )
}
