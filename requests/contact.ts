import { apiTransport } from '@/lib/api/transport'

export interface ContactFormPayload {
  name: string
  email: string
  message: string
  token: string
}

export async function sendContactForm(payload: ContactFormPayload) {
  const res = await apiTransport('/api/backend/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return res
}
