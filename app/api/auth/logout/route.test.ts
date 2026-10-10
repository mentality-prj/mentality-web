/** @jest-environment @edge-runtime/jest-environment */
import { NextRequest } from 'next/server'

import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants'

import { POST } from './route'

const env = { ...process.env }

beforeEach(() => {
  process.env.NEXT_PUBLIC_ZITADEL_ISSUER = 'https://zitadel.example'
  process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID = 'test-client'
  process.env.NEXT_PUBLIC_BASE_URL = 'https://dzvin.example'
})

afterAll(() => { process.env = env })

function request(origin: string, cookie?: string) {
  return new NextRequest('https://dzvin.example/api/auth/logout', {
    method: 'POST',
    headers: { origin, ...(cookie ? { cookie } : {}) },
  })
}

describe('server-owned Zitadel logout', () => {
  it('rejects cross-origin logout', async () => {
    expect((await POST(request('https://attacker.invalid'))).status).toBe(403)
  })

  it('clears the session and redirects to trusted Zitadel without exposing JWT in JSON', async () => {
    const value = encodeURIComponent(JSON.stringify({
      accessToken: 'server-access', idToken: 'private-id-token', refreshToken: 'private-refresh',
      expiresAt: Math.floor(Date.now() / 1000) + 1000,
    }))
    const result = await POST(request('https://dzvin.example', `${AUTH_TOKEN_COOKIE}=${value}`))
    expect(result.status).toBe(303)
    const destination = new URL(result.headers.get('location') as string)
    expect(destination.origin).toBe('https://zitadel.example')
    expect(destination.searchParams.get('client_id')).toBe('test-client')
    expect(result.headers.get('cache-control')).toBe('no-store')
  })
})
