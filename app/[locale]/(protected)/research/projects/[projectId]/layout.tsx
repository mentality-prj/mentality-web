import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectInnerMenu } from '@/components/features/Research/ResearchProjectInnerMenu'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { getServerSession } from '@/lib/auth/server'
import { getEmployees, getEmployeesAdmin } from '@/requests/employees'
import { getResearchProjectById } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

async function getPrincipalInvestigatorName(
  session: CustomSession,
  companyId: string,
  principalInvestigatorId: string,
  members: Array<{ userId: string; name: string }> = []
): Promise<string | null> {
  const projectMember = members.find(
    (member) => member.userId === principalInvestigatorId && member.name && member.name !== principalInvestigatorId
  )

  if (projectMember?.name) {
    return projectMember.name
  }

  if (!companyId || !principalInvestigatorId) {
    return null
  }

  const limit = 100
  let page = 1
  let total = Number.POSITIVE_INFINITY

  while ((page - 1) * limit < total) {
    const employeesResult =
      session.user?.role === 'admin'
        ? await getEmployeesAdmin(session, companyId, page, limit)
        : await getEmployees(session, companyId, page, limit)

    if ('error' in employeesResult) {
      return null
    }

    total = employeesResult.data.total

    const employee = employeesResult.data.items.find((item) => item.id === principalInvestigatorId)
    if (employee?.name) {
      return employee.name
    }

    if (employeesResult.data.items.length === 0) {
      break
    }

    page += 1
  }

  return null
}

export default async function ResearchProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const result = await getResearchProjectById(session as CustomSession, projectId)
  const notAvailable = t('common.notAvailable')
  const projectStatusLabels: Record<string, string> = {
    draft: t('statuses.project.draft'),
    active: t('statuses.project.active'),
    paused: t('statuses.project.paused'),
    completed: t('statuses.project.completed'),
    archived: t('statuses.project.archived'),
  }
  const approvalStatusLabels: Record<string, string> = {
    draft: t('options.approvalStatus.draft'),
    pending: t('options.approvalStatus.pending'),
    pending_review: t('options.approvalStatus.pending_review'),
    approved: t('options.approvalStatus.approved'),
    rejected: t('options.approvalStatus.rejected'),
  }
  const exportPolicyLabels: Record<string, string> = {
    blocked: t('options.exportPolicy.blocked'),
    review_required: t('options.exportPolicy.review_required'),
    allowed: t('options.exportPolicy.allowed'),
    inline_ready: t('options.exportPolicy.inline_ready'),
    disabled: t('options.exportPolicy.disabled'),
  }
  const pseudonymizationLabels: Record<string, string> = {
    required: t('options.pseudonymizationMode.required'),
    optional: t('options.pseudonymizationMode.optional'),
    none: t('options.pseudonymizationMode.none'),
    pseudonymous: t('options.pseudonymizationMode.pseudonymous'),
    aggregated: t('options.pseudonymizationMode.aggregated'),
    raw_granted: t('options.pseudonymizationMode.raw_granted'),
  }

  if ('error' in result) {
    if (result.status === 403) {
      return (
        <ResearchStateCard
          title={t('workspace.accessDeniedTitle')}
          description={t('workspace.accessDeniedDescription')}
        />
      )
    }

    notFound()
  }

  const project = result.data
  const principalInvestigatorName = await getPrincipalInvestigatorName(
    session as CustomSession,
    project.companyId,
    project.principalInvestigatorId,
    project.members
  )
  const summaryRows = [
    { label: t('labels.company'), value: project.companyName || notAvailable },
    { label: t('labels.status'), value: projectStatusLabels[project.status] || project.status || notAvailable },
    {
      label: t('labels.approvalStatus'),
      value: approvalStatusLabels[project.approvalStatus] || project.approvalStatus || notAvailable,
    },
    {
      label: t('labels.exportPolicy'),
      value: exportPolicyLabels[project.exportPolicy] || project.exportPolicy || notAvailable,
    },
    {
      label: t('labels.pseudonymizationMode'),
      value: pseudonymizationLabels[project.pseudonymizationMode] || project.pseudonymizationMode || notAvailable,
    },
    {
      label: t('labels.principalInvestigator'),
      value: principalInvestigatorName || notAvailable,
    },
  ]

  return (
    <div className="flex flex-col gap-lg">
      <StaticCard className="w-full max-w-full lg:w-[50vw]">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-textcolor-primary">{project.name}</h2>
            <p className="mt-2 text-sm text-textcolor-secondary">
              {project.description || project.objective || t('project.noDescription')}
            </p>
          </div>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-textcolor-primary">
              {t('panels.overview.metadataTitle')}
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-sm">
                <tbody className="divide-y divide-border">
                  {summaryRows.map((row) => (
                    <tr key={row.label} className="align-top">
                      <th
                        scope="row"
                        className="w-44 bg-slate-50/70 px-4 py-3 text-left font-medium text-textcolor-secondary"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-3 text-textcolor-primary">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </StaticCard>

      <ResearchProjectInnerMenu projectId={project.id} />
      {children}
    </div>
  )
}
