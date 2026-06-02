export const B2C_MOOD_STORY_ENDPOINTS = Object.freeze({
  LATEST: '/mood-story/latest',
  REGENERATE: '/mood-story/regenerate',
})

export const B2C_MOOD_RECORD_ENDPOINTS = Object.freeze({
  BASE: '/mood-record',
  LAST: '/mood-record/last',
  byId: (id: string) => `/mood-record/${id}`,
  setActive: (id: string) => `/mood-record/${id}/active`,
})

export const B2C_USER_STATISTICS_ENDPOINTS = Object.freeze({
  MOOD: '/user-statistics/mood',
  PSYTESTS: '/user-statistics/psytests',
})

export const MOOD_STORY_ENDPOINTS = B2C_MOOD_STORY_ENDPOINTS
export const MOOD_RECORD_ENDPOINTS = B2C_MOOD_RECORD_ENDPOINTS
export const USER_STATISTICS_ENDPOINTS = B2C_USER_STATISTICS_ENDPOINTS
