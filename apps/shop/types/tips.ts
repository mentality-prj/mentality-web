import { SupportedLanguage } from '@/types/languages'

export type Tip = {
  id: string
  createdAt: string
  isPublished: boolean
  translations: Record<SupportedLanguage, string>
  updatedAt: string
}
