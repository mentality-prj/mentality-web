export const SUPPORTED_LANGUAGES = ['uk', 'en', 'pl'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]
