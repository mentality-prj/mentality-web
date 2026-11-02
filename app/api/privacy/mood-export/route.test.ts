/** @jest-environment @edge-runtime/jest-environment */

import { getServerSessionStrict } from '@/lib/auth/server'
import { getMoodRecords } from '@/requests/moodRecord'

import { GET } from './route'

jest.mock('@/lib/auth/server', () => ({ getServerSessionStrict: jest.fn() }))
jest.mock('@/requests/moodRecord', () => ({ getMoodRecords: jest.fn() }))

const session = { user: { id: 'qa-one', role: 'user' }, OAuthToken: 'server-only' }
const first = {
  id: 'owned-1',
  moodLevel: 3,
  stressLevel: 4,
  energyLevel: 2,
  focusLevel: 3,
  tags: ['sleep'],
  createdAt: '2026-10-19T08:00:00.000Z',
}

describe('GET /api/privacy/mood-export', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(getServerSessionStrict as jest.Mock).mockResolvedValue(session)
  })

  it('rejects anonymous requests without fetching any user records', async () => {
    ;(getServerSessionStrict as jest.Mock).mockResolvedValue(null)
    const response = await GET()
    expect(response.status).toBe(401)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(getMoodRecords).not.toHaveBeenCalled()
  })

  it('downloads only explicitly selected mood fields with no cookie/token or other-user data', async () => {
    ;(getMoodRecords as jest.Mock).mockResolvedValue({ data: { moodNotes: [first], total: 1 } })
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-disposition')).toMatch(/^attachment; filename="dzvin-mood-history-/)
    expect(response.headers.get('cache-control')).toContain('no-store')
    expect(response.headers.get('vary')).toBe('Cookie')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    const body = await response.json()
    expect(body).toMatchObject({
      format: 'dzvin-mood-history',
      version: 1,
      entries: [first],
    })
    expect(JSON.stringify(body)).not.toContain('server-only')
    expect(JSON.stringify(body)).not.toContain('qa-one')
    expect(getMoodRecords).toHaveBeenCalledWith(session, { page: 1, limit: 100, order: 'oldest' })
  })

  it('follows pagination even when a total header is missing', async () => {
    const full = Array.from({ length: 100 }, (_, i) => ({ ...first, id: 'id-' + i }))
    ;(getMoodRecords as jest.Mock)
      .mockResolvedValueOnce({ data: { moodNotes: full, total: 100 } })
      .mockResolvedValueOnce({ data: { moodNotes: [{ ...first, id: 'id-100' }], total: 1 } })
    const response = await GET()
    expect(response.status).toBe(200)
    expect((await response.json()).entries).toHaveLength(101)
    expect(getMoodRecords).toHaveBeenCalledTimes(2)
  })

  it('never sends a partial export after a later page fails', async () => {
    const full = Array.from({ length: 100 }, (_, i) => ({ ...first, id: 'id-' + i }))
    ;(getMoodRecords as jest.Mock)
      .mockResolvedValueOnce({ data: { moodNotes: full, total: 100 } })
      .mockResolvedValueOnce({ error: 'outage' })
    const response = await GET()
    expect(response.status).toBe(502)
    expect(response.headers.get('content-disposition')).toBeNull()
    expect(JSON.stringify(await response.json())).not.toContain('id-1')
  })

  it('refuses ambiguous duplicate records rather than issuing an incomplete download', async () => {
    ;(getMoodRecords as jest.Mock).mockResolvedValue({
      data: { moodNotes: [first, first], total: 2 },
    })
    const response = await GET()
    expect(response.status).toBe(409)
    expect(response.headers.get('content-disposition')).toBeNull()
  })

  it('does not leak history during session validation failure', async () => {
    ;(getServerSessionStrict as jest.Mock).mockRejectedValue(new Error('secret session details'))
    const response = await GET()
    expect(response.status).toBe(503)
    expect(JSON.stringify(await response.json())).not.toContain('secret session details')
    expect(getMoodRecords).not.toHaveBeenCalled()
  })
})
