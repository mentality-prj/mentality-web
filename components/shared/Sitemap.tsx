'use client'
import { ReactNode } from 'react'
import {
  Activity,
  BadgeCheck,
  BarChart,
  BookHeart,
  Bookmark,
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
  Puzzle,
  Speech,
  Tag,
  Trophy,
  Waves,
  Wind,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import {
  adminInnerMenuItems,
  adminSidebarMenu,
  guideMenu,
  landingMenu,
  mentalGamesInnerMenuItems,
  myProgressInnerMenuItems,
  psychologicalTestsInnerMenuItems,
  userSidebarMenu,
} from '@/constants/menu'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { CustomSession } from '@/types/auth'
import { COMPANY_ROLES } from '@/types/rbac'
import { Roles } from '@/types/security'

type Access = 'public' | 'private' | 'admin' | 'b2b'

export const iconMapSitemap: Record<string, ReactNode> = {
  bookmark: <Bookmark size={16} className="icon" />,
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
  badgeCheck: <BadgeCheck size={16} className="icon" />,
  trophy: <Trophy size={16} className="icon" />,
  goal: <GoalIcon size={16} className="icon" />,
  chart: <ChartPie size={16} className="icon" />,
  test: <FileQuestionMark size={16} className="icon" />,
  speech: <Speech size={16} className="icon" />,
  puzzle: <Puzzle size={16} className="icon" />,
}

export default function Sitemap() {
  const { data, status } = useSession()
  const session = data as CustomSession | null
  const isAuthenticated = !!session?.user
  const isAdmin = session?.user?.role === Roles.ADMIN
  const companyRole = session?.user?.companyRole
  const hasCompanyAccess = isAdmin || companyRole === COMPANY_ROLES.SUPERUSER || companyRole === COMPANY_ROLES.MANAGER

  const t = useTranslations('common.menu')

  const subMenuMap: Record<string, Array<{ key: string; href: string; icon?: string }>> = {
    guide: guideMenu,
    'psychological-tests': psychologicalTestsInnerMenuItems,
    'my-progress': myProgressInnerMenuItems,
    'mental-games': mentalGamesInnerMenuItems,
  }

  const legalItems = [
    { key: 'settings', href: Routes.SETTINGS },
    { key: 'privacy', href: Routes.PRIVACY },
    { key: 'terms', href: Routes.TERMS },
    { key: 'cookies', href: Routes.COOKIES },
  ]

  const b2bItems = [
    { key: 'company', href: Routes.COMPANY },
    { key: 'company-superuser', href: Routes.COMPANY_ADMIN },
    { key: 'manager', href: Routes.COMPANY_MANAGER },
  ]

  const rows: {
    left: { titleKey: string; access: Access; items: Array<{ key: string; href: string; icon?: string }> }
    right: { titleKey: string; access: Access; items: Array<{ key: string; href: string; icon?: string }> }
  }[] = [
    {
      left: { titleKey: 'sectionTop', access: 'public', items: landingMenu },
      right: { titleKey: 'sectionLegal', access: 'public', items: legalItems },
    },
    {
      left: { titleKey: 'sectionUser', access: 'private', items: userSidebarMenu },
      right: { titleKey: 'sectionB2B', access: 'b2b', items: b2bItems },
    },
  ]

  const canShowGroup = (access: Access) => {
    if (access === 'public') return true
    if (access === 'private') return isAuthenticated
    if (access === 'admin') return isAdmin
    if (access === 'b2b') return hasCompanyAccess
    return false
  }

  const loading = status === 'loading'

  const renderGroup = (group: {
    titleKey: string
    access: Access
    items: Array<{ key: string; href: string; icon?: string }>
  }) => (
    <div className="space-y-2">
      <h4>{t(group.titleKey)}</h4>
      <ul className="space-y-1">
        {group.items.map((item) => (
          <li key={item.href}>
            <div>
              <Link
                href={item.href}
                className="flex items-center gap-xs text-textcolor-state hover:text-tertiary hover:underline"
              >
                {item.icon && iconMapSitemap[item.icon]}
                <span>{t(item.key)}</span>
              </Link>
            </div>

            {subMenuMap[item.key] && subMenuMap[item.key].length > 0 && canShowGroup('private') && (
              <ul className="mt-2 space-y-1 pl-6 text-sm md:pl-8">
                {subMenuMap[item.key].map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      className="flex items-center gap-xs text-textcolor-state hover:text-tertiary hover:underline"
                    >
                      {sub.icon && iconMapSitemap[sub.icon]}
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
  )

  if (loading) return null

  return (
    <nav aria-label="Sitemap" className="mt-6 w-full max-w-2xl">
      <div className="flex flex-col gap-default">
        {rows.map((row) => {
          const showLeft = canShowGroup(row.left.access)
          const showRight = canShowGroup(row.right.access)
          if (!showLeft && !showRight) return null
          return (
            <div key={row.left.titleKey} className="grid grid-cols-2 gap-default">
              {showLeft && renderGroup(row.left)}
              {showRight && renderGroup(row.right)}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

export function SitemapAdmin() {
  const { data, status } = useSession()
  const session = data as CustomSession | null
  const isAdmin = session?.user?.role === Roles.ADMIN

  const t = useTranslations('common.menu')

  if (status === 'loading' || !isAdmin) return null

  const adminItems = [...adminSidebarMenu, ...adminInnerMenuItems]

  return (
    <nav aria-label="Admin sitemap" className="mt-6 w-full max-w-4xl">
      <div className="space-y-2">
        <h4>{t('sectionAdmin')}</h4>
        <ul className="grid grid-cols-2 gap-x-default gap-y-1 md:grid-cols-3">
          {adminItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-xs text-textcolor-state hover:text-tertiary hover:underline"
              >
                {item.icon && iconMapSitemap[item.icon]}
                <span>{t(item.key)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
