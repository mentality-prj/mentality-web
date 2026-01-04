export const Statuses = {
  default: 'default',
  ghost: 'ghost',
  accent: 'accent',
  dark: 'dark',
  error: 'error',
  info: 'info',
  note: 'note',
  success: 'success',
  support: 'support',
  warn: 'warn',
  special: 'special',
  tag: 'tag',
  'tag-white': 'tag-white',
} as const

export type StatusType = keyof typeof Statuses
