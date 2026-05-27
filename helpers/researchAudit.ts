import { ResearchAuditEvent } from '@/types/research'

type TranslationValues = Record<string, string | number>
type TranslationFunction = (key: string, values?: TranslationValues) => string

const HIDDEN_METADATA_KEYS = new Set([
  'id',
  '_id',
  'projectid',
  'actorid',
  'actoruserid',
  'userid',
  'subjectid',
  'targetid',
  'route',
  'path',
  'url',
])

function normalizeAuditKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.\s-]+/g, '_')
}

function humanizeAuditKey(value: string): string {
  return value
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (part.toLowerCase() === 'ml') {
        return 'ML'
      }

      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

function getMetadataValue(metadata: Record<string, string>, keys: string[]): string | null {
  for (const key of keys) {
    const value = metadata[key]

    if (value && value !== 'null' && value !== 'undefined' && value !== '[]' && value !== '{}') {
      return value
    }
  }

  return null
}

function parseSerializedList(value: string | null): string[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean)
    }
  } catch {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return [value]
}

function formatMetadataValue(key: string, value: string, t: TranslationFunction, notAvailable: string): string | null {
  const normalizedKey = normalizeAuditKey(key)

  if (!value || value === 'null' || value === 'undefined' || value === '{}') {
    return null
  }

  if (normalizedKey === 'format') {
    return value.toUpperCase()
  }

  if (normalizedKey === 'policystatus' || normalizedKey === 'exportpolicy') {
    return getExportPolicyLabel(value, t, notAvailable)
  }

  if (normalizedKey === 'target') {
    return getAuditTargetLabel(value, t, notAvailable)
  }

  const listValues = parseSerializedList(value)
  if (listValues.length > 1) {
    return listValues.join(', ')
  }

  if (listValues.length === 1) {
    return listValues[0]
  }

  return value
}

function getMetadataLabel(key: string, t: TranslationFunction): string {
  switch (normalizeAuditKey(key)) {
    case 'resultcount':
      return t('panels.audit.metadata.resultCount')
    case 'format':
      return t('labels.format')
    case 'requestedfields':
      return t('labels.requestedFields')
    case 'policystatus':
    case 'exportpolicy':
      return t('labels.exportPolicy')
    case 'target':
      return t('labels.target')
    case 'modelversion':
      return t('labels.modelVersion')
    case 'granttitle':
    case 'title':
      return t('labels.grantTitle')
    case 'reason':
      return t('labels.reason')
    case 'contract':
      return t('labels.contract')
    case 'limit':
      return t('labels.limit')
    default:
      return humanizeAuditKey(key)
  }
}

function shouldHideMetadataKey(key: string): boolean {
  const normalizedKey = normalizeAuditKey(key)

  return HIDDEN_METADATA_KEYS.has(normalizedKey) || normalizedKey.endsWith('id')
}

function looksLikeStructuredPayload(value: string): boolean {
  const trimmedValue = value.trim()

  return trimmedValue.startsWith('{') || trimmedValue.startsWith('[')
}

function buildFallbackDetails(event: ResearchAuditEvent, t: TranslationFunction, notAvailable: string): string[] {
  const metadataLines = Object.entries(event.metadata)
    .filter(([key, value]) => !shouldHideMetadataKey(key) && value && value !== 'null' && value !== 'undefined')
    .map(([key, value]) => {
      const formattedValue = formatMetadataValue(key, value, t, notAvailable)

      if (!formattedValue) {
        return null
      }

      return t('panels.audit.details.metadataLine', {
        label: getMetadataLabel(key, t),
        value: formattedValue,
      })
    })
    .filter((item): item is string => item !== null)

  if (metadataLines.length > 0) {
    return metadataLines
  }

  if (event.details && !looksLikeStructuredPayload(event.details)) {
    return [event.details]
  }

  return [t('panels.audit.details.empty')]
}

function getExportPolicyLabel(value: string, t: TranslationFunction, notAvailable: string): string {
  switch (normalizeAuditKey(value)) {
    case 'blocked':
      return t('options.exportPolicy.blocked')
    case 'review_required':
      return t('options.exportPolicy.review_required')
    case 'allowed':
      return t('options.exportPolicy.allowed')
    case 'inline_ready':
      return t('options.exportPolicy.inline_ready')
    case 'disabled':
      return t('options.exportPolicy.disabled')
    default:
      return value ? humanizeAuditKey(value) : notAvailable
  }
}

function getAuditTargetLabel(value: string, t: TranslationFunction, notAvailable: string): string {
  switch (normalizeAuditKey(value)) {
    case 'cohort':
      return t('options.mlTarget.cohort')
    case 'group':
      return t('options.mlTarget.group')
    case 'subject':
      return t('options.mlTarget.subject')
    case 'project':
      return t('options.mlTarget.project')
    case 'team':
      return t('panels.audit.targets.team')
    default:
      return value ? humanizeAuditKey(value) : notAvailable
  }
}

export function formatResearchAuditEventType(eventType: string, t: TranslationFunction): string {
  switch (normalizeAuditKey(eventType)) {
    case 'history_dataset_viewed':
      return t('panels.audit.eventTypes.history_dataset_viewed')
    case 'export_review_requested':
      return t('panels.audit.eventTypes.export_review_requested')
    case 'ml_inspection_viewed':
      return t('panels.audit.eventTypes.ml_inspection_viewed')
    case 'data_grant_created':
    case 'grant_created':
      return t('panels.audit.eventTypes.data_grant_created')
    case 'export_requested':
      return t('panels.audit.eventTypes.export_requested')
    default:
      return humanizeAuditKey(eventType)
  }
}

export function formatResearchAuditCreatedAt(value: string, locale: string, notAvailable: string): string {
  if (!value) {
    return notAvailable
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return notAvailable
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date)
}

export function formatResearchAuditDetails(
  event: ResearchAuditEvent,
  t: TranslationFunction,
  notAvailable: string
): string[] {
  const resultCount = getMetadataValue(event.metadata, ['resultCount', 'count', 'itemsCount'])
  const limit = getMetadataValue(event.metadata, ['limit'])
  const format = getMetadataValue(event.metadata, ['format'])
  const requestedFields = parseSerializedList(getMetadataValue(event.metadata, ['requestedFields']))
  const policyStatus = getMetadataValue(event.metadata, ['policyStatus', 'exportPolicy'])
  const target = getMetadataValue(event.metadata, ['target'])
  const modelVersion = getMetadataValue(event.metadata, ['modelVersion'])
  const grantTitle = getMetadataValue(event.metadata, ['grantTitle', 'title'])

  switch (normalizeAuditKey(event.eventType)) {
    case 'history_dataset_viewed': {
      if (resultCount && limit) {
        return [t('panels.audit.details.historyDatasetViewed', { resultCount, limit })]
      }

      if (resultCount) {
        return [t('panels.audit.details.historyDatasetCountOnly', { resultCount })]
      }

      if (limit) {
        return [t('panels.audit.details.limitOnly', { limit })]
      }

      return buildFallbackDetails(event, t, notAvailable)
    }
    case 'export_review_requested':
    case 'export_requested': {
      const detailLines: string[] = []

      if (format) {
        detailLines.push(t('panels.audit.details.exportRequested', { format: format.toUpperCase() }))
      }

      if (requestedFields.length > 0) {
        detailLines.push(t('panels.audit.details.requestedFields', { fields: requestedFields.join(', ') }))
      }

      if (policyStatus) {
        detailLines.push(
          t('panels.audit.details.policyStatus', {
            policyStatus: getExportPolicyLabel(policyStatus, t, notAvailable),
          })
        )
      }

      return detailLines.length > 0 ? detailLines : buildFallbackDetails(event, t, notAvailable)
    }
    case 'ml_inspection_viewed': {
      const detailLines: string[] = []

      if (target) {
        detailLines.push(
          t('panels.audit.details.mlInspectionViewed', {
            target: getAuditTargetLabel(target, t, notAvailable),
          })
        )
      }

      if (modelVersion) {
        detailLines.push(t('panels.audit.details.modelVersion', { modelVersion }))
      }

      return detailLines.length > 0 ? detailLines : buildFallbackDetails(event, t, notAvailable)
    }
    case 'data_grant_created':
    case 'grant_created': {
      if (grantTitle) {
        return [t('panels.audit.details.dataGrantCreated'), t('panels.audit.details.grantTitle', { title: grantTitle })]
      }

      return [t('panels.audit.details.dataGrantCreated')]
    }
    default:
      return buildFallbackDetails(event, t, notAvailable)
  }
}
