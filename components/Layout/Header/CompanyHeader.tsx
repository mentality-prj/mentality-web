import { AvatarMenu, LocalDate, SearchBar } from '@/components/Layout/Header'
import LangSwitch from '@/components/Layout/Header/LangSwitch'
import CompanyMobileNavDrawer from '@/components/Layout/MobileNavDrawer/CompanyMobileNavDrawer'
import { SidebarMenuItemType, userTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

export const CompanyHeader = ({ menu }: { menu?: SidebarMenuItemType[] }) => (
  <header className="text-remark shadow-light flex w-full items-center justify-between gap-sm md:px-1">
    <div className="flex items-center gap-sm">
      <CompanyMobileNavDrawer menu={menu} />
      <span className="hidden md:block">
        <LocalDate />
      </span>
    </div>
    <div className="flex items-center gap-sm md:gap-md">
      <TopMenu menu={userTopMenu} />
      <span className="hidden w-40 laptop:block">
        <SearchBar />
      </span>
      <LangSwitch />
      <AvatarMenu />
    </div>
  </header>
)
