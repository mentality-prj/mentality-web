import { AvatarMenu, LocalDate, SearchBar } from '@/components/Header'
import LangSwitch from '@/components/Header/LangSwitch'
import { userTopMenu } from '@/constants/menu'

import TopMenu from '../TopMenu/TopMenu'

const Header = ({ pathname }: { pathname: string }) => (
  <header className="flex w-full items-center justify-between text-remark light-shadow ">
    <LocalDate />
    <div className="flex items-center gap-8">
      <TopMenu menu={userTopMenu} pathname={pathname} />
      <SearchBar />
      <LangSwitch />
      <AvatarMenu />
    </div>
  </header>
)

export default Header
