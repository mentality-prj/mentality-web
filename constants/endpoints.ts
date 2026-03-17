export const MOOD_STORY_ENDPOINTS = Object.freeze({
  LATEST: '/mood-story/latest',
})

export const MOOD_RECORD_ENDPOINTS = Object.freeze({
  BASE: '/mood-record',
  LAST: '/mood-record/last',
  byId: (id: string) => `/mood-record/${id}`,
  setActive: (id: string) => `/mood-record/${id}/active`,
})
