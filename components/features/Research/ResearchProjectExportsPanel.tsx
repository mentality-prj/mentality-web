'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import { requestResearchProjectExport } from '@/requests/researchProjects'
import { ResearchExportResponse, ResearchExportStatus } from '@/types/research'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Textarea } from '@/ui/textarea'

import { ResearchMultiSelectField } from './ResearchMultiSelectField'
import { ResearchStateCard } from './ResearchStateCard'

type Props = {
  projectId: string
  canRequestExports: boolean
  suggestedFields?: string[]
}

export function ResearchProjectExportsPanel({ projectId, canRequestExports, suggestedFields = [] }: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [format, setFormat] = useState<'json' | 'csv'>('json')
  const [requestedFields, setRequestedFields] = useState<string[]>([])
  const [reason, setReason] = useState('')
  const [response, setResponse] = useState<ResearchExportResponse | null>(null)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const exportStatusLabels: Record<string, string> = {
    not_requested: t('statuses.export.not_requested'),
    pending_review: t('statuses.export.pending_review'),
    pending_approval: t('statuses.export.pending_approval'),
    running: t('statuses.export.running'),
    ready: t('statuses.export.ready'),
    completed: t('statuses.export.completed'),
    rejected: t('statuses.export.rejected'),
  }

  function downloadInlineFile() {
    if (!response || response.status !== 'ready') {
      return
    }

    const blob = new Blob([response.content], {
      type: response.format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8',
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = response.fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    startTransition(async () => {
      if (!session) {
        setError(t('common.sessionMissing'))
        return
      }

      const result = await requestResearchProjectExport(session, projectId, {
        format,
        requestedFields,
        reason,
      })

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setResponse(result.data)
    })
  }

  if (!canRequestExports) {
    return (
      <ResearchStateCard
        title={t('panels.exports.disabledTitle')}
        description={t('panels.exports.disabledDescription')}
      />
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.exports.requestTitle')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="space-y-2">
            <Label>{t('labels.format')}</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as 'json' | 'csv')} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">json</SelectItem>
                <SelectItem value="csv">csv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResearchMultiSelectField
            label={t('labels.requestedFields')}
            values={requestedFields}
            onChange={setRequestedFields}
            options={suggestedFields}
            disabled={isPending}
            placeholder={t('panels.exports.requestedFieldsPlaceholder')}
          />

          <div className="space-y-2">
            <Label htmlFor="export-reason">{t('labels.reason')}</Label>
            <Textarea
              id="export-reason"
              rows={4}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isPending}
            />
          </div>

          {error ? <p className="text-danger text-sm">{error}</p> : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || requestedFields.length === 0 || !reason.trim()}>
              {isPending ? t('common.submitting') : t('panels.exports.requestButton')}
            </Button>
          </div>
        </form>
      </StaticCard>

      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.exports.latestResponseTitle')}</h2>
        {!response ? (
          <p className="mt-3 text-sm text-textcolor-secondary">{t('panels.exports.latestResponseEmpty')}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-2xl border border-border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{t('labels.status')}</p>
              <p className="mt-1 text-sm text-textcolor-primary">
                {exportStatusLabels[response.status as ResearchExportStatus] || response.status}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(response.metadata).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-border px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-textcolor-secondary">{key}</p>
                  <p className="mt-1 text-sm text-textcolor-primary">{value || notAvailable}</p>
                </div>
              ))}
            </div>

            {response.status === 'ready' ? (
              <Button type="button" onClick={downloadInlineFile}>
                {t('panels.exports.downloadButton')} {response.format === 'csv' ? '.csv' : '.json'}
              </Button>
            ) : (
              <ResearchStateCard
                title={t('panels.exports.pendingReviewTitle')}
                description={t('panels.exports.pendingReviewDescription')}
              />
            )}
          </div>
        )}
      </StaticCard>
    </div>
  )
}
