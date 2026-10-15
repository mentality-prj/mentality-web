import { publicApiRequest } from '@/helpers/api-wrapper'

export interface ContactFormPayload {
  name: string
  email: string
  message: string
  token: string
}

export async function sendContactForm(payload: ContactFormPayload) {
  return publicApiRequest('/contact', payload)
}
