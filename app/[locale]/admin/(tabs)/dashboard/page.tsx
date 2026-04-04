'use client'

import { Building2, ShieldCheck, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { DashboardItem } from '@/components/admin/DashboardItem'
import { Routes } from '@/constants/routes'

const links = [
  { href: Routes.COMPANY_GLOBAL_ADMIN, icon: Building2, key: 'companies' },
  { href: Routes.COMPANY_ADMIN, icon: ShieldCheck, key: 'companyAdmin' },
  { href: Routes.COMPANY_MANAGER, icon: Users, key: 'companyManager' },
] as const

export default function AdminDashboardPage() {
  const t = useTranslations('pages.Admin.dashboard')

  return (
    <div className="dashboard">
      <section>
        <h2>{t('companySection')}</h2>

        <div className="panel">
          {links.map(({ href, icon: Icon, key }) => (
            <DashboardItem
              key={href}
              href={href}
              icon={<Icon size={18} />}
              title={t(`${key}.title`)}
              subtitle={t(`${key}.description`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
