'use client'

import { Building2, Languages, ShieldCheck, Speech, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { DashboardItem } from '@/components/admin/DashboardItem'
import { Routes } from '@/constants/routes'

const companyLinks = [
  { href: Routes.COMPANY_GLOBAL_ADMIN, icon: Building2, key: 'companies' },
  { href: Routes.COMPANY_ADMIN, icon: ShieldCheck, key: 'companyAdmin' },
  { href: Routes.COMPANY_MANAGER, icon: Users, key: 'companyManager' },
] as const

const toolLinks = [
  { href: `${Routes.ADMIN}/translation-model-checks`, icon: Languages, key: 'translationModelChecks' },
  { href: `${Routes.ADMIN}/translate-service`, icon: Languages, key: 'translateService' },
  { href: `${Routes.ADMIN}/speech-demo`, icon: Speech, key: 'speechDemo' },
] as const

export default function AdminDashboardPage() {
  const t = useTranslations('pages.Admin.dashboard')

  return (
    <div className="dashboard">
      <section>
        <h2>{t('companySection')}</h2>

        <div className="panel">
          {companyLinks.map(({ href, icon: Icon, key }) => (
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

      <section>
        <h2>{t('toolsSection')}</h2>

        <div className="panel">
          {toolLinks.map(({ href, icon: Icon, key }) => (
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
