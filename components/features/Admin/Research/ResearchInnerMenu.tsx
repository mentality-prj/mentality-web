'use client'

import { BrainCircuit } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { Routes } from '@/constants/routes'

export function ResearchInnerMenu() {
  const t = useTranslations('pages.Admin')
  const items = [
    {
      key: 'dipWorkspace',
      href: `${Routes.ADMIN_DIP}/research`,
      label: t('dashboard.dipWorkspace.title'),
      icon: <BrainCircuit size={16} className="icon" />,
    },
  ]

  if (items.length < 2) {
    return null
  }

  return <InnerMenu items={items} />
}
