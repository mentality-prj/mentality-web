import { B2B_DECISION_SUPPORT_ADMIN_ENDPOINTS, B2B_DECISION_SUPPORT_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import {
  DecisionSupportReport,
  DecisionSupportRiskEvent,
  PolicyMetrics,
  ResolveRiskEventDto,
  RiskAssociationEvidenceEntity,
  RiskEventActionDto,
} from '@/types/decisionSupport'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

type DecisionSupportRiskEventMutationResponse = {
  success?: boolean
}

function buildAddressRiskEventDto(
  session: CustomSession | null,
  dto: RiskEventActionDto | ResolveRiskEventDto,
  resolutionType: 'action_taken' | 'wont_fix' | 'false_positive' | 'auto_resolved'
) {
  const note = 'actionType' in dto ? [dto.actionType, dto.note].filter(Boolean).join(': ') : dto.note

  return {
    resolutionType,
    resolutionOutcome: note || undefined,
    resolvedBy: session?.user?.id,
  }
}

export async function getDecisionSupportReport(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: DecisionSupportReport } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.report(companyId)}`
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
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.report(companyId)}`
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
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEvents(companyId)}`
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
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEvents(companyId)}`
  const res = await performAdminRequest<DecisionSupportRiskEvent[]>(session, url)

  if ('error' in res) {
    logger.error('Admin: failed to fetch decision support risk events', { error: res.error, companyId })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}

export async function applyDecisionSupportRiskEventAction(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: RiskEventActionDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAuthRequest<DecisionSupportRiskEventMutationResponse>(session, url, {
    method: 'PATCH',
    body: buildAddressRiskEventDto(session, dto, 'action_taken'),
  })

  if ('error' in res) {
    logger.error('Failed to apply decision support risk event action', {
      error: res.error,
      companyId,
      eventId,
      actionType: dto.actionType,
    })
    return { error: res.error }
  }

  return { data: { success: Boolean(res.data?.success ?? true) } }
}

export async function applyDecisionSupportRiskEventActionAdmin(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: RiskEventActionDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAdminRequest<DecisionSupportRiskEventMutationResponse>(session, url, {
    method: 'PATCH',
    body: buildAddressRiskEventDto(session, dto, 'action_taken'),
  })

  if ('error' in res) {
    logger.error('Admin: failed to apply decision support risk event action', {
      error: res.error,
      companyId,
      eventId,
      actionType: dto.actionType,
    })
    return { error: res.error }
  }

  return { data: { success: Boolean(res.data?.success ?? true) } }
}

export async function resolveDecisionSupportRiskEvent(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: ResolveRiskEventDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAuthRequest<DecisionSupportRiskEventMutationResponse>(session, url, {
    method: 'PATCH',
    body: buildAddressRiskEventDto(session, dto, 'action_taken'),
  })

  if ('error' in res) {
    logger.error('Failed to resolve decision support risk event', { error: res.error, companyId, eventId })
    return { error: res.error }
  }

  return { data: { success: Boolean(res.data?.success ?? true) } }
}

export async function resolveDecisionSupportRiskEventAdmin(
  session: CustomSession | null,
  companyId: string,
  eventId: string,
  dto: ResolveRiskEventDto
): Promise<{ data: { success: boolean } } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEventAddress(companyId, eventId)}`
  const res = await performAdminRequest<DecisionSupportRiskEventMutationResponse>(session, url, {
    method: 'PATCH',
    body: buildAddressRiskEventDto(session, dto, 'action_taken'),
  })

  if ('error' in res) {
    logger.error('Admin: failed to resolve decision support risk event', { error: res.error, companyId, eventId })
    return { error: res.error }
  }

  return { data: { success: Boolean(res.data?.success ?? true) } }
}

export async function getRiskEventEvidence(
  session: CustomSession | null,
  companyId: string,
  eventId: string
): Promise<{ data: RiskAssociationEvidenceEntity } | { data: null } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ENDPOINTS.riskEventEvidence(companyId, eventId)}`
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

export async function getPolicyMetrics(
  session: CustomSession | null,
  companyId: string
): Promise<{ data: PolicyMetrics } | { error: string }> {
  const url = `${APIUrl}${B2B_DECISION_SUPPORT_ADMIN_ENDPOINTS.policyMetrics(companyId)}`
  const res = await performAdminRequest<PolicyMetrics>(session, url)

  if ('error' in res) {
    logger.error('Admin: failed to fetch policy metrics', { error: res.error, companyId })
    return { error: res.error }
  }

  if (!res.data) {
    logger.error('Admin: invalid policy metrics response: missing data')
    return { error: 'Invalid policy metrics response' }
  }

  return { data: res.data }
}
