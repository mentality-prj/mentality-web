'use client'
import { ReactNode } from 'react'
import {
  ActivityIcon,
  BookOpenCheckIcon,
  Brain,
  ChartNoAxesCombined,
  Flower,
  Lightbulb,
  NotebookPenIcon,
  Tag,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SidebarMenuItemType, SidebarMenuType } from '@/constants/menu'
import { getMenuItemClass } from '@/helpers/side-menu.helpers'
import { Link, usePathname } from '@/i18n/navigation'

const iconMap: Record<string, ReactNode> = {
  activity: <ActivityIcon className="h-5 w-5" size={12} />,
  bookOpenCheck: <BookOpenCheckIcon className="h-5 w-5" size={12} />,
  brain: <Brain className="h-5 w-5" size={12} />,
  chartNoAxesCombined: <ChartNoAxesCombined className="h-5 w-5" size={12} />,
  lightbulb: <Lightbulb className="h-5 w-5" size={12} />,
  notebookPen: <NotebookPenIcon className="h-5 w-5" size={12} />,
  tag: <Tag className="h-5 w-5" size={12} />,
  flower: <Flower className="h-5 w-5" size={12} />,
}

export default function SidebarMenu({ menu, type = 'user' }: { menu: SidebarMenuItemType[]; type?: SidebarMenuType }) {
  const t = useTranslations('components.Sidebar')
  const pathname = usePathname()

  return (
    <ul
      className={`flex flex-col ${type === 'admin' ? 'text-color-white' : 'text-remark mr-8 overflow-hidden rounded border border-border'}`}
    >
      {menu.map((item: SidebarMenuItemType) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <li key={item.key}>
            <Link href={item.href} className={getMenuItemClass(isActive, type)}>
              {item.icon && iconMap[item.icon]}
              {t(item.key)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
