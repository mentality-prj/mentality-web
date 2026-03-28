'use client'

import { Plus, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

const links = [
  { href: Routes.COMPANY_GLOBAL_ADMIN, icon: Plus, key: 'createCompany' },
  { href: Routes.COMPANY_ADMIN, icon: Users, key: 'companyAdmin' },
] as const

export default function AdminDashboardPage() {
  const t = useTranslations('pages.Admin.dashboard')

  return (
    <div className="flex flex-col gap-lg">
      <h2 className="text-lg font-semibold">{t('companySection')}</h2>

      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        {links.map(({ href, icon: Icon, key }) => (
          <Link
            key={href}
            href={href}
            className="p-lg flex items-start gap-md rounded-lg border border-border transition-colors hover:border-primary hover:bg-background-alt"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background-alt text-primary">
              <Icon size={20} />
            </span>
            <div className="flex flex-col gap-xs">
              <span className="font-medium text-textcolor-primary">{t(`${key}.title`)}</span>
              <span className="text-sm text-textcolor-secondary">{t(`${key}.description`)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
