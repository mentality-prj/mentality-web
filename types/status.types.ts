export const Statuses = {
  default: 'default',
  accent: 'accent',
  dark: 'dark',
  error: 'error',
  info: 'info',
  success: 'success',
  warn: 'warn',
  special: 'special',
  tag: 'tag',
} as const

export type StatusType = keyof typeof Statuses
