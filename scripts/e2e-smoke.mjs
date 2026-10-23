import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const REQUEST_TIMEOUT_MS = 15_000

export async function runSmoke({ baseUrl, locale = 'uk', fetchImpl = fetch }) {
  assert.ok(baseUrl, 'E2E_BASE_URL is required')
  const origin = new URL(baseUrl)
  assert.ok(['http:', 'https:'].includes(origin.protocol), 'E2E_BASE_URL must use HTTP(S)')
  assert.match(locale, /^(uk|en|pl)$/, 'Locale must be uk, en or pl')

  const results = []
  async function request(path, options = {}) {
    const url = new URL(path, origin)
    return fetchImpl(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      ...options,
    })
  }

  async function verify(name, check) {
    try {
      await check()
      results.push({ name, ok: true })
    } catch (error) {
      results.push({ name, ok: false, error: String(error) })
    }
  }

  await verify('public landing responds without authentication', async () => {
    const response = await request(`/${locale}`, { redirect: 'follow' })
    assert.equal(response.status, 200, 'Public landing must return HTTP 200')
    assert.match(response.headers.get('content-type') ?? '', /text\/html/i)
    assert.ok(response.headers.get('content-security-policy'), 'CSP is missing')
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  })

  for (const path of [`/${locale}/my-day`, `/${locale}/admin`, `/${locale}/company`]) {
    await verify(`anonymous ${path} redirects to login`, async () => {
      const response = await request(path)
      assert.ok([302, 303, 307, 308].includes(response.status), `Expected redirect, got ${response.status}`)
      const location = response.headers.get('location')
      assert.ok(location, 'Location header missing')
      const destination = new URL(location, origin)
      assert.equal(destination.origin, origin.origin, 'Redirect must stay on target origin')
      assert.ok(destination.pathname.startsWith(`/${locale}/auth`), `Unexpected destination: ${destination.pathname}`)
    })
  }

  await verify('unauthenticated token endpoint rejects access', async () => {
    const response = await request('/api/auth/token')
    assert.equal(response.status, 401)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  })

  await verify('client-controlled token writes are disabled', async () => {
    const response = await request('/api/auth/token', {
      method: 'POST',
      headers: { Origin: 'https://attacker.invalid', 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: 'invalid', idToken: 'invalid', expiresAt: 9999999999 }),
    })
    assert.equal(response.status, 405)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  })

  await verify('cross-origin cookie deletion is forbidden', async () => {
    const response = await request('/api/auth/token', {
      method: 'DELETE',
      headers: { Origin: 'https://attacker.invalid' },
    })
    assert.equal(response.status, 403)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  })

  const failures = results.filter((result) => !result.ok)
  for (const item of results) {
    const prefix = item.ok ? 'PASS' : 'FAIL'
    console.log(`[${prefix}] ${item.name}${item.error ? ` — ${item.error}` : ''}`)
  }
  assert.equal(failures.length, 0, `${failures.length} smoke checks failed`)
  return results
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runSmoke({ baseUrl: process.env.E2E_BASE_URL, locale: process.env.E2E_LOCALE ?? 'uk' }).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
