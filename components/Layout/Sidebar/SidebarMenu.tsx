'use client'
import { ReactNode } from 'react'
import {
  ActivityIcon,
  Bookmark,
  BookOpenCheckIcon,
  Brain,
  ChartNoAxesCombined,
  FileQuestionMark,
  Flower,
  FolderTree,
  Lightbulb,
  MailPlus,
  NotebookPenIcon,
  Puzzle,
  Speech,
  Tag,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import { SidebarMenuItemType, SidebarMenuType } from '@/constants/menu'
import { getMenuItemClass } from '@/helpers/side-menu.helpers'
import { Link, usePathname } from '@/i18n/navigation'

const iconMapSidebar: Record<string, ReactNode> = {
  activity: <ActivityIcon className="h-5 w-5" size={12} />,
  bookOpenCheck: <BookOpenCheckIcon className="h-5 w-5" size={12} />,
  brain: <Brain className="h-5 w-5" size={12} />,
  chartNoAxesCombined: <ChartNoAxesCombined className="h-5 w-5" size={12} />,
  folderTree: <FolderTree className="h-5 w-5" size={12} />,
  lightbulb: <Lightbulb className="h-5 w-5" size={12} />,
  mailPlus: <MailPlus className="h-5 w-5" size={12} />,
  notebookPen: <NotebookPenIcon className="h-5 w-5" size={12} />,
  tag: <Tag className="h-5 w-5" size={12} />,
  flower: <Flower className="h-5 w-5" size={12} />,
  test: <FileQuestionMark className="h-5 w-5" size={12} />,
  bookmark: <Bookmark className="h-5 w-5" size={12} />,
  speech: <Speech className="h-5 w-5" size={12} />,
  puzzle: <Puzzle className="h-5 w-5" size={12} />,
  users: <Users className="h-5 w-5" size={12} />,
}

export default function SidebarMenu({
  menu,
  type = 'user',
  onLinkClick,
}: {
  menu: SidebarMenuItemType[]
  type?: SidebarMenuType
  onLinkClick?: () => void
}) {
  const t = useTranslations('components.Sidebar')
  const pathname = usePathname()

  return (
    <ul
      className={`sticky top-3 flex flex-col max-md:w-full ${type === 'admin' ? 'text-color-white' : 'text-remark mr-8 overflow-hidden rounded border border-border'}`}
    >
      {menu.map((item: SidebarMenuItemType) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <li key={item.key}>
            <Link href={item.href} className={getMenuItemClass(isActive, type)} onClick={onLinkClick}>
              {item.icon && iconMapSidebar[item.icon]}
              {t(item.key)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
