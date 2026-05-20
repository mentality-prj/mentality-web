'use client'

import { BrainCircuit } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { Routes } from '@/constants/routes'

export function ResearchInnerMenu() {
  const t = useTranslations('pages.Admin')
  const items = [
    {
      key: 'diagnostics',
      href: Routes.ADMIN_R_AND_D_DIAGNOSTICS,
      label: t('diagnostics.title'),
      icon: <BrainCircuit size={16} className="icon" />,
    },
  ]

  if (items.length < 2) {
    return null
  }

  return <InnerMenu items={items} />
}
