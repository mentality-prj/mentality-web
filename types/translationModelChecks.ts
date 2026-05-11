import { SupportedLanguage } from '@/types/languages'

export type TranslationModelChecksRequestBody = {
  text: string
  sourceLang: SupportedLanguage
  targetLang: SupportedLanguage
}

export type TranslationModelCheckModel = 'helsinki' | 'facebook'

export type TranslationModelChecksAction = TranslationModelCheckModel | 'compare'

export type TranslationModelCheckResult = {
  model: TranslationModelCheckModel
  sourceLang: SupportedLanguage
  targetLang: SupportedLanguage
  translation: string
  endpoint: string
  raw?: unknown
}

export type TranslationModelChecksHelloResponse = {
  host: string
  endpoint: string
  data: unknown
}

export type TranslationModelChecksCompareResponse = {
  endpoint: string
  helsinki: TranslationModelCheckResult
  facebook: TranslationModelCheckResult
  raw?: unknown
}

export type TranslationModelChecksErrorResponse = {
  error: string
}
