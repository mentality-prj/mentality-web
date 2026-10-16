import {
  decodeResearchCollection,
  decodeResearchEntity,
  decodeResearchWorkspaceProjects,
  hasResearchEntityId,
} from '@/features/research/api/researchCollection.contract'
import {
  decodeResearchGrantsResponse,
  decodeResearchMembersResponse,
  decodeResearchProjectsResponse,
} from '@/features/research/api/researchListResponses'
import {
  normalizeAuditEvents,
  normalizeCohort,
  normalizeExportResponse,
  normalizeGrant,
  normalizeHistoryDataset,
  normalizeInspection,
  normalizeProject,
  normalizeProjectMember,
} from '@/features/research/model/researchProjectEntities'
import {
  toResearchProjectCohortBody,
  toResearchProjectGrantBody,
  toResearchProjectMutationBody,
} from '@/features/research/model/researchProjectPayloads'
import {
  asArray,
  asObject,
  EMPTY_PERMISSIONS,
  getBoolean,
  getStringArray,
  getValue,
  hasResolvedCompanyLabel,
  JsonObject,
  normalizeWorkspaceCompanyOption,
  upsertWorkspaceCompanyOption,
} from '@/features/research/model/researchProjectPrimitives'
import { isResearchCompanyBoundaryNotDefined } from '@/helpers/researchErrorMessage'
import { type ApiResult, type ApiResultPromise, forwardApiFailure } from '@/lib/api-result'
import { getCompanies, getMyCompany } from '@/requests/companies'
import { APIUrl } from '@/requests/config'
import { performAuthRequest } from '@/requests/genericFetch'
import type { CustomSession } from '@/types/auth'
import type {
  ResearchAuditEvent,
  ResearchExportRequest,
  ResearchExportResponse,
  ResearchHistoryDataset,
  ResearchHistoryDatasetFilters,
  ResearchMLInspection,
  ResearchMLInspectionQuery,
  ResearchProject,
  ResearchProjectCohort,
  ResearchProjectCohortInput,
  ResearchProjectGrant,
  ResearchProjectGrantInput,
  ResearchProjectMember,
  ResearchProjectMutationInput,
  ResearchWorkspaceAccess,
  ResearchWorkspaceCapability,
  ResearchWorkspaceCompanyOption,
  ResearchWorkspaceRole,
} from '@/types/research'

type ResultValue<T> = ApiResult<T>
type Result<T> = ApiResultPromise<T>

const RESEARCH_BASE_URL = `${APIUrl}/research/v1/projects`

const inFlightResearchWorkspaceAccessRequests = new Map<string, Promise<ResultValue<ResearchWorkspaceAccess>>>()

async function resolveWorkspaceCompanies(
  session: CustomSession | null,
  source: JsonObject | null,
  projects: ResearchProject[]
): Promise<ResearchWorkspaceCompanyOption[]> {
  const companiesMap = new Map<string, ResearchWorkspaceCompanyOption>()

  asArray(getValue(source, ['companies', 'availableCompanies', 'companyScopes']))
    .map((item) => normalizeWorkspaceCompanyOption(item))
    .filter((item): item is ResearchWorkspaceCompanyOption => item !== null)
    .forEach((company) => upsertWorkspaceCompanyOption(companiesMap, company))

  projects.forEach((project) => {
    if (!project.companyId) {
      return
    }

    upsertWorkspaceCompanyOption(companiesMap, {
      id: project.companyId,
      name: project.companyName || project.companyId,
    })
  })

  const unresolvedCompanyIds = Array.from(companiesMap.values())
    .filter((company) => !hasResolvedCompanyLabel(company))
    .map((company) => company.id)

  if (unresolvedCompanyIds.length === 0 || !session) {
    return Array.from(companiesMap.values())
  }

  if (session.user?.role === 'admin') {
    const companiesResult = await getCompanies(session)

    if ('data' in companiesResult) {
      companiesResult.data.forEach((company) => {
        if (unresolvedCompanyIds.includes(company.id) && company.name) {
          upsertWorkspaceCompanyOption(companiesMap, {
            id: company.id,
            name: company.name,
          })
        }
      })
    }

    return Array.from(companiesMap.values())
  }

  const myCompanyResult = await getMyCompany(session)

  if (
    'data' in myCompanyResult &&
    unresolvedCompanyIds.includes(myCompanyResult.data.id) &&
    myCompanyResult.data.name
  ) {
    upsertWorkspaceCompanyOption(companiesMap, {
      id: myCompanyResult.data.id,
      name: myCompanyResult.data.name,
    })
  }

  return Array.from(companiesMap.values())
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value))
    }
  })

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

function getResearchWorkspaceAccessCacheKey(session: CustomSession | null): string | null {
  const token = session?.OAuthToken?.trim()
  if (!token) {
    return null
  }

  return `${session?.user?.id ?? session?.user?.email ?? 'anonymous'}:${token}`
}

async function performResearchRequest(
  session: CustomSession | null,
  path: string,
  options?: { method?: string; body?: Record<string, unknown> }
): ApiResultPromise<unknown> {
  // Parse transport bytes as unknown; concrete types are established by the
  // feature decoders, never by generic type assertions on untrusted JSON.
  const response = await performAuthRequest<unknown>(session, `${RESEARCH_BASE_URL}${path}`, options)

  if ('error' in response) {
    return forwardApiFailure(response)
  }

  return { data: response.data }
}

export function hasResearchCapability(access: ResearchWorkspaceAccess | null): boolean {
  return Boolean(access?.hasAccess)
}

export async function getResearchProjects(session: CustomSession | null): Result<ResearchProject[]> {
  const response = await performAuthRequest(session, RESEARCH_BASE_URL, {
    decodeResponse: decodeResearchProjectsResponse,
  })
  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data.map((project) => normalizeProject(project, session)) }
}

export async function createResearchProject(
  session: CustomSession | null,
  payload: ResearchProjectMutationInput
): Result<ResearchProject> {
  const response = await performResearchRequest(session, '', {
    method: 'POST',
    body: toResearchProjectMutationBody(payload),
  })

  if ('error' in response) {
    return response
  }

  const project = decodeResearchEntity(response.data)
  if (!project) {
    return { error: 'Invalid research project response from backend', status: 502 }
  }

  return { data: normalizeProject(project, session) }
}

export async function getResearchProjectById(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProject> {
  const response = await performAuthRequest<Record<string, unknown>>(session, `${RESEARCH_BASE_URL}/${projectId}`, {
    decodeResponse: (value) => {
      const entity = decodeResearchEntity(value)
      return entity
        ? { success: true, data: entity }
        : { success: false, error: 'Invalid research project response from backend' }
    },
  })

  if ('error' in response) {
    return forwardApiFailure(response)
  }

  // Keep feature-level validation as a defense in depth for adapters/mocks.
  const project = decodeResearchEntity(response.data)
  if (!project) {
    return { error: 'Invalid research project response from backend', status: 502 }
  }

  return { data: normalizeProject(project, session) }
}

export async function updateResearchProject(
  session: CustomSession | null,
  projectId: string,
  payload: Partial<ResearchProjectMutationInput>
): Result<ResearchProject> {
  const response = await performResearchRequest(session, `/${projectId}`, {
    method: 'PATCH',
    body: toResearchProjectMutationBody(payload),
  })

  if ('error' in response) {
    return response
  }

  const project = decodeResearchEntity(response.data)
  if (!project) {
    return { error: 'Invalid research project response from backend', status: 502 }
  }

  return { data: normalizeProject(project, session) }
}

export async function getResearchProjectMembers(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectMember[]> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/members`, {
    decodeResponse: decodeResearchMembersResponse,
  })
  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function addResearchProjectMember(
  session: CustomSession | null,
  projectId: string,
  payload: { userId: string; role: ResearchWorkspaceRole }
): Result<ResearchProjectMember> {
  const response = await performResearchRequest(session, `/${projectId}/members`, {
    method: 'POST',
    body: payload,
  })

  if ('error' in response) {
    return response
  }

  const member = normalizeProjectMember(response.data, EMPTY_PERMISSIONS)
  if (!member) {
    return { error: 'Failed to normalize project member' }
  }

  return { data: member }
}

export async function removeResearchProjectMember(
  session: CustomSession | null,
  projectId: string,
  userId: string
): Result<{ ok: true }> {
  const response = await performResearchRequest(session, `/${projectId}/members/${userId}`, {
    method: 'DELETE',
  })

  if ('error' in response) {
    return response
  }

  return { data: { ok: true } }
}

export async function getResearchProjectCohort(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectCohort | null> {
  const response = await performResearchRequest(session, `/${projectId}/cohorts`)

  if ('error' in response) {
    return response
  }

  const source = Array.isArray(response.data) ? response.data[0] : response.data
  return { data: normalizeCohort(source) }
}

export async function updateResearchProjectCohort(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchProjectCohortInput
): Result<ResearchProjectCohort | null> {
  const response = await performResearchRequest(session, `/${projectId}/cohorts`, {
    method: 'PATCH',
    body: toResearchProjectCohortBody(payload),
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeCohort(response.data) }
}

export async function getResearchProjectGrants(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProjectGrant[]> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/grants`, {
    decodeResponse: decodeResearchGrantsResponse,
  })
  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function createResearchProjectGrant(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchProjectGrantInput
): Result<ResearchProjectGrant> {
  const response = await performResearchRequest(session, `/${projectId}/grants`, {
    method: 'POST',
    body: toResearchProjectGrantBody(payload),
  })

  if ('error' in response) {
    return response
  }

  const grantData = decodeResearchEntity(response.data)
  if (!grantData) {
    return { error: 'Invalid research grant response from backend', status: 502 }
  }

  const grant = normalizeGrant(grantData)
  if (!grant) {
    return { error: 'Invalid research grant response from backend', status: 502 }
  }

  return { data: grant }
}

export async function getResearchProjectMLInspection(
  session: CustomSession | null,
  projectId: string,
  query?: ResearchMLInspectionQuery
): Result<ResearchMLInspection | null> {
  const response = await performResearchRequest(
    session,
    `/${projectId}/ml/inspection${buildQuery({
      target: query?.target,
      targetId: query?.targetId,
      modelVersion: query?.modelVersion,
    })}`
  )

  if ('error' in response) {
    return response
  }

  return { data: normalizeInspection(response.data, query) }
}

export async function getResearchProjectHistoryDataset(
  session: CustomSession | null,
  projectId: string,
  filters: ResearchHistoryDatasetFilters = {}
): Result<ResearchHistoryDataset> {
  const response = await performResearchRequest(
    session,
    `/${projectId}/datasets/history${buildQuery({
      from: filters.from,
      to: filters.to,
      limit: filters.limit,
    })}`
  )

  if ('error' in response) {
    return response
  }

  return { data: normalizeHistoryDataset(response.data) }
}

export async function requestResearchProjectExport(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchExportRequest
): Result<ResearchExportResponse> {
  const response = await performResearchRequest(session, `/${projectId}/exports`, {
    method: 'POST',
    body: {
      format: payload.format,
      requestedFields: payload.requestedFields,
      reason: payload.reason,
    },
  })

  if ('error' in response) {
    return response
  }

  return { data: normalizeExportResponse(response.data, projectId, payload) }
}

export async function getResearchProjectAudit(
  session: CustomSession | null,
  projectId: string
): Result<ResearchAuditEvent[]> {
  const response = await performResearchRequest(session, `/${projectId}/audit`)

  if ('error' in response) {
    return response
  }

  const events = decodeResearchCollection(response.data, ['items', 'data', 'events'])
  if (!events) {
    return { error: 'Invalid research audit response from backend', status: 502 }
  }

  const audit = normalizeAuditEvents(events)
  if (audit.length !== events.length) {
    return { error: 'Invalid research audit response from backend', status: 502 }
  }

  return { data: audit }
}

export async function getResearchWorkspaceAccess(session: CustomSession | null): Result<ResearchWorkspaceAccess> {
  const cacheKey = getResearchWorkspaceAccessCacheKey(session)
  const existingRequest = cacheKey ? inFlightResearchWorkspaceAccessRequests.get(cacheKey) : undefined

  if (existingRequest) {
    return existingRequest
  }

  const requestPromise: Promise<ResultValue<ResearchWorkspaceAccess>> = (async () => {
    const response = await performResearchRequest(session, '')

    if ('error' in response) {
      if (response.status === 403 && !isResearchCompanyBoundaryNotDefined(response.error)) {
        return {
          data: {
            hasAccess: false,
            canCreateProjects: false,
            capabilities: [],
            companies: [],
            scientists: [],
          },
        }
      }

      return response
    }

    const source = asObject(response.data)
    const capabilities = getStringArray(source, ['capabilities', 'workspaceCapabilities']).filter(
      (item): item is ResearchWorkspaceCapability => item === 'scientist' || item === 'research_admin'
    )
    const projectItems = decodeResearchWorkspaceProjects(response.data)
    if (!projectItems || !projectItems.every(hasResearchEntityId)) {
      return { error: 'Invalid research workspace response from backend', status: 502 }
    }

    const projects = projectItems.map((item) => normalizeProject(item, session))
    const companies = await resolveWorkspaceCompanies(session, source, projects)

    const canCreateProjects =
      session?.user?.role === 'admin' ||
      getBoolean(source, ['canCreateProject', 'createProjectAllowed'], false) ||
      projects.some((project) => project.permissions.canCreateProject) ||
      capabilities.includes('research_admin')

    return {
      data: {
        hasAccess: true,
        canCreateProjects,
        capabilities,
        companies,
        scientists: [],
      },
    }
  })()

  if (cacheKey) {
    inFlightResearchWorkspaceAccessRequests.set(cacheKey, requestPromise)
  }

  try {
    return await requestPromise
  } finally {
    if (cacheKey && inFlightResearchWorkspaceAccessRequests.get(cacheKey) === requestPromise) {
      inFlightResearchWorkspaceAccessRequests.delete(cacheKey)
    }
  }
}
