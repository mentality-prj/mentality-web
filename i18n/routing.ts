import { defineRouting } from 'next-intl/routing'

import { SUPPORTED_LANGUAGES } from '@/types/languages'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LANGUAGES,

  // Used when no locale matches
  defaultLocale: 'uk',
})
