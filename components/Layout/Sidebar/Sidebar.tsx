import { ReactNode } from 'react'

import { AvatarMenu, LangSwitch } from '@/components/Layout/Header'
import { SidebarMenuItemType, SidebarMenuType } from '@/constants/menu'

import Logo from '../Header/Logo'

import SidebarMenu from './SidebarMenu'
// import SidebarSettingsLink from './SidebarSettingsLink'

const Sidebar = async ({
  menu,
  type,
  extra,
}: {
  menu: SidebarMenuItemType[]
  type?: SidebarMenuType
  extra?: ReactNode
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
        <div className="mb-10 flex justify-between py-3 pr-2">
          <Logo />
        </div>
      </>
    )

  const bottomSidebarMenu =
    type === 'admin' ? (
      <div>
        <button className="flex w-full items-center justify-center rounded-xl border border-dashed border-border py-3 transition hover:bg-border">
          <span className="text-2xl">+</span> Add files
        </button>
        <div className="mt-2 text-center text-xs text-gray-400">Up to 2G</div>
      </div>
    ) : (
      <div className="mb-24 mt-10 flex w-full items-end">{/* <SidebarSettingsLink /> */}</div>
    )

  return (
    <aside
      className={`flex min-w-64 max-w-72 flex-col gap-sm rounded-l-3xl pr-6 ${type === 'admin' ? 'text-white' : 'pl-6'}`}
    >
      {top}
      {extra}
      <nav className="flex-1">
        <SidebarMenu menu={menu} type={type} />
      </nav>
      {bottomSidebarMenu}
    </aside>
  )
}

export default Sidebar
