'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getResearchScientistLabel } from '@/helpers/researchScientists'
import { addResearchProjectMember, removeResearchProjectMember } from '@/requests/researchProjects'
import { ResearchProjectMember, ResearchScientistOption, ResearchWorkspaceRole } from '@/types/research'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import { ResearchStateCard } from './ResearchStateCard'

type Props = {
  projectId: string
  initialMembers: ResearchProjectMember[]
  availableMembers: ResearchScientistOption[]
  canManageMembers: boolean
}

const ROLE_OPTIONS: ResearchWorkspaceRole[] = ['owner', 'scientist', 'analyst', 'reviewer']

function getRoleLabel(t: ReturnType<typeof useTranslations<'pages.Research'>>, role: ResearchWorkspaceRole): string {
  switch (role) {
    case 'owner':
      return t('roles.owner')
    case 'research_admin':
      return t('roles.research_admin')
    case 'scientist':
      return t('roles.scientist')
    case 'analyst':
      return t('roles.analyst')
    case 'reviewer':
      return t('roles.reviewer')
    default:
      return role
  }
}

export function ResearchProjectMembersPanel({ projectId, initialMembers, availableMembers, canManageMembers }: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [members, setMembers] = useState(initialMembers)
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState<ResearchWorkspaceRole>('scientist')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const memberDirectory = new Map(availableMembers.map((member) => [member.id, member]))
  const selectableMembers = availableMembers.filter(
    (candidate) => !members.some((member) => member.userId === candidate.id)
  )

  function handleAddMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const result = await addResearchProjectMember(session, projectId, { userId, role })
      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      const selectedMember = memberDirectory.get(userId)

      setMembers((current) => [
        ...current,
        {
          ...result.data,
          name:
            result.data.name && result.data.name !== result.data.userId
              ? result.data.name
              : (selectedMember?.name ?? notAvailable),
          email: result.data.email || selectedMember?.email || '',
        },
      ])
      setUserId('')
      setRole('scientist')
    })
  }

  function handleRemoveMember(targetUserId: string) {
    setError('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const result = await removeResearchProjectMember(session, projectId, targetUserId)
      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setMembers((current) => current.filter((member) => member.userId !== targetUserId))
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.members.title')}</h2>
        <div className="mt-4 grid gap-3">
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border p-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-textcolor-primary">
                      {(member.name && member.name !== member.userId
                        ? member.name
                        : memberDirectory.get(member.userId)?.name) || notAvailable}
                    </p>
                    <Badge variant="secondary">{getRoleLabel(t, member.role)}</Badge>
                  </div>
                  <p className="text-xs text-textcolor-secondary">
                    {member.email || memberDirectory.get(member.userId)?.email || notAvailable}
                  </p>
                  {member.grants.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {member.grants.map((grant) => (
                        <Badge key={grant} variant="secondary">
                          {grant}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>

                {canManageMembers ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={isPending}
                  >
                    {t('common.remove')}
                  </Button>
                ) : null}
              </div>
            ))
          ) : (
            <ResearchStateCard
              title={t('panels.members.emptyTitle')}
              description={t('panels.members.emptyDescription')}
            />
          )}
        </div>
      </StaticCard>

      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.members.addTitle')}</h2>
        {!canManageMembers ? (
          <p className="mt-3 text-sm text-textcolor-secondary">{t('panels.members.noPermission')}</p>
        ) : (
          <form onSubmit={handleAddMember} className="mt-4 grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="member-user-id">{t('labels.userId')}</Label>
              {selectableMembers.length > 0 ? (
                <Select value={userId} onValueChange={setUserId} disabled={isPending}>
                  <SelectTrigger id="member-user-id">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {getResearchScientistLabel(member)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-textcolor-secondary">{notAvailable}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-role">{t('labels.role')}</Label>
              <Select value={role} onValueChange={(value) => setRole(value as ResearchWorkspaceRole)}>
                <SelectTrigger id="member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {getRoleLabel(t, option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPending || !userId.trim() || selectableMembers.length === 0}>
              {isPending ? t('common.saving') : t('panels.members.addButton')}
            </Button>
          </form>
        )}
        {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
      </StaticCard>
    </div>
  )
}
