import { StatusType } from '@/types/status.types'

export const BORDER_BY_STATUS: Record<StatusType, string> = {
  success: 'border border-inner-white border-border-success',
  warn: 'border border-inner-white border-warning',
  error: 'border border-inner-white border-border-error',
  info: 'border border-inner-white border-border-success',
  special: 'border border-inner-white border-border-success',
  base: 'border border-inner-white border-border-success',
  default: 'border border-inner-white border-border-success',
  ghost: 'border border-inner-white border-border-success',
  accent: 'border border-inner-white border-border-success',
  dark: 'border border-inner-white border-border-success',
  note: 'border border-inner-white border-warning',
  support: 'border border-inner-white border-border-success',
  tag: 'border border-inner-white border-border-success',
  'tag-white': 'border border-inner-white border-border-success',
  joy: 'border border-inner-white border-border-success',
}
