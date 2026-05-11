import type { SupportedLanguage } from '@/types/languages'

export type TranslateServiceRequestBody = {
  text: string
  modelA: string
  modelB: string
  targetLanguage: SupportedLanguage
  sourceLanguage?: SupportedLanguage | 'auto'
}

export type TranslateModelResult = {
  translation: string
  durationMs: number
  model: string
}

export type TranslateServiceResponse = {
  modelA: TranslateModelResult
  modelB: TranslateModelResult
}
