/** @jest-environment @edge-runtime/jest-environment */
import { NextRequest } from 'next/server'

import { getServerSession } from '@/lib/auth/server'

import { POST } from './route'

jest.mock('@/lib/auth/server', () => ({ getServerSession: jest.fn() }))

const getSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const companyId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

function request(selectedId: string = companyId, origin = 'https://dzvin.test') {
  return new NextRequest('https://dzvin.test/api/company-context', {
    method: 'POST',
    headers: {
      Origin: origin,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ companyId: selectedId, locale: 'uk' }),
  })
}

describe('company context selection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getSession.mockResolvedValue({
      user: { id: 'user-1', name: 'User', email: 'u@test.example', role: 'user' },
      OAuthToken: 'private-bearer',
    })
    const verified = {
      _id: 'user-1',
      role: 'user',
      companyId,
      companyRole: 'manager',
    }
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => verified }) as unknown as typeof fetch
  })

  it('sets a HttpOnly cookie only for a backend-verified company role', async () => {
    const response = await POST(request())
    expect(response.status).toBe(303)
    expect(response.headers.get('location')).toBe('https://dzvin.test/uk/company')
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.cookies.get('dzvin-active-company')?.value).toBe(companyId)
    expect(response.headers.get('set-cookie')?.toLowerCase()).toContain('httponly')
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/validate-token'),
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-company-id': companyId }),
      })
    )
  })

  it('does not select a company for an unverified or revoked membership', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ _id: 'user-1', role: 'user' }),
    })
    const response = await POST(request())
    expect(response.status).toBe(403)
    expect(response.cookies.get('dzvin-active-company')).toBeUndefined()
  })

  it('rejects a mismatch between requested and verified company identities', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: 'user-1',
        role: 'user',
        companyId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
        companyRole: 'superuser',
      }),
    })
    expect((await POST(request())).status).toBe(403)
  })

  it('rejects cross-site POST and malformed company IDs before backend calls', async () => {
    expect((await POST(request(companyId, 'https://evil.test'))).status).toBe(403)
    expect((await POST(request('not-an-object-id'))).status).toBe(400)
    expect(getSession).not.toHaveBeenCalled()
  })

  it('does not allow platform administrators to enter a company workspace', async () => {
    getSession.mockResolvedValue({
      user: { id: 'user-1', name: 'Admin', email: 'admin@test.example', role: 'admin' },
      OAuthToken: 'private-bearer',
    })
    expect((await POST(request())).status).toBe(403)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
