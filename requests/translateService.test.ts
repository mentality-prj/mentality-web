import { logger } from '@/lib/logger'
import { performAdminRequest } from '@/requests/genericFetch'
import { compareTranslateService } from '@/requests/translateService'
import type { CustomSession } from '@/types/auth'

jest.mock('@/requests/genericFetch', () => ({
  performAdminRequest: jest.fn(),
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
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin',
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
}

describe('translateService requests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('compares two models through the shared requests layer and normalizes text', async () => {
    ;(performAdminRequest as jest.Mock)
      .mockResolvedValueOnce({ data: { translation: 'Перший переклад' } })
      .mockResolvedValueOnce({ data: { result: 'Другий переклад' } })

    const result = await compareTranslateService(mockSession, {
      text: '  Test text  ',
      modelA: 'gpt-4o',
      modelB: 'claude-3-5-sonnet',
      sourceLanguage: 'en',
      targetLanguage: 'uk',
    })

    expect(result).toEqual({
      data: {
        modelA: expect.objectContaining({
          model: 'gpt-4o',
          translation: 'Перший переклад',
          durationMs: expect.any(Number),
        }),
        modelB: expect.objectContaining({
          model: 'claude-3-5-sonnet',
          translation: 'Другий переклад',
          durationMs: expect.any(Number),
        }),
      },
    })

    expect(performAdminRequest).toHaveBeenNthCalledWith(1, mockSession, 'http://localhost:3200/api/translate', {
      method: 'POST',
      body: {
        text: 'Test text',
        model: 'gpt-4o',
        sourceLanguage: 'en',
        targetLanguage: 'uk',
      },
    })

    expect(performAdminRequest).toHaveBeenNthCalledWith(2, mockSession, 'http://localhost:3200/api/translate', {
      method: 'POST',
      body: {
        text: 'Test text',
        model: 'claude-3-5-sonnet',
        sourceLanguage: 'en',
        targetLanguage: 'uk',
      },
    })
  })

  it('returns validation error when text is empty', async () => {
    const result = await compareTranslateService(mockSession, {
      text: '   ',
      modelA: 'gpt-4o',
      modelB: 'claude-3-5-sonnet',
      sourceLanguage: 'en',
      targetLanguage: 'uk',
    })

    expect(result).toEqual({ error: 'text is required' })
    expect(performAdminRequest).not.toHaveBeenCalled()
  })

  it('uses auto source language fallback when sourceLanguage is omitted', async () => {
    ;(performAdminRequest as jest.Mock)
      .mockResolvedValueOnce({ data: { text: 'Перший переклад' } })
      .mockResolvedValueOnce({ data: { text: 'Другий переклад' } })

    await compareTranslateService(mockSession, {
      text: 'Hello',
      modelA: 'gpt-4o',
      modelB: 'claude-3-5-sonnet',
      targetLanguage: 'uk',
    })

    expect(performAdminRequest).toHaveBeenNthCalledWith(1, mockSession, 'http://localhost:3200/api/translate', {
      method: 'POST',
      body: expect.objectContaining({ sourceLanguage: 'auto' }),
    })
  })

  it('returns the first request error when a model call fails', async () => {
    ;(performAdminRequest as jest.Mock)
      .mockResolvedValueOnce({ error: 'Translation failed', status: 502 })
      .mockResolvedValueOnce({ data: { translation: 'Другий переклад' } })

    const result = await compareTranslateService(mockSession, {
      text: 'Hello',
      modelA: 'gpt-4o',
      modelB: 'claude-3-5-sonnet',
      sourceLanguage: 'en',
      targetLanguage: 'uk',
    })

    expect(result).toEqual({ error: 'Translation failed' })
    expect(logger.error).toHaveBeenCalledWith('Failed to translate with model', {
      error: 'Translation failed',
      model: 'gpt-4o',
    })
  })
})
