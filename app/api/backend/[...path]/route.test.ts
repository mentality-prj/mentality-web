/** @jest-environment @edge-runtime/jest-environment */
import { NextRequest } from 'next/server'

import { getValidatedBackendPath } from '@/lib/backend/path'

import { GET, POST } from './route'
import { getServerSession } from '@/lib/auth/server'

jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))
jest.mock('@/requests/config', () => ({ APIUrl: 'https://backend.example/api' }))

const sessionMock = getServerSession as jest.MockedFunction<typeof getServerSession>
const originalFetch = global.fetch

afterAll(() => { global.fetch = originalFetch })
beforeEach(() => { jest.clearAllMocks(); sessionMock.mockResolvedValue(null) })

function req(path: string, init?: ConstructorParameters<typeof NextRequest>[1]) {
  return new NextRequest(`https://dzvin.example${path}`, init)
}

const ctx = (path: string[]) => ({ params: { path } })

describe('same-origin backend BFF', () => {
  it('rejects path traversal and identity-provider routes', () => {
    expect(getValidatedBackendPath(['auth', 'token'], '')).toBeNull()
    expect(getValidatedBackendPath(['..'], '')).toBeNull()
    expect(getValidatedBackendPath(['mood-record', 'last'], '?days=3')).toBe('mood-record/last?days=3')
  })

  it('rejects requests without an authenticated backend session', async () => {
    const res = await GET(req('/api/backend/mood-record'), ctx(['mood-record']))
    expect(res.status).toBe(401)
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('rejects cross-origin mutations before reading the session', async () => {
    const res = await POST(req('/api/backend/mood-record', {
      method: 'POST', headers: { origin: 'https://attacker.invalid' },
      body: JSON.stringify({ moodLevel: 3 }),
    }), ctx(['mood-record']))
    expect(res.status).toBe(403)
    expect(sessionMock).not.toHaveBeenCalled()
  })

  it('forwards an authenticated GET without leaking tokens to the response', async () => {
    sessionMock.mockResolvedValue({ user: { id: '1', name: 'User', email: 'u@example.test' }, OAuthToken: 'server-token' })
    global.fetch = jest.fn().mockResolvedValue(new Response(JSON.stringify([{ id: '1' }]), {
      status: 200, headers: { 'content-type': 'application/json', 'x-total-count': '1', 'set-cookie': 'secret=1' },
    })) as unknown as typeof fetch
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
})
