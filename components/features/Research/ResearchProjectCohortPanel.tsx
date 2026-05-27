'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { updateResearchProjectCohort } from '@/requests/researchProjects'
import { ResearchProjectCohort, ResearchProjectCohortInput, ResearchProjectGroup } from '@/types/research'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

type Props = {
  projectId: string
  initialCohort: ResearchProjectCohort | null
  availableGroups: ResearchProjectGroup[]
  canManageCohort: boolean
}

export function ResearchProjectCohortPanel({ projectId, initialCohort, availableGroups, canManageCohort }: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [groupIds, setGroupIds] = useState(initialCohort?.groupIds ?? [])
  const [userSelectionMode, setUserSelectionMode] = useState(initialCohort?.userSelectionMode ?? 'all')
  const [from, setFrom] = useState(initialCohort?.from ?? '')
  const [to, setTo] = useState(initialCohort?.to ?? '')
  const [resolvedGroupIds, setResolvedGroupIds] = useState(initialCohort?.resolvedGroupIds ?? [])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const selectionModeLabels: Record<string, string> = {
    all: t('options.userSelectionMode.all'),
    groups_only: t('options.userSelectionMode.groups_only'),
    explicit_users: t('options.userSelectionMode.explicit_users'),
  }
  const groupNamesById = new Map(availableGroups.map((group) => [group.id, group.name]))
  const selectedGroupLabels = groupIds.map((groupId) => groupNamesById.get(groupId) || notAvailable)
  const resolvedGroupLabels = resolvedGroupIds.map((groupId) => groupNamesById.get(groupId) || notAvailable)

  function toggleGroup(groupId: string) {
    setGroupIds((current) =>
      current.includes(groupId) ? current.filter((item) => item !== groupId) : [...current, groupId]
    )
  }

  function getSelectionModeLabel(value: string): string {
    switch (value) {
      case 'all':
        return selectionModeLabels.all
      case 'groups_only':
        return selectionModeLabels.groups_only
      case 'explicit_users':
        return selectionModeLabels.explicit_users
      default:
        return value || notAvailable
    }
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const nextGroupIds = Array.from(new Set(groupIds))
      const payload: ResearchProjectCohortInput = {
        groupIds: nextGroupIds,
        userSelectionMode,
        from: from || null,
        to: to || null,
      }
      const result = await updateResearchProjectCohort(session, projectId, payload)

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setGroupIds(result.data?.groupIds ?? nextGroupIds)
      setResolvedGroupIds(result.data?.resolvedGroupIds ?? [])
      setSuccess(t('panels.cohort.updateSuccess'))
    })
  }

  return (
    <form onSubmit={handleSave} className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <StaticCard className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.cohort.title')}</h2>

        {canManageCohort && availableGroups.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-textcolor-primary">{t('labels.availableGroups')}</p>
            <div className="grid gap-3 md:grid-cols-2">
              {availableGroups.map((group) => (
                <div key={group.id} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                  <Checkbox
                    id={`cohort-group-${group.id}`}
                    checked={groupIds.includes(group.id)}
                    onCheckedChange={() => toggleGroup(group.id)}
                    disabled={!canManageCohort || isPending}
                  />
                  <Label htmlFor={`cohort-group-${group.id}`} className="flex-1 cursor-pointer">
                    <p className="text-sm font-medium text-textcolor-primary">{group.name}</p>
                    <p className="text-xs text-textcolor-secondary">{group.type}</p>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {canManageCohort ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="cohort-user-selection-mode">{t('labels.userSelectionMode')}</Label>
              <Select value={userSelectionMode} onValueChange={setUserSelectionMode} disabled={isPending}>
                <SelectTrigger id="cohort-user-selection-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{selectionModeLabels.all}</SelectItem>
                  <SelectItem value="groups_only">{selectionModeLabels.groups_only}</SelectItem>
                  <SelectItem value="explicit_users">{selectionModeLabels.explicit_users}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cohort-from">{t('labels.from')}</Label>
                <Input
                  id="cohort-from"
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cohort-to">{t('labels.to')}</Label>
                <Input
                  id="cohort-to"
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">
                {t('labels.userSelectionMode')}
              </p>
              <p className="mt-1 text-sm text-textcolor-primary">{getSelectionModeLabel(userSelectionMode)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.from')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{from || notAvailable}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.to')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{to || notAvailable}</p>
            </div>
          </div>
        )}

        {error ? <p className="text-danger text-sm">{error}</p> : null}
        {success ? <p className="text-sm text-success">{success}</p> : null}

        {canManageCohort ? (
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? t('common.saving') : t('panels.cohort.saveButton')}
            </Button>
          </div>
        ) : null}
      </StaticCard>

      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.cohort.previewTitle')}</h2>
        <div className="mt-4 grid gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.groupIds')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedGroupLabels.length > 0 ? (
                selectedGroupLabels.map((groupLabel, index) => (
                  <Badge key={`${groupLabel}-${index}`} variant="secondary">
                    {groupLabel}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-textcolor-secondary">{t('panels.cohort.noGroupsSelected')}</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.resolvedGroupIds')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {resolvedGroupLabels.length > 0 ? (
                resolvedGroupLabels.map((groupLabel, index) => (
                  <Badge key={`${groupLabel}-${index}`} variant="secondary">
                    {groupLabel}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-textcolor-secondary">{t('panels.cohort.noResolvedGroups')}</span>
              )}
            </div>
          </div>
        </div>
      </StaticCard>
    </form>
  )
}
