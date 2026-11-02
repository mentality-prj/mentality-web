import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { logger } from '@/lib/logger'
import { performAuthRequest } from '@/requests/genericFetch'
import type { CustomSession } from '@/types/auth'

jest.mock('@/helpers/api-request-with-auth')
jest.mock('@/lib/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
}))

const session: CustomSession = {
  user: { id: 'test-user', name: 'Test User', email: 'user@example.test', role: 'user' },
  OAuthToken: 'test-token',
}

const url = 'https://backend.example.test/api/research/v1/projects'

function decodeStrings(value: unknown) {
  if (!Array.isArray(value)) return { success: false as const }
  if (!value.every((item) => typeof item === 'string')) return { success: false as const }
  return { success: true as const, data: value as string[] }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('genericFetch optional response decoder', () => {
  it('validates successful responses and preserves headers', async () => {
    const headers = new Headers()
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: ['a'], headers })

    await expect(performAuthRequest(session, url, { decodeResponse: decodeStrings })).resolves.toEqual({
      data: ['a'],
      headers,
    })
    expect(apiRequestWithAuth).toHaveBeenCalledWith(
      session,
      url,
      { method: 'GET', body: undefined },
      { autoSignOutOn401: false }
    )
  })

  it('rejects malformed JSON without logging its content', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: { secret: 'sensitive' } })

    await expect(performAuthRequest(session, url, { decodeResponse: decodeStrings })).resolves.toEqual({
      error: 'Invalid API response from backend',
      status: 502,
    })
    expect(logger.error).toHaveBeenCalledWith('Invalid API response contract', { url, method: 'GET' })
  })

  it('allows null when the decoder explicitly accepts null', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: null })
    const decoder = (value: unknown) => {
      if (value === null) return { success: true as const, data: null }
      return { success: false as const }
    }

    await expect(performAuthRequest(session, url, { decodeResponse: decoder })).resolves.toEqual({
      data: null,
      headers: undefined,
    })
  })

  it('preserves transport errors without invoking the decoder', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
      error: { name: 'Forbidden', message: 'Access denied', status: 403 },
    })
    const decoder = jest.fn(decodeStrings)

    await expect(performAuthRequest(session, url, { decodeResponse: decoder })).resolves.toEqual({
      error: 'Access denied',
      status: 403,
    })
    expect(decoder).not.toHaveBeenCalled()
  })

  it('supports domain errors and handles thrown decoder exceptions', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: {} })
    const invalid = () => ({
      success: false as const,
      error: 'Invalid research project response from backend',
    })
    await expect(performAuthRequest(session, url, { decodeResponse: invalid })).resolves.toEqual({
      error: 'Invalid research project response from backend',
      status: 502,
    })

    const throws = (): { success: false } => {
      throw new Error('do not leak decoder details')
    }
    await expect(performAuthRequest(session, url, { decodeResponse: throws })).resolves.toEqual({
      error: 'Invalid API response from backend',
      status: 502,
    })
  })

  it('retains the legacy response for callers without a decoder', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: { id: 'legacy' } })

    await expect(performAuthRequest<{ id: string }>(session, url)).resolves.toEqual({
      data: { id: 'legacy' },
      headers: undefined,
    })
  })
})
