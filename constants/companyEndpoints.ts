export const COMPANY_ENDPOINTS = Object.freeze({
  BASE: '/companies',
  MY: '/companies/my',
  byId: (id: string) => `/companies/${id}`,
})

export const GROUP_ENDPOINTS = Object.freeze({
  BASE: '/groups',
  byCompany: (companyId: string) => `/groups?companyId=${companyId}`,
  byId: (id: string) => `/groups/${id}`,
})

export const INVITE_ENDPOINTS = Object.freeze({
  BASE: '/invites',
  byId: (id: string) => `/invites/${id}`,
  resend: (id: string) => `/invites/${id}/resend`,
})

export const ACCESS_SCOPE_ENDPOINTS = Object.freeze({
  BASE: '/access-scopes',
  byId: (id: string) => `/access-scopes/${id}`,
})

export const EMPLOYEE_ENDPOINTS = Object.freeze({
  BASE: '/employees',
  byId: (id: string) => `/employees/${id}`,
  byRole: (role: string) => `/employees?role=${role}`,
  paginated: (page: number, limit: number) => `/employees?page=${page}&limit=${limit}`,
})

// ─── Admin-scoped (per-company) endpoints ────────────────────────────────────

export const COMPANY_ADMIN_ENDPOINTS = Object.freeze({
  employees: (companyId: string, page: number, limit: number) =>
    `/companies/${companyId}/employees?page=${page}&limit=${limit}`,
  employeeById: (companyId: string, empId: string) => `/companies/${companyId}/employees/${empId}`,
  employeeRole: (companyId: string, empId: string) => `/companies/${companyId}/employees/${empId}/role`,
  employeesByRole: (companyId: string, role: string) => `/companies/${companyId}/employees?role=${role}`,
  groups: (companyId: string) => `/companies/${companyId}/groups`,
  groupById: (companyId: string, id: string) => `/companies/${companyId}/groups/${id}`,
  inviteBase: (companyId: string) => `/companies/${companyId}/invites`,
  invites: (companyId: string, page: number, limit: number) =>
    `/companies/${companyId}/invites?page=${page}&limit=${limit}`,
  inviteById: (companyId: string, id: string) => `/companies/${companyId}/invites/${id}`,
  inviteResend: (companyId: string, id: string) => `/companies/${companyId}/invites/${id}/resend`,
  accessScopes: (companyId: string) => `/companies/${companyId}/access-scopes`,
  accessScopeById: (companyId: string, id: string) => `/companies/${companyId}/access-scopes/${id}`,
})
