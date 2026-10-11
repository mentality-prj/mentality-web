/**
 * Single HTTP transport for application API traffic.
 *
 * In the browser, only same-origin Next.js /api/* endpoints are accepted.
 * NestJS, QDIP and Zitadel requests run server-side, where they retain their
 * separately scoped credentials and endpoint contracts.
 */
export async function apiTransport(url: string, init: RequestInit = {}): Promise<Response> {
  if (typeof window !== 'undefined') {
    // Reject absolute/protocol-relative URLs and ambiguous encodings that
    // could escape the same-origin Next.js API namespace.
    if (!url.startsWith('/api/') || url.startsWith('//') || /[\\%#]/.test(url.split('?')[0])) {
      throw new Error('Browser API requests must use same-origin /api/ routes')
    }
    const headers = new Headers(init.headers)
    for (const name of [
      'authorization',
      'proxy-authorization',
      'cookie',
      'x-api-key',
      'x-dip-admin-api-key',
      'x-qdip-admin-api-key',
    ]) {
      if (headers.has(name)) throw new Error('Browser API requests cannot provide credentials')
    }
  }
  return fetch(url, { ...init, cache: 'no-store' })
}
