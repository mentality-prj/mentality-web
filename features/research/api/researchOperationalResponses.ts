import { z } from 'zod'

import { decodeResearchCollection } from '@/features/research/api/researchCollection.contract'
import {
  normalizeCohort,
  normalizeExportResponse,
  normalizeHistoryDataset,
  normalizeInspection,
} from '@/features/research/model/researchProjectEntities'
import { asObject, getValue } from '@/features/research/model/researchProjectPrimitives'
import type { ResearchExportRequest, ResearchMLInspectionQuery } from '@/types/research'

const invalidCohort = 'Invalid research cohort response from backend'
const invalidHistory = 'Invalid research history dataset response from backend'
const invalidExport = 'Invalid research export response from backend'
const invalidInspection = 'Invalid research ML inspection response from backend'

const scalar = z.union([z.string(), z.number().finite(), z.boolean()])
const optionalDate = scalar.nullable().optional()
const cohortSchema = z
  .object({
    groupIds: z.array(scalar).optional(),
    groups: z.array(scalar).optional(),
    resolvedGroupIds: z.array(scalar).optional(),
    resolvedGroups: z.array(scalar).optional(),
    userSelectionMode: z.string().optional(),
    selectionMode: z.string().optional(),
    from: optionalDate,
    to: optionalDate,
    startsAt: optionalDate,
    endsAt: optionalDate,
    dateRange: z.object({ from: optionalDate, to: optionalDate }).passthrough().nullable().optional(),
  })
  .passthrough()

const inspectionSchema = z
  .object({
    target: z.string().trim().min(1).optional(),
    targetId: z.string().nullable().optional(),
    modelVersion: z.string().nullable().optional(),
    contract: z.string().nullable().optional(),
    allowedContract: z.string().nullable().optional(),
    governance: z.record(z.unknown()).nullable().optional(),
    governanceMetadata: z.record(z.unknown()).nullable().optional(),
    metadata: z.record(z.unknown()).nullable().optional(),
  })
  .passthrough()

const cohortFields = [
  'groupIds',
  'groups',
  'resolvedGroupIds',
  'resolvedGroups',
  'userSelectionMode',
  'selectionMode',
  'from',
  'to',
  'startsAt',
  'endsAt',
  'dateRange',
]

/** Null and [] are valid absent cohorts; malformed objects must not become empty cohorts. */
export function decodeResearchCohortResponse(value: unknown) {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    return { success: true as const, data: null }
  }

  const candidate = Array.isArray(value) ? (value.length === 1 ? value[0] : null) : value
  const parsed = cohortSchema.safeParse(candidate)
  if (!parsed.success) return { success: false as const, error: invalidCohort }

  const hasCohortData = cohortFields.some((field) => {
    if (!Object.prototype.hasOwnProperty.call(parsed.data, field)) return false
    if (field !== 'dateRange') return true
    const range = parsed.data.dateRange
    return (
      range !== null &&
      range !== undefined &&
      (Object.prototype.hasOwnProperty.call(range, 'from') || Object.prototype.hasOwnProperty.call(range, 'to'))
    )
  })
  if (!hasCohortData) return { success: false as const, error: invalidCohort }

  return { success: true as const, data: normalizeCohort(parsed.data) }
}

function isValidTotal(value: unknown, returnedCount: number): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= returnedCount
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
    const count = Number(value)
    return Number.isSafeInteger(count) && count >= returnedCount
  }
  return false
}

/** Reject invalid rows instead of silently dropping them during ViewModel normalization. */
export function decodeResearchHistoryResponse(value: unknown) {
  const records = decodeResearchCollection(value, ['items', 'data', 'rows'])
  const envelope = asObject(value)
  if (
    !records ||
    records.some((item) => Object.keys(item).length === 0) ||
    !isValidTotal(envelope?.total, records.length)
  ) {
    return { success: false as const, error: invalidHistory }
  }

  const dataset = normalizeHistoryDataset(value)
  if (dataset.items.length !== records.length) return { success: false as const, error: invalidHistory }
  return { success: true as const, data: dataset }
}

/** A successful export must be a real backend state, not a synthetic pending job. */
export function createResearchExportDecoder(projectId: string, request: ResearchExportRequest) {
  return (value: unknown) => {
    const source = asObject(value)
    if (!source || (source.status !== 'pending_review' && source.status !== 'ready')) {
      return { success: false as const, error: invalidExport }
    }

    if (
      (source.format !== undefined && typeof source.format !== 'string') ||
      (source.fileName !== undefined && typeof source.fileName !== 'string') ||
      (source.filename !== undefined && typeof source.filename !== 'string')
    ) {
      return { success: false as const, error: invalidExport }
    }

    if (source.status === 'ready') {
      const content = getValue(source, ['content', 'payload', 'data'])
      if (content == null || (typeof content === 'string' && !content.trim())) {
        return { success: false as const, error: invalidExport }
      }
    }

    return { success: true as const, data: normalizeExportResponse(value, projectId, request) }
  }
}

/** An absent inspection is valid; invalid HTTP 2xx objects must not become synthetic results. */
export function createResearchInspectionDecoder(query?: ResearchMLInspectionQuery) {
  return (value: unknown) => {
    if (value === null) return { success: true as const, data: null }

    const parsed = inspectionSchema.safeParse(value)
    if (!parsed.success) return { success: false as const, error: invalidInspection }

    const identityKeys = ['target', 'targetId', 'modelVersion', 'contract', 'allowedContract'] as const
    const metadataKeys = ['governance', 'governanceMetadata', 'metadata'] as const
    const hasIdentity = identityKeys.some((key) => {
      const field = parsed.data[key]
      return typeof field === 'string' && field.trim().length > 0
    })
    const hasMetadata = metadataKeys.some((key) => {
      const field = parsed.data[key]
      return field !== null && field !== undefined && Object.keys(field).length > 0
    })
    if (!hasIdentity && !hasMetadata) return { success: false as const, error: invalidInspection }

    return { success: true as const, data: normalizeInspection(parsed.data, query) }
  }
}
