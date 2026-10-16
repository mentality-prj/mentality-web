import { z } from 'zod'

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
const stringArray = z.array(z.string())
const decodeStrings = (value: unknown) => {
  const parsed = stringArray.safeParse(value)
  return parsed.success ? { success: true as const, data: parsed.data } : { success: false as const }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('genericFetch optional runtime decoding', () => {
  it('validates successful JSON and preserves transport headers', async () => {
    const headers = new Headers({ 'x-total-count': '2' })
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: ['a', 'b'], headers })

    const result = await performAuthRequest(session, url, { method: 'GET', decodeResponse: decodeStrings })

    expect(result).toEqual({ data: ['a', 'b'], headers })
    expect(apiRequestWithAuth).toHaveBeenCalledWith(
      session,
      url,
      { method: 'GET', body: undefined },
      { autoSignOutOn401: false }
    )
  })

  it('rejects invalid successful responses as a 502 without sending response details to logs', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: { secret: 'do not log this payload' } })

    await expect(performAuthRequest(session, url, { decodeResponse: decodeStrings })).resolves.toEqual({
      error: 'Invalid API response from backend',
      status: 502,
    })
    expect(logger.error).toHaveBeenCalledWith('Invalid API response contract', { url, method: 'GET' })
  })

  it('accepts valid nullable data using a tagged decoder result', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: null })
    const decodeNull = (value: unknown) => {
      if (value === null) return { success: true as const, data: null }
      return { success: false as const }
    }

    await expect(performAuthRequest(session, url, { decodeResponse: decodeNull })).resolves.toEqual({
      data: null,
      headers: undefined,
    })
  })

  it('preserves upstream HTTP errors and never decodes the error response', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({
      error: { name: 'Forbidden', message: 'Access denied', status: 403 },
    })
    const decodeResponse = jest.fn(decodeStrings)

    await expect(performAuthRequest(session, url, { decodeResponse })).resolves.toEqual({
      error: 'Access denied',
      status: 403,
    })
    expect(decodeResponse).not.toHaveBeenCalled()
  })

  it('allows domain-specific failure messages without throwing', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: {} })
    const decodeResponse = () => ({
      success: false as const,
      error: 'Invalid research project response from backend',
    })

    await expect(performAuthRequest(session, url, { decodeResponse })).resolves.toEqual({
      error: 'Invalid research project response from backend',
      status: 502,
    })
  })

  it('turns a decoder exception into a controlled API failure', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValue({ data: {} })
    const decodeResponse = (): { success: false } => {
      throw new Error('Internal decoder details should not escape')
    }

    await expect(performAuthRequest(session, url, { decodeResponse })).resolves.toEqual({
      error: 'Invalid API response from backend',
      status: 502,
    })
  })

  it('keeps existing calls without a decoder backward compatible', async () => {
    ;(apiRequestWithAuth as jest.Mock).mockResolvedValueOnce({ data: undefined, headers: undefined })
    await expect(performAuthRequest<{ id: string }>(session, url)).resolves.toEqual({
      data: undefined,
      headers: undefined,
    })

    ;(apiRequestWithAuth as jest.Mock).mockResolvedValueOnce({ data: { id: 'legacy' } })
    await expect(performAuthRequest<{ id: string }>(session, url)).resolves.toEqual({
      data: { id: 'legacy' },
      headers: undefined,
    })
  })
})
