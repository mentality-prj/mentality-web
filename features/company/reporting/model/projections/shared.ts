import { getReportingCopy } from '@/features/company/reporting/model/reportingCopy'
import { createConfidenceBadgeVM } from '@/features/company/reporting/model/reportingMappers'
import type { ConfidenceBadgeVM, ConfidenceLevel, InsightCardVM, InsightFactVM, RiskEventDetailVM, RiskLevel, TrendDirection, VisibilityRule } from '@/types/reporting'

export type JsonObject = Record<string, unknown>

export const ALWAYS: VisibilityRule[] = ['always']
export const AGGREGATE_ONLY: VisibilityRule[] = ['aggregate-only']

export function asObject(value: unknown): JsonObject | null {
  return value != null && typeof value === 'object' && !Array.isArray(value) ? (value as JsonObject) : null
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

export function getString(object: JsonObject | null, ...keys: string[]): string | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) return trimmed
    }
  }

  return null
}

export function getNumber(object: JsonObject | null, ...keys: string[]): number | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) {
        return parsed
      }
    }
  }

  return null
}

export function getBoolean(object: JsonObject | null, ...keys: string[]): boolean | null {
  if (!object) return null

  for (const key of keys) {
    const value = object[key]
    if (typeof value === 'boolean') {
      return value
    }
  }

  return null
}

export function getObject(object: JsonObject | null, key: string): JsonObject | null {
  if (!object) return null
  return asObject(object[key])
}

export function getStringArray(object: JsonObject | null, key: string): string[] {
  if (!object) return []

  return asArray(object[key]).flatMap((item) => {
    if (typeof item === 'string') {
      const trimmed = item.trim()
      return trimmed ? [trimmed] : []
    }

    const nested = asObject(item)
    const label = getString(nested, 'label', 'title', 'name', 'value')
    return label ? [label] : []
  })
}

export function normalizeConfidenceLevel(value: string | null | undefined): ConfidenceLevel {
  switch ((value ?? '').toLowerCase()) {
    case 'high':
      return 'high'
    case 'medium':
      return 'medium'
    case 'low':
      return 'low'
    default:
      return 'unknown'
  }
}

export function confidenceLevelToScore(level: ConfidenceLevel): number | null {
  switch (level) {
    case 'high':
      return 0.85
    case 'medium':
      return 0.6
    case 'low':
      return 0.3
    default:
      return null
  }
}

export function getIntlLocale(locale?: string): string {
  if (locale?.startsWith('uk')) return 'uk-UA'
  if (locale?.startsWith('pl')) return 'pl-PL'
  return 'en-US'
}

export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value)
}

export function formatSignedNumber(value: number, locale?: string, maximumFractionDigits = 2): string {
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${formatNumber(value, locale, { maximumFractionDigits })}`
}

export function formatCurrency(value: number, locale?: string): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number, locale?: string, maximumFractionDigits = 0): string {
  const normalized = Math.abs(value) <= 1 ? value * 100 : value
  return `${formatNumber(normalized, locale, { maximumFractionDigits })}%`
}

export function humanizeToken(value: string): string {
  return value
    .replace(/[_.-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

export function normalizeRiskLevel(value: string | null | undefined): RiskLevel {
  const normalized = (value ?? '').toLowerCase()

  if (normalized === 'critical') return 'critical'
  if (['high', 'elevated', 'severe'].includes(normalized)) return 'high'
  if (['medium', 'moderate'].includes(normalized)) return 'medium'
  if (['low', 'minimal', 'stable', 'none'].includes(normalized)) return 'low'

  return 'unknown'
}

export function toneFromRiskLevel(level: RiskLevel): InsightCardVM['tone'] {
  switch (level) {
    case 'critical':
      return 'critical'
    case 'high':
      return 'caution'
    case 'medium':
      return 'neutral'
    case 'low':
      return 'positive'
    default:
      return 'neutral'
  }
}

export function riskLevelLabel(level: RiskLevel, locale?: string): string {
  return getReportingCopy(locale).riskLevels[level]
}

export function normalizeTrendDirection(value: string | null | undefined): TrendDirection {
  const normalized = (value ?? '').toLowerCase()

  if (['stable', 'flat', 'steady', 'unchanged'].some((item) => normalized.includes(item))) {
    return 'stable'
  }

  if (['improv', 'recover', 'decreas', 'down'].some((item) => normalized.includes(item))) {
    return 'improving'
  }

  if (['wors', 'deterior', 'escalat', 'increase', 'up'].some((item) => normalized.includes(item))) {
    return 'worsening'
  }

  return 'unknown'
}

export function toneFromTrend(direction: TrendDirection): InsightCardVM['tone'] {
  switch (direction) {
    case 'improving':
      return 'positive'
    case 'worsening':
      return 'critical'
    default:
      return 'neutral'
  }
}

export function dedupeStrings(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => typeof value === 'string' && value.length > 0)))
}

export function mapProjectionConfidence(
  id: string,
  source: JsonObject | null,
  locale?: string,
  visibilityRules: VisibilityRule[] = ALWAYS
): ConfidenceBadgeVM {
  const level = normalizeConfidenceLevel(getString(source, 'level', 'confidence'))
  const score = getNumber(source, 'score', 'ratio', 'value') ?? confidenceLevelToScore(level)
  const badge = createConfidenceBadgeVM(id, score ?? level, locale, visibilityRules)
  const explanation = getString(source, 'explanation', 'reason')

  return explanation ? { ...badge, reason: explanation } : badge
}

export function formatPrimitive(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed || null
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return null
}

export function flattenDiagnostics(value: unknown, prefix = '', depth = 0): InsightFactVM[] {
  if (depth > 2) return []

  const primitive = formatPrimitive(value)
  if (primitive != null) {
    return prefix ? [{ label: humanizeToken(prefix), value: primitive }] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenDiagnostics(item, prefix ? `${prefix} ${index + 1}` : String(index + 1), depth + 1)
    )
  }

  const object = asObject(value)
  if (!object) return []

  return Object.entries(object).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix} ${key}` : key
    return flattenDiagnostics(nested, nextPrefix, depth + 1)
  })
}

export function scaleRiskValue(value: number | null): number | null {
  if (value == null) return null
  return value <= 1 ? Number((value * 5).toFixed(2)) : value
}

export function buildExplainability(
  summary: string,
  whyShown: string,
  reliability: string,
  recommendedAction: string,
  locale?: string
): RiskEventDetailVM['explainability'] {
  const copy = getReportingCopy(locale)

  return {
    whatHappened: summary || copy.common.noData,
    whyShown: whyShown || copy.common.noData,
    reliability: reliability || copy.common.notAvailable,
    recommendedAction: recommendedAction || copy.common.noData,
  }
}

export function mapInsightToCard(
  source: JsonObject,
  id: string,
  locale?: string,
  updatedAt?: string | null,
  visibilityRules: VisibilityRule[] = ALWAYS
): InsightCardVM {
  const level = getString(source, 'confidence')
  const confidenceSource = getObject(source, 'confidence') ?? (level ? { level } : null)
  const confidence = confidenceSource
    ? mapProjectionConfidence(`${id}-confidence`, confidenceSource, locale, visibilityRules)
    : null
  const severity = normalizeRiskLevel(getString(source, 'severity', 'riskLevel'))
  const title = getString(source, 'title', 'category', 'label') ?? id
  const explanation = getString(source, 'explanation', 'text', 'summary') ?? getReportingCopy(locale).common.noData
  const contributingFactors = getStringArray(source, 'contributingFactors')
  const recommendedAction =
    dedupeStrings([getString(source, 'recommendedAction'), ...getStringArray(source, 'recommendedActions')])[0] ?? null

  return {
    id,
    title: humanizeToken(title),
    text: explanation,
    supportingText: contributingFactors.length > 0 ? contributingFactors.join(', ') : null,
    tone: severity === 'unknown' ? 'neutral' : toneFromRiskLevel(severity),
    presentation: 'textInsight',
    confidence,
    recommendedAction,
    updatedAt: updatedAt ?? null,
    visibilityRules,
  }
}

export function createMetricCard(
  id: string,
  title: string,
  text: string,
  supportingText: string | null,
  tone: InsightCardVM['tone'],
  confidence: ConfidenceBadgeVM | null,
  updatedAt: string | null,
  visibilityRules: VisibilityRule[] = ALWAYS,
  presentation: InsightCardVM['presentation'] = 'badge'
): InsightCardVM {
  return {
    id,
    title,
    text,
    supportingText,
    tone,
    presentation,
    confidence,
    recommendedAction: null,
    updatedAt,
    visibilityRules,
  }
}
