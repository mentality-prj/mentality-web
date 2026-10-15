/** Browser cannot forge a role by editing this cookie; the backend rechecks membership. */
export const ACTIVE_COMPANY_COOKIE = 'dzvin-active-company'

export function isValidCompanyId(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^[a-f0-9]{24}$/i.test(value)
}
