import { AvatarMenu, LangSwitch } from '@/components/Header'
import { SidebarMenuItemType, SidebarMenuType } from '@/constants/sidebarMenu'

import Logo from '../Header/Logo'

import SidebarMenu from './SidebarMenu'

const Sidebar = ({
  pathname,
  menu,
  type,
}: {
  pathname: string
  menu: SidebarMenuItemType[]
  type?: SidebarMenuType
}) => {
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
        <div className="flex justify-between py-3 pr-2 mb-10">
          <Logo />
        </div>
      </>
    )
  return (
    <aside className={`flex flex-col min-w-64 rounded-l-3xl ${type === 'admin' ? 'text-white' : 'pl-6'}`}>
      {top}
      <nav className="flex-1">
        <SidebarMenu pathname={pathname} menu={menu} type={type} />
      </nav>
      <div className="my-10 pr-8">
        <button className="flex w-full items-center justify-center rounded-xl border border-dashed border-border py-3 transition hover:bg-border">
          <span className=" text-2xl">+</span> Add files
        </button>
        <div className="mt-2 text-center text-xs text-gray-400">Up to 2G</div>
      </div>
    </aside>
  )
}

export default Sidebar
