export const COMPANY_ENDPOINTS = Object.freeze({
  BASE: '/companies',
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
