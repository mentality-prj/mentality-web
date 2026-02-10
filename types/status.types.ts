export const Statuses = {
  base: 'base',
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
  joy: 'joy',
} as const

export type StatusType = keyof typeof Statuses

export const darkTypes = [
  Statuses.dark,
  Statuses.accent,
  Statuses.warn,
  Statuses.error,
  Statuses.special,
  Statuses.support,
]
export const whiteTypes = [Statuses.default, Statuses.ghost]
