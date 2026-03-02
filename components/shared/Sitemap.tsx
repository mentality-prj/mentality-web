'use client'
import { ReactNode } from 'react'
import {
  Activity,
  BarChart,
  BookHeart,
  BookOpen,
  Brain,
  BrainCircuit,
  ChartPie,
  FileQuestionMark,
  FileText,
  Flower,
  GoalIcon,
  HeartHandshake,
  LayoutDashboard,
  Lightbulb,
  Speech,
  Tag,
  Trophy,
  Waves,
  Wind,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { adminSidebarMenu, guideMenu, landingMenu, userSidebarMenu } from '@/constants/menu'
import { Link } from '@/i18n/navigation'
import { Roles } from '@/types/security'

type Access = 'public' | 'private' | 'admin'

export const iconMap: Record<string, ReactNode> = {
  bookHeart: <BookHeart size={16} className="icon" />,
  layoutDashboard: <LayoutDashboard size={16} className="icon" />,
  tag: <Tag size={16} className="icon" />,
  lightbulb: <Lightbulb size={16} className="icon" />,
  brain: <Brain size={16} className="icon" />,
  brainCircuit: <BrainCircuit size={16} className="icon" />,
  activity: <Activity size={16} className="icon" />,
  bookOpenCheck: <BookOpen size={16} className="icon" />,
  notebookPen: <FileText size={16} className="icon" />,
  chartNoAxesCombined: <BarChart size={16} className="icon" />,
  flower: <Flower size={16} className="icon" />,
  waves: <Waves size={16} className="icon" />,
  wind: <Wind size={16} className="icon" />,
  heartHandshake: <HeartHandshake size={16} className="icon" />,
  trophy: <Trophy size={16} className="icon" />,
  goal: <GoalIcon size={16} className="icon" />,
  chart: <ChartPie size={16} className="icon" />,
  test: <FileQuestionMark size={16} className="icon" />,
  speech: <Speech size={16} className="icon" />,
}

export default function Sitemap() {
  const { data: session, status } = useSession()
  const isAuthenticated = !!session?.user
  const isAdmin = session?.user?.role === Roles.ADMIN

  const t = useTranslations('common.menu')

  const groups: { title: string; access: Access; items: Array<{ key: string; href: string; icon?: string }> }[] = [
    { title: 'Top', access: 'public', items: landingMenu },
    { title: 'User', access: 'private', items: userSidebarMenu },
    { title: 'Admin', access: 'admin', items: adminSidebarMenu },
  ]

  const guideSubItems = guideMenu

  const canShowGroup = (access: Access) => {
    if (access === 'public') return true
    if (access === 'private') return isAuthenticated
    if (access === 'admin') return isAdmin
    return false
  }

  const loading = status === 'loading'

  return (
    <nav aria-label="Sitemap" className="mt-6 w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-default">
        {groups
          .filter((g) => !loading && canShowGroup(g.access))
          .map((g) => (
            <div key={g.title} className="space-y-2">
              <h4>{g.title}</h4>
              <ul className="space-y-1">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <div>
                      <Link
                        href={item.href}
                        className="flex items-center gap-xs text-textcolor-state hover:text-tertiary hover:underline"
                      >
                        {item.icon && iconMap[item.icon]}
                        <span>{t(item.key)}</span>
                      </Link>
                    </div>

                    {/* If this menu item is the Guide parent, render guideSubItems as nested list */}
                    {item.key === 'guide' && guideSubItems.length > 0 && canShowGroup('private') && (
                      <ul className="mt-2 space-y-1 pl-6 text-sm md:pl-8">
                        {guideSubItems.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className="flex items-center gap-xs text-textcolor-state hover:text-tertiary hover:underline"
                            >
                              {sub.icon && iconMap[sub.icon]}
                              {t(sub.key)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </nav>
  )
}
