import { Settings2 } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import { AvatarMenu, LangSwitch } from '@/components/Header'
import { SidebarMenuItemType, SidebarMenuType } from '@/constants/menu'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

import Logo from '../Header/Logo'

import SidebarMenu from './SidebarMenu'

const Sidebar = async ({ menu, type }: { menu: SidebarMenuItemType[]; type?: SidebarMenuType }) => {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'components.AvatarMenu' })

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
      <div className="my-10 pr-8">
        <button className="flex w-full items-center justify-center rounded-xl border border-dashed border-border py-3 transition hover:bg-border">
          <span className="text-2xl">+</span> Add files
        </button>
        <div className="mt-2 text-center text-xs text-gray-400">Up to 2G</div>
      </div>
    ) : (
      <div className="mb-24 mt-10 flex w-full items-end">
        <Link
          href={`/${Routes.SETTINGS}`}
          className="text-remark hover:text-title-light mr-8 box-border flex items-center justify-center gap-xs overflow-hidden rounded-xl border border-dashed border-border px-8 py-3 transition hover:mr-0 hover:w-full hover:rounded-r-none hover:border-background-alt hover:bg-background-alt hover:pr-16"
        >
          <Settings2 />
          {t('settings')}
        </Link>
      </div>
    )

  return (
    <aside className={`flex min-w-64 flex-col rounded-l-3xl ${type === 'admin' ? 'text-white' : 'pl-6'}`}>
      {top}
      <nav className="flex-1">
        <SidebarMenu menu={menu} type={type} />
      </nav>
      {bottomSidebarMenu}
    </aside>
  )
}

export default Sidebar
