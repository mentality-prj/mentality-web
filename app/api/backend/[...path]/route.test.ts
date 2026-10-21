/** @jest-environment @edge-runtime/jest-environment */
import { NextRequest } from 'next/server'

import { getServerSession } from '@/lib/auth/server'
import { getValidatedBackendPath } from '@/lib/backend/path'

import { GET, PATCH, POST } from './route'

jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/config', () => ({ APIUrl: 'https://backend.example/api' }))

const sessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>
const originalFetch = global.fetch

afterAll(() => {
  global.fetch = originalFetch
})
beforeEach(() => {
  jest.clearAllMocks()
  sessionMock.mockResolvedValue(null)
})

function req(path: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  return new NextRequest(`https://dzvin.example${path}`, init)
}

// Next.js 16 Route Handlers receive asynchronous dynamic params.
const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) })

describe('same-origin backend BFF', () => {
  it('rejects path traversal and identity-provider routes', () => {
    expect(getValidatedBackendPath(['auth', 'token'], '')).toBeNull()
    expect(getValidatedBackendPath(['..'], '')).toBeNull()
    expect(getValidatedBackendPath(['mood-record', 'last'], '?days=3')).toBe('mood-record/last?days=3')
    expect(getValidatedBackendPath(['auth', 'validate-token'], '')).toBeNull()
    expect(getValidatedBackendPath(['Auth', 'token'], '')).toBeNull()
    expect(getValidatedBackendPath(['Auth', 'me'], '')).toBeNull()
    expect(getValidatedBackendPath(['%61uth', 'token'], '')).toBeNull()
    expect(getValidatedBackendPath(['auth', '%76alidate-token'], '')).toBeNull()
    expect(getValidatedBackendPath(['auth', 'me'], '')).toBe('auth/me')
    expect(getValidatedBackendPath(['auth', 'me'], '', 'PATCH')).toBeNull()
    expect(getValidatedBackendPath(['auth', 'me', 'analytics-preferences'], '', 'GET')).toBe(
      'auth/me/analytics-preferences'
    )
    expect(getValidatedBackendPath(['auth', 'me', 'analytics-preferences'], '', 'PATCH')).toBe(
      'auth/me/analytics-preferences'
    )
    expect(getValidatedBackendPath(['auth', 'me', 'analytics-preferences'], '', 'POST')).toBeNull()
  })

  it('permits only anonymous POST /contact through the unified BFF, without a bearer', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    ) as unknown as typeof fetch

    expect(getValidatedBackendPath(['contact'], '', 'POST')).toBe('contact')
    expect(getValidatedBackendPath(['contact'], '', 'GET')).toBeNull()
    expect(getValidatedBackendPath(['contact', 'anything'], '', 'POST')).toBeNull()
    expect(getValidatedBackendPath(['contact', 'business'], '', 'POST')).toBe('contact/business')
    expect(getValidatedBackendPath(['contact', 'business'], '', 'GET')).toBeNull()
    expect(getValidatedBackendPath(['contact', 'business'], '?debug=1', 'POST')).toBeNull()
    expect(getValidatedBackendPath(['contact', 'business', 'other'], '', 'POST')).toBeNull()
    expect(getValidatedBackendPath(['contact'], '?admin=1', 'POST')).toBeNull()
    expect(getValidatedBackendPath(['Contact'], '', 'POST')).toBeNull()

    const res = await POST(
      req('/api/backend/contact', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example', 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'Hello!', token: 'recaptcha' }),
      }),
      ctx(['contact'])
    )
    expect(res.status).toBe(201)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(sessionMock).not.toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.example/api/contact',
      expect.objectContaining({ method: 'POST', redirect: 'manual', cache: 'no-store' })
    )
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Headers
    expect(headers.get('authorization')).toBeNull()
    expect(headers.get('cookie')).toBeNull()
  })

  it('routes business submissions only to the explicit anonymous endpoint without a bearer', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      })
    ) as unknown as typeof fetch

    const res = await POST(
      req('/api/backend/contact/business', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example', 'content-type': 'application/json' },
        body: JSON.stringify({ companyName: 'Example Co', interest: 'pilot', token: 'captcha' }),
      }),
      ctx(['contact', 'business'])
    )
    expect(res.status).toBe(201)
    expect(sessionMock).not.toHaveBeenCalled()
    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.example/api/contact/business',
      expect.objectContaining({ method: 'POST', redirect: 'manual' })
    )
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBeNull()
    expect(headers.get('Cookie')).toBeNull()

    const blocked = await POST(
      req('/api/backend/contact/business?admin=1', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example' },
        body: '{}',
      }),
      ctx(['contact', 'business'])
    )
    expect(blocked.status).toBe(400)
  })

  it('rejects cross-site anonymous business leads before backend forwarding', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch
    const res = await POST(
      req('/api/backend/contact/business', {
        method: 'POST',
        headers: { origin: 'https://attacker.invalid', 'content-type': 'application/json' },
        body: '{}',
      }),
      ctx(['contact', 'business'])
    )
    expect(res.status).toBe(403)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('blocks cross-origin and oversized anonymous contact submissions before proxying', async () => {
    global.fetch = jest.fn() as unknown as typeof fetch
    const crossOrigin = await POST(
      req('/api/backend/contact', {
        method: 'POST',
        headers: { origin: 'https://attacker.invalid', 'content-type': 'application/json' },
        body: '{}',
      }),
      ctx(['contact'])
    )
    expect(crossOrigin.status).toBe(403)

    const tooLarge = await POST(
      req('/api/backend/contact', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example', 'content-type': 'application/json' },
        body: 'x'.repeat(1_000_100),
      }),
      ctx(['contact'])
    )
    expect(tooLarge.status).toBe(413)
    expect(global.fetch).not.toHaveBeenCalled()
    expect(sessionMock).not.toHaveBeenCalled()
  })

  it('rejects requests without an authenticated backend session', async () => {
    const res = await GET(req('/api/backend/mood-record'), ctx(['mood-record']))
    expect(res.status).toBe(401)
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('rejects cross-origin mutations before reading the session', async () => {
    const res = await POST(
      req('/api/backend/mood-record', {
        method: 'POST',
        headers: { origin: 'https://attacker.invalid' },
        body: JSON.stringify({ moodLevel: 3 }),
      }),
      ctx(['mood-record'])
    )
    expect(res.status).toBe(403)
    expect(sessionMock).not.toHaveBeenCalled()
  })

  it('forwards an authenticated GET without leaking tokens to the response', async () => {
    sessionMock.mockResolvedValue({
      user: { id: '1', name: 'User', email: 'u@example.test' },
      OAuthToken: 'server-token',
    })
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: '1' }]), {
        status: 200,
        headers: { 'content-type': 'application/json', 'x-total-count': '1', 'set-cookie': 'secret=1' },
      })
    ) as unknown as typeof fetch
    const res = await GET(req('/api/backend/mood-record?limit=1'), ctx(['mood-record']))
    expect(res.status).toBe(200)
    expect(res.headers.get('x-total-count')).toBe('1')
    expect(res.headers.get('set-cookie')).toBeNull()
    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.example/api/mood-record?limit=1',
      expect.objectContaining({ headers: expect.any(Headers), redirect: 'manual', cache: 'no-store' })
    )
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer server-token')
  })
  it('proxies only supported current-user data endpoints and never auth token endpoints', async () => {
    sessionMock.mockResolvedValue({
      user: { id: '1', name: 'User', email: 'u@example.test' },
      OAuthToken: 'server-token',
    })
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        new Response('{"id":"1"}', { status: 200, headers: { 'content-type': 'application/json' } })
      ) as unknown as typeof fetch

    const currentUser = await GET(req('/api/backend/auth/me'), ctx(['auth', 'me']))
    expect(currentUser.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.example/api/auth/me',
      expect.objectContaining({ method: 'GET' })
    )

    const pref = await PATCH(
      req('/api/backend/auth/me/analytics-preferences', {
        method: 'PATCH',
        headers: { origin: 'https://dzvin.example', 'content-type': 'application/json' },
        body: JSON.stringify({ sprintAnchorDay: 2 }),
      }),
      ctx(['auth', 'me', 'analytics-preferences'])
    )
    expect(pref.status).toBe(200)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://backend.example/api/auth/me/analytics-preferences',
      expect.objectContaining({ method: 'PATCH' })
    )

    const blocked = await POST(
      req('/api/backend/auth/validate-token', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example' },
        body: '{}',
      }),
      ctx(['auth', 'validate-token'])
    )
    expect(blocked.status).toBe(400)
  })

  it('rejects oversized chunked mutations without buffering the full payload or contacting the backend', async () => {
    sessionMock.mockResolvedValue({
      user: { id: '1', name: 'User', email: 'u@example.test' },
      OAuthToken: 'server-token',
    })
    global.fetch = jest.fn() as unknown as typeof fetch
    const response = await POST(
      req('/api/backend/mood-record', {
        method: 'POST',
        headers: { origin: 'https://dzvin.example' },
        body: 'x'.repeat(1_000_100),
      }),
      ctx(['mood-record'])
    )
    expect(response.status).toBe(413)
    expect(await response.json()).toEqual({ error: 'Payload too large', message: 'Payload too large' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns a backward-compatible message for local BFF errors', async () => {
    const response = await GET(req('/api/backend/mood-record'), ctx(['mood-record']))
    expect(await response.json()).toEqual({ error: 'Unauthorized', message: 'Unauthorized' })
  })
})
