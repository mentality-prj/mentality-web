'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { getResearchProjectMLInspection } from '@/requests/researchProjects'
import { ResearchMLInspection, ResearchProjectGroup } from '@/types/research'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import { ResearchStateCard } from './ResearchStateCard'

type InspectionSubjectOption = {
  id: string
  label: string
}

type Props = {
  projectId: string
  projectName: string
  availableGroups: ResearchProjectGroup[]
  subjectOptions: InspectionSubjectOption[]
  canViewMlInspection: boolean
  initialInspection?: ResearchMLInspection | null
}

export function ResearchProjectMLInspectionPanel({
  projectId,
  projectName,
  availableGroups,
  subjectOptions,
  canViewMlInspection,
  initialInspection = null,
}: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [target, setTarget] = useState(initialInspection?.target || 'cohort')
  const [targetId, setTargetId] = useState(initialInspection?.targetId || '')
  const [modelVersion, setModelVersion] = useState(initialInspection?.modelVersion || '')
  const [inspection, setInspection] = useState<ResearchMLInspection | null>(initialInspection)
  const [emptyState, setEmptyState] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const groupNamesById = new Map(availableGroups.map((group) => [group.id, group.name]))
  const subjectLabelsById = new Map(subjectOptions.map((subject) => [subject.id, subject.label]))
  const needsTargetSelection = target === 'group' || target === 'subject'

  function getInspectionTargetLabel(inspection: ResearchMLInspection): string {
    switch (inspection.target) {
      case 'project':
        return projectName || notAvailable
      case 'cohort':
        return t('options.mlTarget.cohort')
      case 'group':
        return inspection.targetId ? groupNamesById.get(inspection.targetId) || notAvailable : notAvailable
      case 'subject':
        return inspection.targetId ? subjectLabelsById.get(inspection.targetId) || notAvailable : notAvailable
      default:
        return notAvailable
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setEmptyState(false)

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const result = await getResearchProjectMLInspection(session, projectId, {
        target,
        targetId: targetId || undefined,
        modelVersion: modelVersion || undefined,
      })

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setInspection(result.data)
      setEmptyState(result.data === null)
    })
  }

  if (!canViewMlInspection) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('panels.mlInspection.accessDeniedDescription')}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.mlInspection.title')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-[220px_1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label>{t('labels.target')}</Label>
            <Select value={target} onValueChange={setTarget} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cohort">{t('options.mlTarget.cohort')}</SelectItem>
                <SelectItem value="group">{t('options.mlTarget.group')}</SelectItem>
                {subjectOptions.length > 0 ? (
                  <SelectItem value="subject">{t('options.mlTarget.subject')}</SelectItem>
                ) : null}
                <SelectItem value="project">{t('options.mlTarget.project')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsTargetSelection ? (
            <div className="space-y-2">
              <Label htmlFor="inspection-target-id">
                {target === 'subject' ? t('labels.subjectId') : t('labels.targetId')}
              </Label>
              <Select value={targetId} onValueChange={setTargetId} disabled={isPending}>
                <SelectTrigger id="inspection-target-id">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(target === 'group' ? availableGroups : subjectOptions).map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {'label' in option ? option.label : option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="inspection-model-version">{t('labels.modelVersion')}</Label>
            <Input
              id="inspection-model-version"
              value={modelVersion}
              onChange={(event) => setModelVersion(event.target.value)}
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.loading') : t('panels.mlInspection.inspectButton')}
          </Button>
        </form>

        {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
      </StaticCard>

      {emptyState ? (
        <ResearchStateCard
          title={t('panels.mlInspection.emptyTitle')}
          description={t('panels.mlInspection.emptyDescription')}
        />
      ) : null}

      {inspection ? (
        <StaticCard>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.target')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{inspection.target || notAvailable}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.targetId')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{getInspectionTargetLabel(inspection)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.modelVersion')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{inspection.modelVersion || notAvailable}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.contract')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">{inspection.contract || notAvailable}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {Object.entries(inspection.governanceMetadata).map(([key, value]) => (
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
