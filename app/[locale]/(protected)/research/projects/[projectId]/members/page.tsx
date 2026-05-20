import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ResearchProjectMembersPanel } from '@/components/features/Research/ResearchProjectMembersPanel'
import { ResearchStateCard } from '@/components/features/Research/ResearchStateCard'
import { getResearchScientistOptions } from '@/helpers/researchScientists'
import { getServerSession } from '@/lib/auth/server'
import { getResearchProjectById, getResearchProjectMembers } from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'
import { ResearchProjectMember } from '@/types/research'

type MemberDirectoryEntry = {
  name: string
  email: string
}

function enrichProjectMembers(
  members: ResearchProjectMember[],
  fallbackMembers: ResearchProjectMember[],
  memberDirectory: Map<string, MemberDirectoryEntry>
): ResearchProjectMember[] {
  if (members.length === 0 || fallbackMembers.length === 0) {
    return members.map((member) => {
      const directoryEntry = memberDirectory.get(member.userId)

      return {
        ...member,
        name: member.name && member.name !== member.userId ? member.name : (directoryEntry?.name ?? member.name),
        email: member.email || directoryEntry?.email || '',
      }
    })
  }

  const fallbackByUserId = new Map(fallbackMembers.map((member) => [member.userId, member]))

  return members.map((member) => {
    const fallbackMember = fallbackByUserId.get(member.userId)
    const directoryEntry = memberDirectory.get(member.userId)

    if (!fallbackMember) {
      return member
    }

    return {
      ...member,
      name: member.name && member.name !== member.userId ? member.name : (directoryEntry?.name ?? fallbackMember.name),
      email: member.email || directoryEntry?.email || fallbackMember.email,
      grants: member.grants.length > 0 ? member.grants : fallbackMember.grants,
      createdAt: member.createdAt ?? fallbackMember.createdAt,
    }
  })
}

export default async function ResearchProjectMembersPage({ params }: { params: Promise<{ projectId: string }> }) {
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

  const membersResult = await getResearchProjectMembers(session as CustomSession, projectId)

  if ('error' in membersResult && membersResult.status === 403) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('workspace.accessDeniedDescription')}
      />
    )
  }

  const members = 'data' in membersResult ? membersResult.data : []
  const availableMembers = await getResearchScientistOptions(session as CustomSession, projectResult.data.companyId)
  const memberDirectory = new Map<string, MemberDirectoryEntry>(
    availableMembers.map((member) => [member.id, { name: member.name, email: member.email }])
  )
  const initialMembers =
    'data' in membersResult ? enrichProjectMembers(members, projectResult.data.members, memberDirectory) : []

  return (
    <ResearchProjectMembersPanel
      projectId={projectId}
      initialMembers={initialMembers}
      availableMembers={availableMembers}
      canManageMembers={projectResult.data.permissions.canManageMembers}
    />
  )
}
