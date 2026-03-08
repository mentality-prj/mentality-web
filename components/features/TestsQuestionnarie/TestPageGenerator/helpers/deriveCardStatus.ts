import { StatusType } from '@/types/status.types'

export function deriveCardStatus(index: number, total: number): StatusType {
  if (index <= 0) return 'success'
  if (index >= total - 1) return 'error'
  return 'warn'
}
