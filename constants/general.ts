export const APP_VIEW_TYPE = {
  ADMIN: 'admin',
  LANDING: 'landing',
  DEFAULT: 'default',
} as const

export type AppViewType = (typeof APP_VIEW_TYPE)[keyof typeof APP_VIEW_TYPE]
