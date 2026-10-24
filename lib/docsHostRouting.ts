/**
 * A hostname-only documentation surface on the existing Dzvin Next.js deployment.
 * This is HTTP routing isolation, not a separate security/process boundary.
 */
export type DocsHostRoute =
  | { action: 'allow' }
  | { action: 'not-found' }
  | { action: 'redirect'; destination: string; mainSite?: boolean }

const docsHost = 'docs.dzvin.co'

export function getDocsHostRoute(
  hostname: string,
  pathname: string,
  preferredLocale: 'uk' | 'en' | 'pl'
): DocsHostRoute | null {
  if (hostname.toLowerCase() !== docsHost) return null

  if (pathname === '/' || pathname === '') {
    return { action: 'redirect', destination: `/${preferredLocale}/docs` }
  }

  const localeRoot = pathname.match(/^\/(uk|en|pl)\/?$/)
  if (localeRoot) {
    return { action: 'redirect', destination: `/${localeRoot[1]}/docs` }
  }

  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    return { action: 'redirect', destination: `/${preferredLocale}${pathname}` }
  }

  if (/^\/(uk|en|pl)\/docs(?:\/|$)/.test(pathname)) {
    return { action: 'allow' }
  }

  // Never expose same-project API or callback endpoints on docs hostname.
  if (pathname === '/api' || pathname.startsWith('/api/') || pathname === '/callback') {
    return { action: 'not-found' }
  }

  // Shared public header/footer links still resolve to the main website.
  return { action: 'redirect', destination: pathname, mainSite: true }
}
