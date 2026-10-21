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

/** Separate B2B contract: the legacy "company" key remains an anti-spam honeypot. */
export type BusinessContactFormPayload = {
  name: string
  email: string
  companyName: string
  role?: string
  teamSize: '1-20' | '21-100' | '101-500' | '501+' | 'unsure'
  interest: 'pilot' | 'demo' | 'partnership'
  message?: string
  contactConsent: true
  token: string
  website?: string
}

export async function sendBusinessContactForm(payload: BusinessContactFormPayload) {
  return publicApiRequest('/contact/business', payload)
}
