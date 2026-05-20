'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { createResearchProjectGrant } from '@/requests/researchProjects'
import { ResearchProjectGrant, ResearchProjectGrantInput, ResearchProjectGroup } from '@/types/research'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Switch } from '@/ui/switch'

import { ResearchMultiSelectField } from './ResearchMultiSelectField'

type Props = {
  projectId: string
  initialGrants: ResearchProjectGrant[]
  availableGroups: ResearchProjectGroup[]
  canManageGrants: boolean
  suggestedFields?: string[]
}

const EMPTY_GRANT: ResearchProjectGrantInput = {
  allowedContracts: [] as string[],
  allowedFields: [] as string[],
  allowedTargets: [] as string[],
  groupIds: [] as string[],
  userSelectionMode: 'all',
  pseudonymizationMode: 'required',
  from: null,
  to: null,
  exportAllowed: false,
}

export function ResearchProjectGrantsPanel({
  projectId,
  initialGrants,
  availableGroups,
  canManageGrants,
  suggestedFields = [],
}: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [grants, setGrants] = useState(initialGrants)
  const [form, setForm] = useState(EMPTY_GRANT)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const selectionModeLabels: Record<string, string> = {
    all: t('options.userSelectionMode.all'),
    groups_only: t('options.userSelectionMode.groups_only'),
    explicit_users: t('options.userSelectionMode.explicit_users'),
  }
  const pseudonymizationLabels: Record<string, string> = {
    required: t('options.pseudonymizationMode.required'),
    optional: t('options.pseudonymizationMode.optional'),
    none: t('options.pseudonymizationMode.none'),
  }
  const notAvailable = t('common.notAvailable')
  const groupNamesById = new Map(availableGroups.map((group) => [group.id, group.name]))

  function toggleGroup(groupId: string) {
    setForm((current) => ({
      ...current,
      groupIds: current.groupIds.includes(groupId)
        ? current.groupIds.filter((item) => item !== groupId)
        : [...current.groupIds, groupId],
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const payload = {
        ...form,
        groupIds: Array.from(new Set(form.groupIds)),
        from: form.from,
        to: form.to,
      }

      const result = await createResearchProjectGrant(session, projectId, payload)
      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setGrants((current) => [result.data, ...current])
      setForm(EMPTY_GRANT)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.grants.currentTitle')}</h2>
        <div className="mt-4 grid gap-3">
          {grants.length > 0 ? (
            grants.map((grant) => (
              <div key={grant.id} className="rounded-2xl border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium text-textcolor-primary">{grant.title}</p>
                  <Badge variant="secondary">
                    {grant.exportAllowed ? t('panels.grants.exportAllowedBadge') : t('panels.grants.noExportBadge')}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <p className="text-sm text-textcolor-secondary">
                    {t('labels.allowedContracts')}: {grant.allowedContracts.join(', ') || notAvailable}
                  </p>
                  <p className="text-sm text-textcolor-secondary">
                    {t('labels.allowedTargets')}: {grant.allowedTargets.join(', ') || notAvailable}
                  </p>
                  <p className="text-sm text-textcolor-secondary">
                    {t('labels.allowedFields')}: {grant.allowedFields.join(', ') || notAvailable}
                  </p>
                  <p className="text-sm text-textcolor-secondary">
                    {t('labels.groupIds')}:{' '}
                    {grant.groupIds.map((groupId) => groupNamesById.get(groupId) || notAvailable).join(', ') ||
                      notAvailable}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-textcolor-secondary">{t('panels.grants.empty')}</p>
          )}
        </div>
      </StaticCard>

      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.grants.createTitle')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <ResearchMultiSelectField
            label={t('labels.allowedFields')}
            values={form.allowedFields}
            onChange={(values) => setForm((current) => ({ ...current, allowedFields: values }))}
            options={suggestedFields}
            disabled={!canManageGrants || isPending}
            placeholder={t('panels.grants.allowedFieldsPlaceholder')}
          />

          <ResearchMultiSelectField
            label={t('labels.allowedContracts')}
            values={form.allowedContracts}
            onChange={(values) => setForm((current) => ({ ...current, allowedContracts: values }))}
            disabled={!canManageGrants || isPending}
            placeholder={t('panels.grants.allowedContractsPlaceholder')}
          />

          <ResearchMultiSelectField
            label={t('labels.allowedTargets')}
            values={form.allowedTargets}
            onChange={(values) => setForm((current) => ({ ...current, allowedTargets: values }))}
            disabled={!canManageGrants || isPending}
            placeholder={t('panels.grants.allowedTargetsPlaceholder')}
          />

          {availableGroups.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-textcolor-primary">{t('labels.groupIds')}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {availableGroups.map((group) => (
                  <div key={group.id} className="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
                    <Checkbox
                      id={`grant-group-${group.id}`}
                      checked={form.groupIds.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                      disabled={!canManageGrants || isPending}
                    />
                    <Label htmlFor={`grant-group-${group.id}`} className="flex-1 cursor-pointer">
                      <p className="text-sm font-medium text-textcolor-primary">{group.name}</p>
                      <p className="text-xs text-textcolor-secondary">{group.type}</p>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('labels.userSelectionMode')}</Label>
              <Select
                value={form.userSelectionMode}
                onValueChange={(value) => setForm((current) => ({ ...current, userSelectionMode: value }))}
                disabled={!canManageGrants || isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{selectionModeLabels.all}</SelectItem>
                  <SelectItem value="groups_only">{selectionModeLabels.groups_only}</SelectItem>
                  <SelectItem value="explicit_users">{selectionModeLabels.explicit_users}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('labels.pseudonymizationMode')}</Label>
              <Select
                value={form.pseudonymizationMode}
                onValueChange={(value) => setForm((current) => ({ ...current, pseudonymizationMode: value }))}
                disabled={!canManageGrants || isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">{pseudonymizationLabels.required}</SelectItem>
                  <SelectItem value="optional">{pseudonymizationLabels.optional}</SelectItem>
                  <SelectItem value="none">{pseudonymizationLabels.none}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grant-from">{t('labels.from')}</Label>
              <Input
                id="grant-from"
                type="date"
                value={form.from ?? ''}
                onChange={(event) =>
                  setForm((current) => ({ ...current, from: event.target.value ? event.target.value : null }))
                }
                disabled={!canManageGrants || isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-to">{t('labels.to')}</Label>
              <Input
                id="grant-to"
                type="date"
                value={form.to ?? ''}
                onChange={(event) =>
                  setForm((current) => ({ ...current, to: event.target.value ? event.target.value : null }))
                }
                disabled={!canManageGrants || isPending}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-textcolor-primary">{t('labels.exportAllowed')}</p>
              <p className="text-xs text-textcolor-secondary">{t('panels.grants.exportAllowedDescription')}</p>
            </div>
            <Switch
              checked={form.exportAllowed}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, exportAllowed: checked }))}
              disabled={!canManageGrants || isPending}
            />
          </div>

          {error ? <p className="text-danger text-sm">{error}</p> : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={!canManageGrants || isPending}>
              {isPending ? t('common.saving') : t('panels.grants.createButton')}
            </Button>
          </div>
        </form>
      </StaticCard>
    </div>
  )
}
