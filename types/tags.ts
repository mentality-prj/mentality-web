import { SupportedLanguage } from '@/types/languages'

export type AdminTag = {
  id?: string
  key: string
  // Admin-managed tags MUST include translations (backend requires them)
  translations: Record<SupportedLanguage, string>
  createdAt?: string
  updatedAt?: string
}

export type UserTag = {
  id?: string
  key: string
  // User-created tags provide a single display name; backend expects `name` for simple tags
  name: string
  createdAt?: string
  updatedAt?: string
}

// Union for convenience where either is acceptable
export type Tag = AdminTag | UserTag

export type FieldKey = 'key' | 'uk' | 'en' | 'pl'

export type TagProperties = {
  key: string
  name: FieldKey
}
