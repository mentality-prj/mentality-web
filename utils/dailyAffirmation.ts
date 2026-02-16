import { AffirmationEntity } from '@/types/api-responses'

export const COOKIE_KEY = 'daily-affirmation'

export interface StoredAffirmation {
  affirmation: AffirmationEntity
  date: string
}

export function getTodayDate(): string {
  const now = new Date()
  return now.toISOString().split('T')[0] // YYYY-MM-DD
}

export function setCookie(name: string, value: string, days: number = 1): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`
}

export function saveAffirmation(affirmation: AffirmationEntity): void {
  try {
    const data: StoredAffirmation = {
      affirmation,
      date: getTodayDate(),
    }
    setCookie(COOKIE_KEY, JSON.stringify(data), 1)
  } catch (error) {
    console.error('Failed to save affirmation:', error)
  }
}
