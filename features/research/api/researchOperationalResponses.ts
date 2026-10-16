import { z } from 'zod'

import { decodeResearchCollection } from '@/features/research/api/researchCollection.contract'
import {
  normalizeCohort,
  normalizeExportResponse,
  normalizeHistoryDataset,
} from '@/features/research/model/researchProjectEntities'
import { asObject, getValue } from '@/features/research/model/researchProjectPrimitives'
import type { ResearchExportRequest } from '@/types/research'

const invalidCohort = 'Invalid research cohort response from backend'
const invalidHistory = 'Invalid research history dataset response from backend'
const invalidExport = 'Invalid research export response from backend'

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
  if (!parsed.success || !cohortFields.some((field) => Object.prototype.hasOwnProperty.call(parsed.data, field))) {
    return { success: false as const, error: invalidCohort }
  }

  return { success: true as const, data: normalizeCohort(parsed.data) }
}

function isValidTotal(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0
  if (typeof value === 'string' && value.trim()) {
    const count = Number(value)
    return Number.isSafeInteger(count) && count >= 0
  }
  return false
}

/** Reject invalid rows instead of silently dropping them during ViewModel normalization. */
export function decodeResearchHistoryResponse(value: unknown) {
  const records = decodeResearchCollection(value, ['items', 'data', 'rows'])
  const envelope = asObject(value)
  if (!records || records.some((item) => Object.keys(item).length === 0) || !isValidTotal(envelope?.total)) {
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
    if (!source || typeof source.status !== 'string' || !source.status.trim()) {
      return { success: false as const, error: invalidExport }
    }

    if (
      (source.format !== undefined && typeof source.format !== 'string') ||
      (source.fileName !== undefined && typeof source.fileName !== 'string') ||
      (source.filename !== undefined && typeof source.filename !== 'string')
    ) {
      return { success: false as const, error: invalidExport }
    }

    if (source.status === 'ready' && getValue(source, ['content', 'payload', 'data']) == null) {
      return { success: false as const, error: invalidExport }
    }

    return { success: true as const, data: normalizeExportResponse(value, projectId, request) }
  }
}
