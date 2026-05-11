export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  UKRAINIAN: 'uk',
  POLISH: 'pl',
} as const

export const supportedLanguages = ['uk', 'en', 'pl'] as const

export type SupportedLanguage = (typeof supportedLanguages)[number]

export const LocaleNativeLabels: Record<'uk' | 'en' | 'pl', string> = Object.freeze({
  uk: 'Українська',
  en: 'English',
  pl: 'Polski',
})

export function getLocaleNativeLabel(language: SupportedLanguage): string {
  return LocaleNativeLabels[language]
}

export const LocaleTriggerShortLabels: Record<'uk' | 'en' | 'pl', string> = Object.freeze({
  uk: 'Укр',
  en: 'Eng',
  pl: 'Pol',
})

// Centralized mapping from our `SupportedLanguage` codes to BCP-47 locale tags
export const languageToLocale: Record<SupportedLanguage, string> = Object.freeze({
  uk: 'uk-UA',
  en: 'en-US',
  pl: 'pl-PL',
})
