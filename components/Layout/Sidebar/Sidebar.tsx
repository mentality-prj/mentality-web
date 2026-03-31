import { AvatarMenu, LangSwitch } from '@/components/Layout/Header'
import { SidebarMenuItemType, SidebarMenuType } from '@/constants/menu'

import Logo from '../Header/Logo'

import SidebarMenu from './SidebarMenu'

const Sidebar = async ({ menu, type }: { menu: SidebarMenuItemType[]; type?: SidebarMenuType }) => {
  const top =
    type === 'admin' ? (
      <>
        <div className="flex justify-between py-3 pl-6 pr-2">
          <div>
            <LangSwitch type="admin" />
          </div>
          <AvatarMenu />
        </div>
        <div className="mb-4 ml-2 border border-x-0 border-y border-b-gray-500 border-t-gray-800" />
      </>
    ) : (
      <>
        <div className="mb-10 flex justify-between py-3 pr-2">
          <Logo />
        </div>
      </>
    )
  return (
    <aside className={`flex min-w-64 flex-col rounded-l-3xl ${type === 'admin' ? 'text-white' : 'pl-6'}`}>
      {top}
      <nav className="flex-1">
        <SidebarMenu menu={menu} type={type} />
      </nav>
    </aside>
  )
}

export default Sidebar
