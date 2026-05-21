'use client'

import { FolderKanban, SquarePen } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { Routes } from '@/constants/routes'

export function ResearchWorkspaceMenu({ canCreateProjects = false }: { canCreateProjects?: boolean }) {
  const t = useTranslations('pages.Research')

  const items = [
    {
      key: 'projects',
      href: Routes.RESEARCH_PROJECTS,
      label: t('menu.projects'),
      icon: <FolderKanban size={16} className="icon" />,
    },
  ]

  if (canCreateProjects) {
    items.push({
      key: 'create',
      href: Routes.RESEARCH_PROJECTS_CREATE,
      label: t('menu.create'),
      icon: <SquarePen size={16} className="icon" />,
    })
  }

  return <InnerMenu items={items} />
}
