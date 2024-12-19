import { NewCheckout } from '@/schema'

export type CheckoutDataKeys = keyof NewCheckout

export interface InputProps {
  label: string
  id: CheckoutDataKeys
  description?: string
  required?: boolean
  pattern?: string
  type: string
  minLength?: number
  min?: number
  max?: number
  errorMsg?: string
}
