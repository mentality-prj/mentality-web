'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { useAuth } from '@/context/AuthProvider'
import { getLocalizedResearchErrorMessage } from '@/helpers/researchErrorMessage'
import {
  createResearchHistoryDatasetExportFile,
  ResearchHistoryDatasetExportFormat,
} from '@/helpers/researchHistoryDatasetExport'
import { getResearchProjectHistoryDataset } from '@/requests/researchProjects'
import { ResearchHistoryDataset, ResearchProjectGroup } from '@/types/research'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

import { ResearchStateCard } from './ResearchStateCard'

type Props = {
  projectId: string
  initialDataset: ResearchHistoryDataset
  availableGroups: ResearchProjectGroup[]
  canViewHistoryDataset: boolean
}

function getDatasetFieldValue(item: ResearchHistoryDataset['items'][number], column: string): string | null {
  const matchedField = Object.entries(item.fields).find(([fieldName]) => fieldName === column)

  if (!matchedField) {
    return null
  }

  const [, fieldValue] = matchedField

  return fieldValue
}

export function ResearchProjectHistoryDatasetPanel({
  projectId,
  initialDataset,
  availableGroups,
  canViewHistoryDataset,
}: Props) {
  const { session } = useAuth()
  const t = useTranslations('pages.Research')
  const [dataset, setDataset] = useState(initialDataset)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [limit, setLimit] = useState(String(initialDataset.total ?? 50))
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const notAvailable = t('common.notAvailable')
  const groupNamesById = new Map(availableGroups.map((group) => [group.id, group.name]))

  function handleExport(format: ResearchHistoryDatasetExportFormat) {
    const file = createResearchHistoryDatasetExportFile(dataset, format, {
      cohortLabel: t('labels.cohort'),
      cohortNamesById: groupNamesById,
      dateRangeLabel: t('labels.dateRange'),
      diagnosticsLabel: t('labels.diagnostics'),
      fileBaseName: `research-history-dataset-${projectId}`,
      notAvailableLabel: notAvailable,
      subjectLabel: t('labels.subjectId'),
      subjectLabelPrefix: t('labels.subjectId'),
    })
    const blob = new Blob([file.content], { type: file.mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = file.fileName
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

      const result = await getResearchProjectHistoryDataset(session, projectId, {
        from: from || undefined,
        to: to || undefined,
        limit: Number(limit) || undefined,
      })

      if ('error' in result) {
        setError(getLocalizedResearchErrorMessage(result.error, t))
        return
      }

      setDataset(result.data)
    })
  }

  if (!canViewHistoryDataset) {
    return (
      <ResearchStateCard
        title={t('workspace.accessDeniedTitle')}
        description={t('panels.historyDataset.accessDeniedDescription')}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <StaticCard>
        <h2 className="text-lg font-semibold text-textcolor-primary">{t('panels.historyDataset.title')}</h2>
        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_160px_auto] md:items-end">
          <div className="space-y-2">
            <Label htmlFor="history-from">{t('labels.from')}</Label>
            <Input
              id="history-from"
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="history-to">{t('labels.to')}</Label>
            <Input
              id="history-to"
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="history-limit">{t('labels.limit')}</Label>
            <Input
              id="history-limit"
              type="number"
              min={1}
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              disabled={isPending}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.loading') : t('common.applyFilters')}
          </Button>
        </form>
        {error ? <p className="text-danger mt-3 text-sm">{error}</p> : null}
      </StaticCard>

      {dataset.items.length === 0 ? (
        <ResearchStateCard
          title={t('panels.historyDataset.emptyTitle')}
          description={t('panels.historyDataset.emptyDescription')}
        />
      ) : (
        <StaticCard className="overflow-x-auto">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-textcolor-primary">{t('panels.historyDataset.exportTitle')}</h3>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => handleExport('csv')}>
                {t('panels.historyDataset.exportCsvButton')}
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleExport('xml')}>
                {t('panels.historyDataset.exportXmlButton')}
              </Button>
              <Button type="button" variant="secondary" onClick={() => handleExport('excel')}>
                {t('panels.historyDataset.exportExcelButton')}
              </Button>
            </div>
          </div>
          <table className="w-full min-w-[900px] table-auto border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-textcolor-secondary">
                {[t('labels.subjectId'), t('labels.cohort'), t('labels.dateRange'), t('labels.diagnostics')].map(
                  (column) => (
                    <th key={column} className="px-3 py-3 font-medium">
                      {column}
                    </th>
                  )
                )}
                {dataset.columns.map((column) => (
                  <th key={column} className="px-3 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.items.map((item, index) => (
                <tr key={item.id} className="border-b border-border align-top">
                  <td className="px-3 py-3 text-textcolor-primary">{`${t('labels.subjectId')} ${index + 1}`}</td>
                  <td className="px-3 py-3 text-textcolor-primary">
                    {groupNamesById.get(item.cohort) || item.cohort || notAvailable}
                  </td>
                  <td className="px-3 py-3 text-textcolor-primary">{item.dateRange}</td>
                  <td className="px-3 py-3 text-textcolor-primary">{item.diagnostics}</td>
                  {dataset.columns.map((column) => (
                    <td key={`${item.id}-${column}`} className="px-3 py-3 text-textcolor-primary">
                      {getDatasetFieldValue(item, column) || notAvailable}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </StaticCard>
      )}
    </div>
  )
}
