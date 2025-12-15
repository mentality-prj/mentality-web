import { SupportedLanguage } from '@/types/languages'

export type Tag = {
  id?: string
  key: string
  translations: Record<SupportedLanguage, string>
  createdAt?: Date
  updatedAt?: Date
}

export type FieldKey = 'key' | 'uk' | 'en' | 'pl'

export type TagProperties = {
  key: string
  name: FieldKey
}
