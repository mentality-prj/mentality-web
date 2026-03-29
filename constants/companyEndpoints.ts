export const COMPANY_ENDPOINTS = Object.freeze({
  BASE: '/companies',
  MY: '/companies/my',
  byId: (id: string) => `/companies/${id}`,
})

export const GROUP_ENDPOINTS = Object.freeze({
  BASE: '/groups',
  byId: (id: string) => `/groups/${id}`,
  accessible: '/groups?accessible=true',
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
