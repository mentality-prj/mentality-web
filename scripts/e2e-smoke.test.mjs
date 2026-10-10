import assert from 'node:assert/strict'
import { test } from 'node:test'
import { runSmoke } from './e2e-smoke.mjs'

function mockFetch({ fail = false } = {}) {
  return async (url, options) => {
    const pathname = url.pathname
    if (pathname === '/uk') {
      return new Response('ok', {
        status: fail ? 503 : 200,
        headers: {
          'content-type': 'text/html',
          'content-security-policy': "default-src 'self'",
          'x-content-type-options': 'nosniff',
        },
      })
    }
    if (['/uk/my-day', '/uk/admin', '/uk/company'].includes(pathname)) {
      return new Response(null, { status: 307, headers: { Location: '/uk/auth' } })
    }
    if (pathname === '/api/auth/token' && options.method === 'POST') {
      return new Response(null, { status: 403 })
    }
    if (pathname === '/api/auth/token') {
      return new Response(null, { status: 401, headers: { 'cache-control': 'no-store' } })
    }
    throw new Error(`Unexpected route: ${pathname}`)
  }
}

test('smoke harness validates all public and anonymous boundaries', async () => {
  const results = await runSmoke({ baseUrl: 'https://dzvin.example', fetchImpl: mockFetch() })
  assert.equal(results.length, 6)
  assert.ok(results.every((result) => result.ok))
})

test('smoke harness fails closed on unexpected server status', async () => {
  await assert.rejects(
    runSmoke({ baseUrl: 'https://dzvin.example', fetchImpl: mockFetch({ fail: true }) }),
    /1 smoke checks failed/
  )
})
