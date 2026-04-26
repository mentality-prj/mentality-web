import { DECISION_SUPPORT_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import {
  AddressRiskEventDto,
  DecisionSupportReport,
  DecisionSupportRiskEvent,
  RiskAssociationEvidenceEntity,
} from '@/types/decisionSupport'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export async function getDecisionSupportReport(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: DecisionSupportReport } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.report(companyId)}`
  const res = await performAuthRequest<DecisionSupportReport>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch decision support report', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: res.data as DecisionSupportReport }
}

export async function getDecisionSupportReportAdmin(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: DecisionSupportReport } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.report(companyId)}`
  const res = await performAdminRequest<DecisionSupportReport>(session, url)

  if ('error' in res) {
    logger.error('Admin: failed to fetch decision support report', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: res.data as DecisionSupportReport }
}

export async function getDecisionSupportRiskEvents(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: DecisionSupportRiskEvent[] } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.riskEvents(companyId)}`
  const res = await performAuthRequest<DecisionSupportRiskEvent[]>(session, url)

  if ('error' in res) {
    logger.error('Failed to fetch decision support risk events', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}

export async function getDecisionSupportRiskEventsAdmin(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: DecisionSupportRiskEvent[] } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.riskEvents(companyId)}`
  const res = await performAdminRequest<DecisionSupportRiskEvent[]>(session, url)

  if ('error' in res) {
    logger.error('Admin: failed to fetch decision support risk events', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}

export async function addressDecisionSupportRiskEvent(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: AddressRiskEventDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAuthRequest<{ success: boolean }>(session, url, {
    method: 'PATCH',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to address decision support risk event', { error: res.error, companyId, eventId })
    return { error: res.error }
  }

  return { data: { success: Boolean((res.data as { success?: boolean } | undefined)?.success ?? true) } }
}

export async function addressDecisionSupportRiskEventAdmin(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: AddressRiskEventDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAdminRequest<{ success: boolean }>(session, url, {
    method: 'PATCH',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Admin: failed to address decision support risk event', { error: res.error, companyId, eventId })
    return { error: res.error }
  }

  return { data: { success: Boolean((res.data as { success?: boolean } | undefined)?.success ?? true) } }
}

export async function getRiskEventEvidence(
  session: CustomSession | null,
  companyId: string,
  eventId: string
): Promise<{ data: RiskAssociationEvidenceEntity } | { data: null } | { error: string }> {
  const url = `${APIUrl}${DECISION_SUPPORT_ENDPOINTS.riskEventEvidence(companyId, eventId)}`
  const res = await performAuthRequest<RiskAssociationEvidenceEntity>(session, url)

  if ('error' in res) {
    const status = (res as { error: string; status?: number }).status
    if (status === 404) {
      return { data: null }
    }
    logger.error('Failed to fetch risk event evidence', { error: res.error, companyId, eventId })
    return { error: res.error }
  }

  if (!res.data) {
    return { data: null }
  }

  return { data: res.data }
}
