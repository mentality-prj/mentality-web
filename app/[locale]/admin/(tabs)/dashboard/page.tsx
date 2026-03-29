'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { DashboardItem } from '@/components/admin/DashboardItem'
import { Routes } from '@/constants/routes'

const links = [{ href: Routes.COMPANY_GLOBAL_ADMIN, icon: Plus, key: 'createCompany' }] as const

export default function AdminDashboardPage() {
  const t = useTranslations('pages.Admin.dashboard')

  return (
    <div className="flex flex-col gap-lg">
      <h2 className="text-lg font-semibold">{t('companySection')}</h2>

      <div className="flex flex-col gap-sm">
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
    </div>
  )
}
