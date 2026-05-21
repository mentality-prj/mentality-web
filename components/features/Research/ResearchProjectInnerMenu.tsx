'use client'

import { Database, FolderKanban, ScrollText, ShieldCheck, Telescope, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { InnerMenu } from '@/components/shared/InnerMenu'
import { Routes } from '@/constants/routes'

type Props = {
  projectId: string
}

export function ResearchProjectInnerMenu({ projectId }: Props) {
  const t = useTranslations('pages.Research')

  return (
    <InnerMenu
      items={[
        {
          key: 'overview',
          href: Routes.researchProjectDashboard(projectId),
          label: t('project.menu.overview'),
          icon: <FolderKanban size={16} className="icon" />,
        },
        {
          key: 'members',
          href: Routes.researchProjectMembers(projectId),
          label: t('project.menu.members'),
          icon: <Users size={16} className="icon" />,
        },
        {
          key: 'cohort',
          href: Routes.researchProjectCohort(projectId),
          label: t('project.menu.cohort'),
          icon: <FolderKanban size={16} className="icon" />,
        },
        {
          key: 'grants',
          href: Routes.researchProjectGrants(projectId),
          label: t('project.menu.grants'),
          icon: <ShieldCheck size={16} className="icon" />,
        },
        {
          key: 'mlInspection',
          href: Routes.researchProjectDiagnostics(projectId),
          label: t('project.menu.mlInspection'),
          icon: <Telescope size={16} className="icon" />,
        },
        {
          key: 'historyDataset',
          href: Routes.researchProjectDatasets(projectId),
          label: t('project.menu.historyDataset'),
          icon: <Database size={16} className="icon" />,
        },
        {
          key: 'exports',
          href: Routes.researchProjectExports(projectId),
          label: t('project.menu.exports'),
          icon: <ShieldCheck size={16} className="icon" />,
        },
        {
          key: 'audit',
          href: Routes.researchProjectAudit(projectId),
          label: t('project.menu.audit'),
          icon: <ScrollText size={16} className="icon" />,
        },
      ]}
    />
  )
}
