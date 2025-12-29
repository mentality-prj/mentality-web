import { useTranslations } from 'next-intl'

import { SidebarMenuItemType, SidebarMenuType } from '@/constants/sidebarMenu'
import { getMenuItemClass } from '@/helpers/sideMenu.helpers'
import { Link } from '@/i18n/navigation'

export function SidebarMenu({
  pathname,
  menu,
  type = 'user',
}: {
  pathname: string
  menu: SidebarMenuItemType[]
  type?: SidebarMenuType
}) {
  const ta = useTranslations('components.Admin')
  const tu = useTranslations('components.Sidebar')
  const t = type === 'admin' ? ta : tu

  return (
    <ul
      className={`flex flex-col ${type === 'admin' ? 'text-color-white' : 'text-remark overflow-hidden border border-border rounded mr-8'}`}
    >
      {menu.map((item: SidebarMenuItemType) => {
        const isActive = pathname.endsWith(`${item.href}`)
        return (
          <li key={item.key}>
            <Link href={`/${item.href}`} className={getMenuItemClass(isActive, type)}>
              {'icon' in item && item.icon && <item.icon className="h-5 w-5" size={12} />}
              {t(item.key)}{' '}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default SidebarMenu
