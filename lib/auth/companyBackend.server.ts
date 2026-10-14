import { APIUrl } from '@/requests/config'

/**
 * Reviewed server-only NestJS transport for the company-context handshake.
 * Never import this adapter from browser/client modules; bearer tokens stay server-side.
 */
export async function requestUserCompanies(accessToken: string): Promise<Response> {
  return fetch(`${APIUrl}/companies/mine`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
}

export async function requestCompanyRole(accessToken: string, companyId: string): Promise<Response> {
  return fetch(`${APIUrl}/auth/validate-token`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-company-id': companyId,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
}
