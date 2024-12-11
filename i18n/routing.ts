import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

import { SUPPORTED_LANGUAGES } from '@/types/languages'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LANGUAGES,

  // Used when no locale matches
  defaultLocale: 'uk',
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
