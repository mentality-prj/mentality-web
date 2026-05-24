import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectAuditPanel } from '@/components/features/Research/ResearchProjectAuditPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getResearchScientistOptions } from '@/helpers/researchScientists'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectAudit, getResearchProjectById } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

export default async function ResearchProjectAuditPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const session = await getServerSession()
  const t = await getTranslations('pages.Research')
  const projectResult = await getResearchProjectById(session as CustomSession, projectId)

  if ('error' in projectResult) {
    if (projectResult.status === 403) {
      return (
        <ResearchStateCard
          title={t('workspace.accessDeniedTitle')}
          description={t('workspace.accessDeniedDescription')}
        />
      )
    }

    notFound()
  }

  const auditResult = await getResearchProjectAudit(session as CustomSession, projectId)

  if ('error' in auditResult && auditResult.status === 403) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  const events = 'data' in auditResult ? auditResult.data : []
  // Filter to UUID-shaped IDs only — system/backend actors (e.g. "system") are not
  // employees and would cause getResearchScientistOptions to page through the entire
  // directory without finding a match.
  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const userActorIds = Array.from(new Set(events.map((event) => event.actorUserId).filter(Boolean))).filter((id) =>
    UUID_PATTERN.test(id)
  )
  const actorOptions = await getResearchScientistOptions(
    session,
    projectResult.data.companyId,
    userActorIds
  )
  const actorNamesById = Object.fromEntries(actorOptions.map((actor) => [actor.id, actor.name]))

  return <ResearchProjectAuditPanel events={events} actorNamesById={actorNamesById} />
}
