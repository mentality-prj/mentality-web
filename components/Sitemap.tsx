'use client'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { adminSidebarMenu, guideMenu, landingMenu, userSidebarMenu } from '@/constants/menu'
import { Link } from '@/i18n/navigation'
import { Roles } from '@/types/security'

type Access = 'public' | 'private' | 'admin'

export default function Sitemap() {
  const { data: session, status } = useSession()
  const isAuthenticated = !!session?.user
  const isAdmin = session?.user?.role === Roles.ADMIN

  const t = useTranslations('common.menu')

  const groups: { title: string; access: Access; items: Array<{ key: string; href: string }> }[] = [
    { title: 'Top', access: 'public', items: landingMenu },
    { title: 'User', access: 'private', items: userSidebarMenu },
    { title: 'Admin', access: 'admin', items: adminSidebarMenu },
    { title: 'Guide', access: 'private', items: guideMenu },
  ]

  const canShowGroup = (access: Access) => {
    if (access === 'public') return true
    if (access === 'private') return isAuthenticated
    if (access === 'admin') return isAdmin
    return false
  }

  const loading = status === 'loading'

  return (
    <nav aria-label="Sitemap" className="mt-6 w-full max-w-2xl">
      <div className="grid grid-cols-2 gap-6">
        {groups
          .filter((g) => !loading && canShowGroup(g.access))
          .map((g) => (
            <div key={g.title} className="space-y-2">
              <ul className="space-y-1">
                {g.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-textcolor-state hover:text-tertiary hover:underline">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </nav>
  )
}
