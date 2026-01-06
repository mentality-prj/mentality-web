import { AvatarMenu, LocalDate, SearchBar } from '@/components/Header'
import LangSwitch from '@/components/Header/LangSwitch'
import { userTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

const Header = () => (
  <header className="text-remark light-shadow flex w-full items-center justify-between px-1">
    <LocalDate />
    <div className="flex items-center gap-8">
      <TopMenu menu={userTopMenu} />
      <SearchBar />
      <LangSwitch />
      <AvatarMenu />
    </div>
  </header>
)

export default Header
