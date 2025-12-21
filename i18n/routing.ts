import { defineRouting } from 'next-intl/routing'

import { SUPPORTED_LANGUAGES, supportedLanguages } from '@/types/languages'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: supportedLanguages,

  // Used when no locale matches
  defaultLocale: SUPPORTED_LANGUAGES.UKRAINIAN,

  // Always use locale prefix in URL
  localePrefix: 'always',

  // Disable automatic detection - we'll handle it manually
  localeDetection: false,
})
