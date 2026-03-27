import { COMPANY_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { CompanyEntity, CreateCompanyDto } from '@/types/company'
import { COMPANY_ROLES } from '@/types/rbac'

import { APIUrl } from './config'
import { performAuthRequest } from './genericFetch'

function assertGlobalAdmin(session: CustomSession | null): boolean {
  return session?.user?.companyRole === COMPANY_ROLES.GLOBAL_ADMIN
}

export async function createCompany(
  session: CustomSession | null,
  dto: CreateCompanyDto
): Promise<{ data: CompanyEntity } | { error: string }> {
  if (!assertGlobalAdmin(session)) {
    logger.warn('Unauthorized attempt to create company', { userId: session?.user?.email })
    return { error: 'Unauthorized: GLOBAL_ADMIN role required' }
  }

  const res = await performAuthRequest<CompanyEntity>(session, `${APIUrl}${COMPANY_ENDPOINTS.BASE}`, {
    method: 'POST',
    body: dto as unknown as Record<string, unknown>,
  })

  if ('error' in res) {
    logger.error('Failed to create company', { error: res.error })
    return { error: res.error }
  }

  logger.info('Company created', { name: dto.name })
  return { data: res.data as CompanyEntity }
}

export async function getCompanies(
  session: CustomSession | null
): Promise<{ data: CompanyEntity[] } | { error: string }> {
  const res = await performAuthRequest<CompanyEntity[]>(session, `${APIUrl}${COMPANY_ENDPOINTS.BASE}`)

  if ('error' in res) {
    logger.error('Failed to fetch companies', { error: res.error })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}
