function companyUrl(companyId: string, path: string): string {
  return `/companies/${companyId}${path}`
}

export const COMPANY_ENDPOINTS = Object.freeze({
  BASE: '/companies',
  MY: '/companies/my',
  byId: (id: string) => `/companies/${id}`,
})

export const GROUP_ENDPOINTS = Object.freeze({
  byCompany: (companyId: string) => companyUrl(companyId, '/groups'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/groups/${id}`),
  members: (companyId: string, groupId: string) => companyUrl(companyId, `/groups/${groupId}/members`),
  memberById: (companyId: string, groupId: string, userId: string) =>
    companyUrl(companyId, `/groups/${groupId}/members/${userId}`),
})

export const INVITE_ENDPOINTS = Object.freeze({
  base: (companyId: string) => companyUrl(companyId, '/invites'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}`),
  accept: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/accept`),
  decline: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/decline`),
  cancel: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/cancel`),
  resend: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/resend`),
})

export const ACCESS_SCOPE_ENDPOINTS = Object.freeze({
  base: (companyId: string) => companyUrl(companyId, '/access-scopes'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/access-scopes/${id}`),
})

export const EMPLOYEE_ENDPOINTS = Object.freeze({
  paginated: (companyId: string, page: number, limit: number) =>
    companyUrl(companyId, `/employees?page=${page}&limit=${limit}`),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/employees/${id}`),
  byRole: (companyId: string, role: string) => companyUrl(companyId, `/employees?role=${role}`),
})

// ─── Admin-scoped (per-company) endpoints ────────────────────────────────────

export const COMPANY_ADMIN_ENDPOINTS = Object.freeze({
  employees: (companyId: string, page: number, limit: number) =>
    companyUrl(companyId, `/employees?page=${page}&limit=${limit}`),
  employeeById: (companyId: string, empId: string) => companyUrl(companyId, `/employees/${empId}`),
  employeeRole: (companyId: string, empId: string) => companyUrl(companyId, `/employees/${empId}/role`),
  employeesByRole: (companyId: string, role: string) => companyUrl(companyId, `/employees?role=${role}`),
  groups: (companyId: string) => companyUrl(companyId, '/groups'),
  groupById: (companyId: string, id: string) => companyUrl(companyId, `/groups/${id}`),
  inviteBase: (companyId: string) => companyUrl(companyId, '/invites'),
  invites: (companyId: string, page: number, limit: number) =>
    companyUrl(companyId, `/invites?page=${page}&limit=${limit}`),
  inviteById: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}`),
  inviteResend: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/resend`),
  accessScopes: (companyId: string) => companyUrl(companyId, '/access-scopes'),
  accessScopeById: (companyId: string, id: string) => companyUrl(companyId, `/access-scopes/${id}`),
})

export const DECISION_SUPPORT_ENDPOINTS = Object.freeze({
  report: (companyId: string) => companyUrl(companyId, '/decision-support/report'),
  riskEvents: (companyId: string) => companyUrl(companyId, '/decision-support/risk-events'),
  riskEventAddress: (companyId: string, eventId: string) =>
    companyUrl(companyId, `/decision-support/risk-events/${eventId}/address`),
  riskEventEvidence: (companyId: string, eventId: string) =>
    companyUrl(companyId, `/decision-support/risk-events/${eventId}/evidence`),
})
