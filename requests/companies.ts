import { COMPANY_ENDPOINTS } from '@/constants/companyEndpoints'
import { logger } from '@/lib/logger'
import { CustomSession } from '@/types/auth'
import { CompanyEntity, CreateCompanyDto } from '@/types/company'

import { APIUrl } from './config'
import { performAdminRequest, performAuthRequest } from './genericFetch'

export async function createCompany(
  session: CustomSession | null,
  dto: CreateCompanyDto
): Promise<{ data: CompanyEntity } | { error: string }> {
  const res = await performAdminRequest<CompanyEntity>(session, `${APIUrl}${COMPANY_ENDPOINTS.BASE}`, {
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
  const res = await performAdminRequest<CompanyEntity[]>(session, `${APIUrl}${COMPANY_ENDPOINTS.BASE}`)

  if ('error' in res) {
    logger.error('Failed to fetch companies', { error: res.error })
    return { error: res.error }
  }

  return { data: Array.isArray(res.data) ? res.data : [] }
}

export async function getMyCompany(
  session: CustomSession | null
): Promise<{ data: CompanyEntity } | { error: string }> {
  const res = await performAuthRequest<CompanyEntity>(session, `${APIUrl}${COMPANY_ENDPOINTS.MY}`)

  if ('error' in res) {
    logger.error('Failed to fetch my company', { error: res.error })
    return { error: res.error }
  }

  return { data: res.data as CompanyEntity }
}

export async function getCompanyById(
  session: CustomSession | null,
  id: string
): Promise<{ data: CompanyEntity } | { error: string }> {
  const res = await performAdminRequest<CompanyEntity>(session, `${APIUrl}${COMPANY_ENDPOINTS.byId(id)}`)

  if ('error' in res) {
    logger.error('Failed to fetch company by id', { error: res.error, id })
    return { error: res.error }
  }

  return { data: res.data as CompanyEntity }
}
