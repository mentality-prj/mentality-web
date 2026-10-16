import {
  decodeResearchGrantResponse,
  decodeResearchMemberResponse,
  decodeResearchProjectResponse,
} from '@/features/research/api/researchEntityResponses'
import {
  decodeResearchAuditResponse,
  decodeResearchGrantsResponse,
  decodeResearchMembersResponse,
  decodeResearchProjectsResponse,
} from '@/features/research/api/researchListResponses'
import {
  createResearchExportDecoder,
  decodeResearchCohortResponse,
  decodeResearchHistoryResponse,
} from '@/features/research/api/researchOperationalResponses'
import { decodeResearchWorkspaceResponse } from '@/features/research/api/researchWorkspaceResponse'
import { normalizeInspection, normalizeProject } from '@/features/research/model/researchProjectEntities'
import {
  toResearchProjectCohortBody,
  toResearchProjectGrantBody,
  toResearchProjectMutationBody,
} from '@/features/research/model/researchProjectPayloads'
import {
  asArray,
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
  const response = await performAuthRequest(session, RESEARCH_BASE_URL, {
    method: 'POST',
    body: toResearchProjectMutationBody(payload),
    decodeResponse: decodeResearchProjectResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: normalizeProject(response.data, session) }
}

export async function getResearchProjectById(
  session: CustomSession | null,
  projectId: string
): Result<ResearchProject> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}`, {
    decodeResponse: decodeResearchProjectResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: normalizeProject(response.data, session) }
}

export async function updateResearchProject(
  session: CustomSession | null,
  projectId: string,
  payload: Partial<ResearchProjectMutationInput>
): Result<ResearchProject> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}`, {
    method: 'PATCH',
    body: toResearchProjectMutationBody(payload),
    decodeResponse: decodeResearchProjectResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: normalizeProject(response.data, session) }
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
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/members`, {
    method: 'POST',
    body: payload,
    decodeResponse: decodeResearchMemberResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
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
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/cohorts`, {
    decodeResponse: decodeResearchCohortResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function updateResearchProjectCohort(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchProjectCohortInput
): Result<ResearchProjectCohort | null> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/cohorts`, {
    method: 'PATCH',
    body: toResearchProjectCohortBody(payload),
    decodeResponse: decodeResearchCohortResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
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
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/grants`, {
    method: 'POST',
    body: toResearchProjectGrantBody(payload),
    decodeResponse: decodeResearchGrantResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
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
  const url = `${RESEARCH_BASE_URL}/${projectId}/datasets/history${buildQuery({
    from: filters.from,
    to: filters.to,
    limit: filters.limit,
  })}`
  const response = await performAuthRequest(session, url, {
    decodeResponse: decodeResearchHistoryResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function requestResearchProjectExport(
  session: CustomSession | null,
  projectId: string,
  payload: ResearchExportRequest
): Result<ResearchExportResponse> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/exports`, {
    method: 'POST',
    body: {
      format: payload.format,
      requestedFields: payload.requestedFields,
      reason: payload.reason,
    },
    decodeResponse: createResearchExportDecoder(projectId, payload),
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function getResearchProjectAudit(
  session: CustomSession | null,
  projectId: string
): Result<ResearchAuditEvent[]> {
  const response = await performAuthRequest(session, `${RESEARCH_BASE_URL}/${projectId}/audit`, {
    decodeResponse: decodeResearchAuditResponse,
  })

  if ('error' in response) return forwardApiFailure(response)
  return { data: response.data }
}

export async function getResearchWorkspaceAccess(session: CustomSession | null): Result<ResearchWorkspaceAccess> {
  const cacheKey = getResearchWorkspaceAccessCacheKey(session)
  const existingRequest = cacheKey ? inFlightResearchWorkspaceAccessRequests.get(cacheKey) : undefined

  if (existingRequest) {
    return existingRequest
  }

  const requestPromise: Promise<ResultValue<ResearchWorkspaceAccess>> = (async () => {
    const response = await performAuthRequest(session, RESEARCH_BASE_URL, {
      decodeResponse: decodeResearchWorkspaceResponse,
    })

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

    const { source, projects: projectItems } = response.data
    const capabilities = getStringArray(source, ['capabilities', 'workspaceCapabilities']).filter(
      (item): item is ResearchWorkspaceCapability => item === 'scientist' || item === 'research_admin'
    )

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
