import { AvatarMenu, LocalDate, SearchBar } from '@/components/Layout/Header'
import LangSwitch from '@/components/Layout/Header/LangSwitch'
import MobileNavDrawer from '@/components/Layout/MobileNavDrawer/MobileNavDrawer'
import { userTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

const Header = () => (
  <header className="text-remark shadow-light flex w-full items-center justify-between gap-sm md:px-1">
    <div className="flex items-center gap-sm">
      <MobileNavDrawer />
      <span className="hidden xl:block">
        <LocalDate />
      </span>
    </div>
    <div className="flex items-center gap-sm md:gap-md">
      <TopMenu menu={userTopMenu} collapseToMyDayOnTablet={true} />
      <SearchBar />
      <LangSwitch />
      <AvatarMenu />
    </div>
  </header>
)

export default Header
