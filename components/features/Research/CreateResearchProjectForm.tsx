'use client'

import { useEffect, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getResearchScientistLabel } from '@/helpers/researchScientists'
import { useRouter } from '@/i18n/navigation'
import { createResearchProject } from '@/requests/researchProjects'
import { ResearchProjectMutationInput, ResearchScopedScientistOption, ResearchWorkspaceAccess } from '@/types/research'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

import { ResearchStateCard } from './ResearchStateCard'

type Props = {
  access: ResearchWorkspaceAccess
  principalInvestigatorOptions: ResearchScopedScientistOption[]
}

function buildInitialForm(companyId: string, principalInvestigatorId = ''): ResearchProjectMutationInput {
  return {
    companyId,
    name: '',
    description: '',
    objective: '',
    status: 'draft',
    approvalStatus: 'draft',
    exportPolicy: 'review_required',
    pseudonymizationMode: 'required',
    principalInvestigatorId,
    retentionUntil: null,
    consentMode: 'company_boundary_only',
  }
}

export function CreateResearchProjectForm({ access, principalInvestigatorOptions }: Props) {
  const { session } = useAuth()
  const router = useRouter()
  const t = useTranslations('pages.Research')
  const initialCompanyId = access.companies[0]?.id ?? ''
  const [form, setForm] = useState<ResearchProjectMutationInput>(() => buildInitialForm(initialCompanyId))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const companyScientistOptions = principalInvestigatorOptions.filter((option) => option.companyId === form.companyId)

  useEffect(() => {
    if (companyScientistOptions.length === 0) {
      if (form.principalInvestigatorId) {
        setForm((current) => ({ ...current, principalInvestigatorId: '' }))
      }

      return
    }

    if (
      form.principalInvestigatorId &&
      !companyScientistOptions.some((option) => option.id === form.principalInvestigatorId)
    ) {
      setForm((current) => ({ ...current, principalInvestigatorId: '' }))
    }
  }, [companyScientistOptions, form.principalInvestigatorId])

  if (!access.canCreateProjects) {
    return <ResearchStateCard title={t('workspace.accessDeniedTitle')} description={t('create.accessDenied')} />
  }

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

      const result = await createResearchProject(session, form)

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setSuccess(t('panels.create.success'))
      router.push(Routes.researchProjectDashboard(result.data.id))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label>{t('labels.company')}</Label>
          <Select value={form.companyId} onValueChange={(value) => updateField('companyId', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {access.companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="research-project-name">{t('labels.projectName')}</Label>
          <Input
            id="research-project-name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="research-project-description">{t('labels.description')}</Label>
          <Textarea
            id="research-project-description"
            rows={4}
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            disabled={isPending}
            required
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
              <SelectItem value="archived">{t('statuses.project.archived')}</SelectItem>
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
          {companyScientistOptions.length > 0 ? (
            <Select
              value={form.principalInvestigatorId}
              onValueChange={(value) => updateField('principalInvestigatorId', value)}
              disabled={isPending}
            >
              <SelectTrigger id="research-project-pi">
                <SelectValue placeholder={t('create.principalInvestigatorPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {companyScientistOptions.map((scientist) => (
                  <SelectItem key={scientist.id} value={scientist.id}>
                    {getResearchScientistLabel(scientist)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-textcolor-secondary">{notAvailable}</p>
          )}
        </div>
      </div>

      {error ? <p className="text-danger text-sm">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending || !form.principalInvestigatorId}>
          {isPending ? t('common.creating') : t('create.title')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(Routes.RESEARCH_PROJECTS)}
          disabled={isPending}
        >
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
}
