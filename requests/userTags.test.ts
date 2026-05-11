import { logger } from '@/lib/logger'
import { addUserTag, getUserTags } from '@/requests/userTags'
import { performAuthRequest } from '@/requests/genericFetch'
import type { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch', () => ({
  performAuthRequest: jest.fn(),
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api///',
}))

jest.mock('@/lib/logger', () => ({
  __esModule: true,
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}))

const mockSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    email: 'user@test.com',
    role: 'user',
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

describe('userTags requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('adds a user tag through performAuthRequest', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({
      data: { key: 'focus', name: 'Focus' },
    })

    const result = await addUserTag(mockSession, { key: 'focus', name: 'Focus' })

    expect(result).toEqual({ data: { key: 'focus', name: 'Focus' } })
    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, 'http://localhost:3200/api/user-tags', {
      method: 'POST',
      body: { key: 'focus', name: 'Focus' },
    })
    expect(logger.info).toHaveBeenCalledWith('User tag added via upstream user-tags endpoint', { tagKey: 'focus' })
  })

  it('returns login error when addUserTag is called without session', async () => {
    const result = await addUserTag(null, { key: 'focus', name: 'Focus' })

    expect(result).toEqual({ error: 'Unauthorized: Login required' })
    expect(performAuthRequest).not.toHaveBeenCalled()
  })

  it('returns normalized error when upstream add fails', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({ error: 'Upstream failed', status: 500 })

    const result = await addUserTag(mockSession, { key: 'focus', name: 'Focus' })

    expect(result).toEqual({ error: 'Upstream failed' })
    expect(logger.error).toHaveBeenCalledWith('Failed to add user tag (client helper)', {
      error: 'Upstream failed',
      tagKey: 'focus',
    })
  })

  it('gets user tags through performAuthRequest', async () => {
    ;(performAuthRequest as jest.Mock).mockResolvedValue({
      data: [
        { key: 'focus', name: 'Focus' },
        { key: 'calm', name: 'Calm' },
      ],
    })

    const result = await getUserTags(mockSession)

    expect(result).toEqual({
      data: [
        { key: 'focus', name: 'Focus' },
        { key: 'calm', name: 'Calm' },
      ],
    })
    expect(performAuthRequest).toHaveBeenCalledWith(mockSession, 'http://localhost:3200/api/user-tags', {
      method: 'GET',
    })
  })
})
