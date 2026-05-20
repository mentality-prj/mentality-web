'use client'

import { useState, useTransition } from 'react'
import { SquarePen } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getResearchScientistLabel, getResearchScientistName } from '@/helpers/researchScientists'
import { updateResearchProject } from '@/requests/researchProjects'
import { ResearchProject, ResearchProjectMutationInput, ResearchScientistOption } from '@/types/research'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

type Props = {
  project: ResearchProject
  principalInvestigatorOptions: ResearchScientistOption[]
}

function buildOverviewForm(project: ResearchProject): ResearchProjectMutationInput {
  return {
    companyId: project.companyId,
    name: project.name,
    description: project.description || project.objective,
    objective: project.objective || project.description,
    status: project.status,
    approvalStatus: project.approvalStatus,
    exportPolicy: project.exportPolicy,
    pseudonymizationMode: project.pseudonymizationMode,
    principalInvestigatorId: project.principalInvestigatorId,
    retentionUntil: project.retentionUntil,
    consentMode: project.consentMode,
  }
}

export function ResearchProjectOverview({ project, principalInvestigatorOptions }: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [form, setForm] = useState<ResearchProjectMutationInput>(() => buildOverviewForm(project))
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
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
    pending_review: t('options.approvalStatus.pending_review'),
    approved: t('options.approvalStatus.approved'),
    rejected: t('options.approvalStatus.rejected'),
  }
  const exportPolicyLabels: Record<string, string> = {
    blocked: t('options.exportPolicy.blocked'),
    review_required: t('options.exportPolicy.review_required'),
    allowed: t('options.exportPolicy.allowed'),
  }
  const pseudonymizationLabels: Record<string, string> = {
    required: t('options.pseudonymizationMode.required'),
    optional: t('options.pseudonymizationMode.optional'),
    none: t('options.pseudonymizationMode.none'),
  }
  const fallbackPrincipalInvestigatorName = project.members.find(
    (member) => member.userId === form.principalInvestigatorId
  )?.name
  const principalInvestigatorName = getResearchScientistName(
    principalInvestigatorOptions,
    form.principalInvestigatorId,
    fallbackPrincipalInvestigatorName
  )
  const resolvedPrincipalInvestigatorOptions =
    principalInvestigatorName &&
    form.principalInvestigatorId &&
    !principalInvestigatorOptions.some((option) => option.id === form.principalInvestigatorId)
      ? [
          {
            id: form.principalInvestigatorId,
            name: principalInvestigatorName,
            email: '',
          },
          ...principalInvestigatorOptions,
        ]
      : principalInvestigatorOptions
  const metadataRows = [
    {
      key: 'projectName',
      label: t('labels.projectName'),
      value: form.name || notAvailable,
    },
    {
      key: 'description',
      label: t('labels.description'),
      value: form.description || notAvailable,
      fullWidth: true,
    },
    {
      key: 'company',
      label: t('labels.company'),
      value: project.companyName || notAvailable,
    },
    {
      key: 'status',
      label: t('labels.status'),
      value: projectStatusLabels[form.status] || form.status || notAvailable,
    },
    {
      key: 'approvalStatus',
      label: t('labels.approvalStatus'),
      value: approvalStatusLabels[form.approvalStatus] || form.approvalStatus || notAvailable,
    },
    {
      key: 'exportPolicy',
      label: t('labels.exportPolicy'),
      value: exportPolicyLabels[form.exportPolicy] || form.exportPolicy || notAvailable,
    },
    {
      key: 'pseudonymizationMode',
      label: t('labels.pseudonymizationMode'),
      value: pseudonymizationLabels[form.pseudonymizationMode] || form.pseudonymizationMode || notAvailable,
    },
    {
      key: 'principalInvestigator',
      label: t('labels.principalInvestigator'),
      value: principalInvestigatorName || notAvailable,
    },
  ]

  function updateField<Key extends keyof ResearchProjectMutationInput>(
    key: Key,
    value: ResearchProjectMutationInput[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const result = await updateResearchProject(session, project.id, form)

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setSuccess(t('panels.overview.updateSuccess'))
      setIsEditing(false)
    })
  }

  function handleStartEditing() {
    setError('')
    setSuccess('')
    setIsEditing(true)
  }

  function handleCancelEditing() {
    setForm(buildOverviewForm(project))
    setError('')
    setSuccess('')
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <StaticCard>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.overview.metadataTitle')}</h2>
          {project.permissions.canUpdateProject && !isEditing ? (
            <button
              type="button"
              onClick={handleStartEditing}
              aria-label={t('panels.overview.editButton')}
              title={t('panels.overview.editButton')}
              className="rounded-full p-2 text-textcolor-secondary transition-colors hover:bg-background-alt hover:text-textcolor-primary"
            >
              <SquarePen size={16} />
            </button>
          ) : null}
        </div>
        {!isEditing ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {metadataRows.map((row) => (
              <div key={row.key} className={row.fullWidth ? 'md:col-span-2' : undefined}>
                <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{row.label}</p>
                <p className="mt-1 text-sm text-textcolor-primary">{row.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="overview-name">{t('labels.projectName')}</Label>
                <Input
                  id="overview-name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="overview-description">{t('labels.description')}</Label>
                <Textarea
                  id="overview-description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('labels.status')}</Label>
                <Select value={form.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t('statuses.project.draft')}</SelectItem>
                    <SelectItem value="active">{t('statuses.project.active')}</SelectItem>
                    <SelectItem value="paused">{t('statuses.project.paused')}</SelectItem>
                    <SelectItem value="completed">{t('statuses.project.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('labels.approvalStatus')}</Label>
                <Select value={form.approvalStatus} onValueChange={(value) => updateField('approvalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t('options.approvalStatus.draft')}</SelectItem>
                    <SelectItem value="pending_review">{t('options.approvalStatus.pending_review')}</SelectItem>
                    <SelectItem value="approved">{t('options.approvalStatus.approved')}</SelectItem>
                    <SelectItem value="rejected">{t('options.approvalStatus.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('labels.exportPolicy')}</Label>
                <Select value={form.exportPolicy} onValueChange={(value) => updateField('exportPolicy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blocked">{t('options.exportPolicy.blocked')}</SelectItem>
                    <SelectItem value="review_required">{t('options.exportPolicy.review_required')}</SelectItem>
                    <SelectItem value="allowed">{t('options.exportPolicy.allowed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('labels.pseudonymizationMode')}</Label>
                <Select
                  value={form.pseudonymizationMode}
                  onValueChange={(value) => updateField('pseudonymizationMode', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">{t('options.pseudonymizationMode.required')}</SelectItem>
                    <SelectItem value="optional">{t('options.pseudonymizationMode.optional')}</SelectItem>
                    <SelectItem value="none">{t('options.pseudonymizationMode.none')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t('labels.principalInvestigator')}</Label>
                {resolvedPrincipalInvestigatorOptions.length > 0 ? (
                  <Select
                    value={form.principalInvestigatorId}
                    onValueChange={(value) => updateField('principalInvestigatorId', value)}
                    disabled={isPending}
                  >
                    <SelectTrigger id="overview-pi">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resolvedPrincipalInvestigatorOptions.map((scientist) => (
                        <SelectItem key={scientist.id} value={scientist.id}>
                          {getResearchScientistLabel(scientist)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-textcolor-primary">{principalInvestigatorName || notAvailable}</p>
                )}
              </div>
            </div>

            {error ? <p className="text-danger text-sm">{error}</p> : null}
            {success ? <p className="text-sm text-success">{success}</p> : null}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleCancelEditing} disabled={isPending}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('common.saving') : t('panels.overview.saveButton')}
              </Button>
            </div>
          </form>
        )}

        {!isEditing && error ? <p className="text-danger mt-4 text-sm">{error}</p> : null}
        {!isEditing && success ? <p className="mt-4 text-sm text-success">{success}</p> : null}
      </StaticCard>

      {Object.keys(project.metadata).length > 0 ? (
        <StaticCard>
          <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.overview.governanceTitle')}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(project.metadata).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-border px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{key}</p>
                <p className="mt-1 text-sm text-textcolor-primary">{value || notAvailable}</p>
              </div>
            ))}
          </div>
        </StaticCard>
      ) : null}
    </div>
  )
}
