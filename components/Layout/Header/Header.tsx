import { AvatarMenu, LocalDate, SearchBar } from '@/components/Layout/Header'
import LangSwitch from '@/components/Layout/Header/LangSwitch'
import { userTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

const Header = () => (
  <header className="text-remark light-shadow flex w-full items-center justify-between px-1">
    <LocalDate />
    <div className="flex items-center gap-md">
      <TopMenu menu={userTopMenu} />
      <SearchBar />
      <LangSwitch />
      <AvatarMenu />
    </div>
  </header>
)

export default Header
