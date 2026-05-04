import { useTranslations } from 'next-intl'

import { toDecisionSupportLocale } from '@/helpers/decisionSupport.helpers'
import { DecisionSupportAction } from '@/types/decisionSupport'
import { Statuses, StatusType } from '@/types/status.types'

export function formatGuardReason(code: string, t: ReturnType<typeof useTranslations>): string {
  switch (code) {
    case 'causal_attribution_blocked':
      return t('guard.reasons.causal_attribution_blocked' as never)
    case 'company_privacy_masked':
      return t('guard.reasons.company_privacy_masked' as never)
    case 'group_level_masking':
      return t('guard.reasons.group_level_masking' as never)
    case 'scoped_manager_view':
      return t('guard.reasons.scoped_manager_view' as never)
    default:
      return code
  }
}

export function formatEur(value: number | null, t: ReturnType<typeof useTranslations>, locale: string): string {
  if (value == null) return t('financial.notEnoughData' as never)
  return new Intl.NumberFormat(toDecisionSupportLocale(locale), {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function eventIdForAction(action: DecisionSupportAction): string | null {
  return action.riskEventId ?? action.eventId ?? null
}

export function formatMappedValue(
  value: string | null | undefined,
  t: ReturnType<typeof useTranslations>,
  baseKey: string
): string {
  if (!value) return '—'

  const normalized = String(value).toLowerCase()
  const key = `${baseKey}.${normalized}`
  const translator = t as ReturnType<typeof useTranslations> & { has?: (key: string) => boolean }

  if (typeof translator.has === 'function' && translator.has(key)) {
    return t(key as never)
  }

  return String(value)
}

export function formatConfidenceValue(value: unknown, t: ReturnType<typeof useTranslations>): string {
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') return formatMappedValue(value, t, 'values.confidence')
  return '—'
}

export function overallStatusToCardType(status: string | null | undefined): StatusType {
  switch (status?.toLowerCase()) {
    case 'stable':
    case 'normal':
      return Statuses.success
    case 'elevated':
      return Statuses.warn
    case 'high':
    case 'critical':
      return Statuses.error
    default:
      return Statuses.default
  }
}

export function formatDecisionSupportError(
  error: string | null | undefined,
  t: ReturnType<typeof useTranslations>
): string {
  if (!error) return ''

  const normalized = error.toLowerCase()
  if (normalized.includes('internal server error') || normalized.includes('servererror')) {
    const translator = t as ReturnType<typeof useTranslations> & { has?: (key: string) => boolean }
    if (typeof translator.has === 'function' && translator.has('error.decisionSupportUnavailable')) {
      return t('error.decisionSupportUnavailable' as never)
    }
    return t('error.reportUnavailable' as never)
  }

  return error
}
