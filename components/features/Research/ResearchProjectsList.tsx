'use client'

import { BrainCircuit } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { DashboardItem } from '@/components/admin/DashboardItem'
import { Routes } from '@/constants/routes'
import { ResearchProject } from '@/types/research'
import { Badge } from '@/ui/badge'

function getProjectStatusPresentation(
  t: ReturnType<typeof useTranslations<'pages.Research'>>,
  status: string
): { badgeClassName: string; label: string } {
  switch (status) {
    case 'draft':
      return { badgeClassName: 'bg-slate-100 text-slate-700', label: t('statuses.project.draft') }
    case 'active':
      return { badgeClassName: 'bg-emerald-100 text-emerald-700', label: t('statuses.project.active') }
    case 'paused':
      return { badgeClassName: 'bg-amber-100 text-amber-700', label: t('statuses.project.paused') }
    case 'completed':
      return { badgeClassName: 'bg-sky-100 text-sky-700', label: t('statuses.project.completed') }
    case 'archived':
      return { badgeClassName: 'bg-zinc-100 text-zinc-700', label: t('statuses.project.archived') }
    default:
      return {
        badgeClassName: 'bg-slate-100 text-slate-700',
        label: status || t('common.notAvailable'),
      }
  }
}

function formatProjectDate(value: string, locale: string): string | null {
  if (!value) {
    return null
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toLocaleDateString(locale, { timeZone: 'UTC' })
}

function buildProjectSubtitle(
  t: ReturnType<typeof useTranslations<'pages.Research'>>,
  locale: string,
  project: ResearchProject
): string {
  const companyLabel = project.companyName || t('common.notAvailable')
  const startDateLabel = formatProjectDate(project.startsAt, locale)
  const endDateLabel = formatProjectDate(project.endsAt, locale)
  const dateRangeLabel =
    startDateLabel && endDateLabel
      ? `${startDateLabel} - ${endDateLabel}`
      : startDateLabel || endDateLabel || t('common.notAvailable')

  return `${companyLabel} · ${dateRangeLabel}`
}

type Props = {
  projects: ResearchProject[]
}

export function ResearchProjectsList({ projects }: Props) {
  const t = useTranslations('pages.Research')
  const locale = useLocale()

  if (projects.length === 0) {
    return <p className="text-sm text-textcolor-secondary">{t('projects.empty')}</p>
  }

  return (
    <ul className="flex flex-col gap-sm">
      {projects.map((project) => {
        const statusPresentation = getProjectStatusPresentation(t, project.status)

        return (
          <li key={project.id}>
            <DashboardItem
              href={Routes.researchProjectDashboard(project.id)}
              icon={<BrainCircuit size={18} />}
              title={project.name}
              subtitle={buildProjectSubtitle(t, locale, project)}
              badge={<Badge className={statusPresentation.badgeClassName}>{statusPresentation.label}</Badge>}
            />
          </li>
        )
      })}
    </ul>
  )
}
