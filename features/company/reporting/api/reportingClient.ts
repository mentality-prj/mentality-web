import {
  buildRiskEventFallbackDetail,
  mapMLInspectionProjectionToVM,
  mapPersonalRiskOverviewProjectionToVM,
  mapPersonalRiskTimelineProjectionToVM,
  mapReportOverviewProjectionToVM,
  mapRiskEventProjectionToVM,
  mapTeamDynamicsProjectionToVM,
} from '@/features/company/reporting/model/projections'
import { asArray, asObject } from '@/features/company/reporting/model/projections/shared'
import { mapMlInspectionToVM } from '@/features/company/reporting/model/reportingMappers'
import { logger } from '@/lib/logger'
import { APIUrl } from '@/requests/config'
import {
  applyDecisionSupportRiskEventAction,
  applyDecisionSupportRiskEventActionAdmin,
  resolveDecisionSupportRiskEvent,
  resolveDecisionSupportRiskEventAdmin,
} from '@/requests/decisionSupport'
import { performAdminRequest, performAuthRequest } from '@/requests/genericFetch'
import type { CustomSession } from '@/types/auth'
import type { PolicyMetrics } from '@/types/decisionSupport'
import type {
  MLInspectionVM,
  PersonalRiskOverviewVM,
  PersonalRiskTimelineVM,
  ReportOverviewVM,
  RiskEventActionKind,
  RiskEventDetailVM,
  RiskEventVM,
  TeamDynamicsVM,
} from '@/types/reporting'

type Result<T> = Promise<{ data: T } | { error: string }>

type DecisionSupportScope = {
  session: CustomSession | null
  companyId: string
  admin?: boolean
  locale?: string
}

type TeamDynamicsParams = {
  from: string
  to: string
  groupId: string
  groupLabel?: string
}

function buildQuery(params: Record<string, string | number | boolean | null | undefined>): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

function buildProjectionUrl(path: string): string {
  const baseUrl = APIUrl.trim().replace(/\/+$/, '')
  const normalizedPath = path.trim() ? (path.startsWith('/') ? path : `/${path}`) : ''

  if (!normalizedPath) {
    return baseUrl
  }

  if (baseUrl.endsWith('/api') && normalizedPath === '/api') {
    return baseUrl
  }

  if (baseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${baseUrl}${normalizedPath.slice(4)}`
  }

  return `${baseUrl}${normalizedPath}`
}

async function requestProjection<T>(
  session: CustomSession | null,
  path: string,
  admin = false,
  options?: { method?: string; body?: Record<string, unknown> | FormData }
): Result<T> {
  const url = buildProjectionUrl(path)
  const response = admin
    ? await performAdminRequest<T>(session, url, options)
    : await performAuthRequest<T>(session, url, options)

  if ('error' in response) {
    logger.error('Failed to request reporting projection', { error: response.error, path, admin })
    return { error: response.error }
  }

  return { data: response.data as T }
}

export async function getReportOverviewVM({ session, admin, locale }: DecisionSupportScope): Result<ReportOverviewVM> {
  const result = await requestProjection<unknown>(session, '/api/operational/v1/reports/overview', admin)

  if ('error' in result) {
    return result
  }

  return { data: mapReportOverviewProjectionToVM(result.data, locale) }
}

export async function getRiskEventsVM({ session, admin, locale }: DecisionSupportScope): Result<RiskEventVM[]> {
  const result = await requestProjection<unknown>(session, '/api/operational/v1/risk-events/feed', admin)

  if ('error' in result) {
    return result
  }

  const root = asObject(result.data)
  const items = Array.isArray(result.data) ? result.data : asArray(root?.items)
  return {
    data: items.flatMap((item, index) => {
      const event = asObject(item)
      return event ? [mapRiskEventProjectionToVM(event, locale, index)] : []
    }),
  }
}

export async function getRiskEventDetailVM(
  baseEvent: RiskEventVM,
  _scope: DecisionSupportScope
): Result<RiskEventDetailVM | null> {
  return { data: baseEvent.details ?? buildRiskEventFallbackDetail(baseEvent) }
}

export async function applyRiskEventAction(
  scope: DecisionSupportScope,
  eventId: string,
  dto: { actionType: RiskEventActionKind; note?: string }
): Result<{ success: boolean }> {
  return scope.admin
    ? applyDecisionSupportRiskEventActionAdmin(scope.session, scope.companyId, eventId, dto)
    : applyDecisionSupportRiskEventAction(scope.session, scope.companyId, eventId, dto)
}

export async function resolveRiskEvent(
  scope: DecisionSupportScope,
  eventId: string,
  dto: { note?: string }
): Result<{ success: boolean }> {
  return scope.admin
    ? resolveDecisionSupportRiskEventAdmin(scope.session, scope.companyId, eventId, dto)
    : resolveDecisionSupportRiskEvent(scope.session, scope.companyId, eventId, dto)
}

export async function getTeamDynamicsVM(
  session: CustomSession | null,
  _companyId: string,
  params: TeamDynamicsParams,
  locale?: string,
  admin?: boolean
): Result<TeamDynamicsVM> {
  const [overviewResult, timelineResult] = await Promise.all([
    requestProjection<unknown>(
      session,
      `/api/team/v1/overview${buildQuery({ groupId: params.groupId, from: params.from, to: params.to })}`,
      admin
    ),
    requestProjection<unknown>(
      session,
      `/api/team/v1/timeline${buildQuery({ groupId: params.groupId, from: params.from, to: params.to })}`,
      admin
    ),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in timelineResult) {
    return timelineResult
  }

  return { data: mapTeamDynamicsProjectionToVM(overviewResult.data, timelineResult.data, params.groupLabel, locale) }
}

export async function getMLInspectionVM(
  session: CustomSession | null,
  companyId: string,
  targetType: 'company' | 'team',
  targetId: string,
  locale?: string
): Result<MLInspectionVM> {
  const query = buildQuery({ target: targetType, targetId })
  const [operationalResult, diagnosticsResult, policyMetricsResult] = await Promise.all([
    requestProjection<unknown>(session, `/api/operational/v1/ml/inspection${query}`, true),
    requestProjection<unknown>(session, `/api/admin-diagnostics/v1/ml/inspection${query}`, true),
    requestProjection<unknown>(
      session,
      `/api/admin-diagnostics/v1/ml/policy-metrics${buildQuery({ companyId })}`,
      true
    ),
  ])

  if ('error' in operationalResult) {
    return operationalResult
  }

  if ('error' in diagnosticsResult) {
    return diagnosticsResult
  }

  if ('error' in policyMetricsResult) {
    return policyMetricsResult
  }

  return {
    data: mapMLInspectionProjectionToVM(
      operationalResult.data,
      diagnosticsResult.data,
      policyMetricsResult.data,
      targetType,
      targetId,
      locale
    ),
  }
}

export async function getAdminDiagnosticsInspectionVM(
  session: CustomSession | null,
  companyId: string,
  locale?: string
): Result<MLInspectionVM> {
  const result = await requestProjection<unknown>(
    session,
    `/api/admin-diagnostics/v1/ml/policy-metrics${buildQuery({ companyId })}`,
    true
  )

  if ('error' in result) {
    return result
  }

  return {
    data: mapMlInspectionToVM((result.data as PolicyMetrics | null) ?? null, [], 'company', companyId, locale),
  }
}

export async function getPersonalRiskOverviewVM(
  session: CustomSession | null,
  locale?: string
): Result<PersonalRiskOverviewVM> {
  const [overviewResult, insightsResult] = await Promise.all([
    requestProjection<unknown>(session, '/api/personal/v1/overview'),
    requestProjection<unknown>(session, '/api/personal/v1/insights'),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in insightsResult) {
    return insightsResult
  }

  return { data: mapPersonalRiskOverviewProjectionToVM(overviewResult.data, insightsResult.data, locale) }
}

export async function getPersonalRiskTimelineVM(
  session: CustomSession | null,
  period: '7d' | '14d' | '30d',
  locale?: string
): Result<PersonalRiskTimelineVM> {
  const result = await requestProjection<unknown>(session, `/api/personal/v1/timeline${buildQuery({ period })}`)

  if ('error' in result) {
    return result
  }

  return { data: mapPersonalRiskTimelineProjectionToVM(result.data, period, locale) }
}

export async function getPersonalRiskDashboardVM(
  session: CustomSession | null,
  locale?: string
): Result<{
  overview: PersonalRiskOverviewVM
  timelines: Record<'7d' | '14d' | '30d', PersonalRiskTimelineVM>
}> {
  const [overviewResult, insightsResult, timeline7dResult, timeline14dResult, timeline30dResult] = await Promise.all([
    requestProjection<unknown>(session, '/api/personal/v1/overview'),
    requestProjection<unknown>(session, '/api/personal/v1/insights'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=7d'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=14d'),
    requestProjection<unknown>(session, '/api/personal/v1/timeline?period=30d'),
  ])

  if ('error' in overviewResult) {
    return overviewResult
  }

  if ('error' in insightsResult) {
    return insightsResult
  }

  if ('error' in timeline7dResult) {
    return timeline7dResult
  }

  if ('error' in timeline14dResult) {
    return timeline14dResult
  }

  if ('error' in timeline30dResult) {
    return timeline30dResult
  }

  return {
    data: {
      overview: mapPersonalRiskOverviewProjectionToVM(overviewResult.data, insightsResult.data, locale),
      timelines: {
        '7d': mapPersonalRiskTimelineProjectionToVM(timeline7dResult.data, '7d', locale),
        '14d': mapPersonalRiskTimelineProjectionToVM(timeline14dResult.data, '14d', locale),
        '30d': mapPersonalRiskTimelineProjectionToVM(timeline30dResult.data, '30d', locale),
      },
    },
  }
}
