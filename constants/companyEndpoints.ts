function companyUrl(companyId: string, path: string): string {
  return `/companies/${companyId}${path}`
}

// Global admin service layer
export const GLOBAL_ADMIN_COMPANY_ENDPOINTS = Object.freeze({
  base: '/companies',
  byId: (id: string) => `/companies/${id}`,
})

// B2B company membership layer
export const B2B_COMPANY_MEMBERSHIP_ENDPOINTS = Object.freeze({
  my: '/companies/my',
})

// B2B company collaboration layer
export const B2B_GROUP_ENDPOINTS = Object.freeze({
  byCompany: (companyId: string) => companyUrl(companyId, '/groups'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/groups/${id}`),
  members: (companyId: string, groupId: string) => companyUrl(companyId, `/groups/${groupId}/members`),
  memberById: (companyId: string, groupId: string, userId: string) =>
    companyUrl(companyId, `/groups/${groupId}/members/${userId}`),
})

export const B2B_INVITE_ENDPOINTS = Object.freeze({
  base: (companyId: string) => companyUrl(companyId, '/invites'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}`),
  accept: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/accept`),
  decline: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/decline`),
  cancel: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/cancel`),
  resend: (companyId: string, id: string) => companyUrl(companyId, `/invites/${id}/resend`),
})

export const B2B_ACCESS_SCOPE_ENDPOINTS = Object.freeze({
  base: (companyId: string) => companyUrl(companyId, '/access-scopes'),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/access-scopes/${id}`),
})

export const B2B_EMPLOYEE_ENDPOINTS = Object.freeze({
  paginated: (companyId: string, page: number, limit: number) =>
    companyUrl(companyId, `/employees?page=${page}&limit=${limit}`),
  byId: (companyId: string, id: string) => companyUrl(companyId, `/employees/${id}`),
  byRole: (companyId: string, role: string) => companyUrl(companyId, `/employees?role=${role}`),
})

// B2B company-admin layer

export const B2B_COMPANY_ADMIN_ENDPOINTS = Object.freeze({
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

// B2B operational decision-support layer

export const B2B_DECISION_SUPPORT_ENDPOINTS = Object.freeze({
  report: (companyId: string) => companyUrl(companyId, '/decision-support/report'),
  riskEvents: (companyId: string) => companyUrl(companyId, '/decision-support/risk-events'),
  riskEventAddress: (companyId: string, eventId: string) =>
    companyUrl(companyId, `/decision-support/risk-events/${eventId}/address`),
  riskEventEvidence: (companyId: string, eventId: string) =>
    companyUrl(companyId, `/decision-support/risk-events/${eventId}/evidence`),
})

// B2B decision-support diagnostics admin layer

export const B2B_DECISION_SUPPORT_ADMIN_ENDPOINTS = Object.freeze({
  policyMetrics: (companyId: string) =>
    `/admin-diagnostics/v1/ml/policy-metrics?companyId=${encodeURIComponent(companyId)}`,
  policyMetricsGlobal: () => '/admin-diagnostics/v1/ml/policy-metrics',
})

// Backward-compatible aliases for existing request modules.
export const COMPANY_ENDPOINTS = Object.freeze({
  BASE: GLOBAL_ADMIN_COMPANY_ENDPOINTS.base,
  MY: B2B_COMPANY_MEMBERSHIP_ENDPOINTS.my,
  byId: GLOBAL_ADMIN_COMPANY_ENDPOINTS.byId,
})

export const GROUP_ENDPOINTS = B2B_GROUP_ENDPOINTS
export const INVITE_ENDPOINTS = B2B_INVITE_ENDPOINTS
export const ACCESS_SCOPE_ENDPOINTS = B2B_ACCESS_SCOPE_ENDPOINTS
export const EMPLOYEE_ENDPOINTS = B2B_EMPLOYEE_ENDPOINTS
export const COMPANY_ADMIN_ENDPOINTS = B2B_COMPANY_ADMIN_ENDPOINTS
export const DECISION_SUPPORT_ENDPOINTS = B2B_DECISION_SUPPORT_ENDPOINTS
export const DECISION_SUPPORT_ADMIN_ENDPOINTS = B2B_DECISION_SUPPORT_ADMIN_ENDPOINTS
