'use client'

import { MailPlus, Network, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { Routes } from '@/constants/routes'

type Props = {
  companyId: string
}

export function CompanyDetailInnerMenu({ companyId }: Props) {
  const t = useTranslations('pages.Company.globalAdmin.companyDetail')

  const items = [
    {
      key: 'groups',
      href: Routes.adminCompanyGroups(companyId),
      label: t('groupsTitle'),
      icon: <Network size={16} className="icon" />,
    },
    {
      key: 'employees',
      href: Routes.adminCompanyEmployees(companyId),
      label: t('employeesTitle'),
      icon: <Users size={16} className="icon" />,
    },
    {
      key: 'invites',
      href: Routes.adminCompanyInvites(companyId),
      label: t('inviteMenuTitle'),
      icon: <MailPlus size={16} className="icon" />,
    },
  ]

  return <InnerMenu items={items} />
}
